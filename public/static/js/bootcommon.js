app.config(function($httpProvider) {
    var rand = Math.random();
    $httpProvider.defaults.headers.common = { 'spm' : rand,'X-Requested-With': 'XMLHttpRequest' }
})
$(function(){

$(document).on('click','.messbtn',function(){
 	$('.message_case').modal('show');
 })
// 选择行业分类
$('.class').on('click', function(){
	$(this).siblings('.select-tab').show();
})
// 下拉菜单
   $(document).on('click', '.dropdown-menu li a', function(){
    $(this).parents('li').addClass('hover').siblings().removeClass('hover');
    var con = $(this).html();
    var val = $(this).attr('value');
    $(this).parents('.dropdown').find('.dropdown-selected').html(con).attr('value', val);
    $(this).parents('.dropdown-menu').hide();
   })

  $(document).on('mouseover', '.dropdown', function(){
    $(this).find('.dropdown-menu').css('margin-top', '0px').show();
    $(this).children('.newdt').css({'border-left':'1px solid #e7ebed','border-right': '1px solid #e7ebed','background':'#fff'});
  })

  $(document).on('mouseout', '.dropdown', function(){
    $(this).find('.dropdown-menu').hide();
    $(this).children('.newdt').css({'border-left':'1px solid #f8fbff','border-right': '1px solid #f8fbff','background':''});
  })

$(document).on('mouseover', '.dropdown', function(){
	$(this).find('.dropdown-menu').css('margin-top', '0px').show();
})
$(document).on('mouseout', '.dropdown', function(){
	$(this).find('.dropdown-menu').hide();
})
$(document).on('click', '.dropdown-select li a', function(){
  $(this).parents('.dropdown-select').find('.dropdown-selected').html($(this).html()).attr('value', $(this).attr('value'))
})

// modal 返回指定modal  跳转页面
$(document).on('click', '.modal button', function(){
	var back = $(this).attr('back');
	var fun = $(this).attr('fun');

	if(back){
		if(back.match(/\.htm/)){
			window.location.href = back;
		} else {
			$('.'+back).modal('show')
		}
		return false;
	}

	if(fun){
		eval('('+fun+')');
	}
		
})

// modal  头部拖动
$(document).on('mousedown', '.modal-header, .modal-footer', function(e){
	var x = e.pageX;
	var y = e.pageY;
	var $modal = $(this).parents('.modal-dialog');
	var top = parseInt($modal.css('top'));
	var left = parseInt($modal.css('left'));

	$(document).on('mousemove', function(e){
		var xx = e.pageX;
		var yy = e.pageY;	

		$modal.css({
			top: top+yy-y+'px',
			left: left+xx-x+'px'
		})
	})
})
$(document).on('mouseup', function(){
	$(document).off('mousemove')
})

// 滚动到顶部
$(document).on('click', '.go_top', function(){
  $('body,html').animate({'scrollTop': 0}, 1000)
})

// 购物车右侧
$(document).on('click', '.menu_right_btn', function(){
  $(this).parents('.menu-right').toggleClass('open')
})
$(document).on('click', '.menu_right_close', function(){
  $(this).parents('.menu-right').removeClass('open')
})

// 列表头部放到顶部
$(window).on('scroll', function(){
  if(!$('.goto_header').length) return false;

  var top = $('.goto_header').offset();
  var width = $('.goto_header').width();
  var height = $('.goto_header').height();
  top = top.top;
  var scroll_top = $(window).scrollTop();
  var header_height = $('.header_togo').height();
  if($('.goto_header_ok').length) header_height -=  $('.goto_header_ok').height();

  if(scroll_top+header_height > top){
    if($('.goto_header_ok').length) return false;
    var html = '';
    if($('.goto_header > thead').length){
      html = $('.goto_header > thead').clone()
      html = $('<table class="table goto_header_ok" style="width: '+width+'px;margin: 0 auto;"></table>').append(html)
    } else {
      html = $('.goto_header').clone()
      html = $('<div class=" goto_header_ok" style="width: '+width+'px;margin: 0 auto;"></div>').append(html)
    }
    $('.header_togo').append(html).find('.goto_header').removeClass('goto_header');
  } else {
    $('.goto_header_ok').remove();
  }
})

// 解决框架兼容
$('.modal').on('hidden.bs.modal', function(){
  $('body').css('padding-right', 0);
})

$(document).keypress(function(e) {
    if(e.which == 13) {
        $('.tcdPageCode a.go').trigger('click')
    }
});

	 var cook = $.cookie('token');
	$(document).on('click','.tougao',function(){
		if(cook == null){
	    	modal_confirm('您还没有登录，登录才能投稿！',function(){
				window.location.href = '/member/user/login.htm';
			}, function(){
		          
		    }, {yes: '去登录',no:'hide'});
	    }
	})



})

// ------------------------------------------------功能函数---------------------------------------------

// 点击分页滚动
function gotoTop(target, header){
  var top = target ? $(target).offset() : 0;
  var header_height = header ? $(header).height() : 0;
  $(window).scrollTop(top.top-header_height-20);
}

// 新手引导
function showGuide(){
	 var intro = introJs();
      intro.setOptions({
      	tooltipClass: '',
        nextLabel: '下一步',
        prevLabel: '上一步',
        skipLabel: '跳过',
        doneLabel: "完成",
        exitOnOverlayClick: false,
        exitOnEsc: true,
        showButtons: true,
        showBullets: false,
        showProgress: false,

        steps: [
          {
            element: '#step1',
            intro: "在这里添加网站资源",
            position: 'right'
          },
          {
            element: '#step2',
            intro: "在这里出售相关商品",
            position: 'right'
          },
          {
            element: '#step3',
            intro: "在这里查看、管理订单",
            position: 'right'
          }

        ]
      });

      intro.start();
}
// showGuide();


// 验证手机号
function checkPhone(phone){
  var reg = /^[1][0-9][0-9]{9}$/;
  if(reg.test(phone)){
  	return true;
  } else {
  	return false;
  }
}



// 设置复制功能   252
function setcopy(btn, con){
	
	var clip = new ZeroClipboard.Client();
	clip.setHandCursor(true);
	clip.setText($('#'+con).val());
	clip.glue(btn);

	clip.addEventListener( "complete", function(){
		modal_alert("复制成功！");
	});


	$(document).on('click', function(){
		clip.reposition();
		$(window).scrollTop(0)
	})

}


// 计时器
function setTimer(target, contain, time){
	$('.'+target).removeClass(target).addClass('timer_running').html(time+'秒后获取');

	var timer = setInterval(function(){
		time--;
		if(time < 0){
			clearInterval(timer);
			$('.timer_running').removeClass('timer_running').addClass(target).html(contain)
			return false;
		}
		$('.timer_running').html(time+'秒后获取');
	}, 1000)
}

// 小型模态框  modal_time
// modal_time('123', 1);
function modal_time(str, time){
  if(str && time){
    $('.modal_time').find('.modal_time_text').html(str);
    $('.modal_time').modal('show');

    setTimeout(function(){
      $('.modal_time').modal('hide');
    }, time)

    $('.modal_time').on('hidden.bs.modal', function(){
      $('.modal_time').find('.modal_time_text').html('没有提示内容...');
    })
  }
}

//勾选选择
$(document).on('click', '.checkplace', function(){
    var k = $(this).find('input').attr('mark');
    if ($('.checkplace input[type="radio"]').is(':checked')) {
        if(k==1){
            $('.inpage').show();
        }else{
            $('.inpage').hide();
        }
    }

})


// 小型模态框  modal_alert
// modal_alert(111);
function modal_alert(str){
	if(str){
		$('.modal_tips').find('.modal_tips_text').html(str);
		$('.modal_tips').find('.modal_tips_no').addClass('hidden');
		$('.modal_tips').modal('show');

		$('.modal_tips').on('hidden.bs.modal', function(){
			$('.modal_tips').find('.modal_tips_text').html('没有提示内容...');
			$('.modal_tips').find('.modal_tips_no').removeClass('hidden');
		})
	}
}


// 小型模态框  confirm
// modal_confirm(111,function(){console.log('yes11')}, function(){console.log('no')});
function modal_confirm(str, fnY, fnN, btns){
	if(str){
		$('.modal_tips').find('.modal_tips_text').html(str);
		$('.modal_tips').modal('show');
		$(document).on('click', '.modal_tips .modal_tips_no', function(){
			if(typeof fnN == 'function'){
				fnN();
			}
		})
		$(document).on('click', '.modal_tips .modal_tips_yes', function(){
			if(typeof fnY == 'function'){
				fnY();
			}
		})
		if(btns){
			btns.yes == 'hide' ? $('.modal_tips .modal_tips_yes').hide() : $('.modal_tips .modal_tips_yes').text(btns.yes);
			btns.no == 'hide' ? $('.modal_tips .modal_tips_no').hide() : $('.modal_tips .modal_tips_no').text(btns.no);
		}
		
		$('.modal_tips').on('hidden.bs.modal', function(){
			$('.modal_tips').find('.modal_tips_text').html('没有提示内容...');
			$('.modal_tips .modal_tips_yes').show().text('确定')
			$('.modal_tips .modal_tips_no').show().text('返回')
			setTimeout(function(){
				$(document).off('click', '.modal_tips .modal_tips_no');
				$(document).off('click', '.modal_tips .modal_tips_yes');
			},500)
		})
	}

}

	// 滚动函数 往上滚和往左滚
	// opts = {go: 'left', obj: $('.scroll_left'), cons: 5, goTime: 1000, stopTime: 2000, dots: $('.con-dots span')}
	// go:滚动方向top/left  obj:滚动的容器，有超出隐藏的  cons:容器看到的个数  goTime:滚动的时间，毫秒  stopTime:停止的时间
	// dots:滚动的序号按钮，所有的，要设置属性index从0开始（这个参数可不传）
	// afterfun:滚动后的函数调用，参数为当前的索引  beforefun:滚动前的函数调用，参数是索引 （这两个函数可不传）
    function scrollFun(opts, afterfun, beforefun){
        var itemNum = opts.obj.find('li').length;
        var conH = opts.obj.innerHeight();
        var conW = opts.obj.innerWidth();
        var itemH = conH/opts.cons;
        var itemW = conW/opts.cons;
        var cur = 1;
        //勿删 删掉下面这句会影响滚的时候卡顿
        opts.obj.find('li').clone().appendTo(opts.obj.find('ul')).attr('mark', 'clone');

        // 上滚
        var toTop = function(){
        	if(typeof beforefun == 'function'){
        		beforefun(cur == itemNum? 0: cur);
        	}
            opts.obj.stop(true, true).animate({
                scrollTop: itemH*cur+'px'
            }, opts.goTime, function(){
            	if(typeof afterfun == 'function'){
            		afterfun(cur == itemNum? 0: cur);
            	}
            	if(opts.dots)
            	opts.dots.eq(cur == itemNum? 0: cur).addClass('active').siblings().removeClass('active');
                cur++;
                if(cur > itemNum){
                    opts.obj.stop(true, true).scrollTop(0);
                    cur = 1;
                }
            })
        }
        if(opts.go == 'top'){
        	opts.obj.scrollTop(0);
            var timer = setInterval(toTop, opts.stopTime)
            opts.obj.on('mouseover', function(){
            	clearInterval(timer);
            })
            opts.obj.on('mouseout', function(){
            	timer = setInterval(toTop, opts.stopTime)
            })
            if(opts.dots){
            	opts.dots.on('mouseover', function(){
	            	clearInterval(timer);
	            	var index = $(this).attr('index');
	            	cur = index == 0? itemNum : index;
	            	toTop();
	            })
	            opts.dots.on('mouseout', function(){
	            	timer = setInterval(toTop, opts.stopTime)
	            })
            }
        }

    }

    // 统计字符串长度，一个汉字2个字节
	function countStr(str){
		var len = 0;
		if(str){
			for (var i = 0; i < str.length; i++) {
				if (str.charCodeAt(i) > 128) {
					len += 2;
				} else {
					len += 1;
				}
			};
		}
		return len;
	}

	// 获取链接的参数
  function getParameter(name) { 
    var reg = new RegExp(name +"=.*",'g'); 
    var str = window.location.href.match(reg); 
    
      if (str) {
        str = str[0].split('&');
        str = str[0].split('=');
        str = str[1];
        return str;
      } else {
        return '';
      }
  }




// 字符串超出截断加省略号
function cutStr(str, len){
   if(str.length*2 <= len) {
      return str;
   }

   var strlen = 0;
   var newstr = '';
   for(var i = 0;i < str.length; i++) {
      newstr = newstr + str.charAt(i);

      if (str.charCodeAt(i) > 128) {
          strlen = strlen + 2;
          if(strlen >= len){
             return newstr.substring(0,newstr.length-1) + '...';
          }
      } else {
          strlen = strlen + 1;
          if(strlen >= len){
             return newstr.substring(0,newstr.length-2) + '...';
          }
      }
   }
   return newstr;
}


app.directive('scrollShow', ['$window', function($window){
  return {
    link: function(scope, element, attr){
      $window = angular.element($window);
      $window.on('scroll', handler);
      
      function handler(){   
        if(element.height()/2+element.offset().top < $window.height()+$window.scrollTop()){
          element.addClass(attr.scrollClass);
        }
      }
      handler();
    }
  }
}]);


app.directive('scrollBottom', ['$window', function($window){
  return {
    link: function(scope, element, attr){
      $window = angular.element($window);
      $window.on('scroll', handler);
      
      function handler(){  
        var data = element.attr('data-scroll-bottom');
        if(!data){
          data = element.offset().top+element.height()*0;
          element.attr('data-scroll-bottom', data);
        } 
        if(data > $window.height()+$window.scrollTop()){
          element.addClass(attr.scrollBottom);
        } else {
          element.removeClass(attr.scrollBottom);
        }
      }
    }
  }
}]);


app.service('common', ['$http', function($http){
  // common.formatTime(time2, 'seconds', 'y/m/d h:i:s')
    this.staticHost = function(url){
     
        return staticHost(url);
    }
  this.formatTime = function(time, type, format){
    if(type == 'seconds') time = parseInt(time+'000');
    if(type == 'milliseconds') time = parseInt(time);
    
    var DateTime = new Date(time);
    var year = DateTime.getFullYear();
    var month = this.prevZero(DateTime.getMonth()+1);
    var date = this.prevZero(DateTime.getDate());
    var hours = this.prevZero(DateTime.getHours());
    var minutes = this.prevZero(DateTime.getMinutes());
    var seconds = this.prevZero(DateTime.getSeconds());

    time = format.replace(/y/g, year);
    time = time.replace(/m/g, month);
    time = time.replace(/d/g, date);
    time = time.replace(/h/g, hours);
    time = time.replace(/i/g, minutes);
    time = time.replace(/s/g, seconds);
    return time;
  }

  // 1 01
  this.prevZero = function(num){
    num = num+'';
    if(num.length == 1) num = '0'+num;
    return num;
  }

  // 购物车
  this.itemNum = 0;
  this.itemPrice = 0.00;
  this.itemData = [];
  this.itemDataList = []
  this.itemType = 1;
  this.itemShow = false;
  this.isLogin = false;

  this.getCart = function(type){
     // if(!type) return false;    // 1友链  2图文
      var url = indexUrl('cart/getcart');
      //if(type == 2){
      //  url = indexUrl('/cart/get_twcart');
      //}
      this.itemType = type;
      this.itemShow = true;
     

      var that = this;
      $http.get(url).then(function(res){   
        if(res.data.statusCode == 200){
          that.isLogin = true;
          that.itemNum = res.data.data.count;
          that.itemPrice = res.data.data.price.toFixed(2);
          that.itemDataList = res.data.data.cart;
          that.itemData = res.data.data;
       
            that.showHeadCart(that.itemNum);
        } else  {
          that.isLogin = true;
          that.itemNum = 0;
          that.itemPrice = 0.00;
          that.itemData = [];
          that.showHeadCart(that.itemNum);
        }
      }, function(res){
          that.itemNum = 0;
          that.itemPrice = 0.00;
          that.itemData = [];
          that.showHeadCart(that.itemNum);
      });
  }

  this.CartLogin = function(){
    var self = this
    setTimeout(function() {
      if(!self.isLogin){
          modal_confirm('登录后才能查看购物车，<br/>请先登录', function(){
              window.location.href = memberUrl('/user/login')+'?back_href='+window.location.href;
          }, function(){}, {yes:'去登录', no:'hide'});
      }
    }, 700);
    }
  this.showHeadCart = function(num){
    if(this.itemType == 1){
      $('.ylmm').parent().find('.shoptext').text(num);
    } else {
      $('.tw').parent().find('.shoptext').text(num);
    }
  };

 // 删除商品
    this.can_del = true
    this.delItem = function(gid){
      if(!this.can_del) return false;
      this.can_del = false
      if(!gid) return false;  
      var url = indexUrl('/cart/delfriendcart');
      //if(this.itemType == 2){
      //  url = indexUrl('/cart/deltwcart');
      //}

      var that = this;
      $http.post(url, {gids: gid}).then(function(res){
        that.can_del = true
        if(res.data.statusCode == 200){
          that.delItemOk(gid);
          // modal_alert(res.data.message);
        } else {
          modal_alert(res.data.message);
        }
      }, function(res){
        modal_alert('系统出错，请联系客服。');
      });
    }
    this.delItemOk = function(gid){
      for (var i = 0; i < this.itemData.cart.length; i++) {
          for(var g=0; g<this.itemData.cart[i].data.length;g++){
              if(this.itemData.cart[i].data[g]['gid'] == gid){
                  this.itemData.cart[i].count -= 1;
                  this.itemNum -= 1;
                  this.itemPrice = (this.itemPrice-this.itemData.cart[i].data[g]['price']).toFixed(2);
                  this.itemData.cart[i].data.splice(g, 1);
                  return false;
              }
          }
      };
    }

  // 添加购物车效果
  this.flyImg = function(url, obj1, obj2, pos, fun){
    if(!url || !obj1 || !obj2 || !pos) return false;
    var html = '<img src="'+url+'" class="fly_img" style="position:fixed;top:-100px;left:-100px;z-index:99999;width:45px;height:45px;border-radius:50%;overflow:hidden;opacity:0;"></img>';
    var obj1Data = {x:0, y:0};
    var obj2Data = {x:0, y:0};
    var winData = {x:0, y:0};

    winData.x = $(window).scrollLeft();
    winData.y = $(window).scrollTop();
    obj1Data.x = $(obj1).offset().left-winData.x+$(obj1).width()/pos.obj1x;
    obj1Data.y = $(obj1).offset().top-winData.y+$(obj1).height()/pos.obj1y;
    obj2Data.x = $(obj2).offset().left-winData.x+$(obj2).width()/pos.obj2x;
    obj2Data.y = $(obj2).offset().top-winData.y+$(obj2).height()/pos.obj2y;

    $('body').append(html);
    $('.fly_img').css({
      opacity: 1,
      top: obj1Data.y+'px',
      left: obj1Data.x+'px'
    });
    $('.fly_img').animate({
      top: obj2Data.y+'px',
      left: obj2Data.x+'px',
      width: '15px',
      height: '15px',
      opacity: 0.5
    }, pos.time, 'easeOutQuad', function(){
      $('.fly_img').remove();
      if(fun && typeof(fun) == 'function') fun();
    })
  }
}])

	// 图片上传
	$(document).on('click', '.adimgUp', function(){
		$('#adimgUp').trigger('click');

	})


// 检查长度
app.directive('checkLength', function () {
    return {
        link: function (scope, element, attrs) {
            var target = attrs.checkLength;
            var max = attrs.checkMax;
            var min = attrs.checkMin;

            element.on('change keyup click', function () {
                var val = element.val();
                var check = true;

                if (min && val.length < min) check = false;
                if (max && val.length > max) check = false;
                scope.$apply(function () {
                    scope[target] = check;
                })
            })
        }
    };
});

// 检查url
app.directive('checkUrl', function () {
    return {
        link: function (scope, element, attrs) {
            var target = attrs.checkUrl;

            element.on('change keyup click', function () {
                var val = element.val();
                var reg = /^[\s\S]{2,300}\.[\s\S]{2,300}$/g;
                var check = true;
                check = reg.test(val);
                
                scope.$apply(function () {
                    scope[target] = check;
                })
            })
        }
    };
});

// 渲染后执行
app.directive('renderOk', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) { 
            if (scope.$last === true) {
                $timeout(function () {
                    var fun = scope.$eval(attrs.renderOk);
                    if(fun && typeof(fun)=='function'){  
                        fun();  
                    }  
                });
            }
        }
    }
}])

//验证URL
function validateUrl(url) {
    var str = url;
//在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
//判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
//下面的代码中应用了转义字符"\"输出一个字符"/"
    //var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var Expression=/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp=new RegExp(Expression);
    if(objExp.test(str)==true){
        return true;
    }else{
        return false;
    }
}