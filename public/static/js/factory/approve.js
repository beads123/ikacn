app.factory("approve", function ($http) {
    var obj = {}
    //  网站认证
    // 网站认证  代码2 文件1

    obj.codeIndex = 2  //验证类型
    // 获取网站认证需要  网站wid   ---obj.webWid
    // 获取网站认证信息
    obj.getApproveInfo = function () {
        $http.post("/member/Account/getmete", { wid: obj.webWid }).success(function (data) {
            obj.appData = data
            obj.appCode = data.meta
        })
    }

    // 复制认证代码
    obj.copyCode = function () {
        var textCode = $("#textCode")
        textCode.select();
        document.execCommand("Copy");
        modal_alert("代码已经成功复制")
    }

    // 开始网站认证  upSrt :上架接口   cb 认证回调  成功：success  失败 :fail
    obj.webApprove = function (cb,upStr, wid, gid, web_url) {
        if(!web_url){
            web_url = obj.web_url
        }
        obj.startApprove = function(){
            obj.loading =1;
		    obj.up_data = '网站认证中';
            $('.modal_loading').modal('show')
            var webcheckInfo = {
                wid: obj.webWid,
                type: obj.codeIndex,
                gid: gid
            }
            if (wid) {
                webcheckInfo.wid = wid
            }
    
            $http({
                url: '/member/Account/webcheck',
                data: webcheckInfo,
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function (obj) {
                    var str = [];
                    for (var o in obj)
                        if (obj[o]) str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                    return str.join("&");
                }
            }).success(function (data) {
                $('.modal_loading').modal('hide')
                if (data.statusCode == 200) {
                    if(cb){
                        cb('success')
                    }
                    $('.authen_success').modal("show")
                    if (upStr) {
                        //上架
                        $http.post(upStr, { wid: wid, gid: gid, status: '上架' }).success(function (data) {
    
                        })
                    }
                } else {
                    if(cb){
                        cb('fail')
                    }
                    $('.authen_lose').modal('show');      // 失败
                }
            }, function () { })
           }
       
       if(web_url){
            
        $http.post('/member/Account/getcheck',{url:web_url}).success(function(data){
            if(data.statusCode == 200){
                //   200已经认证过
                modal_confirm( web_url + ' 已经有认证出售，您的网站认证通过后，会下架原来卖家的所有商品。',function(){
                    obj.startApprove(); 
                })             
            }else{
                obj.startApprove();
            }
        })
       }      
    }
    // 重新认证
    obj.reAuth = function () {
        $(".checkwebsite").modal("show")
    }

    return obj

})


