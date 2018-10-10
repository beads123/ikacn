app.controller('articleControl',function($scope,$http,common,$rootScope) {
	$rootScope.common=common;
	$rootScope.common.getCart();
	$scope.list = list;


//	最新收录
	$scope.newlist = {};
	$scope.newList = function(){
		$http.post('/index/Index/NewIncluded').success(function(data){
		
			$scope.newlist = data
		})
		
	}
	$scope.newList();
});	
$(function(){
})
	
