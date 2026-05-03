#!/usr/bin/env python3
"""
Split the clone's news.html into 4 pages with pagination.
6 articles per page, matching the original site's structure.
"""
import re, os

SOURCE = "/workspace/ainsley-clone/news.html"
OUTPUT_DIR = "/workspace/ainsley-clone"

with open(SOURCE) as f:
    html = f.read()

# Find all article items - they follow the pattern <div class="item">...</div>
# and are inside <article>...</article>
article_start = html.find("<article>")
article_end = html.find("</article>") + len("</article>")

before_articles = html[:article_start]
after_articles = html[article_end:]

# Extract the article section inner content
article_content = html[article_start:article_end]

# Split into individual items
# Find all item divs
items = re.findall(r'<div class="item">.*?</div>\s*(?=<div class="item">|</article>|\s*<footer)', html, re.DOTALL)

print(f"Found {len(items)} article items")

# Sort them to match original page structure (reverse chronological)
# Original had: page 1 = newest 6, page 2 = next 6, etc.
# Current order: newest first (22, 18, 12, 8, 20, 21, 15, 19, 17, 16, 14, 13, 11, 9, 7, 6, 5, 4, 3, 2, 1)
# So first 6 go to page 1, next 6 to page 2, etc.

PER_PAGE = 6
total_pages = (len(items) + PER_PAGE - 1) // PER_PAGE
print(f"Total pages: {total_pages}")

# Extract the style block for news_cover classes (lines 1-31 approximately)
style_start = html.find(".news_cover_0")
style_end = html.find("</style>", style_start) + len("</style>")
style_block = html[html.rfind("<style", 0, style_start):style_end]

# Template for pagination
pagination_template = """
        <div class="pagination" style="text-align:center;padding:40px 0;">
          {links}
        </div>
"""

def make_page_link(page_num, current_page):
    if page_num == 1:
        url = "news.html"
    else:
        url = f"news_page_{page_num}.html"
    if page_num == current_page:
        return f'<span style="display:inline-block;padding:6px 14px;margin:0 4px;background:#2D4A3E;color:#fff;border-radius:4px;font-size:14px;">{page_num}</span>'
    else:
        return f'<a href="{url}" style="display:inline-block;padding:6px 14px;margin:0 4px;background:#f0f0f0;color:#333;border-radius:4px;font-size:14px;text-decoration:none;">{page_num}</a>'

for page in range(1, total_pages + 1):
    start_idx = (page - 1) * PER_PAGE
    end_idx = min(start_idx + PER_PAGE, len(items))
    page_items = items[start_idx:end_idx]
    
    # Build article HTML for this page
    # Need to include the style block with news_cover classes for items on this page
    # Re-index news_cover_N based on position within this page
    page_articles = '<article>\n'
    for i, item_html in enumerate(page_items):
        # Fix news_cover class numbering within this page
        for old_n in range(30):  # up to 30 items
            old_class = f'news_cover_{old_n}'
            if old_class in item_html:
                # Replace with new index
                new_class = f'news_cover_{i}'
                item_html = item_html.replace(old_class, new_class)
                break  # Only replace first match per item
        
        # Also fix the inline style items that don't use news_cover class
        page_articles += item_html + '\n'
    page_articles += '</article>'
    
    # Extract and fix cover styles for this page
    page_styles = ""
    for i, item_html in enumerate(page_items):
        # Find the background image for this item
        if f'news_cover_{i}' in page_articles:
            # Look for the original cover style
            original_idx = start_idx + i
            match = re.search(rf'\.news_cover_{original_idx}\{{.*?\}}', style_block)
            if match:
                old_style = match.group(0)
                new_style = old_style.replace(f'news_cover_{original_idx}', f'news_cover_{i}')
                page_styles += new_style + '\n'
    
    # Create pagination links
    pagi_links = ""
    for p in range(1, total_pages + 1):
        pagi_links += make_page_link(p, page)
    pagination = pagination_template.format(links=pagi_links)
    
    # Build the page
    page_html = before_articles
    
    # Inject page-specific styles
    style_section = f"<style>\n{page_styles}\n.news_img{{width:100%;height:200px;background-size:cover;background-position:center;background-repeat:no-repeat;}}\narticle .item > div .news_img{{background-size:cover!important;height:auto;padding-top:66.8269%;}}\n</style>"
    # Replace the original style section
    page_html = re.sub(r'<style>.*?</style>', style_section, page_html, count=1, flags=re.DOTALL)
    
    page_html += page_articles
    page_html += pagination
    page_html += after_articles
    
    # Fix the active category link (always ALL on listing pages)
    page_html = page_html.replace(
        'href="news.html" class="category_item">ALL',
        'href="news.html" class="category_item" style="background:#2D4A3E;color:#fff;">ALL'
    )
    
    # Determine filename
    if page == 1:
        filename = "news.html"
    else:
        filename = f"news_page_{page}.html"
    
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, 'w') as f:
        f.write(page_html)
    
    print(f"  ✅ {filename} ({len(page_items)} articles, page {page}/{total_pages})")

print(f"\nDone! Created {total_pages} pages.")
