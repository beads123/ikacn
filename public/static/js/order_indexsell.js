app.controller('ctrlArea', function ($scope, $http, incorder) {
    $scope.order = incorder;
    $scope.failureCause = '';//解决故障说明
    $scope.because = '';//故障原因
    $scope.rejectCause = '';//拒单理由
    $scope.orderObj = varData; //订单对象类型
    $scope.packageObj = [] //套餐数据

    //打开解决故障对话框
    $scope.openGuZhang = function (obj) {
        $scope.failureCause = '';//解决故障说明
        $scope.because = obj.because ? obj.because : '未说明';//故障原因
        $scope.causeId = obj.id;
        $scope.gzobj= obj;
        $('.solve_modal').modal('show');
    }
    $scope.openWindow = function (obj, cls) {
        $scope.orderObj = obj;
        $('.' + cls).modal('show');
    }
    $scope.formatPrice = function(num){
        //return num.toFixed(2);
        var f = parseFloat(num);
        if (isNaN(f)) {
            return;
        }
        f = Math.round(num*100)/100;
        return f;
    }


    $scope.in_array = function (b, arr) {
        return in_array(b, arr)
    }
    //打开接单窗口
    $scope.acceptWindow = function (obj) {
        $scope.orderObj = obj;
        if ($scope.orderObj.ispackage == 2) {
            $scope.accept();
        } else {
            $scope.packageObj = []
            $scope.getPackage(function(){
                $('.package-pay').modal('show');
            })
        }
    }
    //获取套餐列表
    $scope.getPackage = function(callback){
        $scope.packageObj = []
        $http.post('/member/Order/getPackOrder', {id: $scope.orderObj.id}).success(function (data) {
            $scope.packageObj = data.data;
            if(callback)callback();
        })
    }
    //接单
    $scope.accept = function () {
        if (!$scope.orderObj.id) {
            modal_alert("订单ID错误");
            return false;
        }
        $(".modal_cue").modal('show')
        $http.get('/member/Order/accept?id=' + $scope.orderObj.id).success(function (data) {
            $(".modal_cue").modal('hide')
            if (data.statusCode == 200) {
            	if(data.status != 4 || $scope.orderObj.ispackage == 1){
	            	if ($scope.orderObj.ispackage == 2) {
	                    $('.success-order2').modal('show');
	                }else{
	                    $('.success-order').modal('show');
	                }	
            	}
                
                $('.package-pay').modal('hide');
                if ($scope.orderObj.ispackage == 1) {
                    for (var h = 0 in $scope.order.orderData) {
                        for (var g = 0 in $scope.packageObj) {
                            if ($scope.order.orderData[h].no == $scope.packageObj[g].no) {
                                $scope.order.orderData[h].orderstatus = 3
                            }
                        }
                    }
                }
                if(data.status == 4){
	                $scope.orderObj.orderstatus = 4;                
	                $scope.orderObj.onchaintime_fmt = data.onchain_time;                
	                $scope.orderObj.endtime_fmt = data.endtime;                
                }else{
                	$scope.orderObj.orderstatus = 3;                	
                }

            } else {
                modal_alert(data.message);
            }
        })
    }
    //打开拒单弹窗
    $scope.rejectWindow = function (obj) {
        $scope.orderObj = obj;
        if ($scope.orderObj.ispackage == 1) {
            $scope.getPackage();
        }
        $('.refuse_modal').modal('show');
    }
    //拒绝订单
    $scope.reject = function () {
        if(!$scope.rejectCause){
            modal_alert("请填写拒单理由")
            return
        }
        if($scope.rejectCause.length < 8){
        	modal_alert("拒单理由最少要添加8个字")
            return
        }
        if ($scope.orderObj.id < 0) {
            modal_alert("订单ID错误");
            return false;
        }
        if (!$scope.rejectCause) {

            return false;
        }
        $http.get('/member/Order/reject?id=' + $scope.orderObj.id + '&info=' + $scope.rejectCause).success(function (data) {
            if (data.statusCode == 200) {
                if ($scope.orderObj.ispackage == 1) {
                    for (var h = 0 in $scope.order.orderData) {
                        for (var g = 0 in $scope.packageObj) {
                            if ($scope.order.orderData[h].no == $scope.packageObj[g].no) {
                                $scope.order.orderData[h].orderstatus = 9
                                $scope.order.orderData[h].endtime_fmt = Date.parse(new Date())/1000;
                            }
                        }
                    }
                }

                $('.refuse_modal').modal('hide');
                $scope.orderObj.orderstatus = 9;
                $scope.orderObj.endtime_fmt = Date.parse(new Date())/1000;
            } else {
                modal_alert(data.message);
            }
        });
    }
    //设置拒单理由
    $scope.rejectCauseFun = function (t) {
        $scope.rejectCause = $scope.rejectCauses = t;
        if (t == 0) {
            $scope.rejectCause = '';
        }
    }
    //确认解决故障
    $scope.submitCause = function (obj) {
        if (!$scope.failureCause) {
            modal_alert("请输入反馈结果");
            return false;
        }
        $http.get('/member/Order/solve?id=' + $scope.causeId + '&back=' + $scope.failureCause).success(function (data) {
            if (data.statusCode == 200) {
                $('.solve_modal').modal('hide');
                $scope.orderObj.orderstatus = 4;
                //$scope.order.submitData(false,0);
                modal_alert(data.message);
                modal_confirm(data.message,function(){
                	window.location.reload();
                })
            } else {
                modal_alert(data.message);
            }
        })

    }
    ///开始服务
    $scope.beginInfo = {};
    $scope.webpath = '';
    $scope.encode = '';
    $scope.protocol = 'http';
    $scope.situation = 1;
    $scope.beginService = function (s,obj) {
        if(s==1){
            $scope.situation = 1;
            $scope.onchain(obj)
        }else{
            $scope.situation = 2;
            $scope.solveES(obj)
        }
    }
    //确认解决故障
    $scope.solveES=function(obj){
        $('.analytic_method').modal('hide')
        if(obj){
            $scope.webpath = '';
            $scope.encode = '';
            $scope.orderObj = obj;
        }
        if ($scope.orderObj.id < 0) {
            modal_alert("订单ID错误");
            return false;
        }
        if (!$scope.failureCause) {
            modal_alert("请输入反馈结果");
            return false;
        }
        $('.modal-tips').modal('hide');
        $('.modal_cue').modal('show');
        $('.solve_modal').modal('hide');
        $http.get('/member/Order/solve?id=' + $scope.causeId + '&back=' + $scope.failureCause+'&webpath='+encodeURIComponent($scope.webpath)+'&encode='+$scope.encode+'&protocol='+$scope.protocol,{headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}}).success(function (data) {
            $scope.beginInfo = data;
            $('.modal_cue').modal('hide');
            if (data.statusCode == 200) {
                $('.solve_modal').modal('hide');
                $scope.orderObj.orderstatus = 4;
                //$scope.order.submitData(false,0);
                modal_alert(data.message);
                modal_confirm(data.message,function(){
                    window.location.reload();
                })
            } else {
                if(obj){
                    test_confirm(data.message,function(){
                            setTimeout(function(){
                                $scope.beginService(2);
                            },100);
                        },function(){
                            $('.analytic_method').modal('show')
                        }
                        ,{yes:'重新检测',no:'查找问题'});
                }else{
                    if(!data.message)data.message = '未检测到上链信息';
                    $('.modal-tips').find('.text-info').html(data.message);
                    $('.modal-tips').modal('show');
                }
            }
        })

    }
    $scope.onchain=function(obj){
        $('.analytic_method').modal('hide')
        if(obj){
            $scope.webpath = '';
            $scope.encode = '';
            $scope.orderObj = obj;
        }
        if ($scope.orderObj.id < 0) {
            modal_alert("订单ID错误");
            return false;
        }
        $('.modal-tips').modal('hide');
        $('.modal_cue').modal('show');
        $http.post('/member/Order/onchain?id=' + $scope.orderObj.id+'&webpath='+encodeURIComponent($scope.webpath)+'&encode='+$scope.encode+'&protocol='+$scope.protocol,{headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}}).success(function (data) {
            $scope.beginInfo = data;
            $('.modal_cue').modal('hide');
            if (data.statusCode == 200) {
                if(data.message != '操作成功'){
                    $('.upper-chain-tw').modal('show');
                }else{
                    $('.upper-chain').modal('show');
                }
                $scope.orderObj.orderstatus = 4;
            } else {
                if(obj){
                    test_confirm(data.message,function(){
                            setTimeout(function(){
                                $scope.beginService(1);
                            },100);
                        },function(){
                            $('.analytic_method').modal('show')
                        }
                        ,{yes:'重新检测',no:'查找问题'});
                }else{
                    $('.modal-tips').modal('show');
                }
            }
        });
    }
	$(document).on('click','.close-btn',function(){
		window.location.reload()
	})
    //$scope.previewAd = function(key){
    //    $scope.previewArr = $scope.order.orderData[key];
    //}

    //$scope.clearWhere = function(){ //清空所有搜索条件
    //    $scope.order.data.stime = $scope.order.data.etime = $scope.order.data.search = $scope.stime = $scope.etime = '';
    //    $scope.order.data.status = 0; $scope.order.data_type = '所有';
    //    $('.Wdate').val('')
    //}
    //$scope.clearWhere();
    $scope.$watch('stime', function (old, news) {
        $scope.watchTime();
    });
    $scope.$watch('etime', function (old, news) {
        $scope.watchTime();
    });
    $scope.watchTime = function () {
        if (($scope.stime && $scope.etime) || (!$scope.stime && !$scope.etime && $scope.order.scrollDisabled)) {
            $scope.order.stime = $scope.stime;
            $scope.order.etime = $scope.etime;
            $scope.order.submitData(false, 0);
        }
    }
    
    $scope.$watch('endstime', function (old, news) {
        $scope.watchTime2();
    });
    $scope.$watch('endetime', function (old, news) {
        $scope.watchTime2();
    });
    $scope.watchTime2 = function () {
        if (($scope.endstime && $scope.endetime) || (!$scope.endstime && !$scope.endetime && $scope.order.scrollDisabled)) {
            $scope.order.endstime = $scope.endstime;
            $scope.order.endetime = $scope.endetime;
            $scope.order.submitData(false, 0);
        }
    }

    $(function () {

        $(document).on('click', '.copys', function () {
            var con = $(this).siblings().find('.copya').text();
            //modal_alert("<p>当前浏览器不支持该复制方法，请按Ctrl+c复制，Ctrl+v粘贴</p>"+ww);
            $('.copymodal').modal('show');
            $('.copymodal .copytext textarea').val(con)

        })
		$scope.copyCode = function () {
	        var textCode = $(".copymodal .copytext textarea")
	        textCode.select();
	        document.execCommand("Copy");
	        //modal_alert("复制成功")
	        $scope.ok = true;
	
	    }
//      $(document).on('click', '.copycode', function () {
//          $('.copymodal').modal('hide')
//      })
//
//      function setcopy(btn, con) {
//
//          var clip = new ZeroClipboard.Client();
//          clip.setHandCursor(true);
//          clip.setText(con);
//          clip.glue(btn);
//
//          clip.addEventListener("complete", function () {
//              $('.copymodal').modal('hide');
//              modal_alert("复制成功！");
//          });
//
//
//          $(document).on('click', function () {
//              clip.reposition();
//              $(window).scrollTop(0)
//          })
//
//      }

    })

    $scope.ref = function () {
        window.location.href="/member/order/indexsell.htm"
    }

    var status = getQueryString('status')
    if(status){
        $scope.order.data.px = 1
        $scope.order.data.status = status
        $scope.order.submitData(false,0);
    }
})