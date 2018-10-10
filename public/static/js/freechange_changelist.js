app.controller('ctrlArea', function ($scope, $http) {
    // 我申请1 被申请 2
    $scope.data_list = []
    $scope.apply = {}
    $scope.apply.type = 1
    $scope.apply.px = 1
    $scope.apply.search = ''
    $scope.apply.pz = 10
  	$scope.sl_status = ["全部","对方未上链", "对方已上链", "对方拒绝交换","自己未上链","自己已上链"];
  
  
    $scope.formatDate = function (time) {
        if (!time) return;
        return new Date(time * 1000).format('yyyy-MM-dd hh:mm')
    }
	
	
	$scope.status = 0;
    $scope.changetype = function (k) {
        $scope.status= k
       	$scope.getSearchData()
    }
	
	
    var o_gid = getQueryString('gid'), o_type = getQueryString('type'),o_wid = getQueryString('wid')

   
    $scope.link_order = function (o_type) {
        $http.get('/member/freechange/changelist?type=' + o_type + '&gid=' + o_gid + '&wid=' + o_wid + "&px=" + $scope.apply.px + "&pz="+ $scope.apply.pz +  "&search=" + $scope.apply.search+ "&status=" + $scope.status).success(function (data) {
            if (data.statusCode == 200) {
                $scope.data_list = data.res
                $('.listpage').createPage({
                    pageCount : data.page.num_page,
                    current :  $scope.apply.px,
                    total : data.page.num_rows,
                    showTotal : true,
                    showInput : true,
                    backFn : function(p){
                        $scope.$apply(function(){
                            $scope.apply.px = p;
                            $scope.link_order($scope.apply.type)
                        })
                    }
                })

            } else {
                modal_alert(data.message)
            }
        })
    }
    $scope.getSearchData = function(){
        $scope.apply.px = 1;
        if (o_gid && o_type && o_wid){
            $scope.link_order($scope.apply.type)
        }else{
            $scope.getData();
        }
       
    }

  

  
    if (o_gid && o_type && o_wid) {
        $scope.apply.type = o_type
        $scope.apply.px = 1
        $scope.link_order(o_type)
    }
    $scope.getData = function () {
        if (o_gid && o_type && o_wid) {
            return
        }  
        $http.get(' /member/freechange/changelist?type=' + $scope.apply.type + "&px=" + $scope.apply.px + "&search=" + $scope.apply.search + "&pz=" + $scope.apply.pz + "&status=" + $scope.status).success(function (data) {
            if (data.statusCode == 200) {
                $scope.data_list = data.res
                $('.listpage').createPage({
                            pageCount : data.page.num_page,
                            current :  $scope.apply.px,
                            total : data.page.num_rows,
                            showTotal : true,
                            showInput : true,
                            backFn : function(p){
                                $scope.$apply(function(){
                                    $scope.apply.px = p;
                                    $scope.getData()
                                })
                            }
                        })
                

            } else {
                modal_alert(data.message)
            }
            $scope.scrollDisabled = false;

        })
    }
    $scope.getData()
    $scope.free_status = function (str, status,type) {
        if (str == 2) {
        	if(type == 2){
        		return '取消交换'
        	}else{
        		return '拒绝交换'
        	}
            
        } else {
            if (status == 2) {
                return '已上链'
            } else {
                return '未上链'
            }
        }
    }

    // type  1我申请  2被申请 
    $scope.show_handle = function (item, str, type) {
        var tStr = 'my'
        // if (type == 1) {
        //     tStr = 'my'
        // } else {
        //     tStr = 'op'
        // }
        switch (str) {
            case '上链接':
                if (item[tStr + '_status'] != 2) {
                    return true
                } else {
                    return false
                }
                break;
            case '下链接':
                if (item[tStr + '_status'] == 2) {
                    return true
                } else {
                    return false
                }
                break;
            case '取消':
                if (type == 1) {
                    if (item[tStr + '_status'] != 2 && item.op_status != 2) {
                        return true
                    } else {
                        return false
                    }

                } else {
                    return false
                }
                break;
            case '详情':
                return true
                break;
            case '拒绝':
                if (type == 2) {
                    if (item.my_status != 2) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }

                break;
        }

    }
    $scope.type_str = ''
    $scope.order_oid = ''
    $scope.can_del = true
    // 删除订单   或者 拒绝订单 
    $scope.delete = function (oid, type, index, str) {
        $scope.can_del = false
        $scope.str = str
        $scope.order_oid = oid
        $scope.order_index = index
        $('.reasonbox').modal('show')
        type == 1 ? $scope.type_str = 'buy' : $scope.type_str = 'sell'
    }
    $scope.sure_dl = function () {
        $http.post('/member/freechange/del_mforder', { oid: $scope.order_oid, type: $scope.type_str, back: $scope.reject_str }).success(function (data) {
            $scope.reject_str = ''
            $scope.can_del = true
            if (data.statusCode == 200) {
                $scope.data_list.splice($scope.order_index, 1)
            } else {
                modal_alert(data.message)
            }
        })
    }

    // 上下链
    // 上链接传2、下链接传3
  
    $scope.upOrDown = function (oid, type, index, num) {
    
        var str = ''
        type == 1 ? str = 'buy' : str = 'sell';
        if(num == 2){
        	// if(o_wid){
        	// 	$scope.up_oid = o_wid;
        	// }else{
        	// 	$scope.up_oid = oid;
            // } 
            $scope.up_oid = oid;         
            $scope.up_type = type;
            $scope.up_index = index;
            $scope.up_num = num
            $scope.up_str = str
            $(".modal_cue").modal('show')
        }
        $http.post('/member/freechange/link_mforder', { oid: oid, type: str, status: num }).success(function (data) {
          
            $(".modal_cue").modal('hide')
            if (data.statusCode == 200) {   
                    $scope.data_list[index].my_status = num
                   
                if(num == 2){
                    $(".modal_cue").modal('hide'); //上链接                
                }               
            } else {
               if(num == 2){
                $(".modal_cue").modal('hide')  
                $scope.up_err = data.message;
                $('.detection').modal('show') //重新检测
               }else{              	
                 modal_alert(data.message)
               }             
            }
           
        })
    }

    // 重新检测
    $scope.re_detection = function(){
        // $('.detection').modal('hide');
        $(".modal_cue").modal('show')
        // $('.modal-backdrop').remove()
        // $scope.upOrDown($scope.up_oid,$scope.up_type,$scope.up_index,$scope.up_num);
        $http.post('/member/freechange/link_mforder', { oid: $scope.up_oid, type: $scope.up_str, status: $scope.up_num }).success(function(data){
           setTimeout(function(){
            if(data.statusCode == 200){         
                $(".modal_cue").modal('hide')
                $scope.data_list[$scope.up_index].my_status = 2
            }else{
                $scope.up_err = data.message;
                $('.detection').modal('show')
                $(".modal_cue").modal('hide')
            }
        }, 350);

        })

    }
	$scope.backdrop = function(){
		$('.modal-backdrop').remove()
	}

    // 详情  getdetails   oid type
    $scope.getDetails = function (oid, type) {
        $('.changedetail').modal('show')
        var str = ''
        type == 1 ? str = 'buy' : str = 'sell';
        $http.post('/member/freechange/getdetails', { oid: oid, type: str }).success(function (data) {
            $scope.order_details = data
        })
    }
    
   

    
    $scope.change_type = function (num) {
        if (o_gid && o_type && o_wid) {
            $scope.apply.type = num
            $scope.link_order(num)
        } else {
           
            if ($scope.apply.type == num) {
                return
            } else {
                $scope.apply.type = num
                $scope.apply.px = 1
                $scope.getData()
            }  
        }

    }

    var type = getQueryString('type')
    if(type){
        $scope.apply.type = type;
        $scope.getData();
    }

})
$(function(){
	$('.modal-backdrop').last().hide()
})
