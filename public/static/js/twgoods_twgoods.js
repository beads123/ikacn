app.controller("ctrlArea", function ($scope, $http ,approve,complete_info) {
    $scope.approve = approve
    $scope.complete_info = complete_info
    $scope.sell_graphic = sell_graphic;
    $scope.seeAd = [];
    $scope.o_status = o_status;
    $scope.data = {};
    $scope.data.px = 1 //页数
    $scope.data.pz = 10 // 每页条数
    $scope.scrollDisabled = false;
    $scope.s_type = ["所有", "上架", "下架"];
    $scope.types = ["全部", "图片广告", "文字广告"];

    //时间实例化
    $scope.formatDate = function (time) {
        if (!time) return;
        return new Date(time * 1000).format('yyyy-MM-dd hh:mm')
    }

    $scope.data_type = '所有';
    $scope.changeTypes = function (k) {
        $scope.data_type = k;
        $scope.submitData();
    }

    $scope.type = '全部';
    $scope.changetw = function (k) {
        $scope.type = k;
        $scope.submitData();
    }

    $scope.submitData = function (t) {
        if (!t) $scope.data.px = 1;
        if ($scope.data_type == '所有') {
            $scope.data.status = '';
        } else {
            $scope.data.status = $scope.data_type;
        }

        if ($scope.type == '全部') {
            $scope.data.type = '';
        } else {
            $scope.data.type = $scope.type;
        }

        $scope.data.stime = $scope.stime;
        $scope.data.etime = $scope.etime;
        $http.post('/member/goods/twgoods', $scope.data).success(function (data) {

            if (data.statusCode == 200) {
                if ($scope.data.px == 1) { //如果是第一页，那么把变量重新赋值
                    $scope.sell_graphic = data.data;
                } else {//否则把返回的结果累加进变量里面
                    if (data.data.length > 0) {
                        for (var g in data.data) {
                            $scope.sell_graphic.push(data.data[g]);
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

    // 商品上架
    $scope.upGoods = function (item) {
        $http.post("/member/goods/upDownState", { gid: item.gid, state: "上架" }).success(function (data) {
           $scope.adv_type = item.type
            if (data.statusCode == 200) {
                item.sellstatus = "上架"
                modal_alert(data.message)
            }else if(data.statusCode == 508){
                $(".modal-auth").modal("show")
                $scope.web_wid = item.wid
                $scope.wurl = item.weburl
            }else{
                modal_alert(data.message)
            }
        })
    }

    $scope.go_auth = function(){
        $(".checkwebsite").modal("show")
        $scope.approve.web_url = $scope.wurl
        $scope.approve.webWid = $scope.web_wid
        $scope.approve.getApproveInfo()
    }
	$scope.dowmGoods_text = "";
    // 商品下架
    $scope.downGoods = function (item) {
        $scope.dowmGoods_text =  item.carding == 1 ? "该商品设置了商品推荐，如果下架将取消推荐，确认下架？" : "确认下架该广告？"
        modal_confirm($scope.dowmGoods_text,function(){
        	$http.post("/member/goods/upDownState", { gid: item.gid, state: "下架" }).success(function (data) {

	            modal_alert(data.message)
	            if (data.statusCode == 200) {
	                item.sellstatus = "下架"
	            }
	        })
        })
        
    }


    // 出售广告
    $scope.sellAd = function () {
       
        $scope.complete_info.check_user(memberUrl('/twgoods/twSell')) //检测用户信息是否完善
    }


    var int
    // 检查手机号
    $scope.btnDisabled = true
    $scope.checkPhone = function () {
        if (!$scope.phone) {
            $scope.tipMsg = ""
        }
        $http.post("/member/goods/checkPhone", { phone: $scope.phone }).success(function (data) {
            if (data.statusCode == 200) {
                $scope.btnDisabled = false
                $scope.tipMsg = ''
            } else {
                $scope.btnDisabled = true
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
            $scope.btnDisabled = true
        }

     
      

    }

      //   保存个人资料
      $scope.siveEdit = function () {
        if ($scope.userInfo.phone == "" && $scope.userInfo.qq == "" && $scope.userInfo.email == "") {
            $http.post('/member/goods/savedata', { phone: $scope.phone, qq: $scope.qq, email: $scope.email, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    location.href = memberUrl("/twgoods/twsell")
                } else {
                    modal_alert(data.message)
                }

            })
        } else if ($scope.userInfo.phone != "" && $scope.userInfo.qq == "" && $scope.userInfo.email == "") {
            $http.post('/member/goods/savedata', { qq: $scope.qq, email: $scope.email, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    location.href = memberUrl("/twgoods/twsell")
                } else {
                    modal_alert(data.message)
                }
            })
        } else if ($scope.userInfo.phone == "" && $scope.userInfo.qq != "" && $scope.userInfo.email == "") {
            $http.post('/member/goods/savedata', { phone: $scope.phone, email: $scope.email, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    location.href = memberUrl("/twgoods/twsell")
                } else {
                    modal_alert(data.message)
                }
            })

        } else if ($scope.userInfo.phone == "" && $scope.userInfo.qq == "" && $scope.userInfo.email != "") {
            $http.post('/member/goods/savedata', { phone: $scope.phone, qq: $scope.qq, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    location.href = memberUrl("/twgoods/twsell")
                } else {
                    modal_alert(data.message)
                }
            })
        } else if ($scope.userInfo.phone != "" && $scope.userInfo.qq == "" && $scope.userInfo.email != "") {
            $http.post('/member/goods/savedata', { qq: $scope.qq, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    location.href = memberUrl("/twgoods/twsell")
                } else {
                    modal_alert(data.message)
                }
            })
        } else if ($scope.userInfo.phone == "" && $scope.userInfo.qq != "" && $scope.userInfo.email != "") {
            $http.post('/member/goods/savedata', { phone: $scope.phone, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    location.href = memberUrl("/twgoods/twsell")
                } else {
                    modal_alert(data.message)
                }
            })
        }
    }
 

    $scope.delete = function(gid,index){

        $scope.delete_gid = gid
        $scope.delete_index = index
        $('.del_mfgoods').modal('show')
    
     }
     $scope.sure_delete = function(){
            $http.post('/member/goods/goodsdel',{gid:$scope.delete_gid}).success(function(data){
                if(data.statusCode == 200){
                    $scope.sell_graphic.splice($scope.delete_index,1)
                }else{
                    modal_alert(data.message)
                }
            })
     }

})

