app.controller("ctrlArea",function($scope,$http,qrcodeLogin){
    $scope.isLoginType = 'password'; //登录方式：qrcode二维码，password密码登录
    $scope.qrLogin = qrcodeLogin;

    $scope.isLoginTypeFun = function(key){
        $scope.isLoginType = key
        $scope.qrLogin.closeOpen();
        if(key == 'qrcode'){
            $scope.qrLogin.isOpen();
        }
    }

    $scope.error = {
        account:'',
        password:'',
        verfiyCode:false
    }
    $scope.error_verfiy = false;
    $scope.autoLogin = true;
    $scope.account = '';
    $scope.password = '';
    $scope.autoFun = function(){
        $scope.autoLogin = $scope.autoLogin?false:true;
    }
    $scope.changeAccount = function() {
        if ($scope.account=='') {
            $scope.error.account = '请输入帐号';
            return false;
        } else {
            $scope.error.account = '';
            return true
        }
    }
    $scope.changePass = function(){
        if($scope.password==''){
            $scope.error.password = '请输入密码';
            return false;
        }else{
            $scope.error.password = '';
            return true;
        }
    }
    $scope.beginLogin = function(obj){
        var ac = $scope.changeAccount();
        var pa = $scope.changePass();
        if(!obj)return;
        if(ac && pa) {
            var geetest_challenge = $('input[name=geetest_challenge]').val();
            var geetest_validate = $('input[name=geetest_validate]').val();
            var geetest_seccode = $('input[name=geetest_seccode]').val();
            if(!geetest_challenge || !geetest_validate || !geetest_seccode){
                showVerfiyMsg();
                return;
            }
            var arg = {
                account:$scope.account,password:$scope.password,autologin:$scope.autoLogin,
                geetest_challenge:geetest_challenge,geetest_validate:geetest_validate,geetest_seccode:geetest_seccode
            }
            $http.get(memberUrl('user/logined',arg)).success(function(data){
                if(data.statusCode!=200){
                    if(obj)obj.reset();
                }
                switch(data.statusCode){
                    case 200:
                        window.location.href = referer;
                        break;
                    case 508:
                        showVerfiyMsg();
                        break;
                    default :
                        $scope.error.account= data.message
                        break;
                }
            }).error(function(error){
                httpError(error);
            })
        }
    }
    var showVerfiyMsg = function(){
        $("#notice")[0].className = "help-block text-red has-icon-error";
        setTimeout(function () {
            $("#notice")[0].className = "hidden";
        }, 2000);
    }
    var handlerEmbed = function (captchaObj) {
        $("#embed-submit").click(function (e) {
            var validate = captchaObj.getValidate();
                if (!validate) {
                    showVerfiyMsg();
                    e.preventDefault();
                } else {
                    $scope.beginLogin(captchaObj);
                }
        });
        // 将验证码加到id为captcha的元素里，同时会有三个input的值：geetest_challenge, geetest_validate, geetest_seccode
        captchaObj.appendTo("#embed-captcha");
        captchaObj.onReady(function () {
            $("#wait")[0].className = "hidden";
        });
        captchaObj.on
        // 更多接口参考：http://www.geetest.com/install/sections/idx-client-sdk.html
    };
    $http.get(indexUrl('Geetest/getverfiy',{t:(new Date()).getTime()})).success(function(data){
        initGeetest({
            gt: data.gt,
            challenge: data.challenge,
            new_captcha: data.new_captcha,
            product: "embed", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
            offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
            // 更多配置参数请参见：http://www.geetest.com/install/sections/idx-client-sdk.html#config
        }, handlerEmbed);
    }).error(function(error){
        httpError(error);
    });
})
