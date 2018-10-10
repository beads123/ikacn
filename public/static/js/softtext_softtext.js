app.controller('ctrlArea',function($scope,$http,approve){

	$scope.soft = res;
	$scope.parameter = {
		px:1,
		pz:page.pz,
		status:'',
		search:''
	}
	$scope.page = page.num_page
	$scope.scrollDisabled = false  //滚动条
	$scope.approve = approve

	$scope.changeStatus = function(str){
		if(str ==	$scope.parameter.status)return
		$scope.parameter.status = str
		$scope.parameter.px= 1
		$scope.list()
	}
	$scope.seachWeb = function(){
		$scope.parameter.search = $scope.webString
		$scope.parameter.px= 1
		$scope.list()
	}


	$scope.editGoods = function (item) {
		location.href = memberUrl("/softtext/editsofttextsell",{gid:item.gid});
	}

	$scope.shelves = function(gid,s,$index){
		if(s == '下架'){
			modal_confirm('确认下架出售的软文？',function(){
				$scope.update_state(gid,s,$index)
			})
		}else{
			$scope.update_state(gid,s,$index)
		}
	}
	$scope.update_state = function(gid,s,$index){
        $http.post("/member/goods/upDownState", {gid: gid,state:s}).success(function (data) {
            
            if (data.statusCode == 200) {
				$scope.soft[$index].sellstatus = s
            }else if(data.statusCode == 508){
                $(".modal-auth").modal("show")
            }else{
            	modal_alert(data.message)
            }
        })
	}
	$scope.del= function (gid, $index) {
        modal_confirm("确定要删除吗？", function () {
            $http.post("/member/softtext/del", {gid: gid}).success(function (data) {
				modal_alert(data.message)
                if (data.statusCode == 200) {
                    $scope.soft.splice($index, 1)
                }
            })
        })
	}


	$scope.list = function () {
		$http.post("/member/softtext/softtext", $scope.parameter).success(function (data) {
			$scope.page = data.page.num_page;
			if (data.statusCode == 200) {
				if ($scope.parameter.px == 1) {
					$scope.page_max = data.page.num_page
					$scope.soft = data.res
				} else {
					if (data.res.length > 0) {
						for (var g in data.res) {
							$scope.soft.push(data.res[g])
						}
					}
				}
				if ($scope.parameter.px >= data.page.num_page) { //如果当前页面大于等于总页面，那么禁用滚动
					$scope.scrollDisabled = true;
					return false;
				}
			} else {
				modal_alert(data.message)
			}
			$scope.scrollDisabled = false
		}, function () {
		})
	}
	$scope.loadMore = function () {
        if ($scope.scrollDisabled) {
            return false
        }
		if($scope.parameter.px < $scope.page){
			$scope.parameter.px += 1
			$scope.list()
		}else{
			$scope.scrollDisabled = true
		}
    }
	
//	去认证
	$scope.go_auth = function(){
        $(".checkwebsite").modal("show")
        $scope.approve.web_url = findGoods.weburl;
        $scope.approve.webWid = $scope.web_wid
        $scope.approve.getApproveInfo()
    }
//	自动发布
	$scope.releaseInfo = {
		gid : $scope.releaseGid,
		apiurl : $scope.apiurl
	}
	
	$scope.auto_sl = function(){
		if($scope.apiurl){
			
			$scope.apiurls = encodeURIComponent($scope.apiurl)
		}
		$('.modal_loading .modal_time_text').text('检测中')
    	$('.modal_loading').modal('show')
		$http.post("/member/goods/auto_release",{gid:$scope.releaseGid,apiurl:$scope.apiurls}).success(function(data){
			$('.modal_loading').modal('hide')
			if(data.statusCode==200){
				console.log(data)
				if(data.message=='取消自动发布成功'){
					$scope.soft[$scope.release_index].auto_release = 2
				}else{
					$scope.soft[$scope.release_index].auto_release = 1
				}
				$('.autochain').modal('hide')
				$scope.apiurl = ''
				modal_alert(data.message)
			}else{
				modal_alert(data.message)
			}
		})
	}
	
	$scope.autochain = function(val,index){
		$scope.releaseGid = val.gid
		$scope.release_index = index
		$scope.webname = val.webname;
		if(val.auto_release==2){
			$('.autochain').modal('show')
		}else{
			$scope.releaseInfo.gid = $scope.releaseGid
			$scope.auto_sl()	
		}
	}
	
	$scope.sure_sl = function(){
		$scope.releaseInfo.gid = $scope.releaseGid
		if(!$scope.apiurl){
			modal_alert('请填写地址')
			return false;
		}
		$scope.releaseInfo.apiurl = $scope.apiurl
		$scope.auto_sl()
	}
	
	
})