app.controller("ctrlArea",function($http,$scope){

    $scope.show_style = userInfo[0].show_style
    $scope.auto_accept = userInfo[0].auto_accept
   
	$scope.isCheck1=true;
	$scope.isCheck2=true;
	if(userInfo[0].price == 0)$scope.isCheck1 = false;
	if(userInfo[0].price_qz == 0)$scope.isCheck2 = false;
    
    $scope.accept = function(num){
    	$scope.auto_accept = num;
    }
    $scope.style = function(num){
    	$scope.show_style = num;
    }
    
    $scope.priceArr = {
    	price:{p:userInfo[0].price,v:'首页',isCheck:$scope.isCheck1},
    	price_qz:{p:userInfo[0].price_qz,v:'全站',isCheck:$scope.isCheck2},
    }
    $scope.change = function(k){
    	$scope.priceArr[k].isCheck = $scope.priceArr[k].isCheck?false:true; 	
    }
    
  	$scope.can_save = true;
    $scope.saveEdit = function(){
		if(!$scope.can_save){
			return false
		}
    	if(!$scope.auto_accept){
	    	modal_alert('请选择是否自动接单');
	    	return false;
	    }
	    if(!$scope.show_style){
	    	modal_alert('请选择显示风格');
	    	return false;
	    }
	    if($scope.priceArr.price.isCheck == false && $scope.priceArr.price_qz.isCheck == false){
	    	modal_alert('请至少选择一个价格');
	    	return false;
	    }
    	if($scope.priceArr.price.isCheck == false){
    		$scope.priceArr.price.p = 0;
    	}else{
    		if($scope.priceArr.price.p < 2){
    			modal_alert('友链的价格最低2元')
        		return false;
    		}
    	}
    	if($scope.priceArr.price_qz.isCheck == false){
    		$scope.priceArr.price_qz.p = 0;
    	}else{
    		if($scope.priceArr.price_qz.p < 2){
    			modal_alert('友链的价格最低2元')
        		return false;
    		}
    	}
    	$scope.can_save = false
        $http.post("/goods/upFriend",{gid:userInfo[0].gid,price:$scope.priceArr.price.p,price_qz:$scope.priceArr.price_qz.p,show_style:$scope.show_style,auto_accept:$scope.auto_accept}).success(function(data){	
			modal_confirm(data.message,function(){
				window.location.href = memberUrl("goods/friendgoods")
			},function(){
			},{no:'hide'})	
        })
	}

	
})