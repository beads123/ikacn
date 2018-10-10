app.controller("ctrlArea", function ($scope, $http, $filter) {  

	$scope.pormas = {
		status:'',
		ispay:''
	}
	$scope.getInfo = function(status,ispay,str){
		if(status){
			$scope.pormas.status = status
		}
		if(ispay){
			$scope.pormas.ispay = ispay
		}
		if(str == 'status'){
			$scope.pormas.status = ''
		}else if(str == 'ispay'){
			$scope.pormas.ispay  = ''
		}
		$http.post('/member/trafficsales/getFlowGoods',$scope.pormas).success(function(data){
			if(data.statusCode == 200){
				$scope.goods = data.data.goods //广告位
				$scope.count = data.data.count
			}else{
				modal(data.message)
			}
		})
	} 
	$scope.getInfo()

	

	$scope.copy_success = false
//  广告代码
	$scope.adv_code = function(item){
		$scope.codes = item.script
		$scope.copy_success = false
		$('.copytextss').modal('show')
	}
	$scope.copyCode = function () {
        var textCode = $(".copytextss .copytext textarea");
        textCode.select();
        document.execCommand("Copy");
        $scope.copy_success = true;

    }
	
	//删除
	$scope.del = function(id,index){
		modal_confirm('确认删除该广告位吗？',function(){
			$http.post('/member/Trafficsales/delSoftGoods',{gid:id}).success(function(data){
			  if(data.statusCode  == 200){
					$scope.goods.splice(index,1)
				}else{
					modal_alert(data.message)
				}

			})
		})
	}

 // 开启
 $scope.openGoods = function (item) {
	$http.post("/member/Trafficexchange/chackExchange", { gid: item.id }).success(function (data) {
			if (data.statusCode == 200) {
					$http.post("/member/Trafficexchange/upGoodsStatus", { id: item.id, status: 2 }).success(function (data) {

							if (data.statusCode == 200) {
									item.status = '开启'
									modal_alert(data.message)
							} else {
									$(".open-failure").modal("show")
							}


					})
			} else {
					//              modal_alert(data.message);
					if (data.message == '未检测到广告代码，请确认加入后重试') {
							modal_alert('开启失败，无法检测到您插入的代码，请先确认代码无误后，再次点击【开启】验证，如无法开启请联系客服！')
					} else {
							modal_alert(data.message)
					}
			}
	})
}

//  暂停
$scope.stop = function(item){
	modal_confirm('暂停后，广告将不再进行投放 !',function(){
		$http.post('/member/Trafficexchange/upGoodsStatus',{status:1,id:item.id}).success(function(data){
			if(data.statusCode == 200){
			item.status =  '暂停'
			}else{
				modal_alert(data.message)
			}
		})
	})
}

// 编辑
$scope.check_adname = false

$scope.edit = function(item,index){
	$scope.adname = item.adname
	if(item.ispay == "流量出售/交换"){
		$('input[name = "traffic_sell"]').prop('checked',true)
		$('input[name = "traffic_change"]').prop('checked',true)
	}else if(item.ispay == "流量出售"){
		$('input[name = "traffic_sell"]').prop('checked',true)
	}else{
		$('input[name = "traffic_change"]').prop('checked',true)
	}
	$scope.item = item;
	$scope.index = index;
	$('.edit').modal('show');
}
$scope.check_str = function(data){
	if(data){
		if(getLength(data)  < 6 || getLength(data) > 20 ){
			$scope.check_adname= true
		}else{
			$scope.check_adname = false
		}
	}else{
		$scope.check_adname= true
	}
	

}


$scope.save = function(){
	// ispay 1流量出售/交换，2流量交换，3流量出售
	var t1 = $('input[name = "traffic_sell"]').prop('checked') 
	var t2 = $('input[name = "traffic_change"]').prop('checked')
	var ispay,pay_str	
	if(t1){
		ispay = 3
		pay_str = '流量出售'
	}
	if(t2){
		ispay = 2;
		pay_str = '流量交换'
	}
	if( t1 && t2){
		ispay = 1
		pay_str ='流量出售/交换'
	}

	if($scope.check_adname)return false;
	$http.post('/member/Trafficsales/editGoods',{gid:$scope.item.id,adname:$scope.adname,ispay:ispay}).success(function(data){
		modal_alert(data.message)
		if(data.statusCode == 200){
				$scope.goods[$scope.index].adname = $scope.adname;
				$scope.goods[$scope.index].ispay = pay_str;
				$('.edit').modal('hide')		
		}else{
		
		}
	})


}





	
})


