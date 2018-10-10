app.controller('MainController',function($scope,$http,common,$rootScope) {
	$rootScope.common = common;
	$rootScope.common.getCart();

	$scope.cate = api_cate;
  	$scope.res = api_res;
  	$scope.page = api_page;
  	$scope.apiParam = {
  		px: $scope.page.px,
  		pz: $scope.page.pz
  	};
  	$scope.apiParam.order = "id";
  	$scope.itemLoad = false;
  	$scope.exchangeData = {};
	$scope.exchangeLimit = {};
	$scope.exchangeRes = {};
	$scope.exchangeResLen = 1;
	$scope.exchangeShow = false;
	$scope.exchangeMessage = '正在加载...';
	$scope.exchangeLoading = true;
	$scope.exchangeGid = '';                 // 要交换的商品
	$scope.exchangeNo = false;               // 不能交换，已经交换过
	$scope.exchangeSeller = {};              // 对方的信息，比如qq

	$scope.exchangeTabShow = true;
	$scope.exchangeOkShow = false;
	$scope.exchangeFailShow = false;

  	$scope.resAll = { checked: false };      // 选择全部商品
	$scope.cateIsOpen = false;
	$scope.cateAll = { active: true }        // 不限分类
	$scope.bdweight = {
		any: { active: true, value: '' },
		w0: { active: false, value: '0' },
		w1: { active: false, value: '1' },
		w2: { active: false, value: '2' },
		w3: { active: false, value: '3' },
		w4: { active: false, value: '4' },
		w5: { active: false, value: '5' },
		w6: { active: false, value: '6' },
		w7: { active: false, value: '7' },
		w8: { active: false, value: '8' },
		w9: { active: false, value: '9' },
		w10: { active: false, value: '10' }
	}
	$scope.googleweight = {
		any: { active: true, value: '' },
		w0: { active: false, value: '0' },
		w1: { active: false, value: '1' },
		w2: { active: false, value: '2' },
		w3: { active: false, value: '3' },
		w4: { active: false, value: '4' },
		w5: { active: false, value: '5' },
		w6: { active: false, value: '6' },
		w7: { active: false, value: '7' },
		w8: { active: false, value: '8' },
		w9: { active: false, value: '9' },
		w10: { active: false, value: '10' }
	}
	$scope.bdincluded = {
		any: { active: true, value: '' },
		w0: { active: false, value: '0_10000' },
		w1: { active: false, value: '10000_50000' },
		w2: { active: false, value: '50000_100000' },
		w3: { active: false, value: '100000_500000' },
		w4: { active: false, value: '500000_1000000' },
		w5: { active: false, value: '1000000_5000000' },
		input: { active: false, min: '', max: '', invalid: false }
	}
	$scope.rip = {
		any: { active: true, value: '' },
		w0: { active: false, value: '0-100'},
		w1: { active: false, value: '100-500'},
		w2: { active: false, value: '500-1000'},
		w3: { active: false, value: '1000-3000'},
		w4: { active: false, value: '3000-5000'},
		w5: { active: false, value: '5000-10000'},
		w6: { active: false, value: '大于1万' },
	}
	$scope.price = {
		any: { active: true, value: '' },
		w0: { active: false, value: '_1000' },
		w1: { active: false, value: '1000_5000' },
		w2: { active: false, value: '5000_10000' },
		w3: { active: false, value: '10000_30000' },
		w4: { active: false, value: '30000_50000' },
		w5: { active: false, value: '50000_100000' },
		w6: { active: false, value: '100000_' },
		input: { active: false, min: '', max: '', invalid: false }
	}
	$scope.websr = {
		any: { active: true, value: '' },
		w0: { active: false, value: '0-1000'},
		w1: { active: false, value: '1000-5000'},
		w2: { active: false, value: '5000-1万' },
		w3: { active: false, value: '一万以上' },
	}
	
	$scope.order = {
		any: { active: true, asc: false },
		bdweight: { active: false, asc: false },
		googleweight: { active: false, asc: false },
		rip: { active: false, asc: false },
		price: { active: false, asc: false },
	}
	$scope.search = '';       // 搜索网站名称和域名

	// 获取搜索条件
	$scope.resetApiParam = function(){
		$scope.apiParam = {};
		$scope.apiParam.px = $scope.page.px;
		$scope.apiParam.pz = $scope.page.pz;

		if(!$scope.cateAll.active){
			$scope.apiParam.cid1 = $scope.getCate();  
		}

		if(!$scope.bdweight.any.active){
			var bdweight = '';
			for(var i in $scope.bdweight){
				if($scope.bdweight[i]['active']){
					bdweight += $scope.bdweight[i]['value']+','
				}
			}
			$scope.apiParam['bdweight'] = bdweight.slice(0, -1);
		}

		if(!$scope.googleweight.any.active){
			var googleweight = '';
			for(var i in $scope.googleweight){
				if($scope.googleweight[i]['active']){
					googleweight += $scope.googleweight[i]['value']+','
				}
			}
			$scope.apiParam['googleweight'] = googleweight.slice(0, -1);
		}

		if(!$scope.rip.any.active){
			var rip = '';
			for(var i in $scope.rip){
				if($scope.rip[i]['active']){
					rip += $scope.rip[i]['value']+','
				}
			}
			$scope.apiParam['rip'] = rip.slice(0, -1);
		}
	    if(!$scope.websr.any.active){
			var websr = '';
			for(var i in $scope.websr){
				if($scope.websr[i]['active']){
					websr += $scope.websr[i]['value']+','
				}
			}
			$scope.apiParam['imcome'] = websr.slice(0, -1);
		}
		$scope.rangeApiParam('bdincluded');
	    $scope.rangeApiParam('price');

		if(!$scope['order']['any']['active']){
			for(var i in $scope['order']){
				if($scope['order'][i]['active']){
					$scope.apiParam['order'] = i;
					$scope.apiParam['asc'] = $scope['order'][i]['asc'] ? 'asc':'desc';
				}
			}
		}

		if($scope.search) $scope.apiParam['search'] = $scope.search;

	}
	$scope.rangeApiParam = function(target){
		if(!$scope[target]['any']['active']){
			for(var i in $scope[target]){
				if($scope[target][i]['active']){
					if(i == 'input'){
						var unit = 1;
						if(target == 'bdincluded' || target == 'trans') unit = 10000; 
						$scope.apiParam['min'+target] = $scope[target][i]['min'] * unit;
						$scope.apiParam['max'+target] = $scope[target][i]['max'] * unit;
					} else {
						var arr = $scope[target][i]['value'].split('_');
						$scope.apiParam['min'+target] = arr[0];
						$scope.apiParam['max'+target] = arr[1];
					}
				}
			}
		}
	}
	$scope.singleApiParam = function(target){
		if(!$scope[target]['any']['active']){
			for(var i in $scope[target]){
				if($scope[target][i]['active']) $scope.apiParam[target] = $scope[target][i]['value']
			}
		}
	}

	// 单选、多选、排序点击、切换状态
	$scope.singleSelect = function(target, item){
		if(!target || !item) return false;
		if(item == 'input') return false;
		for(var i in $scope[target]){
			$scope[target][i]['active'] = false;
			$scope[target][i]['min'] = '';
			$scope[target][i]['max'] = '';
		}
		$scope[target][item]['active'] = true;

		$scope.searchGoods();
	}
	$scope.moreSelect = function(target, item){
		if(!target || !item) return false;
		if(item == 'any'){
			if($scope[target][item]['active']) return false;
			
			for(var i in $scope[target]){
				$scope[target][i]['active'] = false;
			}
			$scope[target][item]['active'] = !$scope[target][item]['active'];
		} else {
			$scope[target][item]['active'] = !$scope[target][item]['active'];
			var anyActive = true;
			for(var i in $scope[target]){
				if(i != 'any' && $scope[target][i]['active']){
					anyActive = false;
				}
			}

			$scope[target]['any']['active'] = anyActive;
		}

		$scope.searchGoods();
	}
	$scope.clickOrder = function(target, item){
		
		if(!target || !item) return false;
		if($scope[target][item]['active']){
			$scope[target][item]['asc'] = !$scope[target][item]['asc'];
		} else {
			for(var i in $scope[target]){
				$scope[target][i]['active'] = false; 
			}
			$scope[target][item]['active'] = true; 
		}

		$scope.searchGoods();
	
	}
	
	// 选择分类、获取选择的分类
	$scope.clickCate = function(index){
		if(index == 'all' && !$scope.cateAll.active){
			$scope.cateAll.active = true;
			for (var i = 0; i < $scope.cate.length; i++) {
				$scope.cate[i]['active'] = false;
			};
			$scope.searchGoods();
			return true;
		}
		if(index == 'all' && $scope.cateAll.active){
			return false;
		}

		$scope.cate[index]['active'] = !$scope.cate[index]['active'];

		var cateAll = true;
		for (var j = 0; j < $scope.cate.length; j++) {
			if($scope.cate[j]['active']){
				cateAll = false;
			}
		};
		$scope.cateAll['active'] = cateAll;

		$scope.searchGoods();
	}
	$scope.getCate = function(){
		var cid1 = '';
		for (var i = 0; i < $scope.cate.length; i++) {
			if($scope.cate[i]['active']){
				cid1 += $scope.cate[i]['cid1']+',';
			}
		};
		return cid1.slice(0, -1);
	}

	
	// 加载商品
	$scope.setItem = function(){
		for (var i = 0; i < $scope.res.length; i++) {
			$scope.res[i]['loading'] = false;
		};
	}
	$scope.setItem();
	$scope.loadItem = function(gid, loading){
		for (var i = 0; i < $scope.res.length; i++) {
			if($scope.res[i]['gid'] == gid){
				$scope.res[i]['loading'] = loading;
			}
		};
	}
	$scope.getItem = function(gid){
		for (var i = 0; i < $scope.res.length; i++) {
			if($scope.res[i]['gid'] == gid){
				return $scope.res[i];
			}
		};
	}
	// 购买 
	$scope.buy_index = []
	for(var i = 0;i < $scope.res.length; i++){
		$scope.buy_index[i]	 = true
	}
	$scope.buyGoods = function(gid,index){
		if(!$scope.buy_index[index]) return false
		$scope.buy_index[index] = false
		var gids = '';
		if(!gid){
				modal_alert('没有选择要购买的商品哦~');
				return false;
			}else{
				gids=gid
			}
		var url = '/index/cart/buy';
		$http.post(url, {gids: gids}).then(function(res){
			$scope.buy_index[index] = true
			if(res.data.statusCode == 200){
				common.flyImg('/images/demo/cart_font.png', '.fly'+gid, '.menu-right .icon-shop', {
					obj1x: 2, obj1y:6, obj2x: 2, obj2y: 3, time: 1000
				}, function(){
					common.itemNum += 1;
					common.getCart();
				});
			} else if(res.data.statusCode == 505) {
				modal_confirm('登录后才能购买，<br/>请先登录', function(){
					window.location.href = memberUrl('/user/login')+'?back_href='+window.location.href;
				}, function(){}, {yes:'去登录', no:'hide'});
			} else {
				modal_alert(res.data.message);
			}
		}, function(res){
			modal_alert('系统出错，请联系客服。');
		});
	}
	var cook = $.cookie('token');
	// 创建分页
	$scope.createPage = function(){
		$('.item_page').createPage({
			pageCount : $scope.page.num_page,
			current : $scope.page.px,
			total : $scope.page.num_rows,
			showTotal : true,
			showInput : true,
			backFn : function(index){
				$scope.$apply(function(){
					if(index > 3){
						if (cook == null) {
							$('.modal_tips_no').hide();
					        modal_confirm('您还没有登录，登录才能查看更多商品！',function(){
								window.location.href = '/member/user/login.htm';
							}, function(){
					              
					        }, {yes: '去登录'});
					    }else{
					    	$scope.page.px = index;
							$scope.getGoods();
					    }
						$scope.createPage()
					}else{
						$scope.page.px = index;
						$scope.getGoods();
					}
				})
			}
		})
	}
	$scope.createPage();
	var cook = $.cookie('token');
	// 小分页
	$scope.getPage = function(mark){
		if(mark == 'prev' && $scope.page.px > 1){
			$scope.page.px -= 1;
			$scope.getGoods();	
		} 
		if(mark == 'next' && $scope.page.px < $scope.page.num_page){
			if($scope.page.px >= 3){
				if (cook == null) {
					$('.modal_tips_no').hide();
			        modal_confirm('您还没有登录，登录才能查看更多商品！',function(){
						window.location.href = '/member/user/login.htm';
					}, function(){
			              
			        }, {yes: '去登录'});
			    }else{
			    	$scope.page.px += 1;
					$scope.getGoods();
			    }
			}else{
				$scope.page.px += 1;
				$scope.getGoods();
			}
		} 
	}
	
	// 获取商品
	$scope.getGoods = function(){
		$scope.itemLoad = true;
		$scope.resetApiParam();
		var url = '/web_exchange';
		$http.post(url, $scope.apiParam).then(function(res){
			if(res.data.statusCode == 200){
				$scope.res = res.data.res;
				$scope.resAll.checked = false;
				$scope.page = res.data.page;
				$scope.createPage();
				$scope.itemLoad = false;
			} else {
				modal_alert(res.data.message);
			}
		}, function(res){
			httpError('系统出错，请联系客服。');
		});
	}
	$scope.searchGoods = function(){
		$scope.page.px = 1;
		$scope.getGoods();
	}
	/*$scope.getGoods();*/
	
	
//	weburl
	var  toolweburl = getParameter('weburl');
	if(toolweburl){
		$scope.search = toolweburl;
		$scope.searchGoods();
	}
	//求购弹窗
 $scope.open_modal = function(){
        $(".modal-qiugou").modal('show')
    }

$scope.bdqz=["不限",0,1,2,3,4,5,6,7,8,9];
$scope.qgrip=["不限",100,500,1000,3000,5000,'一万'];
 $scope.changebd = function (v) {
       $scope.ad.bdqz=v;  
    }

 $scope.changepr = function (v) {
       $scope.ad.pr=v;  
    }
$scope.changerip = function (v) {
       $scope.ad.rip=v;  
    }


$scope.ad={}
 $scope.adddemand=function(){
 	$scope.ad.cate=$("#cateName").attr("cid").slice(0, -1);
 	  if ($scope.ad.price == undefined || $scope.ad.price== '' ) {
		        $scope.ad.price="无需求"
			 }
			 if($('input[type="radio"][name = "price"]:checked').attr('mark') == 0 ){
				$scope.ad.price = ''
			}
        if ($scope.ad.bdqz == undefined || $scope.ad.bdqz ==='') {
                modal_alert("请选择百度权重")
                return
            }else if ($scope.ad.pr == undefined || $scope.ad.pr === '') {
                modal_alert("请选择PR值")
                return
            }else if ($scope.ad.rip == undefined || $scope.ad.rip ==='') {
                modal_alert("请选择日IP数")
                return
            }else if ($scope.ad.name == undefined || $scope.ad.name === '') {
                modal_alert("请输入您的称呼")
                return
            }else if ($scope.ad.connect == undefined || $scope.ad.connect === '') {
                modal_alert("请输入您的联系方式")
                return
            }else{
            	$('.tj_btn').attr('disabled',true).css('cursor','not-allowed')
	       	$http.post('/index/goods/addDemand', $scope.ad).then(function(res){
				if(res.data.statusCode == 200){
					$('.modal-qiugou').modal('hide')
					modal_alert(res.data.message);
				}
				 else {
					modal_alert(res.data.message);
				}
				 $('.tj_btn').attr('disabled',false).css('cursor','pointer')
			}, function(res){
				httpError('系统出错，请联系客服。');
			})
	       }
 }
 $scope.tobargain={}
 $scope.yijiaGoods=function(gid){
         if(cook == null){
		    	modal_confirm('您还没有登录，登录才能议价！',function(){
					window.location.href = '/member/user/login.htm';
				}, function(){
			          
			    }, {yes: '去登录',no:'hide'});
		    }
        var url ='/index/cart/bargainMsg';
        $scope.tobargain.gid=gid
		$http.post(url,{gid:gid}).then(function(res){
                if(res.data.statusCode == 200){
                	  $scope.bargainMsg=res.data.data
					 $('.modal-bargaining').modal('show')
				}else {
					modal_alert(res.data.message);
				}

		}, function(res){
			httpError('系统出错，请联系客服。');
		})
        
 }
 $scope.tobargaining=function(){
 	if(!$scope.tobargain.how){
 		modal_alert('请输入砍价金额')
 		return false;
 	}
  var url ='/index/goods/toBargainMsg';
   $http.post(url,$scope.tobargain).then(function(res){
   			$('.modal-bargaining').modal('hide')
                if(res.data.statusCode == 200){
					 $('.modal_submit_succedd').modal('show')
				}
			    else if(res.data.statusCode == 555){
					 $('.modal_againyijia').modal('show')
				}else {
					modal_alert(res.data.message);
				}
		}, function(res){
			httpError('系统出错，请联系客服。');
		})
   $scope.tobargain.how=""
 }

});

// 检查输入框整数和小数，赋值
app.directive('checkInput', function() {
  return {
    link: function(scope, element, attrs) {
      var target = attrs.checkTarget;
      var name = attrs.checkName;
      var type = attrs.checkType;
      element.on('keyup', function(){
        var val = element.val();  
        var val2 = '';
        var invalid = false;

        if( type=='int' && isNaN(parseInt(val)) ){
          if(val.length>0) invalid = true;
        }
        if( type=='int' && !isNaN(parseInt(val)) ){
          val2 = parseInt(val);
        }
        if( type=='float' && isNaN(parseFloat(val)) ){
          if(val.length>0) invalid = true;
        }
        if( type=='float' && !isNaN(parseFloat(val)) ){
          if(val.substr(-1, 1) == '.' && val.substr(-2, 1) != '.'){
            val2 = val;
          } else {
            val2 = parseFloat(val); 
          }
        }
        
        scope.$apply(function(){
          scope[target]['input'][name] = val2;
          scope[target]['input']['invalid'] = invalid;

          var min = scope[target]['input']['min']+'';
          var max = scope[target]['input']['max']+'';
          if(min.length>0 || max.length>0){
            for(var i in scope[target]){
              scope[target][i]['active'] = false;
            }
            scope[target]['input']['active'] = true;

          } else {
            for(var i in scope[target]){
              scope[target][i]['active'] = false;
            }
            scope[target]['any']['active'] = true;
          }
        })
      })

    element.on('blur', function(){
      var val = element.val();  
      var val2 = '';
      var invalid = false;

      if( type=='float' && !isNaN(parseFloat(val)) ){
        val2 = parseFloat(val); 

        scope.$apply(function(){
	        scope[target]['input'][name] = val2;
	        scope[target]['input']['invalid'] = invalid;
	    })
      }

      scope.searchGoods();
    })
    }
  };
});

// enter键搜索
app.directive('enterSearch', function() {
  return {
    link: function(scope, element, attrs) {
      element.on('keyup', function(e){
        if(e.keyCode == 13){
        	scope.searchGoods();
        }
      });
    }
  };
});

$(function(){
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
            if (cids && cids.split(',').length > 3) {
                modal_alert('最多选择3个分类')
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

})



