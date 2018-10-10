app.controller('ctrlArea', function ($scope, $http,approve,complete_info) {
    $scope.complete_info = complete_info
    $scope.approve = approve
    $scope.free_change = free_change;
    $scope.data = {};
    $scope.data.px = 1 //页数
    $scope.data.pz = 10 // 每页条数
    $scope.types = ["所有", "开启", "暂停"];


    // gid申请


    //实例化时间戳
    $scope.formatDate = function (time) {
        if (!time) return;
        return new Date(time * 1000).format('yyyy-MM-dd hh:mm')
    }
    //end

    $scope.type = '所有';
    $scope.changetype = function (k) {
        $scope.type = k;
        $scope.submitData();
    }

    $scope.submitData = function (t) {
        if (!t) $scope.data.px = 1;
        if ($scope.type == '所有') {
            $scope.data.status = '';
        } else {
            if ($scope.type == "开启") {
                $scope.data.status = '上架';
            }
            if ($scope.type == "暂停") {
                $scope.data.status = '下架';
            }
        }

        $http.post('/member/freechange/release', $scope.data).success(function (data) {

            if (data.statusCode == 200) {
                if ($scope.data.px == 1) { //如果是第一页，那么把变量重新赋值
                    $scope.free_change = data.data;
                } else {//否则把返回的结果累加进变量里面
                    if (data.data.length > 0) {
                        for (var g in data.data) {
                            $scope.free_change.push(data.data[g]);
                        }
                    }
                }
                if ($scope.data.px >= data.page.num_page) { //如果当前页面大于等于总页面，那么不可以禁用滚动
                    $scope.scrollDisabled = true;
                    return false;
                }
            } else {
                modal_alert(data.message)
            }
            $scope.scrollDisabled = false;
        });
    }
    $scope.loadMore = function () {
        if ($scope.scrollDisabled) return false;
        $scope.scrollDisabled = true;
        $scope.data.px += 1;
        $scope.submitData(true);
    }

    // $scope.submitData(true);

    $scope.keyWord = function (str) {
        if (str == null) {
            return "无关键词"
        } else {
            return str
        }
    }

    // 上下架  

    //  上架
    $scope.upGoods = function (item,index) {
       
        if (item.validate == 2) {
            $scope.approve.webWid = item.wid;
            $scope.web_wid = item.wid
            $scope.web_gid = item.gid
            $scope.web_index = index
            $scope.approve.web_url = item.weburl
            $(".checkwebsite").modal("show");
            $scope.approve.getApproveInfo();
        } else {
            $http.post("/member/freechange/updShelves", { gid: item.gid, wid: item.wid, status: "上架" }).success(function (data) {
            if (data.statusCode == 200) {
                item.sellstatus = "上架";   ///  
                modal_alert('免费换链开启成功!')
               
            } else {
        		modal_alert(data.message)
            }
        })
        }


    }

    // 网站认证
    $scope.webApprove = function () {
        $scope.approve.webApprove(function (cb) {
            if(cb == 'success'){
                $scope.free_change[$scope.web_index].sellstatus = "上架";
            }
         },'/member/freechange/updShelves',$scope.web_wid,$scope.web_gid)
    }
    // 下架
	$scope.dowmGoods_text = ""
    $scope.downGoods = function (item, index) {
    	$scope.dowmGoods_text = item.carding == 1 ? "该商品设置了商品推荐，如果暂停将取消推荐，确认暂停？" : "确认暂停该友链交换吗？"
        $(".grounding").modal("show")
        $scope.findDowmIndex = index
        $scope.findDownGoods = item
    }

    $scope.sureDown = function () {
        $http.post("/member/freechange/updShelves", { gid: $scope.findDownGoods.gid, wid: $scope.findDownGoods.wid, status: "下架" }).success(function (data) {

           
            if (data.statusCode == 200) {
                free_change[$scope.findDowmIndex].sellstatus = "下架"
                $scope.submitData();
            } else {
                modal_alert(data.message)
            }
        })
    }


    // 新增交换
    $scope.sellchange = function () {   
        $scope.complete_info.check_user('/member/freechange/addchange') //检测用户信息是否完善
    }

    //删除弹窗
    $scope.delfree = function (id, isbuy, key, key1) {
        $scope.delid = id
        if (isbuy == 1) {
            $scope.delstatus = 'buy'
        }
        if (isbuy == 2) {
            $scope.delstatus = 'sell'
        }
        $scope.delkey = key
        $scope.delkey1 = key1

    }
    //确认删除
    $scope.delsure = function () {
        $http.post("/member/freechange/updatelook", { id: $scope.delid }).success(function (data) {
            $scope.free_change[$scope.delkey].about.splice($scope.key1, 1)
            if ($scope.delstatus == 'buy') {
                $scope.free_change[$scope.delkey].apply -= 1;
            } else if ($scope.delstatus == 'sell') {
                $scope.free_change[$scope.delkey].applyed -= 1;
            }
            //if($scope.free_change[$scope.delkey].apply == 0 && $scope.free_change[$scope.delkey].applyed == 0){
            //    $scope.free_change.splice($scope.delkey, 1)
            //}

            window.location.reload();

        })
    }


    $scope.shenqin = function (val, index) {
        $scope.sq = val
        //	$(this).parents('tr').siblings().find('.othertab').hide();
        //// 	 	$(this).toggleClass('curr');
        // 	 	$(this).parents('td').find('.othertab').toggle();
        //	$('.othertab').toggle()

        $('.othertab').addClass('none')
       
        //	$('.othertab').eq(index).toggle()
        if ($('.othertab').eq(index).hasClass('none')) {
            $('.othertab').eq(index).removeClass('none')
        } else {
            $('.othertab').eq(index).addClass('none')
        }

        $scope.gArr = 0
    
        if ($scope.free_change[index].about.length > 0) {

            for (var i = 0; i < $scope.free_change[index].about.length; i++) {
                if ($scope.free_change[index].about[i].isbuy == val) {
                    $scope.gArr++
                } else {
                    $scope.gArr = 0
                }
            }
        } else {
            $scope.gArr = 0
        }

     
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

    //   保存资料
    $scope.siveEdit = function () {
        if ($scope.userInfo.phone == "" && $scope.userInfo.qq == "" && $scope.userInfo.email == "") {
            $http.post('/member/goods/savedata', { phone: $scope.phone, qq: $scope.qq, email: $scope.email, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    modal_alert(data.message)
                    location.href = memberUrl("/freechange/addchange")
                } else {
                    modal_alert(data.message)
                }
            })
        } else if ($scope.userInfo.phone != "" && $scope.userInfo.qq == "" && $scope.userInfo.email == "") {
            $http.post('/member/goods/savedata', { qq: $scope.qq, email: $scope.email }).success(function (data) {
                if (data.statusCode == 200) {
                    modal_alert(data.message)
                    location.href = memberUrl("/freechange/addchange")
                } else {
                    modal_alert(data.message)
                }
            })
        } else if ($scope.userInfo.phone == "" && $scope.userInfo.qq != "" && $scope.userInfo.email == "") {
            $http.post('/member/goods/savedata', { phone: $scope.phone, email: $scope.email, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    modal_alert(data.message)
                    location.href = memberUrl("/freechange/addchange")
                } else {
                    modal_alert(data.message)
                }
            })

        } else if ($scope.userInfo.phone == "" && $scope.userInfo.qq == "" && $scope.userInfo.email != "") {
            $http.post('/member/goods/savedata', { phone: $scope.phone, qq: $scope.qq, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    modal_alert(data.message)
                    location.href = memberUrl("/freechange/addchange")
                } else {
                    modal_alert(data.message)
                }
            })
        } else if ($scope.userInfo.phone != "" && $scope.userInfo.qq == "" && $scope.userInfo.email != "") {
            $http.post('/member/goods/savedata', { qq: $scope.qq }).success(function (data) {
                if (data.statusCode == 200) {
                    modal_alert(data.message)
                    location.href = memberUrl("/freechange/addchange")
                } else {
                    modal_alert(data.message)
                }
            })
        } else if ($scope.userInfo.phone == "" && $scope.userInfo.qq != "" && $scope.userInfo.email != "") {
            $http.post('/member/goods/savedata', { phone: $scope.phone, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    modal_alert(data.message)
                    location.href = memberUrl("/freechange/addchange")
                } else {
                    modal_alert(data.message)
                }
            })

        }
    }


    //返回格式切换
    $scope.format = 'json';
    $scope.active = 1
    $scope.show = function (type) {
        $scope.active = type
        if (type == 1) {
            $scope.format = 'json';
        }
        if (type == 2) {
            $scope.format = 'xml';
        }
        if (type == 3) {
            $scope.format = 'html';
        }
        $http.post("/member/Autochain/GetAutoChain", { id: $scope.id }).success(function (data) {
            if (data.statusCode == 200) {
                $scope.chaincode = data.data.url + $scope.format;
        
                $scope.codes = $scope.chaincode;
            }
        })
    }

    $scope.test = 'false';
    $scope.act = 1
    $scope.code = function (type) {
        $scope.act = type
        if (type == 1) {
            $scope.test = 'false';
        }
        if (type == 2) {
            $scope.test = 'true';
        }
        $http.post("/member/Autochain/GetAutoChain", { id: $scope.id }).success(function (data) {
            if (data.statusCode == 200) {
                $scope.chaincode = data.data.url + $scope.format + "&text=" + $scope.test;
             
                $scope.codes = $scope.chaincode;
            }
        })
    }





    $scope.name = ''
    $scope.autochain = function (webId, item, index, name, weburl, autochain) {

        if (autochain == 1) {
            $scope.free_change[index].autochain = 2
            $('.chain-set').modal('show');

            $scope.chainame = name;
            $scope.id = webId;
            $scope.wurl = weburl
            $scope.chain = 2;
            $scope.kid = webId;
            //勾选自动上链
            //		@apiParam {int} id 网站id
            //   	* @apiParam {int} chain 1{否}2{是}
       
            $http.post("/member/Autochain/JoinAutoChain", { id: webId, chain: $scope.chain }).success(function (data) {
                if (data.statusCode == 200) {
              
                    //	                modal_alert(data.message)
                }
            })

            //上链设置	

            $http.post("/member/Autochain/GetAutoChain", { id: webId }).success(function (data) {
                if (data.statusCode == 200) {
                    $scope.chaincode = data.data.url + $scope.format + "&text=false";
                    $scope.sign = data.data.sign;
                    $scope.codes = $scope.chaincode;
                }
            })




        } else {
            modal_confirm('确定要取消自动上链吗？', function () {
                $scope.free_change[index].autochain = 1
                $('.chain-set').modal('hide');
                $scope.chain = 1;
                $http.post("/member/Autochain/JoinAutoChain", { id: webId, chain: $scope.chain }).success(function (data) {
                    if (data.statusCode == 200) {
                        modal_alert(data.message)
                    } else {
                        modal_alert(data.message)
                    }
                })
            })
        }


    }

    //  语言切换
    $scope.curr = 1;
    $scope.language = function (type) {
        $scope.curr = type
    }

    $scope.codetest = function () {
        $http.post("/member/Autochain/CheckAutoChain", { sign: $scope.sign, url: $scope.wurl }).success(function (data) {
            if (data.statusCode == 200) {
                $scope.returndata = data.message
            } else {
                modal_alert(data.message)
            }
        })
    }

    $scope.reflash = function () {
        window.location.reload();
    }

    $scope.c_chain = function () {
        var jid = $('.kname').attr('kid');
     
        $scope.chain = 1;
        $http.post("/member/Autochain/JoinAutoChain", { id: jid, chain: $scope.chain }).success(function (data) {
            if (data.statusCode == 200) {
         
                window.location.reload();
            } else {
                modal_alert(data.message)
            }
        })
    }


    $scope.order_taking = function (sid, status, index) {
    
        if (status == 2) {
            $http.post("/member/freechange/order_taking", { id: sid, status: 3 }).success(function (data) {
                if (data.statusCode == 200) {
                    $scope.free_change[$scope.itemindex].about[index].ex_status = 3
                    $scope.free_change[$scope.itemindex].about[index].buy_status = 3
                }
            })
        } else {
            $http.post("/member/freechange/order_taking", { id: sid, status: 2 }).success(function (data) {
                if (data.statusCode == 200) {
                    $scope.free_change[$scope.itemindex].about[index].ex_status = 2
                    $scope.free_change[$scope.itemindex].about[index].buy_status = 2
                }
            })
        }
    }

    $scope.sees = function (index) {
        $scope.itemindex = index;
    }

 $scope.delete = function(gid,index){

    $scope.delete_gid = gid
    $scope.delete_index = index
    $('.del_mfgoods').modal('show')

 }
 $scope.sure_delete = function(){
        $http.post('/member/goods/goodsdel',{gid:$scope.delete_gid}).success(function(data){
            if(data.statusCode == 200){
                $scope.free_change.splice($scope.delete_index,1)
            }else{
                modal_alert(data.message)
            }
        })
 }

   
    $scope.apply_info = function(type,num,gid,wid){
        if(num == 0){
            return
        }else{
            window.location.href = '/member/freechange/changelist?gid=' + gid  + "&type=" + type + '&wid=' + wid
        }
    }


	$scope.style_str = function(str){
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
	
	
})

