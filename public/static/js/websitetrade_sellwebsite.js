app.controller('ctrlArea', function ($scope, $http,approve) {
    $scope.approve = approve;
    $scope.trade = res;
    $scope.counts=counts;
    $scope.data = {};
    $scope.data.px = 1 ;//页数
    $scope.data.pz = 15 ;// 每页条数
/*    $scope.types = ["全部","待审核","出售中","交接中","已售出","下架","待结算","未通过"];*/
$scope.types = ["全部","待审核","未通过","出售中","下架","交接中","申诉中","待结算","交易完成","未认证","待交接"]

    //实例化时间戳
    $scope.formatDate = function (time) {
        if (!time) return;
        return new Date(time * 1000).format('yyyy-MM-dd hh:mm')
    }
  
   $scope.show_status = function(num){
        switch (num){
            case 1:
            return '待审核'
            break;
            case 2:
            return '未通过'
            break;
            case 3:
            return '出售中'
            break;
            case 4:
            return '下架'
            break;
            case 5:
            return '交接中'
            break;
            case 6:
            return '申诉中'
            break;
            case 7:
            return '待结算'
            break;
            case 8:
            return '交易完成'
            break;
            case 9:
            return '待交接'
            break;
        }
    }

    $scope.status = 0;
    $scope.changetype = function (k) {
        $scope.status= k
       $scope.submitData()
    }

     //1:未审核 2:未通过 3出售中 4下架 5交接中 6申诉中7待结算8已完成  ["全部","待审核","出售中","交接中","已售出","下架","待结算","未通过"]
    $scope.submitData = function (t) {

        if (!t) $scope.data.px = 1;
        if ($scope.status == 0) {
             $scope.data.status = ''
         }else{
             $scope.data.status=$scope.status
         }
         
        $http.post('/member/websitetrade/sellwebsite', $scope.data).success(function (data) {

            if (data.statusCode == 200) {
             
                if ($scope.data.px == 1) { //如果是第一页，那么把变量重新赋值
                    $scope.trade = data.data;
                } else {//否则把返回的结果累加进变量里面
                    if (data.data.length > 0) {
                        for (var g in data.data) {
                            $scope.trade.push(data.data[g]);
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
        })
    }

 $scope.loadMore = function () {
        if ($scope.scrollDisabled) return false;
        $scope.scrollDisabled = true;
        $scope.data.px += 1;
        $scope.submitData(true);
    }
 
  /*申诉，   type   1申诉 2取消申诉*/
     $scope.appeal_modal = function(id,index,type){

      if (type == 1) {
        $(".complaints").modal('show')
      }else{
        $(".cancel_ss").modal('show')
      }
       $scope.index = index;
        $scope.id = id;
        $scope.typeS=type
    }
    $scope.sure_appeal = function(){
        $http.post('/member/websitetrade/AppealState',{gid:$scope.id,message:$scope.message,type:$scope.typeS,model:1}).success(function(data){
            if(data.statusCode == 200){
               if ( $scope.typeS == 1) {
              $scope.trade[$scope.index].status = 6
                $scope.trade[$scope.index].appealt_user=2
                 }else{
                     $scope.trade[$scope.index].status = 5
                 }
            }else{
                modal_alert(data.message)
            }
        })
    }


    // 下架      type 1下架  2上架 
    $scope.downGoods = function (id, index,type) {
        if (type == 1) {
          $(".shelves_web").modal("show")
          $scope.dowmsg="下架"
        }else{
          $(".up_shang").modal("show")
           $scope.dowmsg="上架"
        }
        $scope.index = index
        $scope.id = id
        $scope.dtype=type
    }

    $scope.sureDown = function () {
        $http.post("/member/websitetrade/upDownState", {gid:$scope.id,state:$scope.dowmsg }).success(function (data) {
        
            if (data.statusCode == 200) { 
                if ( $scope.dtype == 1) {
              $scope.trade[$scope.index].status = 4
                 }else{
                     $scope.trade[$scope.index].status = 3
                 }
            } else {
                modal_alert(data.message)
            }
        })
    }


    // 新增网站交易
    $scope.sellchange = function () {
        $http.post("/member/goods/checkData").success(function (data) {
            $scope.userInfo = data.data

            if (data.statusCode == 200) {
                if (data.data.phone != "" && data.data.qq != "") { //手机号 和 QQ号是否为空         
                    location.href = memberUrl("/websitetrade/addwebsite")
                } else {
                    $(".person").modal("show")
                }
            }
        })
    }

   $scope.delete = function(gid,index){

    $scope.delete_gid = gid
    $scope.delete_index = index
    $('.del_web').modal('show')

 }
 $scope.sure_delete = function(){
        $http.post('/member/websitetrade/dellState',{gid:$scope.delete_gid}).success(function(data){
            if(data.statusCode == 200){
                $scope.trade.splice($scope.delete_index,1)
            }else{
                modal_alert(data.message)
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
                    location.href = memberUrl("/websitetrade/addwebsite")
                } else {
                    modal_alert(data.message)
                }

            })
        } else if ($scope.userInfo.phone != "" && $scope.userInfo.qq == "" && $scope.userInfo.email == "") {
            $http.post('/member/goods/savedata', { qq: $scope.qq, email: $scope.email, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    location.href = memberUrl("/websitetrade/addwebsite")
                } else {
                    modal_alert(data.message)
                }
            })
        } else if ($scope.userInfo.phone == "" && $scope.userInfo.qq != "" && $scope.userInfo.email == "") {
            $http.post('/member/goods/savedata', { phone: $scope.phone, email: $scope.email, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    location.href = memberUrl("/websitetrade/addwebsite")
                } else {
                    modal_alert(data.message)
                }
            })

        } else if ($scope.userInfo.phone == "" && $scope.userInfo.qq == "" && $scope.userInfo.email != "") {
            $http.post('/member/goods/savedata', { phone: $scope.phone, qq: $scope.qq, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    location.href = memberUrl("/websitetrade/addwebsite")
                } else {
                    modal_alert(data.message)
                }
            })
        } else if ($scope.userInfo.phone != "" && $scope.userInfo.qq == "" && $scope.userInfo.email != "") {
            $http.post('/member/goods/savedata', { qq: $scope.qq, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    location.href = memberUrl("/websitetrade/addwebsite")
                } else {
                    modal_alert(data.message)
                }
            })
        } else if ($scope.userInfo.phone == "" && $scope.userInfo.qq != "" && $scope.userInfo.email != "") {
            $http.post('/member/goods/savedata', { phone: $scope.phone, verify: $scope.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    location.href = memberUrl("/websitetrade/addwebsite")
                } else {
                    modal_alert(data.message)
                }
            })
        }
    }

 $scope.checkweb = function () {
        $('.checkwebsite').modal('show');
    }
    
    $scope.approve_web = function (item, index) {
        $scope.index = index;
        $(".checkwebsite").modal("show");
        $scope.approve.web_url = item.url  
        $scope.approve.webWid = item.wid
        $scope.approve.getApproveInfo()
    }

    
    $scope.callBack = function(data){
        if(data == 'success'){
            $scope.trade[$scope.index].validate = 3
        }
    }
	
	  $scope.bargainMsg= function (gid,index) {
        $scope.bargainindex=index
        $http.post('/member/websitetrade/bargainMsg',{gid:gid}).success(function(data){
            if(data.statusCode == 200){
                $scope.bargain=data.data
                $('.barga_modal').modal('show')
            }else{
                modal_alert(data.message)
            }
        })

      }
  $scope.solvebargain={}
   $scope.howBargain=function(type,gid,how){
      $scope.solvebargain.bid=gid
      $scope.solvebargain.type=type
      $scope.bargainHow=how
      if ( $scope.solvebargain.type == 2) {
         $('.Refused_bargain').modal('show')
      }else{
         $('.js_bargain').modal('show')
      }
   }
  
    $scope.toBargain=function(){
         $http.post('/member/websitetrade/toBargain',$scope.solvebargain).success(function(data){
            if(data.statusCode == 200){
                  $scope.trade[$scope.bargainindex].bargainCount  = $scope.trade[$scope.bargainindex].bargainCount -1
                modal_alert(data.message)
            }else{
                modal_alert(data.message)
            }
        })
    }

	/*$(function(){
		$(document).on('click','.bargaining',function(){
			$('.barga_modal').modal('show')
		})
		$(document).on('click','.Refused_btn',function(){
			$('.Refused_bargain').modal('show')
		})
	})*/
	
	$scope.setRenderOk = function(){
		$('[data-toggle="tooltip"]').tooltip({   // 有宽高限制
			'html': true,
	        'trigger': 'hover'  // 默认hover
	      })
	}
	
//开始交接
 $scope.begin_web = function(gid,index){
    $scope.over_gid = gid
    $scope.index = index
    $('.bengin').modal('show')

 }

 $scope.sure_begin_web = function(){
        $http.post('/member/websitetrade/beginWebsiteOrder',{gid:$scope.over_gid}).success(function(data){
            if(data.statusCode == 200){
                 $scope.trade[$scope.index].status = 5
            }else{
                modal_alert(data.message)
            }
        })
 }

})

