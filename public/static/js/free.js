app.controller('MainController',function($scope,$http,common,$rootScope,complete_info) {
	$rootScope.common = common;
	$rootScope.common.getCart();  // 1友链  2图文
	$scope.complete_info = complete_info
	
	$scope.cate = api_cate;
  	$scope.res = api_res;
  	$scope.page = api_page;
  	$scope.apiParam = {
  		px: $scope.page.px,
  		pz: $scope.page.pz
  	};
  	$scope.apiParam.order = "bdweight";
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
	$scope.isComplete = true
  	$scope.resAll = { checked: false };      // 选择全部商品
	$scope.cateIsOpen = false;
	$scope.cateAll = { active: true }
	        // 不限分类
	$http.post("/member/goods/checkData").success(function(data){
		if (data.statusCode == 200) {
			if (data.data.qq == "" || data.data.phone == ""){
				$scope.isComplete = false
			}else{
				$scope.isComplete = true
			}
		}
	})
	$scope.fast_list = []
	$scope.fast_str = '请选择您要匹配的网站';
	$scope.get_list = function(){
		if($scope.fast_list.length > 0)return false
		$http.get('/index/cart/quick_choose').success(function(data){
			if(data.statusCode == 200){
				$scope.fast_list = data.data
			}else if(data.statusCode == 505){
				modal_confirm('您还未登录，请登录',function(){
					window.location.href = '/'
				})
			}else{
				modal_alert('系统出错，请联系客服！')
			}
		})
	}
	
	// $scope.quick_search = function(item){
	// 	$scope.fast_str = item.name
	// 	$scope.gid = item.gid
	// 	$scope.searchGoods();
	// }

	// $scope.reset_quick_search = function(){
	// 	if(!$scope.gid)return false;
	// 	$scope.gid = '';
	// 	$scope.fast_str = '请选择您要匹配的网站';
	// 	$scope.searchGoods();
	// }
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
	$scope.trans = {
		any: { active: true, value: '' },
		w0: { active: false, value: '0_10000' },
		w1: { active: false, value: '10000_50000' },
		w2: { active: false, value: '50000_100000' },
		w3: { active: false, value: '100000_500000' },
		w4: { active: false, value: '500000_1000000' },
		w5: { active: false, value: '1000000_5000000' },
		input: { active: false, min: '', max: '', invalid: false }
	}
	$scope.age = {
		any: { active: true, value: '' },
		w0: { active: false, value: '_1' },
		w1: { active: false, value: '1_2' },
		w2: { active: false, value: '2_5' },
		w3: { active: false, value: '5_10' },
		w4: { active: false, value: '10_' },
		input: { active: false, min: '', max: '', invalid: false }
	}
	$scope.sense = {
		any: { active: true, value: '' },
		w0: { active: false, value: '1' },
		w1: { active: false, value: '2' },
	}
	$scope.autochain = {
		any: { active: true, value: '' },
		w0: { active: false, value: '1' },
		w1: { active: false, value: '2' },
	}
	$scope.utime = {
		any: { active: true, value: '' },
		w0: { active: false, value: '1' },
		w1: { active: false, value: '3' },
		w2: { active: false, value: '7' },
		w3: { active: false, value: '15' },
		w4: { active: false, value: '30' },
	}
	$scope.show_style = {
		any: { active: true, value: '' },
		w0: { active: false, value: '1' },
		w1: { active: false, value: '2' },
		w2: { active: false, value: '3' },	
	}
	$scope.validate = {
		any: { active: true, value: '' },
		w0: { active: false, value: '1' },
		w1: { active: false, value: '2' },
	}
	$scope.order = {
		any: { active: true, asc: false },
		bdweight: { active: false, asc: false },
		bdincluded: { active: false, asc: false },
		bdtrans: { active: false, asc: false },
		price: { active: false, asc: false },
		sales: { active: false, asc: false }
	}
	$scope.myweb = false;     // 我的网站 true 传1；否则不传
	$scope.search = '';       // 搜索网站名称和域名

	// 获取搜索条件
	$scope.resetApiParam = function(){
		$scope.apiParam = {};
		$scope.apiParam.px = $scope.page.px;
		$scope.apiParam.pz = $scope.page.pz;
		if($scope.gid){
			$scope.apiParam.freegid = $scope.gid
		}
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

		$scope.rangeApiParam('bdincluded');
		$scope.rangeApiParam('trans');
		$scope.rangeApiParam('age');
		$scope.singleApiParam('show_style');
		$scope.singleApiParam('utime');
		$scope.singleApiParam('validate');
		$scope.singleApiParam('sense');

		if(!$scope['autochain']['any']['active']){
			for(var i in $scope['autochain']){
				if($scope['autochain'][i]['active']) $scope.apiParam['autochain'] = $scope['autochain'][i]['value']
			}
		}

		if(!$scope['order']['any']['active']){
			for(var i in $scope['order']){
				if($scope['order'][i]['active']){
					$scope.apiParam['order'] = i;
					$scope.apiParam['asc'] = $scope['order'][i]['asc'] ? 'asc':'desc';
				}
			}
		}

		if($scope.myweb) $scope.apiParam['myweb'] = 1;
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
	 
	$scope.show_style_str = function(str){
		switch (str){
			case 1:
			return '直接显示';
			break;
			case 2:
			return '鼠标滑动显示';
			break;
			case 3:
			return '隐藏不显示';
			break;
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
	$scope.toggleMe = function(target){
		if(!target) return false;
		$scope[target] = !$scope[target];

		if(target == 'myweb') $scope.searchGoods();
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

	// 勾选商品
	$scope.checkItem = function(index){
		if(index == 'all'){
			$scope.resAll.checked = !$scope.resAll.checked;
			for (var i = 0; i < $scope.res.length; i++) {
				$scope.res[i]['checked'] = $scope.resAll.checked;
			};
			return true;
		}
		$scope.res[index]['checked'] = !$scope.res[index]['checked'];
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

	// 创建分页
	$scope.createPage = function(){
		$('.item_page').createPage({
			pageCount : $scope.page.num_page,
			current : $scope.page.px,
			total : $scope.page.num_rows,
			showTotal : true,
			showInput : true,
			backFn : function(index){
				gotoTop('.goto_header', '.header_togo');
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
		var url = '/friendchange';
		
		
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

	// 申请交换 
	$('#exchange_tab').on('hidden.bs.modal', function(){
		$scope.exchangeTabShow = true;
		$scope.exchangeFailShow = false;
		$scope.exchangeOkShow = false;
	})
	$scope.exchangeGoods = function(gid){
		$('#exchange_tab .modal-lg').removeAttr("style")
		if(!$scope.isComplete){
			if($scope.complete_info.isComplete_info){
				$scope.isComplete = true
			}
		}  	
		if($scope.isComplete){
			$scope.ggid = gid;
		var item = $scope.getItem(gid);
		if(item.loading) return false;
		$scope.loadItem(gid, true)
		$scope.exchangeData = {};
		$scope.exchangeLimit = {};
		$scope.exchangeRes = {};
		$scope.exchangeResLen = 1;
		$scope.exchangeShow = false;
		$scope.exchangeMessage = '正在加载...';
		$scope.exchangeLoading = true;

		if(!gid){
			modal_alert('没有选择要交换的网站。')
			return false;
		}
		
		var url = '/index/cart/myfree';
		$http.post(url, {gid: gid}).then(function(res){
			$scope.loadItem(gid, false)
			$scope.exchangeLoading = false;
			if(res.data.statusCode == 200){
				$scope.exchangeData = res.data.data;
				$scope.exchangeLimit = res.data.limit;
				$scope.exchangeRes = res.data.res;
				$scope.exchangeResLen = res.data.res.length;
				$scope.exchangeShow = true;
				$('#exchange_tab').modal('show')
			} else if(res.data.statusCode == 502){
				$scope.exchangeTabShow = false;
				$scope.exchangeFailShow = true;
				$('#exchange_tab').modal('show')
			} else if(res.data.statusCode == 501) {
				$scope.exchangeData = res.data.data;
				$scope.exchangeLimit = res.data.limit;
				$scope.exchangeRes = res.data.res;
				$scope.exchangeResLen = res.data.res.length;
				$scope.exchangeShow = true;
				$('#exchange_tab').modal('show')
			} else if(res.data.statusCode == 505) {
				modal_confirm('请先登录再申请交换', function(){
					window.location.href = memberUrl('/user/login')+'?back_href='+window.location.href;
				}, function(){}, {yes: '去登录', no: 'hide'})
			} else {
				//$scope.exchangeMessage = res.data.message;
				$scope.exchangeLoading = false;
				modal_alert(res.data.message);
			}
		}, function(res){
			$scope.loadItem(gid, false)
			$scope.exchangeMessage = '系统出错，请联系客服。';
			$scope.exchangeLoading = false;
			modal_alert('系统出错，请联系客服。');
		});
		}else{
			$scope.complete_info.check_user() //检测用户信息是否完善	
		}
		
	}
	// 进到免费换链
	$scope.go_freed= function(){
		$scope.complete_info.check_user('/member/freechange/addchange') //检测用户信息是否完善
	}
	$scope.selectExchange = function(wid){
		if(!wid) return false;
		$scope.exchangeGid = wid;
		$scope.exchangeNo = false;
	}
	$scope.exchangeGo = function(wid){
		$scope.exchangeGid = wid;
		$scope.exchangeNo = false;
		if(!$scope.exchangeGid) return false;
		var data = {
			gid: $scope.exchangeData.gid,
			widbuy: $scope.exchangeGid
		}
		var url = '/index/cart/addmforder';
		
		if($scope.exchangeData.autochain == 2){
			$('.modal_cue').modal('show');
		}
		$scope.exchangeGid = '';
		$http.post(url, data).then(function(res){
			$('.modal_cue').modal('hide')
			if(res.data.statusCode == 200){
				$scope.exchangeSeller = res.data.seller;
				$scope.exchangeTabShow = false;
				$('#exchange_tab .modal-lg').width(600);
				$scope.exchangeOkShow = true;
			} else if(res.data.statusCode == 501){
				$scope.exchangeNo = true;
				$scope.exchangeGid = '';
				modal_time('您选择的网站已向对方申请过换链，请选择其他的网站！', 4000)
			} else {
				if(res.data.message == '买家未上链,申请交换失败'){
					modal_time('对方是自动上链的网站您还没有先给对方上链，请先上链后再申请!', 4000)
					

				}else{
					$scope.exchangeShow = false;
					$scope.exchangeLoading = false;
					$scope.exchangeMessage = res.data.message;
					modal_time(res.data.message, 4000)
				}
				
			}
		}, function(res){
			$scope.exchangeShow = false;
			$scope.exchangeLoading = false;
			$scope.exchangeMessage = '系统出错，请联系客服。';
		});
	}
	
	
//	weburl
	
	
	$scope.cha = function(){
		$('#exchange_tab .modal-lg').removeAttr("style")
	}
	
	var  toolweburl = getParameter('weburl');
	if(toolweburl){
		$scope.search = toolweburl;
		$scope.apiParam['search'] = $scope.search		
	}
	// $scope.getGoods();
	
	$scope.setRenderOk = function(){
		$('[data-toggle="tooltip"]').tooltip({   // 有宽高限制
			'html': true,
	        'trigger': 'hover'  // 默认hover
	      })
	}
	$scope.test = function(){
		$('.search-count').hover(function(){
		
		})
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
	

$(document).on('click', '.show_table', function(){
//	$('.show_table').find('.table').hide();  
	$(this).parents('tr').siblings().find('.table').hide();
	$(this).find('.table').toggle();
	var fenlei = $(this).find('.table tbody tr td').eq(1).find('span');
	var bdweights = $(this).find('.table tbody tr td').eq(2).find('span');
	var bdincludeds = $(this).find('.table tbody tr td').eq(3).find('span');
	
	var hid = $(this).attr('yid');
	
	var url = '/index/cart/myfree';
	$.ajax({
        url: "/index/cart/myfree",
        type: 'post',
        async: false,
        dataType: "json",
        data: {gid: hid},
        success: function (res) {
            if(res.statusCode == 200){
				fenlei.text(res.limit.cate1name)
				bdweights.text(res.limit.bdweight)
				bdincludeds.text(res.limit.bdincluded)

			}else if(res.statusCode == 501) {
				fenlei.text(res.limit.cate1name)
				bdweights.text(res.limit.bdweight)
				bdincludeds.text(res.limit.bdincluded)
			}
        },
        error: function (obj) {
           
        }
    });
	
	
})   


