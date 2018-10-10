app.controller("ctrlArea",function($scope,$http){

    $scope.data = {}
    $scope.data.px = 1 //页数
    $scope.data.pz = 10 // 每页条数
    $scope.scrollDisabled  = false
    $scope.package = []
   
    $scope.listData = function(){
        $http.post("/member/package/index",$scope.data).success(function(data){
          
            if(data.statusCode == 200){
                if($scope.data.px == 1){ //如果是第一页，那么把变量重新赋值
                    $scope.package = data.data;
                }else{//否则把返回的结果累加进变量里面
                    if(data.data.length > 0){
                        for(var g in data.data){
                            $scope.package.push(data.data[g]);
                        }
                    }
                }
                if($scope.data.px >= data.page.num_page){ //如果当前页面大于等于总页面，那么不可以禁用滚动
                    $scope.scrollDisabled = true;
                    return false;
                }
            }else{
                modal_alert(data.message)
            }
            $scope.scrollDisabled = false;
            
        })
    }
    $scope.listData()

    // 加载更多

    $scope.loadMore = function(){
       
        if($scope.scrollDisabled)return false;
        $scope.scrollDisabled = true;
        $scope.data.px += 1;
        $scope.listData()
       
    }

    $scope.state = function(status){
        if(status == 1){
            return "待审核"
        }else if(status == 2){
            return "上架"

        }else if(status == 3){
            return "下架"
        }else{
            //4
            return "未通过"
        }
    } 

    // 查看套餐
    $scope.look_combo = function(id){
        // $scope.combo_info = item
      
        $http.get("/member/package/see_pack?id=" + id ).success(function(data){
           
            if(data.statusCode == 200){
                $('.see_modal').modal('show');
                $scope.combo_info = data.res
            }else{
                modal_alert(data.message)
            }
        })
       
    }

//   商品下架
 $scope.downGoods = function(id,index){
    $('.package_xj').modal('show');
    $scope.down_id = id
    $scope.down_index = index

 }
//  确定下架1
 $scope.sureDown = function(){
     $http.post("/member/package/sxj_status",{id:$scope.down_id,status:3}).success(function(data){    
         if(data.statusCode == 200){
            modal_alert(data.message)
            $scope.package[$scope.down_index].status = 3     
         }else if(data.statusCode == 501){
             $(".package_xj2").modal("show")
         }else{
            modal_alert(data.message)
         }
       
     })

 }

 $scope.sureDown2 = function(){
    $http.post("/member/package/sxj_status",{id:$scope.down_id,status:3,fit:1}).success(function(data){
        modal_alert(data.message)
        if(data.statusCode == 200){
           $scope.package[$scope.down_index].status = 3

        } 
    })

}

 
//  上架
 $scope.upGoods = function(id,index){
    $http.post("/member/package/sxj_status",{id:id,status:2}).success(function(data){
     
        if(data.statusCode == 200){
            $scope.package[index].status = 2
            if(data.price){
                $scope.package[index].price = data.price;
            }
        }
       
        modal_alert(data.message)

    })
 }
    

//  删除套餐
$scope.del_goods = function(id,index){
  $http.post("/member/package/drop",{id:id}).success(function(data){
     
      modal_alert(data.message)
    if(data.statusCode == 200){
        $scope.package.splice(index,1)
    }
  })
}
// 1待审核 2上架 3下架4 未通过
// 选择友链状态 (0:所有 1待审核 2上架 3下架4 未通过)    
$scope.goods_status = 0 // 默认所有
$scope.choice_state = function(str){
    $scope.goods_status = str
}


// 筛选
$scope.show_goods = function(status){
  if($scope.goods_status == 0){
      return true
  }else{
      if($scope.goods_status == status){
          return true
      }else{
          return false
      }
  }
}

// 点击添加套餐
$scope.add_goods = function(){
    $http.post("/member/goods/checkData").success(function (data) {
        $scope.userInfo = data.data
      
        if (data.statusCode == 200) {
            if( data.data.phone != "" && data.data.qq != ""){ //手机号 和 QQ号是否为空    
                $http.post("/member/package/getPackWeb", $scope.getUrl).success(function (data) {
               
                    if(data.statusCode == 200){
                        if(data.data.length > 0){
                            window.location.href = memberUrl("/package/addpackage")
                        }else{
                            modal_alert("当前没有上架状态的友链，无法添加套餐")
                        }
                    }else{
                        modal_alert(data.message)
                    }
                })
            } else {

                $(".person").modal("show")
            }
        }
    })   
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
            if(data.statusCode == 200){
                modal_alert(data.message)
                location.href = memberUrl("/package/addpackage")
            }else{
                modal_alert(data.message)
            }
        })
    } else if ($scope.userInfo.phone != "" && $scope.userInfo.qq == "" && $scope.userInfo.email == "") {
        $http.post('/member/goods/savedata', { qq: $scope.qq, email: $scope.email, verify: $scope.verify }).success(function (data) {
            if(data.statusCode == 200){
                modal_alert(data.message)
                location.href = memberUrl("/package/addpackage")
            }else{
                modal_alert(data.message)
            }
        })
    } else if ($scope.userInfo.phone == "" && $scope.userInfo.qq != "" && $scope.userInfo.email == "") {
        $http.post('/member/goods/savedata', { phone: $scope.phone, email: $scope.email, verify: $scope.verify }).success(function (data) {
            if(data.statusCode == 200){
                modal_alert(data.message)
                location.href = memberUrl("/package/addpackage")
            }else{
                modal_alert(data.message)
            }
        })

    } else if ($scope.userInfo.phone == "" && $scope.userInfo.qq == "" && $scope.userInfo.email != "") {
        $http.post('/member/goods/savedata', { phone: $scope.phone, qq: $scope.qq, verify: $scope.verify }).success(function (data) {
            if(data.statusCode == 200){
                modal_alert(data.message)
                location.href = memberUrl("/package/addpackage")
            }else{
                modal_alert(data.message)
            }
        })
    } else if ($scope.userInfo.phone != "" && $scope.userInfo.qq == "" && $scope.userInfo.email != "") {
        $http.post('/member/goods/savedata', { qq: $scope.qq, verify: $scope.verify }).success(function (data) {
            if(data.statusCode == 200){
                modal_alert(data.message)
                location.href =memberUrl("/package/addpackage")
            }else{
                modal_alert(data.message)
            }
        })
    } else if ($scope.userInfo.phone == "" && $scope.userInfo.qq != "" && $scope.userInfo.email != "") {
        $http.post('/member/goods/savedata', { phone: $scope.phone, verify: $scope.verify }).success(function (data) {
            if(data.statusCode == 200){
                modal_alert(data.message)
                location.href = memberUrl("/package/addpackage")
            }else{
                modal_alert(data.message)
            }
        })

    }
}


})