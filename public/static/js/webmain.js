app.controller('articleControl',function($scope,$http,common,$rootScope) {
    $rootScope.common = common;
    $rootScope.common.getCart();  // 1友链  2图文
});

	
