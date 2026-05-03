/**
 * 無糖談心室 - Static Clone
 * Clean JS without RequireJS - uses CDN jQuery
 */
(function($) {
  'use strict';

  var $window = $(window),
      winH = $window.height(),
      $menu = $('.menu'),
      $nav = $('nav'),
      $header = $('header'),
      $fixed = $('.fixed'),
      $footer = $('footer');

  // 1. Nav dropdown - click nav divs to toggle .box submenu
  $nav.children('div').on('click', function() {
    var $this = $(this);
    if ($window.width() > 768) {
      if ($this.find('.box').is(':visible')) {
        $this.stop().removeClass('active').find('.box').stop().slideUp();
      } else {
        $this.stop().addClass('active').find('.box').stop().slideDown();
        $this.siblings('div').removeClass('active').find('.box').stop().slideUp();
      }
    }
  });

  // 2. Mobile hamburger
  $menu.on('click', function() {
    var $this = $(this);
    if ($this.hasClass('active')) {
      $this.removeClass('active');
      $nav.stop().slideUp();
    } else {
      $this.addClass('active');
      $nav.stop().slideDown();
    }
  });

  // 3. Responsive resize handler
  $window.on('resize', function() {
    if ($window.width() <= 768) {
      $menu.removeClass('active');
      $nav.css('display', 'none');
    } else {
      $menu.removeClass('active');
      $nav.css('display', 'flex');
    }
  });

  // 4. Scroll header - add .active class when scrollTop > 0
  $window.on('scroll', function() {
    if ($window.scrollTop() > 0) {
      if (!$header.hasClass('active')) $header.addClass('active');
    } else {
      if ($header.hasClass('active')) $header.removeClass('active');
    }

    // 5. Fixed sidebar - add .no_fixed when overlapping footer
    var footerTop = $footer.offset().top;
    if ($window.scrollTop() >= footerTop - winH) {
      if (!$fixed.hasClass('no_fixed')) $fixed.addClass('no_fixed');
    } else {
      if ($fixed.hasClass('no_fixed')) $fixed.removeClass('no_fixed');
    }
  }).trigger('scroll');

  // 6. Back to top
  $('.top').on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 900);
  });

  // 7. Popup system - service descriptions
  var $popupOpen = $('.popup_open');
  var serviceData = {
    '法律諮詢': [
      '在法律的複雜世界中，您需要的不僅是建議，而是專業的指導。我們的法律諮詢服務旨在為您提供深入的法律分析與建議，無論是面對面、電話或視訊會議，我們的律師將針對您的具體情況，提供清晰且具體的法律意見，幫助您有效應對各種挑戰，確保您的權益得到充分保障。',
      '在面對法律問題時，您需要不僅是建議，而是設身處地為您著想並富有專業的指導。我們依每人不同的需求，提供以口頭或書面的法律意見，無論是電話、視訊還是面對面會議，都將為您提供清晰、具體的法律建議，助您有效解決問題，維護您的權益。'
    ],
    '法律顧問': [
      '企業運營中不可避免地會遇到各種法律挑戰。我們的法律顧問服務專為企業設計，提供即時並有效率的法律服務。',
      '包含:合約審查、風險評估、合規建議。我們的目標是幫助企業在法律框架內穩健發展，能以事前的角度來避免未來潛在的法律風險，讓您能專注於業務增長，而不必擔心法律問題。'
    ],
    '商務談判': [
      '商務談判是成功交易的關鍵。',
      '我們擁有豐富的談判經驗（中文及英語），能夠代表您在各類商業交易中進行專業有效的協商，以促進雙方達成共識。',
      '我們與您的交易對手正式進行商務談判前，會仔細和您確認您的需求並演練各種潛在情境，務必確保您的利益能在談判中達至最大化。'
    ],
    '專題演講': [
      '無糖律師常於各企業、政府機關、民間團體、校園等，針對不同議題，提供專題演講。',
      '無糖律師風趣幽默，能將複雜的觀念，用深入淺出的方式，引導聽眾進行「無痛式學習」。',
      '無糖律師擅長「互動式」演講，不僅能增進參與者對演講主題的參與度，更能在有趣的互動活動中，輕鬆理解複雜的概念，有助於提高大眾的法律意識與談判能力。'
    ],
    '談判課程': [
      '提升談判技巧是每位專業人士必備的能力。',
      '我們設計的談判課程由經驗豐富的無糖律師主導，涵蓋從基本原則到高級策略應用的一系列內容。參加者將學習如何在各種商務、職場、家庭、人際關係的不同情境中，利用不同的談判技巧來有效應對，以提升自身在談判中的成功機率和影響力。'
    ],
    '企業培訓': [
      '我們提供量身定制的企業培訓服務，幫助企業主或員工們深入理解相關法律知識及合規要求。',
      '這不僅能增強員工對法律風險的認識，也能促進企業文化中的合規意識，降低因違法行為而可能產生的風險，為企業創造一個健康、能持續性發展的友善環境。'
    ],
    '專欄寫作': [
      '無糖律師樂於和大眾分享最新的法律相關議題、趨勢與見解，撰寫文章以提供有價值的信息，幫助讀者更好地理解複雜的法律問題。'
    ],
    '溝通技巧': [
      '良好的溝通是成功人際關係的基石。',
      '我們提供針對性的溝通技巧培訓，幫助參加者提升表達能力和人際互動技巧，使他們在職場中更具影響力，透過各種設計情境案例的練習，我們將幫助您更自信地傳達想法，更有效地促進團隊合作，建立起更良好鞏固的人際關係網絡。'
    ],
    '會議主持': [
      '我們提供專業會議主持服務，確保會議高效、有序進行。',
      '無論是公司內部會議還是與外部客戶協商洽談，我們都能協助制定議程、引導討論，使議程順利進展，促進會議有效溝通，降低爭議風險，最重要的是確保會議的合規性，提升決策效率。'
    ],
    '採訪合作': [
      '無糖律師樂意接受媒體採訪或商業合作，以分享在法律、商務領域的專業知識。這不僅有助於提供公眾有價值的信息，更能幫助提升民眾對法律或商務領域專業知識的理解。'
    ],
    '學習工作坊': [
      '我們定期舉辦學習工作坊，邀請參加者深入探討特定法律或各種談判主題。互動式課程將鼓勵參加者提出問題和分享經驗，以加強彼此間的交流與合作，理論的學習可以立即體現於實作，讓學習效果收事半功倍之效。在輕鬆且富有啟發性的氛圍中，共同探索專業知識的新領域。',
      '我們可為民間企業、法人團體、學校機關，依其不同需求量身訂作，提供客製化特定主題的學習工作坊。'
    ],
    '和解調解': [
      '在爭端發生時，我們提供專業的和解調解服務。透過且具經驗的律師協助，有效率地協助雙方找到共識，以和平方式解決爭端。',
      '我們相信，在尊重與理解中尋求解決方案，不但能降低訴訟成本，還能維護您與您所重視的人間的良好關係。'
    ]
  };

  $popupOpen.on('click', function(e) {
    e.preventDefault();
    var $this = $(this);
    var href = $this.attr('href');
    var $popup = $(href);
    var $title = $popup.find('.txt h5');
    var $wordContainer = $popup.find('.word');
    var serviceName = $this.find('p').text();
    var descData = serviceData[serviceName];

    if (serviceName.length > 0) {
      $title.text(serviceName);
      $wordContainer.empty();
      descData.forEach(function(text) {
        $wordContainer.append('<p>' + text + '</p>');
      });
    }
    $popup.stop().fadeIn();
  });

  // Popup close
  $('.popup_close').on('click', function(e) {
    e.preventDefault();
    $(this).closest('.pop').stop().fadeOut();
  });

  // Popup service button -> scroll to contact
  $('.pop_service .btn').on('click', function() {
    $(this).closest('.pop').stop().fadeOut();
    var $contactSection = $('.service .s4');
    if ($contactSection.length) {
      $('html, body').stop().animate({ scrollTop: $contactSection.offset().top }, 900, 'swing');
    }
  });

  // 8. Page-specific initialization
  var path = location.pathname.split('/');
  var pageName = path[path.length - 1].replace('.html', '').replace('.php', '');
  if (!pageName) pageName = 'index';

  // index page
  if (pageName === 'index') {
    // Banner slider
    var $banner = $('.banner .show');
    $banner.css({ opacity: 1 });
    if ($.fn.slick) {
      $banner.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        dots: true,
        arrow: false,
        autoplaySpeed: 5000,
        fade: true,
        cssEase: 'linear',
        speed: 500
      });
    }

    // Tabs on s1 section
    var $switchLinks = $('.s1 .switch a');
    var $sectionItems = $('.s1 .content .item');

    $switchLinks.on('click', function(e) {
      e.preventDefault();
      var $this = $(this);
      var idx = $this.index();
      var $bookPTag = $switchLinks.eq(1).find('p');

      if ($this.hasClass('active')) return;

      $this.addClass('active').siblings().removeClass('active');
      $sectionItems.eq(idx).stop().fadeIn().siblings().stop().hide();

      if (idx === 0) {
        $bookPTag.css({ 'border-left': 'none', 'border-right': 'solid 1px #fff' });
      } else if (idx === 1) {
        $bookPTag.css({ 'border-left': 'none', 'border-right': 'none' });
        var $bookShow = $('.s1 .part2 .show');
        if ($.fn.slick && !$bookShow.hasClass('slick-initialized')) {
          $bookShow.css('opacity', 1);
          $bookShow.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: false,
            dots: true,
            arrow: false,
            autoplaySpeed: 5000,
            swipeToSlide: true,
            fade: true,
            cssEase: 'linear',
            speed: 500
          });
        }
      } else {
        $bookPTag.css({ 'border-right': 'none', 'border-left': 'solid 1px #fff' });
      }
    });

    // News section slider
    var $newsArticle = $('.s2 article');
    if ($.fn.slick) {
      var newsSliderSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        dots: false,
        arrow: true,
        autoplaySpeed: 5000,
        centerMode: false
      };
      $newsArticle.not('.slick-initialized').slick(newsSliderSettings);
      $window.on('resize', function() {
        if ($window.width() <= 768) {
          $newsArticle.not('.slick-initialized').slick(newsSliderSettings);
        } else {
          if ($newsArticle.hasClass('slick-initialized')) $newsArticle.slick('unslick');
        }
      }).trigger('resize');

      // Partners carousel
      var $partners = $('.s3 .show');
      $partners.css('opacity', 1);
      $partners.slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        dots: false,
        arrow: true,
        autoplaySpeed: 5000,
        swipeToSlide: true,
        responsive: [{
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 3000,
            dots: false,
            arrow: true,
            swipeToSlide: true
          }
        }]
      });

      // YouTube section slider
      var $ytShow = $('.s5 .show');
      $ytShow.css({ opacity: 1 });
      $ytShow.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        dots: false,
        arrow: true,
        autoplaySpeed: 5000,
        swipeToSlide: true
      });
    }
  }

  // Book pages - recommendations slider
  if (pageName === 'book_negotiation' || pageName === 'book_relationship') {
    var $recContent = $('.s4 .content');
    $recContent.stop().css('opacity', 1);
    if ($.fn.slick) {
      var recSliderSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        dots: false,
        arrow: true,
        autoplaySpeed: 5000,
        centerMode: false
      };
      $recContent.not('.slick-initialized').slick(recSliderSettings);
      $window.on('resize', function() {
        if ($window.width() <= 575) {
          $recContent.not('.slick-initialized').slick(recSliderSettings);
        } else {
          if ($recContent.hasClass('slick-initialized')) $recContent.slick('unslick');
        }
      }).trigger('resize');
    }
  }

  // Service page banner
  if (pageName === 'service') {
    var $serviceBanner = $('.s1 .banner');
    if ($.fn.slick) {
      $serviceBanner.css('opacity', 1);
      $serviceBanner.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        dots: true,
        arrow: false,
        autoplaySpeed: 5000,
        fade: true,
        cssEase: 'linear',
        speed: 500
      });
    }

    // Contact nav link smooth scroll
    $('.nav_contact[href*="#"]').on('click', function(e) {
      e.preventDefault();
      var hash = this.hash;
      var $target = $(hash);
      if ($target.length) {
        $('html, body').stop().animate({ scrollTop: $target.offset().top }, 900, 'swing');
        if ($window.width() <= 768) {
          $menu.removeClass('active');
          $nav.css('display', 'none');
        }
      }
    });
  }

  // 9. Scroll-triggered animations via WOW
  if (typeof WOW !== 'undefined') {
    new WOW().init();
  }

})(jQuery);
