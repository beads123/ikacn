app.controller('articleControl',function($scope,$http,common,$rootScope,qrcodeLogin) {
  $scope.isLoginType = 'password'; //登录方式：qrcode二维码，password密码登录
  $scope.zxzx = true;
  $scope.dsds = false;
  $scope.jzjz = false;
  $scope.cycy = false;
  $scope.qrLogin = qrcodeLogin;

  $scope.isLoginTypeFun = function(key){
    $scope.isLoginType = key
    $scope.qrLogin.closeOpen();
    if(key == 'qrcode'){
      $scope.qrLogin.isOpen();
    }
  }

  $rootScope.common = common;
  $rootScope.common.getCart();  // 1友链  2图文
  //$rootScope.catNum = $scope.common.itemNum;

  $scope.zzzx_more_url = 'news';

  $scope.accountError = '';
  $scope.passwordError = '';
  $scope.checkError = '';
  $scope.autoLogin = true;
  $scope.autoFun = function(){
    $scope.autoLogin = $scope.autoLogin?false:true;
  }

  $scope.articleClick = function(index){
    $scope.zxzx = false;
    $scope.dsds = false;
    $scope.jzjz = false;
    $scope.cycy = false;
  
    if(index == 1) {
      $scope.zxzx = true;
      $scope.zzzx_more_url = 'news';
    }
    if(index == 2) {
      $scope.dsds = true;
      $scope.zzzx_more_url = 'bizs';
    }
    if(index == 3) {
      $scope.jzjz = true;
      $scope.zzzx_more_url = 'web';
    }
    if(index == 4) {
      $scope.cycy = true;
      $scope.zzzx_more_url = 'start';
    }
  }

  $scope.beginLogin = function(obj){
    if(!$scope.account) return $scope.accountError = '*请输入帐户';
    if(!$scope.password) return $scope.passwordError = '*请输入密码';
    //if(!$scope.verfiyCode) return $scope.checkError = '*请输入验证码';
    var geetest_challenge = $('input[name=geetest_challenge]').val();
    var geetest_validate = $('input[name=geetest_validate]').val();
    var geetest_seccode = $('input[name=geetest_seccode]').val();
    if(!geetest_challenge || !geetest_validate || !geetest_seccode){
      showVerfiyMsg();
      return;
    }
    if(!obj)return;
    var arg = {
      account:$scope.account,password:$scope.password,autologin:$scope.autoLogin,
      geetest_challenge:geetest_challenge,geetest_validate:geetest_validate,geetest_seccode:geetest_seccode
    }
    $http.get(memberUrl('/user/logined',arg)).success(function(data){
      if(data.statusCode!=200){
        if(obj)obj.reset();
      }
      switch(data.statusCode){
        case 200:
          window.location.href = '/';
          break;
        case 501:
          $scope.accountError = data.message;
          break;
        case 502:
          $scope.passwordError = data.message;
          break;
        case 508:
          showVerfiyMsg();
          break;
        default :
          $scope.checkError = data.message;
          break;
      }
    }).error(function(error){
      httpError(error);
    })
  }
  $scope.enterUp = function(e){ //回车事件
    $scope.accountError = '';
    $scope.passwordError = '';
    $scope.checkError = '';

    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13){
        //$scope.beginLogin();
      $("#embed-submit").trigger('click');
    }
  }

  var showVerfiyMsg = function(){
    $("#notice")[0].className = "banner-login-tips";
    $("#notice1").hide();
    setTimeout(function () {
      $("#notice1").show();
      $("#notice")[0].className = "hidden";
    }, 2000);
  }
  var handlerEmbed = function (captchaObj) {
    $("#embed-submit").click(function (e) {
      var validate = captchaObj.getValidate();
      if (!validate) {
        showVerfiyMsg();
        e.preventDefault();
      }else{
        $scope.beginLogin(captchaObj);
      }
    });
    // 将验证码加到id为captcha的元素里，同时会有三个input的值：geetest_challenge, geetest_validate, geetest_seccode
    captchaObj.appendTo("#embed-captcha");
    captchaObj.onReady(function () {
      if(wait[0]){
        $("#wait")[0].className = "hidden";
      }
    });
    //captchaObj.on
    // 更多接口参考：http://www.geetest.com/install/sections/idx-client-sdk.html
  };
  var wait = $("#wait");
  if(wait[0]) {
    $http.get(indexUrl('/Geetest/getverfiy', {t: (new Date()).getTime()})).success(function (data) {
      initGeetest({
        gt: data.gt,
        challenge: data.challenge,
        new_captcha: data.new_captcha,
        product: "embed", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
        offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
        // 更多配置参数请参见：http://www.geetest.com/install/sections/idx-client-sdk.html#config
      }, handlerEmbed);
    }).error(function (error) {
      httpError(error);
    });
  }



});