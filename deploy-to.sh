#!/usr/bin/env bash
# ============================================================
# deploy-to.sh — 從 staging 沙盒同步檔案到 production repo
# 用法:
#   ./deploy-to.sh <target> <file1> [file2 ...]   # 特定檔案
#   ./deploy-to.sh <target> --all                  # 全專案
#
# 目標:
#   ainsley   → julian67chou/ainsley-site (Vercel: ainsley-site)
#   elai      → julian67chou/elai
#   elai-exp  → julian67chou/elai-experiment (Vercel: elai-experiment)
#   staging   → julian67chou/staging (本 repo，快照用)
#
# 範例:
#   ./deploy-to.sh ainsley index.html news.html
#   ./deploy-to.sh ainsley news_page_2.html service.html
#   ./deploy-to.sh elai --all           # 全專案同步（含圖片/js/css）
# ============================================================
set -euo pipefail

GIT_NAME="Hermes Agent"
GIT_EMAIL="hermes@nousresearch.com"
STAGING_DIR="$(cd "$(dirname "$0")" && pwd)"

# ── 載入 .env（選擇性 Vercel token） ──
if [ -f "$STAGING_DIR/.env" ]; then
    set -a; source "$STAGING_DIR/.env"; set +a
fi

# ── 目標對照表 ──
declare -A TARGETS
TARGETS[ainsley]="git@github.com:julian67chou/ainsley-site.git"
TARGETS[elai]="git@github.com:julian67chou/elai.git"
TARGETS[elai-exp]="git@github.com:julian67chou/elai-experiment.git"
TARGETS[staging]="git@github.com:julian67chou/staging.git"

usage() {
    echo "用法: $0 <target> <file1> [file2 ...]"
    echo "      $0 <target> --all"
    echo ""
    echo "可用目標:"
    for t in "${!TARGETS[@]}"; do
        echo "  $t → ${TARGETS[$t]}"
    done
    echo ""
    echo "範例:"
    echo "  $0 ainsley index.html news.html"
    echo "  $0 elai --all"
    exit 1
}

TARGET="${1:-}"
shift 2>/dev/null || usage

REPO="${TARGETS[$TARGET]:-}"
if [ -z "$REPO" ]; then
    echo "❌ 未知目標: $TARGET"
    usage
fi

if [ $# -eq 0 ]; then
    echo "❌ 請指定要同步的檔案，或使用 --all 全專案同步"
    usage
fi

# ── clone/pull 目標 repo ──
WORK_DIR="/tmp/deploy-to-$TARGET"
if [ -d "$WORK_DIR" ]; then
    echo "📦 更新現有暫存 ..."
    cd "$WORK_DIR" && git config user.name "$GIT_NAME" && git config user.email "$GIT_EMAIL"
    git pull origin main 2>&1 | tail -3
else
    echo "📦 Clone 目標 repo ..."
    git clone "$REPO" "$WORK_DIR"
    cd "$WORK_DIR"
    git config user.name "$GIT_NAME"
    git config user.email "$GIT_EMAIL"
fi

# ── 判斷模式：--all（全專案）或特定檔案 ──
FULL_SYNC=false
FILE_ARGS=()
for arg in "$@"; do
    if [ "$arg" = "--all" ]; then
        FULL_SYNC=true
    else
        FILE_ARGS+=("$arg")
    fi
done

if $FULL_SYNC; then
    echo "📦 全專案同步（略過 .git / .vercel / .env / 工具腳本）..."
    rsync -a --delete \
        --exclude='.git' \
        --exclude='.vercel' \
        --exclude='.env' \
        --exclude='deploy-to.sh' \
        --exclude='split_news_pages.py' \
        "$STAGING_DIR/" "$WORK_DIR/" 2>&1 | tail -5
    COPIED=("全專案")
    MSG="Full sync from staging"
else
    if [ ${#FILE_ARGS[@]} -eq 0 ]; then
        echo "❌ 請指定要同步的檔案，或使用 --all 全專案同步"
        usage
    fi

    # ── 複製指定檔案 ──
    COPIED=()
    MISSING=()
    for f in "${FILE_ARGS[@]}"; do
        if [ -f "$STAGING_DIR/$f" ]; then
            cp "$STAGING_DIR/$f" "$WORK_DIR/$f"
            COPIED+=("$f")
            echo "  ✅ $f"
        else
            MISSING+=("$f")
            echo "  ⚠️  找不到: $STAGING_DIR/$f"
        fi
    done

    if [ ${#COPIED[@]} -eq 0 ]; then
        echo "❌ 沒有檔案可同步"
        exit 1
    fi
    MSG="Sync from staging: ${COPIED[*]}"
fi

# ── commit & push ──
cd "$WORK_DIR"
git add -A
if git diff --cached --quiet; then
    echo "ℹ️  無變更，跳過"
else
    git commit -m "$MSG"
    git push origin main 2>&1 | tail -3
    echo ""
    echo "✅ 已推送至 ${TARGETS[$TARGET]}"
    echo "⏳ Vercel 自動部屬中 ..."

    # ── 選擇性 Vercel cache purge ──
    if [ -n "${VERCEL_TOKEN:-}" ] && [ -n "${VERCEL_TEAM:-}" ]; then
        echo ""
        echo "🧹 清除 Vercel CDN cache ..."
        DOMAIN="${TARGET}.vercel.app"
        curl -sf -X POST "https://api.vercel.com/v1/edge-cache/purge" \
            -H "Authorization: Bearer $VERCEL_TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"teamId\":\"$VERCEL_TEAM\",\"domains\":[\"$DOMAIN\"]}" \
            >/dev/null 2>&1 && echo "   ✅ cache purged" || echo "   ⚠️  purge API 失敗（不影響部屬）"
    fi

    echo ""
    echo "📎 線上檢查:"
    case "$TARGET" in
        ainsley)  URL="https://ainsley-site.vercel.app" ;;
        elai)     URL="https://elai.vercel.app" ;;
        elai-exp) URL="https://elai-experiment.vercel.app" ;;
        *)       URL="" ;;
    esac
    if [ -n "$URL" ]; then
        echo "   $URL/${COPIED[0]}"
    else
        echo "   等待 Vercel 部屬完成"
    fi
fi

# ── 清理暫存？保留不動以便下次增量更新 ──
