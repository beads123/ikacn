app.controller("ctrlArea",function($scope,$http,$timeout){

    var initError = function(){
        $scope.verfiyMsginfo = 0;
        $scope.isRegister = false;
        var error = {
            phone:'',
            ver:'',
            pass:'',
            password:''
        }
        return error;
    }
	
    $scope.error = initError();
    $scope.isRegister = false;
    $scope.serviceTerm = false;
    $scope.serviceTermFun = function(){
        $scope.serviceTerm = $scope.serviceTerm?false:true;
        $scope.changeArg();
    }
    $scope.regData = {
        phone:'',ver:'',pass:'',password:''
    };
    
    var getinvite = getParameter('inviter');
	
	if(getinvite){
		$scope.regData.inviter = getinvite;
	}
    
    $scope.timeoutInfo = '发送验证码';
    $scope.timeout = 60;
    $scope.isRegister = false;//注册按钮状态是否可以注册
    $scope.changeArg = function(f){
        $scope.error = initError();
        if(!preg.mobile.test($scope.regData.phone) && f==1){
            $scope.error.phone = '请输入正确的手机号码';
            return false;
        }
        if(f==1){
            verfiyPhone();
        }
        if($scope.regData.ver.length!=6 && f==2){
            $scope.error.ver = '验证码不正确';
            return false;
        }
        if(isNaN($scope.regData.ver) && f==2){
            $scope.error.ver = '验证码只能是6位数字';
            return false;
        }
        if($scope.regData.pass.length < 6 && f==3){
            $scope.error.pass = '请填写6位以上的密码';
            return false;
        }
        if($scope.regData.password.length < 6 && f==4){
            $scope.error.password = '请填写6位以上的密码';
            return false;
        }
        if(!$scope.serviceTerm){
            $scope.error.password = '需要同意条款才能继续注册';
            return false;
        }
        if($scope.regData.password != $scope.regData.pass &&(f==3 || f==4)){
            $scope.error.password = '两次密码不一致';
            return false;
        }
        if($scope.regData.inviter){
        	if($scope.regData.inviter.length > 6 && f==5){
	            $scope.error.inviter = '邀请码需小于6位数';
	            return false;
	        }
        }
        
        if(f){
            $scope.isRegister = true;
            return true;
        }
        return false;
    }
    var verfiyPhone = function(){
        $http.post(memberUrl('/user/verifi_phone'),{phone:$scope.regData.phone}).success(function(data){
            if(data.statusCode==200){
                $scope.error.phone = '';
            }else{
                $scope.error.phone = data.message;
            }
        }).error(function(error){
            httpError(error);
        })
    }
    $scope.verfiyMsginfo = 0;
    $scope.verfiyMsg = function(){
        if($scope.error.ver==''){
            return 1
        }else{
            if($scope.verfiyMsginfo==200) {
                return 3;
            }else{
                return 2;
            }
        }
    }
    var interval;
    $scope.verifysure = function(){
    	
		$scope.verifysi = $scope.verify;
		console.log($scope.verifysi);
		$('.verifybox').modal('hide')
    }
//  $scope.getVerfiy = function(){
//  	$scope.verify = ''
//  	if($scope.regData.phone == ''){
//  		return false;
//  	}
//  	if($scope.error.phone!=''){
//          return false;
//      }
//  	if($('.send-code').hasClass('btn-disabled')){
//  		return false;
//  	}
//  	var isvery = $('#isveryfy').attr('value');
//  	console.log(isvery)
//  	if(isvery == 1){
//  		$('.verifybox').modal('show');
//  	}else{
//  		$scope.sendVerfiy()
//  	}
//  	
//  	$scope.getverify();
//  }
    
    $scope.sendVerfiy = function(){
        if($scope.error.phone!=''){
            return false;
        }
        if($scope.timeout!=60){
            $scope.verfiyMsginfo = 0;
            $scope.error.ver = $scope.timeoutInfo;
            return false;
        }
        if($scope.regData.phone.length!=11){
            return false;
        }           
        $scope.errorMsg = '';
        $http.post(memberUrl('/sms/add'),{mobile:$scope.regData.phone,type:1,codecaptche:$scope.verify}).success(function(data){    
        	switch(data.statusCode){
        		case 200:
        		if(data.code == 539){
            		$scope.timeoff = data.message.substr(0,2)
            		console.log($scope.timeoff)
            	}
        		$('.verifybox').modal('hide');
        		$scope.verify = '';
        		if($scope.timeoff){
					$scope.timeout = $scope.timeoff
				}else{
					$scope.timeout = 60;
				}
        		$scope.verfiyMsginfo = data.statusCode;
	            $scope.error.ver = data.message;
	            timeoutFun();
        		break;
        		case 538:
        		$('.verifybox').modal('show');
        		$scope.getverify();
        		break;
        		case 537:
        		$scope.errorMsg = '验证码错误';
        		$scope.getverify();
        		break;
        		default:
        		$scope.errorMsg = '验证码错误';
        		$scope.getverify();
        		break;
        	}
            
        }).error(function(error){
            httpError(error);
        })
    }
    
    var timeoutFun = function(){
    	
        $scope.timeout-- ;
        $scope.timeoutInfo = $scope.timeout+'秒重新获取';
        interval = $timeout(function(){
            if($scope.timeout<=0){
                $scope.timeout = 60;
                $timeout.cancel(interval);
                $scope.timeoutInfo = '重新发送';
            }else{
                timeoutFun();
            }
        },1000);
    }
    $scope.verfiyImg = '';
    $scope.getverify = function(){
    	$scope.verfiyImg = memberUrl('/user/getcaptcha',{v:Math.random(0,1)});
    }
	
    $scope.register = function(){
        if($scope.changeArg(1) && $scope.changeArg(2) && $scope.changeArg(3) && $scope.changeArg(4) && $scope.changeArg(5)){
            $http.post(memberUrl('/user/registerEd'),$scope.regData).success(function(data){
                if(data.statusCode == 200){
                    modal_confirm('注册成功',function(){
                        window.location.href = memberUrl('/user/login');
                    },false,{yes:'现在去登录',no:'hide'})
                }else{
                	if(data.message == '验证码有误'){
                		$scope.error.ver = data.message;
                	}else{
                		$scope.error.password = data.message;
                	}
                    
                }
            }).error(function(error){
                httpError(error);
            })
        }else{
        	console.log($scope.error.password)
        	if(!$scope.error.password){
        		$scope.error.password = '请填写完整信息';
        	}
            
        }
    }
    

})
//获取验证码图片
    