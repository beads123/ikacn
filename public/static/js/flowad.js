app.controller('articleControl',function($scope,$http,common,public,$rootScope) {
    $rootScope.common = common;
    $rootScope.common.getCart();  // 1友链  2图文

    $scope.public = public
	$scope.active = 1;        //设置默认
	$scope.show = function(index){
		$scope.active = index;
	}



	$scope.ADtype = 1 //广告类型
//  $scope.ADfontSize = "1200*75"
//  $scope.ADfontType = 8
    $scope.ADpicSize = "300*250"
    $scope.ADpicType = 2

    $scope.changeType = function (type) {
        $scope.ADtype = type
    }

    $scope.fonSize = function (size, type) {
        $scope.ADfontSize = size
        $scope.ADfontType = type
    }

    $scope.picSize = function (size, type) {
        $scope.ADpicSize = size
        $scope.ADpicType = type

    }
	
	
	$scope.join = function () {

        $http.post("/member/Account/addwebsite").success(function (data) {
            if(data.message == '未登录'){
            	$('.join-adv').modal('show');
            }else{
            	window.open('/member/trafficexchange/index')
            }
        })
    }
	
	
	$scope.row = [2, 3, 4, 5, 6] //行
    $scope.col = [2, 3, 4, 5, 6,7] // 列

    $scope.changeSize = function (str, val) {
        $scope[str] = val;
        if ($scope.hang && $scope.lie) {
            $http.post('/index/index/getSizeAdtype', { hang: $scope.hang, lie: $scope.lie }).success(function (data) {
                if (data.statusCode == 200) {
                    $scope.ADfontSize = data.data[1]
                    $scope.ADfontType = data.data[0]
                } else {
                    modal_alert('数据错误，请联系客服')
                }

            })
        }
    }
	
	
	
// 失去焦点时检查用户输入
    $scope.isname = true
    $scope.isurl = true
    $scope.isadname = true
    $scope.tip_str = {
        name: '6-20个字符，一个汉字为两个字符',
        url: '请输入http或者https,如：https://www.2898.com',
        adname: '最多16个字符或者8个汉字'
    }
    $scope.tip_default = {
        name: '6-20个字符，一个汉字为两个字符',
        url: '请输入http或者https,如：https://www.2898.com',
        adname: '最多16个字符或者8个汉字'
    }
    $scope.tip_err = {
        name: "字符串长度为6-20个字符",
        url: '请输入http或者https',
        adname: '广告名称最多16个字符'
    }
    $scope.can_submit = true //表单是否可以提交

    $scope.check_str = function (str, val) {
        // $scope[str]  =

        switch (str) {

            case 'name':
                if (val) {
                    if (getLength(val) > 20 || getLength(val) < 6) {
                        $scope.tip_str[str] = $scope.tip_err[str]
                        $scope['is' + str] = false
                        $scope.can_submit = false
                    } else {
                        $scope.can_submit = true
                        $scope['is' + str] = true
                        $scope.tip_str[str] = $scope.tip_default[str]
                    }
                } else {
                    $scope['is' + str] = true
                }

                break;
            case 'url':
                if (val) {


                    if (val.indexOf('http') > -1) {
                        $scope.can_submit = true
                        $scope['is' + str] = true
                        $scope.tip_str[str] = $scope.tip_default[str]
                    } else {
                        $scope.tip_str[str] = $scope.tip_err[str]
                        $scope.can_submit = false
                        $scope['is' + str] = false
                    }
                } else {
                    $scope['is' + str] = true
                }
                break;
            case 'adname':
                if (val) {


                    if (getLength(val) > 16) {
                        $scope.tip_str[str] = $scope.tip_err[str]
                        $scope.can_submit = false
                        $scope['is' + str] = false
                    } else {
                        $scope.can_submit = true
                        $scope['is' + str] = true
                        $scope.tip_str[str] = $scope.tip_default[str]
                    }
                } else {
                    $scope['is' + str] = true
                }
        }


    }

	$scope.save = function(){
		var t1 = $('input[name = "traffic_sell"]').prop('checked')
        var t2 = $('input[name = "traffic_change"]').prop('checked')
        var ispay, pay_str
        if (t1) {
            ispay = 3
            pay_str = '流量出售'
        }
        if (t2) {
            ispay = 2;
            pay_str = '流量交换'
        }
        if (t1 && t2) {
            ispay = 1
            pay_str = '流量出售/交换'
        }
		if(!$scope.name){
			modal_alert('请填写网站名称');
			return false;
		}
		if(!$scope.url){
			modal_alert('请填写网站域名');
			return false;
		}
		var yz = preg.wurl.test($scope.url)
		if(yz == false){
			modal_alert('请输入正确的域名');
			return false;
		}
		if(!$scope.public.editPicOneCate){
			modal_alert('请选择行业分类');
			return false;
		}
		if (!$scope.adname) {
            modal_alert('请输入广告名称')
            return false
        }
		if($scope.ADtype == 1){
            if(!$scope.hang){
                modal_alert("请选择文字广告行数")
                return false
            }
            if(!$scope.lie){
                modal_alert("请选择文字广告列数")
                return false
            }
        }
		if (!t1 && !t2) {
            modal_alert('请选择是否参与付费广告的展示')
            return
        }
		if ($scope.public.editPicTwoCate) {
            var typeTwo = $scope.public.editPicweb.filter(function (item) {
                return item.name == $scope.public.editPicTwoCate
            });
            $scope.two_id = typeTwo[0].id
        }
		console.log(ispay)
        var webInfo = {
            name: $scope.name,
            url: $scope.url,
            cid: $scope.two_id,
            cate1:$scope.public.editPicOneCate,
            cate2:$scope.public.editPicTwoCate,
            twoArr:$scope.public.editPicweb,
            ispay: ispay,
            sensitive_advertising: $("input:radio[name = 'picWeb']:checked").val()
        }
        $scope.web_p = $("input:radio[name = 'web_place']:checked").val()
        if ($scope.web_p == 2) {
            if (!$scope.pageurl) {
                modal_alert('请输入广告页面地址');
                return false;
            }
            webInfo.web_places = $scope.pageurl
        } else {
            webInfo.web_places = ""
        }
        if ($scope.ADtype == 1) {
//	            webInfo.wid = $scope.wid;
                webInfo.size = $scope.ADfontSize;
                webInfo.ad_type = $scope.ADfontType;
                webInfo.type = $scope.ADtype
                webInfo.hang =  $scope.hang;
                webInfo.lie = $scope.lie;
                ispay: ispay;

        } else {
//				webInfo.wid = $scope.wid;
                webInfo.size = $scope.ADpicSize;
                webInfo.ad_type = $scope.ADpicType;
                webInfo.type = $scope.ADtype
                ispay: ispay;
        }
        webInfo.adname = $scope.adname
//      设置cookie
console.log(webInfo)
		var str = JSON.stringify(webInfo);     //转换为 JSON 字符串

        $.cookie('the_cookie', str, { expires: 7, path: '/member/trafficexchange/newadvert'});

//		var myCookie = $.cookie('the_cookie');
//      var newObject = JSON.parse(myCookie); //字符串转化成JSON数据
//		console.log(newObject)
//
//		console.log($.cookie('the_cookie'))
		
		$http.post("/member/Account/addwebsite", webInfo).success(function (data) {
          
            if (data.statusCode == 200) {
                $scope.wid = data.web_id  //新增网站ID

                if ($scope.ADtype == 1) {
                    var dataInfo = {
                        wid: $scope.wid,
                        size: $scope.ADfontSize,
                        ad_type: $scope.ADfontType,
                        type: $scope.ADtype
                    }
                } else {
                    var dataInfo = {
                        wid: $scope.wid,
                        size: $scope.ADpicSize,
                        ad_type: $scope.ADpicType,
                        type: $scope.ADtype
                    }
                }
                $http.post("/member/Trafficexchange/addFlowGoods", dataInfo).success(function (data) {
                  
                    if (data.statusCode == 200) {
                        window.location.href = memberUrl("/trafficexchange/verifycode") + "?gid=" + data.data
                    } else {
                        modal_alert(data.message)
                    }
                })

            } else {
                modal_alert(data.message)
                modal_confirm('请登录后再进行广告位添加',function(){
                	window.location.href = '/member/user/login?ref=' + '/member/trafficexchange/newadvert';
                })
            }

        })
		
		
	}

	
	var iframeSrc = '';
    var flowExchange = window.location.protocol.split(":")[0];
    var http = flowExchange === "https"?'https':'http';
    
	$scope.imgIframe = function(num){
		switch(num)
				{
				case 960:
				  	iframeSrc = http + "://www.2898.com/ad2898.htm?type=flowimg&gid=179&size=960*90&ad_type=横幅广告"
				  break;
				case 760:
				  	iframeSrc = http + "://www.2898.com/ad2898.htm?type=flowimg&gid=170&size=760*60&ad_type=横幅广告"
				  break;
				case 35:
				  	iframeSrc = http + "://www.2898.com/ad2898.htm?type=flowtext&gid=178&size=760*75&ad_type=5行*3列"	
				  break;
				case 640:
				  	iframeSrc = http + "://www.2898.com/ad2898.htm?type=flowimg&gid=398&size=640*60&ad_type=横幅广告"
				  break;
				case 250:
				  	iframeSrc = http + "://www.2898.com/ad2898.htm?type=flowimg&gid=175&size=250*250&ad_type=矩形广告"
				  break;
				case 300:
				  	iframeSrc = http + "://www.2898.com/ad2898.htm?type=flowimg&gid=382&size=300*250&ad_type=矩形广告"
				  break;
				case 36:
				  	iframeSrc = http + "://www.2898.com/ad2898.htm?type=flowtext&gid=393&size=960*75&ad_type=6行*3列"
				  break;
				case 23:
				  	iframeSrc = http + "://www.2898.com/ad2898.htm?type=flowtext&gid=396&size=468*50&ad_type=3行*2列"
				  break;
					
				}
	}

	$(document).on('click','.adv',function(){
 		$(this).find('.showimg').children('iframe').attr('src',iframeSrc)
 	})
	
	

});
	

	var supports = function(prop) {
		var div = document.createElement('div'), vendors = 'Khtml O Moz Webkit'.split(' '), len = vendors.length;
		if ( prop in div.style)
			return true;
		if ('-ms-' + prop in div.style)
			return true;
		prop = prop.replace(/^[a-z]/, function(val) {
			return val.toUpperCase();
		});
		while (len--) {
			if (vendors[len] + prop in div.style) {
				return true;
			}
		}
		return false;
	};
$(function(){
	if (supports("animation")) {
		$("body").addClass("animate1");
		
	}
 	$(document).on('click', '.pictype', function(){
		var index = $(this).index();
		$('.advert-box').hide();
		$('.advert-box').eq(index).show();
 	})
 	var adObj = {
        img_960_90:'http://exchange.2898.com/index/flowexchange/getGoods?id=179&sign=6ff1ed86ab67e4b5872dcbd35bad2282',
    }
 	
   	$(".adv").hover(function(){
	    $(this).find('.showimg').show();
	},function(){
	   $(this).find('.showimg').hide();
	});
	$('.showimg iframe').attr('src','')
	
	

})
