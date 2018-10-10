app.controller('MainController', function($scope, $http, common, $rootScope) {
	$rootScope.common = common;
	$rootScope.common.getCart(); // 1友链  2图文

	$scope.cate = api_cate;
	$scope.res = api_res;
	$scope.page = api_page;
	$scope.apiParam = {
		px: $scope.page.px,
		pz: $scope.page.pz
	};
	$scope.itemLoad = false;
	if($scope.res){
		$scope.res.map(function(item, index) {
			
			if(item.price == 0 && item.price_qz > 0) {
				item.qz = 1 //全站
			}else{
				item.qz = 2
			}
			return item
		})
	}
	

	$scope.resAll = {
		checked: false
	}; // 选择全部商品
	$scope.cateIsOpen = false;
	$scope.cateAll = {
		active: true
	} // 不限分类
	$scope.fast = {
		any: { active: true, value: '' },
		link2: { active: false, value: 'price_2_2' },
		link3: { active: false, value: 'price_3_5' },
		link5: { active: false, value: 'price_5_10' },
		link_good: { active: false, value: 'qualitylink_1' }
	}
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
	$scope.price = {
		any: { active: true, value: '' },
		w0: { active: false, value: '0_5' },
		w1: { active: false, value: '5_10' },
		w2: { active: false, value: '10_20' },
		w3: { active: false, value: '20_50' },
		w4: { active: false, value: '50_100' },
		w5: { active: false, value: '100_500' },
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
	$scope.order = {
		any: { active: true, asc: false },
		bdweight: { active: false, asc: false },
		bdincluded: { active: false, asc: false },
		bdtrans: { active: false, asc: false },
		price: { active: false, asc: false },
		sales: { active: false, asc: false }
	}
	$scope.show_style = {
		any: { active: true, value: '' },
		w1: { active: false, value: '1' },
		w2: { active: false, value: '2' },
		w3: { active: false, value: '3' },
	}
	$scope.weizhi = {
		any: { active: true, value: '' },
		w1: { active: false, value: '1' },
		w2: { active: false, value: '2' },
	}
	$scope.sales = false; // 成单 true 传1；否则不传
	$scope.search = ''; // 搜索网站名称和域名

	// 获取搜索条件
	$scope.resetApiParam = function() {
		$scope.apiParam = {};
		$scope.apiParam.px = $scope.page.px;
		$scope.apiParam.pz = $scope.page.pz;

		if(!$scope.cateAll.active) {
			$scope.apiParam.cid1 = $scope.getCate();
		}
		for(var i in $scope.fast) {
			if($scope.fast[i]['active']) {
				var fast = $scope.fast[i]['value'].split('_');
				if(fast.length == 2) {
					$scope.apiParam[fast[0]] = fast[1];
				}
				if(fast.length == 3) {
					$scope.apiParam['minprice'] = fast[1];
					$scope.apiParam['maxprice'] = fast[2];
				}
			}
		}

		if(!$scope.bdweight.any.active) {
			var bdweight = '';
			for(var i in $scope.bdweight) {
				if($scope.bdweight[i]['active']) {
					bdweight += $scope.bdweight[i]['value'] + ','
				}
			}
			$scope.apiParam['bdweight'] = bdweight.slice(0, -1);
		}

		$scope.rangeApiParam('bdincluded');
		$scope.rangeApiParam('trans');
		$scope.rangeApiParam('price');
		$scope.rangeApiParam('age');

		if(!$scope['sense']['any']['active']) {
			for(var i in $scope['sense']) {
				if($scope['sense'][i]['active']) $scope.apiParam['sense'] = $scope['sense'][i]['value']
			}
		}

		if(!$scope['autochain']['any']['active']) {
			for(var i in $scope['autochain']) {
				if($scope['autochain'][i]['active']) $scope.apiParam['autochain'] = $scope['autochain'][i]['value']
			}
		}
		
		if(!$scope['show_style']['any']['active']) {
			for(var i in $scope['show_style']) {
				if($scope['show_style'][i]['active']) $scope.apiParam['show_style'] = $scope['show_style'][i]['value']
			}
		}
		if(!$scope['weizhi']['any']['active']) {
			for(var i in $scope['weizhi']) {
				if($scope['weizhi'][i]['active']) $scope.apiParam['weizhi'] = $scope['weizhi'][i]['value']
			}
		}

		if(!$scope['order']['any']['active']) {
			for(var i in $scope['order']) {
				if($scope['order'][i]['active']) {
					$scope.apiParam['order'] = i;
					$scope.apiParam['asc'] = $scope['order'][i]['asc'] ? 'asc' : 'desc';
				}
			}
		}

		if($scope.sales) $scope.apiParam['sales'] = 1;
		if($scope.search) $scope.apiParam['search'] = $scope.search;

	}
	$scope.rangeApiParam = function(target) {
		if(!$scope[target]['any']['active']) {
			for(var i in $scope[target]) {
				if($scope[target][i]['active']) {
					if(i == 'input') {
						var unit = 1;
						if(target == 'bdincluded' || target == 'trans') unit = 10000;
						$scope.apiParam['min' + target] = $scope[target][i]['min'] * unit;
						$scope.apiParam['max' + target] = $scope[target][i]['max'] * unit;
					} else {
						var arr = $scope[target][i]['value'].split('_');
						$scope.apiParam['min' + target] = arr[0];
						$scope.apiParam['max' + target] = arr[1];
					}
				}
			}
		}
	}

	// 单选、多选、排序点击、切换状态
	$scope.singleSelect = function(target, item) {
		if(!target || !item) return false;
		if(item == 'input') return false;
		for(var i in $scope[target]) {
			$scope[target][i]['active'] = false;
			$scope[target][i]['min'] = '';
			$scope[target][i]['max'] = '';
		}
		$scope[target][item]['active'] = true;

		// 快速筛选和价格筛选
		if(target == 'fast' && item.match(/^link\d$/)) {
			for(var j in $scope['price']) {
				$scope['price'][j]['active'] = false;
			}
			$scope['price']['input']['min'] = '';
			$scope['price']['input']['max'] = '';
			$scope['price']['any']['active'] = true;
		}
		if(
			target == 'price' &&
			($scope['fast']['link2']['active'] ||
				$scope['fast']['link3']['active'] ||
				$scope['fast']['link5']['active'])
		) {
			$scope['fast']['link2']['active'] = false;
			$scope['fast']['link3']['active'] = false;
			$scope['fast']['link5']['active'] = false;
			$scope['fast']['any']['active'] = true;
		}

		$scope.searchGoods();
	}
	$scope.moreSelect = function(target, item) {
		if(!target || !item) return false;
		if(item == 'any') {
			if($scope[target][item]['active']) return false;

			for(var i in $scope[target]) {
				$scope[target][i]['active'] = false;
			}
			$scope[target][item]['active'] = !$scope[target][item]['active'];
		} else {
			$scope[target][item]['active'] = !$scope[target][item]['active'];
			var anyActive = true;
			for(var i in $scope[target]) {
				if(i != 'any' && $scope[target][i]['active']) {
					anyActive = false;
				}
			}

			$scope[target]['any']['active'] = anyActive;
		}

		$scope.searchGoods();
	}
	$scope.clickOrder = function(target, item) {
		if(!target || !item) return false;
		if($scope[target][item]['active']) {
			$scope[target][item]['asc'] = !$scope[target][item]['asc'];
		} else {
			for(var i in $scope[target]) {
				$scope[target][i]['active'] = false;
			}
			$scope[target][item]['active'] = true;
		}

		$scope.searchGoods();
	}
	$scope.toggleMe = function(target) {
		if(!target) return false;
		$scope[target] = !$scope[target];

		if(target == 'sales') $scope.searchGoods();
	}

	// 选择分类、获取选择的分类
	$scope.clickCate = function(index) {
		if(index == 'all' && !$scope.cateAll.active) {
			$scope.cateAll.active = true;
			for(var i = 0; i < $scope.cate.length; i++) {
				$scope.cate[i]['active'] = false;
			};
			$scope.searchGoods();
			return true;
		}
		if(index == 'all' && $scope.cateAll.active) {
			return false;
		}

		$scope.cate[index]['active'] = !$scope.cate[index]['active'];

		var cateAll = true;
		for(var j = 0; j < $scope.cate.length; j++) {
			if($scope.cate[j]['active']) {
				cateAll = false;
			}
		};
		$scope.cateAll['active'] = cateAll;

		$scope.searchGoods();
	}
	$scope.getCate = function() {
		var cid1 = '';
		for(var i = 0; i < $scope.cate.length; i++) {
			if($scope.cate[i]['active']) {
				cid1 += $scope.cate[i]['cid1'] + ',';
			}
		};
		return cid1.slice(0, -1);
	}

	// 勾选商品
	$scope.checkItem = function(index) {
		if(index == 'all') {
			$scope.resAll.checked = !$scope.resAll.checked;
			for(var i = 0; i < $scope.res.length; i++) {
				$scope.res[i]['checked'] = $scope.resAll.checked;
			};
			return true;
		}
		$scope.res[index]['checked'] = !$scope.res[index]['checked'];
	}

	// 创建分页
	$scope.createPage = function() {
		$('.item_page').createPage({
			pageCount: $scope.page.num_page,
			current: $scope.page.px,
			total: $scope.page.num_rows,
			showTotal: true,
			showInput: true,
			backFn: function(index) {
				gotoTop('.goto_header', '.header_togo');
				$scope.$apply(function() {
				
					if(index > 3) {
						if(cook == null) {
							$('.modal_tips_no').hide();
							modal_confirm('您还没有登录，登录才能查看更多商品！', function() {
								window.location.href = '/member/user/login.htm';
							}, function() {

							}, {
								yes: '去登录'
							});
						} else {
							$scope.page.px = index;
							$scope.getGoods();
						}
						$scope.createPage()
					} else {
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
	$scope.getPage = function(mark) {
		if(mark == 'prev' && $scope.page.px > 1) {
			$scope.page.px -= 1;
			$scope.getGoods();
		}
		if(mark == 'next' && $scope.page.px < $scope.page.num_page) {
			if($scope.page.px >= 3) {
				if(cook == null) {
					$('.modal_tips_no').hide();
					modal_confirm('您还没有登录，登录才能查看更多商品！', function() {
						window.location.href = '/member/user/login.htm';
					}, function() {

					}, {
						yes: '去登录'
					});
				} else {
					$scope.page.px += 1;
					$scope.getGoods();
				}
			} else {
				$scope.page.px += 1;
				$scope.getGoods();
			}

		}

	}

	// 获取商品
	$scope.getGoods = function() {
		$scope.itemLoad = true;
		$scope.resetApiParam();
		var url = '/friendlink';
		$http.post(url, $scope.apiParam).then(function(res) {
			if(res.data.statusCode == 200) {
				$scope.res = res.data.res;
				if($scope.res) {
					$scope.res.map(function(item, index) {
						
						if(item.price == 0 && item.price_qz > 0) {
							item.qz = 1 //全站
						}else{
							item.qz = 2
						}
						return item
					})
				}
				$scope.resAll.checked = false;
				$scope.page = res.data.page;
				$scope.createPage();
				$scope.itemLoad = false;

			} else {
				modal_alert(res.data.message);
			}
		}, function(res) {
			modal_alert('系统出错，请联系客服。');
		});
	}

	$scope.searchGoods = function() {
		$scope.page.px = 1;
		$scope.getGoods();
	}
	// 购买 

	$scope.qz = '';
	$scope.buyGoods = function(gid, price, price_qz, index) {
		if(price > 0 && price_qz == 0) { //首页
			$scope.qz = '2'
		}
		if(price == 0 && price_qz > 0) {
			$scope.qz = '1' //全站
		}
		if(price > 0 && price_qz > 0) {
			if(index == $scope.index) {
				$scope.qz = $scope.str
			} else {
				$scope.qz = 2
			}
		}

		var gids = '';
		var data_por = {}
		if(gid) {
			if(gid == $scope.cli_gid) return false
			$scope.cli_gid = gid
			gids = gid + '';
			data_por = {
				gids: gids,
			    qz: $scope.qz
			}
			
		} else {
			gids = $scope.getCheckedGids();
		
			data_por = {
				gids: gids,
			    qz: $scope.qz_pors
			}
			if(!gids) {
				modal_alert('没有选择要购买的商品哦~');
				return false;
			}
		}

		var url = '/index/cart/buy';

		$http.post(url,data_por).then(function(res) {
			$scope.cli_gid = ''
			if(res.data.statusCode == 200) {
				var obj1 = '';
				if(gid) {
					obj1 = '.fly' + gid;
				} else {
					obj1 = '.flyall';
				}
				common.flyImg('/images/demo/cart_friend.png', obj1, '.menu-right .icon-shop', {
					obj1x: 2,
					obj1y: 6,
					obj2x: 2,
					obj2y: 3,
					time: 1000
				}, function() {
					common.itemNum += gids.split(',').length;
					common.getCart(1);
				});
			} else if(res.data.statusCode == 505) {
				modal_confirm('登录后才能购买友链，<br/>请先登录', function() {
					window.location.href = memberUrl('/user/login') + '?back_href=' + window.location.href;
				}, function() {}, {
					yes: '去登录',
					no: 'hide'
				});
			} else {
				modal_alert(res.data.message);
			}
		}, function(res) {
			modal_alert('系统出错，请联系客服。');
		});
	}

	$scope.changePrice = function(str, index) {
		$scope.index = index
		$scope.str = str
		$scope.res[index].qz = str
	

	}
	// 获取选择商品的gid 
	$scope.getCheckedGids = function() {
		var gids = '';
		$scope.qz_pors = ''
		for(var i = 0; i < $scope.res.length; i++) {
			if($scope.res[i]['checked']) {
				gids += $scope.res[i]['gid'] + ',';
				$scope.qz_pors +=$scope.res[i].qz + ','
				
			}
		}
		$scope.qz_pors= $scope.qz_pors.slice(0, -1);
		return gids.slice(0, -1);
	}


	$scope.setRenderOk = function() {
		$('[data-toggle="tooltip"]').tooltip({ // 有宽高限制
			'html': true,
			'trigger': 'hover' // 默认hover
		})
	}

	//$scope.param_fast = getParameter('fast');
	$scope.param_fast = fast;
	if($scope.param_fast) $scope.singleSelect('fast', $scope.param_fast);
	$scope.param_url = getParameter('url');
	if($scope.param_url) {
		$scope.search = $scope.param_url;
		$scope.searchGoods();
	}
	$scope.param_name = getParameter('name');
	if($scope.param_name) {
		$scope.search = decodeURIComponent($scope.param_name);
		$scope.searchGoods();
	}

	var toolweburl = getParameter('weburl');
	if(toolweburl) {
		$scope.search = toolweburl;
		$scope.searchGoods();
	}
	
	
	$scope.showstyle = function(str){
		switch(str){
			case 1:
			return "直接显示"
			break;
			case 2:
			return  "鼠标滑显"
			break;
			case 3 :
			return "隐藏不显示"
			break;
			
			
		}
	}
	

});

// 检查输入框整数和小数，赋值
app.directive('checkInput', function() {
	return {
		link: function(scope, element, attrs) {
			var target = attrs.checkTarget;
			var name = attrs.checkName;
			var type = attrs.checkType;
			element.on('keyup', function() {
				var val = element.val();
				var val2 = '';
				var invalid = false;

				if(type == 'int' && isNaN(parseInt(val))) {
					if(val.length > 0) invalid = true;
				}
				if(type == 'int' && !isNaN(parseInt(val))) {
					val2 = parseInt(val);
				}
				if(type == 'float' && isNaN(parseFloat(val))) {
					if(val.length > 0) invalid = true;
				}
				if(type == 'float' && !isNaN(parseFloat(val))) {
					if(val.substr(-1, 1) == '.' && val.substr(-2, 1) != '.') {
						val2 = val;
					} else {
						val2 = parseFloat(val);
					}
				}

				scope.$apply(function() {
					scope[target]['input'][name] = val2;
					scope[target]['input']['invalid'] = invalid;

					var min = scope[target]['input']['min'] + '';
					var max = scope[target]['input']['max'] + '';
					if(min.length > 0 || max.length > 0) {
						for(var i in scope[target]) {
							scope[target][i]['active'] = false;
						}
						scope[target]['input']['active'] = true;

						// 检查快速筛选
						if(
							target == 'price' &&
							(scope['fast']['link2']['active'] ||
								scope['fast']['link3']['active'] ||
								scope['fast']['link5']['active'])
						) {
							scope['fast']['link2']['active'] = false;
							scope['fast']['link3']['active'] = false;
							scope['fast']['link5']['active'] = false;
							scope['fast']['any']['active'] = true;
						}

					} else {
						for(var i in scope[target]) {
							scope[target][i]['active'] = false;
						}
						scope[target]['any']['active'] = true;
					}
				})
			})

			element.on('blur', function() {
				var val = element.val();
				var val2 = '';
				var invalid = false;

				if(type == 'float' && !isNaN(parseFloat(val))) {
					val2 = parseFloat(val);

					scope.$apply(function() {
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
			element.on('keyup', function(e) {
				if(e.keyCode == 13) {
					scope.searchGoods();
				}
			});
		}
	};
});

$(document).on('mouseover', '.show_table', function() {
	$('.show_table').find('.table').hide();
	$(this).find('.table').show();
})
$(document).on('mouseout', '.show_table', function() {
	$(this).find('.table').hide();
})