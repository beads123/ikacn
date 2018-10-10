
// /member/goods/friendgoods	出售友链首页
app.controller('ctrlArea', function ($http, $scope,approve,complete_info) {

    $scope.approve = approve
    $scope.complete_info = complete_info
    $scope.pageNumber = 1 //页数
    $scope.pageSize = 10 // 每页条数
    // $scope.scrollDisabled = false  //滚动条
    $scope.goodsStatus = true
    $scope.list = dataArr
    $scope.dataList = function () {
        $http({
            url: '/member/goods/friendgoods',
            data: { px: $scope.pageNumber, pz: $scope.pageSize ,status:$scope.status,search:$.trim($scope.webString)},
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function (obj) {
                var str = [];
                for (var o in obj)
                    if (obj[o]) str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                return str.join("&");
            }
        }).success(function (data) {
            if (data.statusCode == 200) {
                if ($scope.pageNumber == 1) {
                    $scope.list = data.data
                } else {
                    if (data.data.length > 0) {
                        for (var g in data.data) {
                            $scope.list.push(data.data[g])
                        }
                    }
                }
                if ($scope.pageNumber > data.page.num_page) {
                    $scope.scrollDisabled = true
                    return false
                }

            } else {
                modal_alert(data.message)
            }

            $scope.scrollDisabled = false



        }, function () { })
    }

    //$scope.dataList()




    // //	出售友链 查看
    // //    $(".table-responsive").hide()
    // 	$(document).on('click','.friend-table .see',function(){
    // 	$(this).parents('tr').siblings().find('.order-info').hide();
    //  	$(this).toggleClass('curr');
    //  	$(this).parent().find('.order-info').toggle();
    // })



    //  订单状态
    $scope.orderSta = function (item) {
        if (item.orderstatus == 2) {  //未接单
            return "待接单"
        } else if (item.orderstatus == 3) { // 待上链
            return "已接单"
        } else if (item.orderstatus == 4) { // 服务中
            return "服务中"
        } else if (item.orderstatus == 5) { // 故障中
            return "故障中"
        } else if (item.orderstatus == 6) { //待结算
            return "待结算"
        } else if (item.orderstatus == 7) {  // 已结束
            return "服务完成"
        } else if (item.orderstatus == 8) {  // 已结束
            return "关闭订单"
        } else if (item.orderstatus == 9) {  //拒单
            return "已拒单"
        }
    }

    //  商品上下架状态
    $scope.sellStatus = function (status) {
        if (status == "上架") {
            return "下架"
        } else {
            return "上架"
        }
    }
    // 商品上下架
    // status 商品上下架状态
    var findIndex = '' // 商品位置
    var findGoods = ""  //商品信息

    // 商品上架
    $scope.upGoods = function (id, status, index, item) {
    
        findIndex = index
        findGoods = item
        $scope.web_wid = item.wid
        if (status == "上架") {
            $scope.type = "下架";
            $scope.dowmGoods_text = findGoods.carding == 1 ? "该商品设置了商品推荐，如果下架将取消推荐，确认下架？" : "确认下架该友链？"
            $(".dowmGoods").modal("show")
            return $scope.goodsId = id
        } else if (status == "下架") {
            $scope.type = "上架"
            if (status == "下架") {
                $http({
                    url: '/member/goods/upDownState',
                    data: { gid: id, state: $scope.type },
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function (obj) {
                        var str = [];
                        for (var o in obj)
                            if (obj[o]) str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                        return str.join("&");
                    }
                }).success(function (data) {
                    if (data.statusCode == 200) {         
                        findGoods.sellstatus = "上架"
                        $scope.list.splice(findIndex, 1, findGoods)
                        status = "上架"
                        $(".success-up").modal("show")
                        $scope.suMsg = data.message
                    } else if(data.statusCode == 508){

                        $(".modal-auth").modal("show")

                    }else {
                        modal_alert(data.message)
                    }

                }, function () { })
            }

        }
    }
  
    $scope.go_auth = function(){
        $(".checkwebsite").modal("show")
        $scope.approve.web_url = findGoods.weburl;
        $scope.approve.webWid = $scope.web_wid
        $scope.approve.getApproveInfo()
    }

    // 确定商品下架
    $scope.sureDown = function () {
        $http({
            url: '/member/goods/upDownState',
            data: { gid: $scope.goodsId, state: '下架' },
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function (obj) {
                var str = [];
                for (var o in obj)
                    if (obj[o]) str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                return str.join("&");
            }

        }).success(function (data) {
            if (data.statusCode == 200) {
                findGoods.sellstatus = "下架"
                $scope.list.splice(findIndex, 1, findGoods)
                $(".success-up").modal("show")
                $scope.suMsg = data.message
               
            } else if(data.statusCode == 501){
                $(".dowmGoods2").modal("show")
                $scope.downMsg = data.message


            }else{
                modal_alert(data.message)
            }
            

        }, function () { })
    }
  

    $scope.sureDown2 = function(){
        $http.post("/member/goods/upDownState",{ gid: $scope.goodsId, state: '下架' ,fit:1}).success(function(data){
            // modal_alert(data.message)
            if(data.statusCode == 200){
                findGoods.sellstatus = "下架"
                $scope.list.splice(findIndex, 1, findGoods)
                $(".success-up").modal("show")
                $scope.suMsg = data.message
            }else{
                modal_alert(data.message)
            }

        })
    }

    // 修改商品
    var goodsInfo = ''
    $scope.editGoods = function (item) {
        location.href = memberUrl("/goods/editfriendsell",{gid:item.gid});
    }


    // 出售友链（新增友链）

    $scope.sellUrl = function () {
        $scope.complete_info.check_user(memberUrl("/goods/friendsell")) //检测用户信息是否完善
    }



    var int
    // 检查手机号
    // $scope.btnDisabled = true
    $scope.checkPhone = function () {
        if (!$scope.phone) {
            $scope.tipMsg = ""
        }
        $http.post("/member/goods/checkPhone", { phone: $scope.phone }).success(function (data) {
            if (data.statusCode == 200) {
                // $scope.btnDisabled = false
                $scope.tipMsg = ''
            } else {
                // $scope.btnDisabled = true
                $scope.tipMsg = data.message
            }
          
        })
    }



    // 发送验证码
    $scope.authCode = function () {
        $scope.timeNum = 59
        if ((preg.mobile.test($scope.phone)) || $scope.userInfo.phone != "") {
            if ($scope.userInfo.phone == "") {
                $http.post("/member/Sms/add", { mobile: $scope.phone, type: 1 }).success(function (data) {        
                    if (data.statusCode == 200) {
                        $("#timeCount").removeClass("hidden")
                        $("#getCode").addClass("hidden")
                        // 验证码倒计时
                        int = setInterval(function () {
                            $scope.timeNum--

                            $("#d-sec").text($scope.timeNum)

                            if ($scope.timeNum <= 0) {
                                $("#getCode").removeClass("hidden")
                                $("#timeCount").addClass("hidden")
                                $scope.msg = ""
                                $("#d-sec").text('')
                                clearInterval(int)
                            }
                        }, 1000)
                    } else {
                        $scope.msg = data.message
                        setTimeout(function () {
                            $scope.msg = ''
                        }, 2000);
                    }
                })
            } else {

                $http.post("/member/Sms/add", { mobile: $scope.userInfo.phone, type: 1 }).success(function (data) {
                    if (data.statusCode == 200) {
                        $("#timeCount").removeClass("hidden")
                        $("#getCode").addClass("hidden")
                        // 验证码倒计时
                        int = setInterval(function () {
                            $scope.timeNum--

                            $("#d-sec").text($scope.timeNum)

                            if ($scope.timeNum <= 0) {
                                $("#getCode").removeClass("hidden")
                                $("#timeCount").addClass("hidden")
                                $scope.msg = ""
                                $("#d-sec").text('')
                                clearInterval(int)
                            }
                        }, 1000)
                    } else {
                        $scope.msg = data.message
                        setTimeout(function () {
                            $scope.msg = ''
                        }, 2000);
                    }
                })
            }

        } else {
            //    $scope.btnDisabled = true     
        }

    }


    //   保存个人资料
    $scope.siveEdit = function () {
      
        if ($scope.userInfo.phone == "" && $scope.userInfo.qq == "" && $scope.userInfo.email == "") {
            $http.post('/member/goods/savedata', { phone: $scope.phone, qq: $scope.qq, email: $scope.email, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    modal_alert(data.message)
                    location.href = memberUrl('/goods/friendsell')
                } else {
                    modal_alert(data.message)
                }
            })
        } else if ($scope.userInfo.phone != "" && $scope.userInfo.qq == "" && $scope.userInfo.email == "") {
            $http.post('/member/goods/savedata', { qq: $scope.qq, email: $scope.email }).success(function (data) {
                if (data.statusCode == 200) {
                    modal_alert(data.message)
                    location.href = memberUrl('/goods/friendsell')
                } else {
                    modal_alert(data.message)
                }
            })
        } else if ($scope.userInfo.phone == "" && $scope.userInfo.qq != "" && $scope.userInfo.email == "") {
            $http.post('/member/goods/savedata', { phone: $scope.phone, email: $scope.email, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    modal_alert(data.message)
                    location.href = memberUrl('/goods/friendsell')
                } else {
                    modal_alert(data.message)
                }
            })

        } else if ($scope.userInfo.phone == "" && $scope.userInfo.qq == "" && $scope.userInfo.email != "") {
            $http.post('/member/goods/savedata', { phone: $scope.phone, qq: $scope.qq, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    modal_alert(data.message)
                    location.href = memberUrl('/goods/friendsell')
                } else {
                    modal_alert(data.message)
                }
            })
        } else if ($scope.userInfo.phone != "" && $scope.userInfo.qq == "" && $scope.userInfo.email != "") {
            $http.post('/member/goods/savedata', { qq: $scope.qq }).success(function (data) {
                if (data.statusCode == 200) {
                    modal_alert(data.message)
                    location.href = memberUrl('/goods/friendsell')
                } else {
                    modal_alert(data.message)
                }
            })
        } else if ($scope.userInfo.phone == "" && $scope.userInfo.qq != "" && $scope.userInfo.email != "") {
            $http.post('/member/goods/savedata', { phone: $scope.phone, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    modal_alert(data.message)
                    location.href = memberUrl('/goods/friendsell')
                } else {
                    modal_alert(data.message)
                }
            })

        }
    }

    // 商品显示上下架
    $scope.goods = ''
    $scope.goodsUpDown = function (status) {
        $scope.pageNumber = 1 //页数
        $scope.list = [];
        $scope.status  = status
        $scope.dataList()
    }



    $scope.loadMore = function () {
        if ($scope.scrollDisabled) {
            return false
        }
        $scope.scrollDisabled = true

        $scope.pageNumber = $scope.pageNumber + 1    
        $scope.dataList()
    }


    // 搜索网站      
    $scope.seachWeb = function () {
        $scope.pageNumber = 1
        $scope.dataList()
    }


  	//返回格式切换
	$scope.format = 'json';
    $scope.active = 1
    $scope.show = function(type){
    	$scope.active = type
    	if(type == 1){
    		$scope.format = 'json';
    	}
    	if(type == 2){
    		$scope.format = 'xml';
    	}
    	if(type == 3){
    		$scope.format = 'html';
    	}
    	$http.post("/member/Autochain/GetAutoChain", {id:$scope.id}).success(function (data) {
            if (data.statusCode == 200) {
                $scope.chaincode = data.data.url+$scope.format;
              
                $scope.codes =  $scope.chaincode;
            }
        })
    }

	$scope.test = 'false';
	$scope.act = 1
	$scope.code = function(type){
    	$scope.act = type
    	if(type == 1){
    		$scope.test = 'false';
    	}
    	if(type == 2){
    		$scope.test = 'true';
    	}
    	$http.post("/member/Autochain/GetAutoChain", {id:$scope.id}).success(function (data) {
            if (data.statusCode == 200) {
                $scope.chaincode = data.data.url+$scope.format+"&text="+$scope.test;
              
                $scope.codes =  $scope.chaincode;
            }
        })
    }
	

	$scope.name= ''
	$scope.autochain = function(webId, item, index,name,weburl,autochain){
		
		if(autochain == 1){
			$scope.list[index].autochain = 2
	     	$('.chain-set').modal('show');
	     	
	     	$scope.chainame = name;
	     	$scope.id = webId;   
	     	$scope.wurl = weburl
	     	$scope.chain = 2;
	     	$scope.kid = webId;
//勾选自动上链
//		@apiParam {int} id 网站id
//   	* @apiParam {int} chain 1{否}2{是}

			$http.post("/member/Autochain/JoinAutoChain", {id:webId,chain:$scope.chain}).success(function (data) {
	            if (data.statusCode == 200) {
				
//	                modal_alert(data.message)
	            }
	        })
	     	
//上链设置	
												
	     	$http.post("/member/Autochain/GetAutoChain", {id:webId}).success(function (data) {
	            if (data.statusCode == 200) {
	                $scope.chaincode = data.data.url+$scope.format+"&text=false";
					$scope.sign = data.data.sign;
	                $scope.codes =  $scope.chaincode;
	            }
	        })
	     	
	     	
	     	
	     	
		}else{
	    	modal_confirm('确定要取消自动上链吗？',function(){
		    	$scope.list[index].autochain = 1
		    	$('.chain-set').modal('hide'); 
		    	$scope.chain = 1;
		    	$http.post("/member/Autochain/JoinAutoChain", {id:webId,chain:$scope.chain}).success(function (data) {
		            if (data.statusCode == 200) {
		                modal_alert(data.message)
		            }else{
		            	 modal_alert(data.message)
		            }
		        })
		    })
	    }
		
		
	}

	//  语言切换
	$scope.curr = 1;
    $scope.language = function(type){
    	$scope.curr = type
    }

	$scope.codetest = function(){
		$http.post("/member/Autochain/CheckAutoChain", {sign:$scope.sign,url:$scope.wurl}).success(function (data) {
            if (data.statusCode == 200) {
               $scope.returndata = data.message
            }else{
            	 modal_alert(data.message)
            }
        })
	}
	
	$scope.reflash  = function(){
		window.location.reload();
	}
	
	$scope.c_chain = function(){
		var jid =  $('.kname').attr('kid');

		$scope.chain = 1;
    	$http.post("/member/Autochain/JoinAutoChain", {id:jid,chain:$scope.chain}).success(function (data) {
            if (data.statusCode == 200) {
            
                window.location.reload();
            }else{
            	 modal_alert(data.message)
            }
        })
    }
    
    $scope.delete = function(gid,index){

        $scope.delete_gid = gid
        $scope.delete_index = index
        $('.del_mfgoods').modal('show')
    
     }
     $scope.sure_delete = function(){
            $http.post('/member/goods/goodsdel',{gid:$scope.delete_gid}).success(function(data){
                if(data.statusCode == 200){
                    $scope.list.splice($scope.delete_index,1)
                }else{
                    modal_alert(data.message)
                }
            })
     }
	$scope.status_show = function(str){
		switch(str){
			case 1 :
			return "直接显示"
			break;
			case 2:
			return "鼠标滑显"
			break;
			case 3:
			return  "隐藏不显示"
			break;
		}
	}
	
})