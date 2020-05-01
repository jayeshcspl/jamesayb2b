var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
$(document).ready(function($) {
  var hc_append_height_old = $('.hc-append').height()
  var hc_append_height = $('nav.shop_menu').height() - $('.cart_bottom').height();
  if(hc_append_height_old > hc_append_height) {
    $('.hc-append').height(hc_append_height);
    $('.hc-append').css({'overflow':'auto', 'padding-right':'10px'});
  }
  
  var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  var deviceHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;

  var content_area_height =  $('.content_area div').height();

  if (content_area_height < deviceHeight ){
    paddingTop = (deviceHeight - content_area_height)/2;
    if (paddingTop > 130) {
      paddingTop = paddingTop - 130;
    }
    $('.content_area > div').css({"padding-top":paddingTop+"px"});
  }
  if (deviceWidth < 992 ){
    //var marginTop = ($('.testbg').height()/2) + 30;
    //$('.testbg').css({"margin-top":"-"+marginTop+"px"});

    $('.testbg').each(function (index, value){
      var marginTop = $(this).height()/2;
      $(this).css({"margin-top":"-"+marginTop+"px"});
      //console.log(index + " text height = " + $(this).height());
      //console.log(index + " marginTop = " + marginTop);
    });

    $('.text').each(function (index, value){
      var textMarginTop = $(this).height()/2;
      $(this).css({"margin-top":"-"+textMarginTop+"px"});
      //console.log(index + " text height = " + $(this).height());
      //console.log(index + " textMarginTop = " + textMarginTop);
    });
  }
  /*if (deviceWidth > 991 ){
    var buyNowBtnTop = deviceHeight - $('.buy-now-btn').height();
    $('.buy-now-btn').css("top",buyNowBtnTop);
  }*/
  if (iOS) {
    if (deviceWidth < 992 ){
      $("#CartCount").css({"top":"7px"});
      $("#CartCount").css({"right":"4px"});
      $(".l-right svg.show_open").css({"width":"23px"});
    }
  }
  $('#stories #fullpage section, .template-article #fullpage1 section, .template-product #fullpage1 section, .template-index #fullpage section').each(function (index, value){
    console.log(index);
    console.log($(this).attr('data-section'));
    if($(this).attr('data-section') == "two-image") {
      var element_bgimage = $(this).find('.section1_imgl');
      var mobile_url = $(this).find('.section1_imgl').attr('data-mobile-url');
    } else if($(this).attr('data-section') == "video") {
      var element_bgimage = $(this).find('.vimeo-wrapper');
      var mobile_url = element_bgimage.attr('data-mobile-url');
    } else {
      var element_bgimage = $(this);
      var mobile_url = $(this).attr('data-mobile-url');
    }
   console.log(mobile_url);
    if(typeof mobile_url !== undefined && mobile_url !== false && mobile_url != undefined) {
      console.log('inside condition');
      if (deviceWidth < 575 ){
        element_bgimage.css({"background-image": "url('"+mobile_url+"')"});
      }
    }
  });

  var $isAnimatedFirst = $('.section-first .is-animated'),
  $isAnimatedSecond = $('.section-second .is-animated'),
  $isAnimatedThird = $('.section-third .is-animated'),
  $isAnimatedFourth = $('.section-fourth .is-animated');

  // fullpage customization
  if ($('#fullpage').length) {
    $('#fullpage').fullpage({
      //sectionsColor: ['#000000', '#000000', '#000000', '#000000', '#000000'],
      sectionsColor: ['#686868', '#686868', '#686868', '#686868', '#686868'],
      sectionSelector: '.vertical-scrolling',
      slideSelector: '.horizontal-scrolling',
      navigation: true,
      slidesNavigation: true,
      controlArrows: false,
      anchors: ['firstSection', 'secondSection', 'thirdSection', 'fourthSection', 'fifthSection'],
      menu: '#menu',
      afterLoad: function(slideIndex){
        if( slideIndex == "firstSection" ) { 
          $isAnimatedFirst.addClass('animated fadeInUp');
          $isAnimatedFirst.eq(0).css('animation-delay', '.3s');
          $isAnimatedFirst.eq(1).css('animation-delay', '.6s');
        }
      }, 
      onLeave: function(index, nextIndex, direction) {
        if( index == 1 && nextIndex == 2 ) { 
          $isAnimatedSecond.addClass('animated fadeInUp');
          $isAnimatedSecond.eq(0).css('animation-delay', '.3s');
          $isAnimatedSecond.eq(1).css('animation-delay', '.6s');
        }
        else if( ( index == 1 || index == 2 ) && nextIndex == 3 ) {
          $isAnimatedThird.addClass('animated fadeInUp');
          $isAnimatedThird.eq(0).css('animation-delay', '.3s');
          $isAnimatedThird.eq(1).css('animation-delay', '.6s');
        }
        else if( ( index == 1 || index == 2 || index == 3 ) && nextIndex == 4 ) {
          $isAnimatedFourth.addClass('animated fadeInUp');
          $isAnimatedFourth.eq(0).css('animation-delay', '.3s');
          $isAnimatedFourth.eq(1).css('animation-delay', '.6s');
        }
      }
    });
  }
  
  $("#vl-overlay").click(function(event) {
    $('.header-top').removeClass('shop-menu');
    $('.header-top').removeClass('open-menu');
    $('.header-top').removeClass('open-searchbar');
    toggleScrollAndOverlay();
  });

  $('.menu_middle').on('click', function() {
    $('.header-top').toggleClass('open-menu');
    $('.header-top').removeClass('shop-menu');
    $('.header-top').removeClass('open-searchbar');
    toggleScrollAndOverlay();
  });

  $('.show_open').click(function(event) {
    $('.header-top').toggleClass('shop-menu');
    $('.header-top').removeClass('open-menu');
    $('.header-top').removeClass('open-searchbar');
    toggleScrollAndOverlay();
    $(window).scrollTop(0);
  });

  $('.search').click(function(event) {
    $('.header-top').addClass('open-searchbar');
    $('.header-top').removeClass('shop-menu');
    $('.header-top').removeClass('open-menu');
    toggleScrollAndOverlay();
  });

  $(".search-close").click(function(event) {
    $('.header-top').removeClass('open-searchbar');
    $('.header-top').removeClass('shop-menu');
    $('.header-top').removeClass('open-menu');
    toggleScrollAndOverlay();
  });

  function toggleScrollAndOverlay() {
    if(!$('body').hasClass('template-index') && !$('body').hasClass('template-blog')) {
      if($('.header-top').hasClass('open-menu') || $('.header-top').hasClass('shop-menu') || $('.header-top').hasClass('open-searchbar')) {
        $('body').css({"overflow":"hidden"});
      }else{
        $('body').css({"overflow":"auto"});
      }
    }
    if($('.header-top').hasClass('open-menu') || $('.header-top').hasClass('shop-menu') || $('.header-top').hasClass('open-searchbar')) {
      $("#vl-overlay").css("opacity", "0.7");
      $("#vl-overlay").fadeIn();
    }else{
      $("#vl-overlay").css("opacity", "0");
      $("#vl-overlay").fadeOut();
    }    
  }

  AOS.init({
    easing: 'ease-out-back',
    duration: 1000,
    once: true
  });

  /* for text hover change image on menu*/
  $("ul#menu a").hover(function() {
    $("#pic").removeClass().addClass($(this).attr('rel'));
  });

  $(window).scroll(function() {
    if ($(this).scrollTop() > 150) {
      $('.header-top').addClass('stuck');
      $('.james').hide();
      $('.ays').show();
    } else {
      $('.header-top').removeClass('stuck');
      if($('body#store-locator').length){
        $('.header-top').css({"background-color":"#ffffff"});
      } else {
        $('.header-top').css({"background-color":"transparent"});
      }
      $('.james').show();
      $('.ays').hide();
    }
    if ( deviceWidth > 991 ) {
      $('.stuck').css({"top":"35px"});
    } else {
      $('.stuck').css({"top":"0px"});
      $('.james').hide();
      $('.ays').show();      
    }    
  });

  document.forms['searchform'].elements['q'].focus();

	$("#jamesay").click(function() {
      $('html, body').animate({scrollTop: $("#jamesay-data").offset().top-200}, 2000);
  });
  $("#customerservice").click(function() {
      $('html, body').animate({scrollTop: $("#customerservice-data").offset().top-200}, 2000);
  });
  $("#ambassador").click(function() {
      $('html, body').animate({scrollTop: $("#ambassador-data").offset().top-200}, 2000);
  });
  $("#press").click(function() {
      $('html, body').animate({scrollTop: $("#press-data").offset().top-200}, 2000);
  });

  // $(window).scroll(function() {
  //   if ($(this).scrollTop() >= 50) {
  //     $('#return-to-top').fadeIn(200);
  //   } else {
  //     $('#return-to-top').fadeOut(200);
  //   }
  // });
  // $('#return-to-top').click(function() {
  //   $('body,html').animate({
  //     scrollTop : 0
  //   }, 500);
  // });
});

$(window).on('load', function() {
  AOS.refresh();
});