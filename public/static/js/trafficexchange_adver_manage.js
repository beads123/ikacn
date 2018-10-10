app.controller("ctrlArea", function ($scope, $http) {
  $scope.data = ''
  $scope.parmas = {}
  $scope.getInfo = function(){
		$http.post('/member/Trafficsales/total_advert',$scope.parmas).success(function(data){
			if(data.statusCode == 200){
        $scope.data = data.data
			}else{
				modal(data.message)
			}
		})
	} 
  $scope.getInfo()

  $scope.ad_type = function(str){
    if(str == 1){
      return '文字广告'
    }else{
      return '图片广告'
    }
  }
  $scope.change_type = function(str){
    $scope.parmas.status = str
    $scope.getInfo()
  }

  // $scope.detail = function(item){
  //   $('.seeflow2').modal('show')
  //   $http.post('/member/Trafficsales/getAdvertDetails',{adid:item.id}).success(function(data){
  //     console.log(data)
  //   })
  // }

  $scope.del = function(id,index){
    modal_confirm('确认删除该广告吗？',function(){
      $http.post('/member/Trafficsales/delSoftAdvert',{adid:id}).success(function(data){
        modal_alert(data.message)
       if(data.statusCode == 200){
         $scope.data.splice(index,1)
       }
      })
    })
   
  }
 
  $scope.edit = function(id,type){
    if(type == 1){
      window.location.href  = '/member/trafficexchange/editfontad?id=' + id
    }else{
      window.location.href  = '/member/trafficexchange/editpicad?id=' +  id
    }
  }

  $scope.showEdit = function(item){
    if(item.is_pay == "流量交换展示"){
      if(item.status == '未通过' || item.status == '暂停'){
        return true
      }else{
        return false
      }
    }else{
     return false
    }
  }

  $scope.showDel = function(item){
    if(item.is_pay == "流量交换展示"){
      if(item.status == '未通过' || item.status == '暂停'){
        return true
      }else{
        return false
      }
    }else{
      if(item.status == '未通过'){
        return true
      }else{
        return false
      }
    }
  }


  
  


  
})