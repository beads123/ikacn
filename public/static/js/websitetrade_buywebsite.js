app.controller('ctrlArea', function ($scope, $http) {
    $scope.trade = res
    $scope.counts=counts
    $scope.data = {};
    $scope.data.px = 1 //页数
    $scope.data.pz = 15 // 每页条数
$scope.types = ["全部","未付款","交接中","申诉中","交易取消","交易完成","待交接"]

   //实例化时间戳
    $scope.formatDate = function (time) {
        if (!time) return;
        return new Date(time * 1000).format('yyyy-MM-dd hh:mm')
    }
  //1未付款2交易关闭3交接中4申诉中5交接完成6订单结算7交易取消
   $scope.show_status = function(num){
        switch (num){
            case 1:
            return '未付款'
            break;
            case 2:
            return '交易取消'
            break;
            case 3:
            return '交接中'
            break;
            case 4:
            return '申诉中'
            break;
            case 5:
            return '交易完成'
            break;
            case 6:
            return '交易完成'
            break;
            case 7:
            return '交易取消'
            break;
            case 8:
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
         }else if ($scope.status == 1) {
              $scope.data.status=1
         }else if ($scope.status == 2) {
              $scope.data.status=3
         }else if ($scope.status == 3) {
              $scope.data.status=4
         }else if ($scope.status == 4) {
              $scope.data.status= 8
         }else if ($scope.status == 6) {
              $scope.data.status= 10
         }else {
             $scope.data.status= 9
         }
        $http.post('/member/websitetrade/buywebsite', $scope.data).success(function (data) {

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
       $scope.sindex = index;
        $scope.id = id;
        $scope.typeS=type
    }
    $scope.sure_appeal = function(){
        $http.post('/member/websitetrade/AppealState',{gid:$scope.id,message:$scope.message,type:$scope.typeS,model:2}).success(function(data){
            if(data.statusCode == 200){
               if ($scope.typeS == 1) {
                $scope.trade[$scope.sindex].orderstatus = 4
                  $scope.trade[$scope.sindex].appealt_user =1
                }else{
                    $scope.trade[$scope.sindex].orderstatus = 3
                 }
            }else{
                modal_alert(data.message)
            }
        })
    }



//对接完成
 $scope.over_web = function(gid,index){
    $scope.over_gid = gid
    $scope.index = index
    $('.handover').modal('show')

 }
 $scope.sure_over = function(){
        $http.post('/member/websitetrade/transferWebsiteOrder',{gid:$scope.over_gid}).success(function(data){
            if(data.statusCode == 200){
                 $scope.trade[$scope.index].orderstatus = 5
            }else{
                modal_alert(data.message)
            }
        })
 }


//删除
   $scope.delete = function(gid,index){
    $scope.delete_gid = gid
    $scope.delete_index = index
    $('.del_web').modal('show')

 }
 $scope.sure_delete = function(){
        $http.post('/member/websitetrade/dellOrder',{gid:$scope.delete_gid}).success(function(data){
            if(data.statusCode == 200){
                $scope.trade.splice($scope.delete_index,1)
            }else{
                modal_alert(data.message)
            }
        })
 }

  


})

