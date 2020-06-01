// 滚动到指定元素
function scrollToElement(target, offset) {
  var scroll_offset = $(target).offset();
  $('body,html').animate({
    scrollTop: scroll_offset.top + (offset || 0),
    easing: 'swing'
  });
}

// 防抖动函数
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// 顶部菜单的监听事件
function navbarScrollEvent() {
  var navbar = $('#navbar');
  if (navbar.offset().top > 0) {
    navbar.addClass('navbar-custom');
    navbar.removeClass('navbar-dark');
  }
  $(window).scroll(debounce(function () {
    $('.scrolling-navbar')[navbar.offset().top > 50 ? 'addClass' : 'removeClass']('top-nav-collapse');
    if (navbar.offset().top > 0) {
      navbar.addClass('navbar-custom');
      navbar.removeClass('navbar-dark');
    } else {
      navbar.addClass('navbar-dark');
    }
  }, 20));
  $('#navbar-toggler-btn').on('click', function () {
    $('.animated-icon').toggleClass('open');
    $('#navbar').toggleClass('navbar-col-show');
  });
}

// 头图视差的监听事件
function parallaxEvent() {
  var target = $('#background[parallax="true"]');
  var parallax = function () {
    var oVal = $(window).scrollTop() / 5;
    var offset = parseInt($('#board').css('margin-top'), 0);
    var max = 96 + offset;
    if (oVal > max) {
      oVal = max;
    }
    target.css({
      transform: 'translate3d(0,' + oVal + 'px,0)',
      '-webkit-transform': 'translate3d(0,' + oVal + 'px,0)',
      '-ms-transform': 'translate3d(0,' + oVal + 'px,0)',
      '-o-transform': 'translate3d(0,' + oVal + 'px,0)'
    });

    var toc = $('#toc');
    if (toc) {
      $('#toc-ctn').css({
        'padding-top': oVal + 'px'
      });
    }
  };
  if (target.length > 0) {
    parallax();
    $(window).scroll(parallax);
  }
}

// 向下滚动箭头的监听事件
function scrollDownArrowEvent() {
  $('.scroll-down-bar').on('click', function () {
    scrollToElement('#board', -$('#navbar').height());
  });
}

// 向顶部滚动箭头的监听事件
function scrollTopArrowEvent() {
  var topArrow = $('#scroll-top-button');
  if (!topArrow) {
    return;
  }
  var posDisplay = false;
  var scrollDisplay = false;
  // 位置
  var setTopArrowPos = function () {
    var boardRight = document.getElementById('board').getClientRects()[0].right;
    var bodyWidth = document.body.offsetWidth;
    var right = bodyWidth - boardRight;
    posDisplay = right >= 50;
    topArrow.css({
      'bottom': posDisplay && scrollDisplay ? '20px' : '-60px',
      'right': right - 64 + 'px'
    });
  };
  setTopArrowPos();
  $(window).resize(setTopArrowPos);
  // 显示
  var headerHeight = $('#board').offset().top;
  $(window).scroll(debounce(function () {
    var scrollHeight = document.body.scrollTop + document.documentElement.scrollTop;
    scrollDisplay = scrollHeight >= headerHeight;
    topArrow.css({
      'bottom': posDisplay && scrollDisplay ? '20px' : '-60px'
    });
  }, 20));
  // 点击
  topArrow.on('click', function () {
    $('body,html').animate({
      scrollTop: 0,
      easing: 'swing'
    });
  });
}

// 鼠标点击效果
function clickEffect() {
  //定义获取词语下标
  var a_idx = 0;
  jQuery(document).ready(function ($) {
    //点击body时触发事件
    $("body").click(function (e) {
      //需要显示的词语
      var a = new Array("富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法治", "爱国", "敬业", "诚信", "友善");
      //设置词语给span标签
      var $i = $("<span/>").text(a[a_idx]);
      //下标等于原来下标+1  余 词语总数
      a_idx = (a_idx + 1) % a.length;
      //获取鼠标指针的位置，分别相对于文档的左和右边缘。
      //获取x和y的指针坐标
      var x = e.pageX,
        y = e.pageY;
      //在鼠标的指针的位置给$i定义的span标签添加css样式
      $i.css({
        "z-index": 999,
        "top": y - 20,
        "left": x,
        "position": "absolute",
        "font-weight": "bold",
        "color": rand_color()
      });
      // 随机颜色
      function rand_color() {
        return "rgb(" + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + ")"
      }
      //在body添加这个标签
      $("body").append($i);
      //animate() 方法执行 CSS 属性集的自定义动画。
      //该方法通过CSS样式将元素从一个状态改变为另一个状态。CSS属性值是逐渐改变的，这样就可以创建动画效果。
      //详情请看http://www.w3school.com.cn/jquery/effect_animate.asp
      $i.animate({
        //将原来的位置向上移动180
        "top": y - 180,
        "opacity": 0
        //1500动画的速度
      }, 1500, function () {
        //时间到了自动删除
        $i.remove();
      });
    });
  });
}

$(document).ready(function () {
  navbarScrollEvent();
  parallaxEvent();
  scrollDownArrowEvent();
  scrollTopArrowEvent();
  clickEffect();
});
