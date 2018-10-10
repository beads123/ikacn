app.controller('ctrlArea',function($scope,$http,incorder){
    $scope.order  = incorder;
    $scope.orderData = orderData;
    $scope.because = '';//申请故障原因
    $scope.orderObj = varData; //订单对象类型
    //打开申请故障窗口
    $scope.openWindow = function(obj,cls){
        $scope.orderObj = obj;
        $('.'+cls).modal('show');
    }
    //申请故障
    $scope.solve = function(){
        if($scope.orderObj.id<0){
            modal_alert("订单ID错误");
            return false;
        }
        if(!$scope.because){
            modal_alert("请选择您的申请理由");
            return false;
        }
        $http.get('/member/Order/faultApply?id='+$scope.orderObj.id+'&because='+$scope.because).success(function(data){
            if(data.statusCode==200){
                modal_alert("申请故障提交成功，请耐心等待卖家处理！");
                $('.apply-fault').modal('hide');
                $scope.orderObj.orderstatus = 5;
            }else{
                modal_alert(data.message);
            }
        })
    }
    //重新购买
    $scope.reBuy = function(obj){
        if(!obj)return false;
        var st = obj.orderstatus;
        if(obj.orderstatus==6||obj.orderstatus==7){
            st = '6,7';
        }
        var url = replaceArg(o_status.list[st][0]['重新购买'],[obj.no]);
        $http.get(url).success(function(data){
            var r = {'友情链接':'/goods/submit_order','图片广告':'/goods/submit_order','文字广告':'/goods/submit_order'};
            var url1 = indexUrl(r[obj.goods_type]);
            switch (data.statusCode){
                case 200:
                    window.location.href = url1;
                    break;
                case 501:
                    modal_confirm(data.message,function(){
                        window.location.href = url1;
                    },false,{yes:'查看购物车'})

                    break;
                default :
                    modal_alert(data.message);
                    break;
            }
        }).error(function(error){
            httpError(error);
        })

    }
    //设置申请故障原因
    $scope.setBecause = function(str){
        $scope.because = str;
        if(str==0){
            $scope.because = '提前下链（不退款）';
        }
    }
    //打开关闭订单窗口
    $scope.closeOrder = function(obj){
        $scope.orderObj = obj;
        if($scope.orderObj.id<0){
            modal_alert("订单ID错误");
            return false;
        }
        modal_confirm('确认关闭这个订单吗',function(){
            $http.get('/member/Order/dropOrder?id='+$scope.orderObj.id).success(function(data){
                if(data.statusCode==200){
                    $('.del-account').modal('hide');
                    $scope.orderObj.orderstatus = 8;
                    modal_alert("订单已关闭");
                }else{
                    modal_alert(data.message);
                }
            })
        },false)

    }

    $scope.$watch('stime', function(old, news){
            $scope.watchTime();
    });
    $scope.$watch('etime', function(old, news){
            $scope.watchTime();
    });
    $scope.watchTime = function(){
        if(($scope.stime && $scope.etime) || (!$scope.stime && !$scope.etime && $scope.order.scrollDisabled)){
            $scope.order.stime = $scope.stime;
            $scope.order.etime = $scope.etime;
            $scope.order.submitData(false,1);
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
            $scope.order.submitData(false, 1);
        }
    }
	
	
	
    $scope.autoRenew = function(oid,key){
        if(!oid)return false;
        $http.get(memberUrl('/order/autoRenew',{id:oid})).success(function(data){
            if(data.statusCode == 200){
                if(key)$scope.orderData[key].renew = data.data.renew;
                if(data.data.renew == 1){
                	modal_alert('选择自动续费功能服务时，在您余额充足的情况下，我们将在您的订单到期后自动逐月续费这笔订单，商品价格修改或下架则会续费失败！');
                }else{
                	modal_alert('您已经取消自动续费')
                }
            }else{
                modal_alert(data.message);
            }
        }).error(function(error){
            httpError(error);
        })
    }
    $scope.delorder = function(no){
        if(!no)return false;
        modal_confirm("确认删除该订单吗？",function(){
            $http.get(memberUrl('/order/delorder',{no:no})).success(function(data){
                modal_alert(data.message);
                $scope.order.submitData(false,1);
            }).error(function(error){
                httpError(error);
            })
        })       
    }

    var status = getQueryString('status')
    if(status){
        $scope.order.data.status = status
        $scope.order.submitData(false,1);
    }
    //$scope.previewAd = function(){
    //    $('.previewAd').modal('show');
    //}


})