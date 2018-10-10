$(function(){
	
	$(document).on('click','.head-type ul li a',function(){
		$(this).parents('ul').find('li a').removeClass('curr')
	    $(this).addClass('curr')
	})
	$(document).on('click','.order-types ul li a',function(){
		$(this).parents('ul').find('li a').removeClass('curr')
	    $(this).addClass('curr')
	})
//	提现管理页面头部切换
	$(document).on('click','.withdraw-type ul li a',function(){
		$(this).parents('ul').find('li a').removeClass('curr')
	    $(this).addClass('curr')
	    var index = $(this).parent().index();
	    $('.withdraw').hide();
	    $('.withdraw').eq(index).show();
	})
	
//	卖家页面JS
	$(document).on('click','.member-nav ul li',function(){
		$(this).addClass('curr').siblings().removeClass('curr');
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
	

	//下拉窗
	$('.user-logo .logoa').hover(function(){
		$('.dropdown-history').show();
	},function(){
		$('.dropdown-history').hide();
	})
	
	$('.webnav').hover(function(){
		$('.dropdown-nav').show();
	},function(){
		$('.dropdown-nav').hide();
	})
	
	//消息点击
//	$(document).on('click','.message .mess',function(){
//	 	$('.messagebox').fadeToggle();
//	})
	$('.message .mess').hover(function(){
		$('.messagebox').show();
	},function(){
		$('.messagebox').hide();
	})
	$('.shoppingcart .bg-shop').hover(function(){
		$('.dropdown-shop').show();
	},function(){
		$('.dropdown-shop').hide();
	})
	
//	消息弹窗
//	$(document).on('click','.allsee a',function(){
//	 	//$('.message_case').modal('show');
//	 })
	// //	新增网站弹窗
	// $(document).on('click','.add_btn',function(){
	// 	$('.addwebsite').modal('show');
	// })
	
	// $(document).on('click','.addwebsite .save',function(){
	// 	//$('.add_success').modal('show');     //成功
	// 	$('.add_waring').modal('show');     //失败
	// })
	
	//编辑网站弹窗
	// $(document).on('click','.edit-btn',function(){
	// 	$('.editwebsite').modal('show');
	// })
	
    // // 认证弹窗
	// $(document).on('click','.rz_btn',function(){
	// 	$('.checkwebsite').modal('show');
	// })
	
	//$('.add_success').modal('show'); 
	
//	认证成功/失败
	// $(document).on('click','.checkwebsite .save',function(){
	// //	$('.authen_success').modal('show');   //成功
	// 	$('.authen_lose').modal('show');      // 失败
		
	// })
	
	// $(document).on('click','.next_btn',function(){
	//  	$('.checkwebsite').modal('show');
	//  })
	
	//勾选选择
	  $(document).on('click', '.checkplace', function(){
	  	var k = $(this).find('input').attr('mark');
	    if ($('.checkplace input[type="radio"]').is(':checked')) {
	     	if(k==2){
	     		$('.inpage').show();
	     	}else{
	     		$('.inpage').hide();
	     	}
	    }
	   
	  })
	// 图片上传
//	$(document).on('click', '.adimgUp', function(){
//		$('#adimgUp').trigger('click');
//
//	})
	$(document).on("click",'.adFontImgUp',function(){
		$("#fontUpImg").trigger("click")
	})
	$(document).on("click",'.threeUp',function(){
		$("#threeUpIimg").trigger("click")
	})
	
//	取消认证 cancel-authen
	$(document).on('click', '.cancel-authen', function () {
       $('.cancel_modal').modal('show');
    })
	
	
	
	// $(document).on('click','.copy-btn',function(){
    // 	var con = $('.get-code').val();
    // 	console.log(con); 
    // 	setTimeout(function(){
 	// 	$(document).scrollTop(0);
	//     	setcopy('btn', con);
	    		
	//   	},1200)
    // })
	
	$(document).on('mouseover', '.yellow-r,.gray-r,.red_jy,.green_qy,.red-sz', function () {
        $(this).find('img').show();

    })
	
    $(document).on('mouseout', '.yellow-r,.gray-r,.red_jy,.green_qy,.red-sz', function () {
        $(this).find('img').hide();

    })
	
	//免费换链
	$(document).on('click','.free-table .website i',function(){
		$(this).parents('tr').siblings('tr').find('i').removeClass('curr');
		$(this).toggleClass('curr');
		$(this).parents('tr').siblings().find('.othertab').hide();
		$(this).parents('td').find('.othertab ').toggle();
		
	})
	
	$(document).on('click','#sees',function(){
   		$(this).parents('tr').siblings().find('.othertab').hide();
// 	 	$(this).toggleClass('curr');
   	 	$(this).parents('td').find('.othertab').toggle();
   	})
	
	
	// //免费换链 上架
	// $(document).on('click','.grounding_btn',function(){
	// 	$('.grounding').modal('show');
	// })


	
	//免费换链  删除友链
	$(document).on('click','.delweb_btn',function(){
		$('.del-friendlink').modal('show');
	})

	// 选择行业分类
	$('.class').on('click', function(){
		$(this).siblings('.select-tab').show();
	})
	
	$(document).on('click', '.select-tab li', function () {
        var $this = $(this);
        var $ipt = $this.parents('.select-tab').siblings('.class')  
        var cids = $ipt.attr('cid')

        if ($this.hasClass('active')) {
            $this.removeClass('active')

            var val = $ipt.val() ? $ipt.val() : '';
            val += ',';
            var cid = $ipt.attr('cid') ? $ipt.attr('cid') : '';
            var regVal = new RegExp($this.html() + '\,', 'g')
            var regCid = new RegExp($this.attr('cid') + '\,', 'g')


            val = val.replace(regVal, '');
            cid = cid.replace(regCid, '');

            val = val.slice(0, -1)
            $ipt.val(val)
            $ipt.attr('cid', cid)
            if($ipt.val() == ''){
                $ipt.val('不限');
                $('.select-tab li').removeClass('active');
            }

        } else {
            if (cids && cids.split(',').length > 5) {
                modal_alert('最多选择5个分类')
                return false;
            }

            $this.addClass('active')

            var val = $ipt.val() ? $ipt.val() + ',' : '';
            var cid = $ipt.attr('cid') ? $ipt.attr('cid') : '';

            val += $this.html() + ','
            cid += $this.attr('cid') + ','

            val = val.slice(0, -1)
            $ipt.val(val)
            $ipt.attr('cid', cid)
            
            var val22 = $ipt.val();
            val22 = val22.replace('不限,', '');
            $ipt.val(val22);
        }
	})
	

	// select-tab 关闭
	$('.select-tab .ok').on('click', function(){
		$(this).parents('.select-tab').hide();
	})

//买家页面JS

   	$(document).on('click','.all-type ul li a',function(){
   		var index = $(this).parent().index();
   		$(this).parents('ul').find('li a').removeClass('curr')
    	    $(this).addClass('curr')
    	    $('.tab-list').hide();
   		$('.tab-list').eq(index).show();
   		$('.newadd').hide();
   		$('.newadd').eq(index).show();
   	})
// 	// 小图  大图  定位
   	// $(document).on('mouseover', '.smallimg', function (e) {
   	//     var src = $(this).attr('src');
   	//     $('body').append('<img src="' + src + '" style="display:none;position:absolute;top:0;left:0;z-index:99999;" class="position_img"/>');
   	//     $('.position_img').fadeIn();
   	//     runPosition($(this), $('.position_img'));
   	// })
   	// $(document).on('mouseout', '.smallimg', function () {
   	//     $('.position_img').remove();
   	// })
	 
// //	买家首页弹窗  	 

 	$(document).on('click','.addlink_btn',function(){
 		$('.addlink').modal('show');
 	})

 	$(document).on('click','.editlink_btn',function(){
 		$('.editlink').modal('show');
 	})
	
 	$(document).on('click','.del-link',function(){
 		$('.del-model').modal('show');
 	})
	
 	$(document).on('click','.deladv_btn',function(){
 		$('.del-advert').modal('show');
 	})
	
 	$(document).on('click','.addadvert_btn',function(){
 		$('.add-advert').modal('show');
 	})
	
 	$(document).on('click','.editadvert_btn',function(){
 		$('.edit-advert').modal('show');
 	})
//	选择网站  already
//	$(document).on('click','.already',function(){ ///////////////////////////////////////
//	 	$('.chooseweb').modal('show');
//	})
	$(document).on('click', '.select_single', function(){
 		
 			$(this).addClass('checked').parents('tr').siblings().find('td').children().removeClass('checked')
 		
 	})

//	出售友链 查看 /////////////////////////////////
   	$(document).on('click','.friend-table .see',function(){
		//    $(".order-info").removeClass('none')
   		$(this).parents('tr').siblings().find('.order-info').hide();
   	 	$(this).toggleClass('curr');
   	 	$(this).parent().find('.order-info').toggle();
   	})
	
   	// $(document).on('click', '.down-shelf', function(){
	// 	$('.grounding').modal('show');
	// })
   	// $(document).on('click', '.up-shelf', function(){
	// 	$('.success-up').modal('show');
	// })
	
//	出售图文切换  sell-tab
	$(document).on('click', '.sell-tab a', function(){
 		$(this).addClass('active').siblings().removeClass('active');
 		var index = $(this).index()-1;
 		$('.twsell').hide().eq(index).show();
 		
 	})
//	勾选自动续费效果
//	$(document).on('click','.auto',function(){
//		if ($('.auto input[type="checkbox"]').is(':checked')) {
//	     	modal_alert('选择自动续费功能服务时，在您余额充足的情况下，我们将在您的订单到期后自动按最新的商品价格为您逐月续费这笔订单！');
//	    }else{
//	    	modal_alert('您已经取消自动续费')
//	    }
//	})
	
	//效果预览  inside
//	$(document).on('click','.inside',function(){
//		$('.effect').modal('show')
//	})
	
//	套餐付款   pachage-btn
	$(document).on('click','.pachage-btn',function(){
		$('.package-pay').modal('show');
	})
	//确认删除订单？
	$(document).on('click','.order-del',function(){
		$('.del-account').modal('show')
	})
	//解决故障
	$(document).on('click','.solve_btn',function(){
		$('.solve_modal').modal('show');
	})
	//拒绝订单
	$(document).on('click','.refuse_btn',function(){
		$('.refuse_modal').modal('show');
	})
//	成功接单弹窗
	//$('.success-order').modal('show');
	
	//编辑签名
	// $(document).on('click', '.penbtn', function(){
    //     var msg=$("#msg").text();
    //     $("#msg").before("<input type='text' value='"+msg+"' id='inmsg' class='modalsp3' onblur='change()'>");
    //     $("#inmsg").focus();
    //     $("#msg").remove();
	// }); 
//	修改账户信息
	$(".modify").on('click', function() {
        $(this).parent().parent('.row').removeClass('show').addClass('hidden');
        $(this).parent().parent('.row').siblings('.hide-box:first()').removeClass('hidden').addClass('show');
        $(this).parent().parent().siblings().find('.pw-txt').val('');
        $(this).parents('.com-wrap').siblings().children('.hide-box').removeClass('show').addClass('hidden');
        $(this).parents('.com-wrap').siblings().children('.row').removeClass('hidden').addClass('show');
        $(".nickNameCon").removeClass('show').addClass('hidden');
        $(".nickname").removeClass('hidden').addClass('show');
	});
	

    // $('.baocun01').on('click',function(){
    // 	$("#phonecode").addClass('error').siblings('label').addClass('show').removeClass('hidden');
    // 	$("#confirpsw").addClass('error').siblings('label').addClass('show').removeClass('hidden');
	// })
	
    $('.newpwd').on('change',function(){
    	
    	$(".newpwd").siblings('label').addClass('show').removeClass('hidden');
    })
    $(".cancel-btn").on('click', function() {
        $(this).parents('.hide-box').removeClass('show').addClass('hidden');
        $(this).parents('.hide-box').siblings('h4,.row').removeClass('hidden').addClass('show');
    });
//  修改绑定手机号码下一步
//     $("#phone-next-btn").click(function(){
        
//         $(this).parents('.hide-box').removeClass('show').addClass('hidden');        
//         $(this).parents('.hide-box').siblings('.hide-box').removeClass('hidden').addClass('show');
                    
//     });
//    修改QQ下一步
//     $("#qq-next-btn").click(function(){
        
//         $(this).parents('.hide-box').removeClass('show').addClass('hidden');        
//         $(this).parents('.hide-box').siblings('.hide-box').removeClass('hidden').addClass('show');
                    
//     });
//      修改邮箱下一步
//     $("#email-next-btn").click(function(){
        
//         $(this).parents('.hide-box').removeClass('show').addClass('hidden');        
//         $(this).parents('.hide-box').siblings('.hide-box').removeClass('hidden').addClass('show');
                    
//     });
    
    $(document).on('click', '.add_bank,.add-account', function(){
 		$('.addbank_modal').modal('show');
 	})
    //勾选选择支付宝
	  $(document).on('click', '.checkbank', function(){
	  	var k = $(this).find('input').attr('mark');
	    if ($('.checkbank input[type="radio"]').is(':checked')) {
	     	if(k==2){
	     		$('.openbank').hide();
	     	}else{
	     		$('.openbank').show();
	     	}
	    }
	   
	  })
    $(document).on('click', '.del-bank', function(){
 		$('.del-account').modal('show');
 	})
    
//  申请故障选择
    $(document).on('click', '.r_other', function(){
	  	var k = $(this).find('input').attr('mark');
	    if ($('.r_other input[type="radio"]').is(':checked')) {
	     	if(k==2){
	     		$('.remarlbox').show();
	     	}else{
	     		$('.remarlbox').hide();
	     	}
	    }
	   
	})
    
    // $(document).on('click', '.add-free', function(){
 	// 	$('.success-free').modal('show');
 	// })
    
    $(document).on('click', '.apply_btn', function(){
 		$('.apply-fault').modal('show');
 	})
    
// //  提现管理页面的提现按钮  with_btn
// 	$(document).on('click', '.with_btn', function(){
//  		$(this).parents('.withdraw').hide();
//  		$('.balance a.return').hide();
//  		$('.success-tx').show();
//  	})
//	充值金额选择
	$(document).on('click', '.amount ul li', function(){
 		$(this).addClass('choose').siblings().removeClass('choose');
 	})
	//	充值方式选择
	$(document).on('click', '.way ul li', function(){
 		$(this).addClass('choose').siblings().removeClass('choose');
 		//$('.recharge-foot a.once').hide().eq(index).show();

 	})
	//微信充值按钮弹窗
	//$(document).on('click', '.wx_btn', function(){
 	//	$('.wx-pay').modal('show');
 	//})
//	流量交换
	$(document).on('click', '.c-head ul li', function(){
 		$(this).addClass('curr').siblings().removeClass('curr');
 	})
	$(document).on('click', '.daynum a', function(){
 		$(this).addClass('active').siblings().removeClass('active');
 	})
	$(document).on('click', '.databoxs span', function(){
 		$(this).addClass('active').siblings().removeClass('active');
 	})
	//新增广告位的流量查看
	// $(document).on('click', '.seeflow_btn', function(){
 	// 	$('.seeflow').modal('show');
 	// })
	//新增广告位的暂停
	// $(document).on('click', '.suspend_btn', function(){
 	// 	$('.suspend').modal('show');
 	// })
	//新增广告位的开启失败
	// $(document).on('click', '.openfail_btn', function(){
 	// 	$('.openfail').modal('show');
 	// })
	//新增广告位的删除
	// $(document).on('click', '.cutout_btn', function(){
 	// 	$('.cutout').modal('show');
 	// })
	
	//我的加盟广告暂停弹窗
	$(document).on('click', '.stop_btn', function(){
 		$('.stop').modal('show');
 	})
	//我的加盟广告流量查看
	$(document).on('click', '.seeflow_btn2', function(){
 		$('.seeflow2').modal('show');
 	})
	//我的加盟广告删除
	$(document).on('click', '.cutout_btn2', function(){
 		$('.cutout2').modal('show');
 	})
	
	
//	友链套餐  查看
	// $(document).on('click', '.see_btn', function(){
 	// 	$('.see_modal').modal('show');
 	// })
//	友链套餐删除
	// $(document).on('click', '.delpackage', function(){
 	// 	$('.delpackage_modal').modal('show');
 	// })
//	友链套餐下架 
	// $(document).on('click', '.package_xjbtn', function(){
 	// 	$('.package_xj').modal('show');
 	// })
	//	友链套餐  有修改过的上架
	$(document).on('click', '.up_btn', function(){
 		$('.success-up').modal('show');
 	})
	
	//	友链套餐  添加网站
	// $(document).on('click', '.add_webs', function(){
 	// 	$('.choosewebsite').modal('show');
 	// })
	
//	复制代码字数控制
//	var code = $('#codes').text(); 
//	LimitNumber(code,'codes');
	
	
	$(document).on('click', '.checktype', function(){
		var index = $(this).index();
		$('.advert-box').hide();
		$('.advert-box').eq(index).show();
 	})
	// 返回顶部
	$(window).scroll(function(){
		if ($(document).scrollTop() > 150) {
			$('.gotop').addClass('topdh')
		}else{
			$('.gotop').removeClass('topdh')
		}
	})
	$('.gotop').click(function() {
        $("html,body").animate({
            scrollTop: 0
        }, 500);
    });
    
    // modal  头部拖动
		//$( ".modal-content" ).draggable();
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
    
//  左侧新菜单
	$(document).on('click','.member-nav dl dt',function(){
		
		$(this).parent().find('dd').slideToggle();
		$(this).parent().siblings().find('dd').hide();
		$(this).parent().siblings().find('dt').children().children().removeClass('arrow_down');
		if($(this).find('a').hasClass('arrup')){
			$(this).find('a').children().toggleClass('arrow_down')
		}
		
	})
	$(document).on('click','.member-nav dl dd a',function(){
		$(this).addClass('active').parent().siblings().find('a').removeClass('active')
	})
    
	$('body,html').animate({'scrollTop':0},100);
    $(document).on('click', function () {
        $('body').css({'padding-right': '0px'})
    })


	


//	引导页

var guideimg = "<img src='/static/images/guide/new.png' class='guide_new'>";
	
var guidePath = JSON.parse($.cookie('newGuide')) || [

	{
	path:'/websitetrade/sellwebsite',
 isNew:'true'
	},
	{
	path:'/goods/friendgoods',
 isNew:'true'
	},
	{
	path:'/order/indexsell',
 isNew:'true'
	},
	{
	path:'/',
 isNew:'true'
	},
	
]

	//关掉引导
	$(document).on('click','.show_guide',function(){

		var lo = window.location.href;
		console.log(lo,guidePath)
		for( var i in guidePath){
			if(lo.indexOf(guidePath[i].path) > -1){
				console.log(guidePath[i].path)
				guidePath[i].isNew = false;
				switch (guidePath[i].path){
					case '/websitetrade/sellwebsite':
					$('.wzjy').find('dd').find('img').remove();
					$('.guide_wzjy').hide();
					break;
					case '/goods/friendgoods':
					$('.csyl').find('dt').find('img').remove();
					$('.guide_csyl').hide();
					break;
					case '/order/indexsell':
					$('.ddgl').find('dd').find('img').remove();
					$('.guide_ddgl').hide();
					break;
					case '/':
					$('.zhgs').find('dt').find('img').remove();
					$('.guide_zhgs').hide();
					break;
			}
			}
		}
		
		

		$.cookie('newGuide',JSON.stringify(guidePath), { path: '/',expires: 1000});
	})


    if (!$.cookie('newGuide')) {
			$('.ddgl').find('dd').eq(1).append(guideimg);
			$('.wzjy').find('dd').eq(0).append(guideimg);
			$('.csyl').find('dt').append(guideimg);
			$('.zhgs').find('dt').append(guideimg);	
			$('.show_guide').show()
				$.cookie('newGuide',JSON.stringify(guidePath), {path: '/' , expires: 10000});
    }else{
				var guides = JSON.parse($.cookie('newGuide'))
				var location = window.location.href;
			for(var i in guides){
				
				if(	guides[i].isNew ){
					  switch (guides[i].path){
								case '/websitetrade/sellwebsite':
								$('.wzjy').find('dd').eq(0).append(guideimg);
								$('.guide_wzjy').show();
								break;
								case '/goods/friendgoods':
								$('.csyl').find('dt').append(guideimg);
								$('.guide_csyl').show();
								break;
								case '/order/indexsell':
								$('.ddgl').find('dd').eq(1).append(guideimg);
								$('.guide_ddgl').show();
								break;
								case '/account/index':
								$('.zhgs').find('dt').append(guideimg);
								$('.guide_zhgs').show();
								break;
						}
				}else{
					switch (guides[i].path){
						case '/websitetrade/sellwebsite':
						$('.wzjy').find('dd').find('img').remove();
						 $('.guide_wzjy').hide();
						break;
						case '/goods/friendgoods':
						$('.csyl').find('dt').find('img').remove();
						$('.guide_csyl').hide();
						break;
						case '/order/indexsell':
						$('.ddgl').find('dd').find('img').remove();
						$('.guide_ddgl').hide();
						break;
						case '/account/index':
						$('.zhgs').find('dt').find('img').remove();
						$('.guide_zhgs').hide();
						break;
				}
				}

				
				} 
		

		}

 	//	3.2.1版本流量引导
	var guide = document.cookie.match(/guide=\d/g);
	if (!guide) {
		$('.traffic_guide_new').show()
	}
	$(document).on('click','.member-nav dl.lljh dt a',function(){
		console.log(guide)
		$('.traffic_guide_new').hide()
		if (!guide) {
			$('.one_step').show();
			//$('.traffic_guide_new').show()
		}
	})
	$(document).on('click','.one_step',function(event){
		var guide = document.cookie.match(/guide=\d/g);
        if (!guide) {
            $('.one_step').show()
            var expires = new Date();
            expires.setTime(expires.getTime() + 240 * 60 * 60000)
            document.cookie = 'guide=1;expires=' + expires.toGMTString()+";path=/";
        }
		$('.one_step').hide()
		$('.traffic_guide_new').hide()	
		 event.stopPropagation();
			
	})
//	3.2.1版本流量引导
	
})

function change(){
    var newmsg=$("#inmsg").val();
    $("#inmsg").before("<span id='msg' class='modalsp3'>"+newmsg+"</span>");
    $("#inmsg").remove();
}
// 小型模态框  modal_alert
// modal_alert(111);
function modal_alert(str){
	if(str){
		$('.modal-tips').find('.text-info').html(str);
		$('.modal-tips').find('.return-btn').addClass('hidden');
		$('.modal-tips').modal('show');

		$('.modal-tips').on('hidden.bs.modal', function(){
			$('.modal-tips').find('.text-info').html('没有提示内容...');
			$('.modal-tips').find('.return-btn').removeClass('hidden');
		})
	}
}
function modal_msg(str){
	if(str){
		$('.modal-msg').find('.text-info').html(str);
		$('.modal-msg').modal('show');
	}
}

function test_confirm(str, fnY, fnN, btns){
	$(document).off('click', '.modal-tips .save-btn',function(){});
	if(str){
		$('.modal-tips').find('.text-info').html(str);
		$('.modal-tips').modal('show');
		$(document).on('click', '.modal-tips .return-btn', function(){
			if(typeof fnN == 'function'){
				fnN();
			}
		})

		$(document).on('click', '.modal-tips .save-btn', function(){
			if(typeof fnY == 'function'){
				fnY();
			}
		})
		if(btns){
			btns.yes == 'hide' ? $('.modal-tips .save-btn').hide() : $('.modal-tips .save-btn').text(btns.yes);
			btns.no == 'hide' ? $('.modal-tips .return-btn').hide() : $('.modal-tips .return-btn').text(btns.no);
		}
	}

}
// 小型模态框  confirm
// modal_confirm(111,function(){console.log('yes11')}, function(){console.log('no')});
function modal_confirm(str, fnY, fnN, btns){
	$(document).off('click', '.modal-tips .save-btn',function(){});
	if(str){
		$('.modal-tips').find('.text-info').html(str);
		$('.modal-tips').modal('show');
		$(document).on('click', '.modal-tips .return-btn', function(){
			if(typeof fnN == 'function'){
				fnN();
			}
		})
		
		$(document).on('click', '.modal-tips .save-btn', function(){
			if(typeof fnY == 'function'){
				fnY();
			}
		})
		if(btns){
			btns.yes == 'hide' ? $('.modal-tips .save-btn').hide() : $('.modal-tips .save-btn').text(btns.yes);
			btns.no == 'hide' ? $('.modal-tips .return-btn').hide() : $('.modal-tips .return-btn').text(btns.no);
		}
		
		$('.modal-tips').on('hidden.bs.modal', function(){
			$('.modal-tips').find('.text-info').html('没有提示内容...');
			$('.modal-tips .save-btn').show().text('确定')
			$('.modal-tips .return-btn').show().text('返回')
			setTimeout(function(){
				$(document).off('click', '.modal-tips .return-btn');
				$(document).off('click', '.modal-tips .save-btn');
			},500)
		})
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


// // 实现定位功能 定位到目标元素旁边
// // $target是目标元素  $position是需要定位的元素，放到body层  
// // place是设置位置，如果不设置就按照右下左上的顺序判断能否定位
// function runPosition($target, $position, place) {
//     var offset = $target.offset();
//     var top = offset.top;
//     var left = offset.left;
//     var targetWidth = $target.outerWidth();
//     var targetHeight = $target.outerHeight();
//     var documentWidth = $(document).width();
//     var documentHeight = $(document).height();
//     var bottom = documentHeight - top - targetHeight;
//     var right = documentWidth - left - targetWidth;

//     var positionWidth = $position.outerWidth();
//     var positionHeight = $position.outerHeight();
//     var deltaTop = top + targetHeight / 2 - positionHeight / 2;
//     var deltaBottom = bottom + targetHeight / 2 - positionHeight / 2;
//     var deltaLeft = left + targetWidth / 2 - positionWidth / 2;
//     var deltaRight = right + targetWidth / 2 - positionWidth / 2;

//     if (!place && (right > positionWidth + 10) && (documentHeight > positionHeight + 10)) {               // 右边
//         $position.css({
//             left: left + targetWidth + 5 + 'px',
//             top: top + targetHeight / 2 - positionHeight / 2 + 'px'
//         })

//         if (deltaTop < 5) {
//             $position.css('top', 5 + 'px')
//         } else
//         if (deltaBottom < 5) {
//             $position.css('top', documentHeight - positionHeight - 5 + 'px')
//         }
//     } else
//     if (!place && (bottom > positionHeight + 10) && (documentWidth > positionWidth + 10)) {             // 下面
//         $position.css({
//             left: left + targetWidth / 2 - positionWidth / 2 + 'px',
//             top: top + targetHeight + 5 + 'px'
//         })

//         if (deltaLeft < 5) {
//             $position.css('left', 5 + 'px')
//         } else
//         if (deltaRight < 5) {
//             $position.css('left', documentWidth - positionWidth - 5 + 'px')
//         }
//     } else
//     if (!place && (left > positionWidth + 10) && (documentHeight > positionHeight + 10)) {                // 左边
//         $position.css({
//             left: left - positionWidth - 5 + 'px',
//             top: top + targetHeight / 2 - positionHeight / 2 + 'px'
//         })

//         if (deltaTop < 5) {
//             $position.css('top', 5 + 'px')
//         } else
//         if (deltaBottom < 5) {
//             $position.css('top', documentHeight - positionHeight - 5 + 'px')
//         }
//     } else
//     if (!place && (top > positionHeight + 10) && (documentWidth > positionWidth + 10)) {                 // 上面
//         $position.css({
//             left: left + targetWidth / 2 - positionWidth / 2 + 'px',
//             top: top - positionHeight - 5 + 'px'
//         })

//         if (deltaLeft < 5) {
//             $position.css('left', 5 + 'px')
//         } else
//         if (deltaRight < 5) {
//             $position.css('left', documentWidth - positionWidth - 5 + 'px')
//         }
//     }

//     if (place == 'right') {               // 右边
//         $position.css({
//             left: left + targetWidth + 5 + 'px',
//             top: top + targetHeight / 2 - positionHeight / 2 + 'px'
//         })

//         if (deltaTop < 5) {
//             $position.css('top', 5 + 'px')
//         } else
//         if (deltaBottom < 5) {
//             $position.css('top', documentHeight - positionHeight - 5 + 'px')
//         }
//     }
//     if (place == 'bottom') {             // 下面
//         $position.css({
//             left: left + targetWidth / 2 - positionWidth / 2 + 'px',
//             top: top + targetHeight + 5 + 'px'
//         })

//         if (deltaLeft < 5) {
//             $position.css('left', 5 + 'px')
//         } else
//         if (deltaRight < 5) {
//             $position.css('left', documentWidth - positionWidth - 5 + 'px')
//         }
//     }
//     if (place == 'left') {                // 左边
//         $position.css({
//             left: left - positionWidth - 5 + 'px',
//             top: top + targetHeight / 2 - positionHeight / 2 + 'px'
//         })

//         if (deltaTop < 5) {
//             $position.css('top', 5 + 'px')
//         } else
//         if (deltaBottom < 5) {
//             $position.css('top', documentHeight - positionHeight - 5 + 'px')
//         }
//     }
//     if (place == 'top') {                 // 上面
//         $position.css({
//             left: left + targetWidth / 2 - positionWidth / 2 + 'px',
//             top: top - positionHeight - 5 + 'px'
//         })

//         if (deltaLeft < 5) {
//             $position.css('left', 5 + 'px')
//         } else
//         if (deltaRight < 5) {
//             $position.css('left', documentWidth - positionWidth - 5 + 'px')
//         }
//     }

// }



// function setcopy(btn, con) {

//     var clip = new ZeroClipboard.Client();
//     clip.setHandCursor(true);
//     clip.setText(con);
//     clip.glue(btn);

//     clip.addEventListener("complete", function () {
//         alert("复制成功！");
//     });


//     $(document).on('click', function () {
//         clip.reposition();
//         $(window).scrollTop(0)
//     })

//})
function LimitNumber(txt,idName) {
        var str = txt;
        str = str.substr(0,100) + '...' ;
        var id=document.getElementById(idName);
        id.innerText=str;
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