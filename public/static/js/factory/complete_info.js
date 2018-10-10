// 完善个人信息
app.factory('complete_info', function ($http) {
    var obj = {}
    obj.isComplete_info = false
    obj.check_user = function (go_urlStr) {
        if(go_urlStr){
            obj.url = go_urlStr
        }
        $http.post("/member/goods/checkData").success(function (data) {
            if (data.statusCode == 200) {
                obj.userInfo = data.data
                if (obj.userInfo.qq == "" || obj.userInfo.phone == "") {
                    obj.isComplete_info = false
                    $(".person").modal("show")
                } else {
                    obj.isComplete_info = true
                    if(go_urlStr){
                        window.location.href = go_urlStr
                    }
                }
            }else{
                modal_alert(data.message)
            }    
        })
    }


    //   保存个人资料
    obj.siveEdit = function () {
        if (obj.can_submit) {
            return
        }
        if (obj.userInfo.phone == "" && obj.userInfo.qq == "" && obj.userInfo.email == "") {
            $http.post('/member/goods/savedata', { phone: obj.phone, qq: obj.qq, email: obj.email, verify: obj.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    obj.isComplete_info = true
                    if(obj.url){
                        window.location.href = obj.url
                    }else{
                        modal_alert(data.message)
                    }
                    $(".person").modal("hide")
                          
                } else {
                    obj.isComplete_info = false
                    modal_alert(data.message)
                }
            })
        } else if (obj.userInfo.phone != "" && obj.userInfo.qq == "" && obj.userInfo.email == "") {
            $http.post('/member/goods/savedata', { qq: obj.qq, email: obj.email }).success(function (data) {
                if (data.statusCode == 200) {
                    obj.isComplete_info = true
                    if(obj.url){
                        window.location.href = obj.url
                    }else{
                        modal_alert(data.message)
                    }
                    $(".person").modal("hide")
                
                } else {
                    obj.isComplete_info = false
                    modal_alert(data.message)
                }
            })
        } else if (obj.userInfo.phone == "" && obj.userInfo.qq != "" && obj.userInfo.email == "") {
            $http.post('/member/goods/savedata', { phone: obj.phone, email: obj.email, verify: obj.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    obj.isComplete_info = true
                    if(obj.url){
                        window.location.href = obj.url
                    }else{
                        modal_alert(data.message)
                    }
                    $(".person").modal("hide")
                   
                } else {
                    obj.isComplete_info = false
                    modal_alert(data.message)
                }
            })

        } else if (obj.userInfo.phone == "" && obj.userInfo.qq == "" && obj.userInfo.email != "") {
            $http.post('/member/goods/savedata', { phone: obj.phone, qq: obj.qq, verify: obj.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    obj.isComplete_info = true
                    if(obj.url){
                        window.location.href = obj.url
                    }else{
                        modal_alert(data.message)
                    }
                    $(".person").modal("hide")
                   
                } else {
                    obj.isComplete_info = false
                    modal_alert(data.message)
                }
            })
        } else if (obj.userInfo.phone != "" && obj.userInfo.qq == "" && obj.userInfo.email != "") {
            $http.post('/member/goods/savedata', { qq: obj.qq }).success(function (data) {
                if (data.statusCode == 200) {
                    obj.isComplete_info = true
                    if(obj.url){
                        window.location.href = obj.url
                    }else{
                        modal_alert(data.message)
                    }
                    $(".person").modal("hide")
                   

                } else {
                    obj.isComplete_info = false
                    modal_alert(data.message)
                }
            })
        } else if (obj.userInfo.phone == "" && obj.userInfo.qq != "" && obj.userInfo.email != "") {
            $http.post('/member/goods/savedata', { phone: obj.phone, verify: obj.verify }).success(function (data) {
                if (data.statusCode == 200) {
                    obj.isComplete_info = true
                    if(obj.url){
                        window.location.href = obj.url
                    }else{
                        modal_alert(data.message)
                    }
                    $(".person").modal("hide")
                   
                } else {
                    obj.isComplete_info = false
                    modal_alert(data.message)
                }
            })
        }
    }

    obj.can_submit = true
    obj.check_str = function (str, val) {

        // obj[str]  =
        switch (str) {

            case 'name':
                if (val) {
                    if (getLength(val) > 20 || getLength(val) < 6) {

                        obj['is' + str] = false
                        obj.can_submit = false
                    } else {
                        obj.can_submit = true
                        obj['is' + str] = true

                    }
                } else {
                    obj['is' + str] = false
                }
                break;
            case 'url':
                if (val) {
                    if (val.indexOf('http') > -1) {
                        obj.can_submit = true
                        obj['is' + str] = true
                    } else {
                        obj.can_submit = false
                        obj['is' + str] = false
                    }
                } else {
                    obj['is' + str] = false
                }
                break;
            case 'adname':  //广告名称
                if (val) {
                    if (getLength(val) > 16) {

                        obj.can_submit = false
                        obj['is' + str] = false
                    } else {
                        obj.can_submit = true
                        obj['is' + str] = true
                    }
                } else {
                    obj['is' + str] = false
                }
                break;
            case 'weburl':
                if (val) {
                    if (preg.wurl.test(val)) {
                        obj.can_submit = false
                        obj['is' + str] = false
                    } else {
                        obj.can_submit = true
                        obj['is' + str] = true
                    }
                } else {
                    obj['is' + str] = false
                }
                break;
            case 'phone':
                if (val) {
                    if (preg.mobile.test(val)) {
                        obj.can_submit = false
                        obj['is' + str] = false
                    } else {
                        obj.can_submit = true
                        obj['is' + str] = true
                    }
                } else {
                    obj['is' + str] = false
                }
                break;
            case 'qq':
                if (val) {
                    if (preg.qq.test(val)) {
                        obj.can_submit = false
                        obj['is' + str] = false
                    } else {
                        obj.can_submit = true
                        obj['is' + str] = true
                    }
                } else {
                    obj['is' + str] = false
                }
                break;
            case 'email':
                if (val) {
                    if (preg.email.test(val)) {
                        obj.can_submit = false
                        obj['is' + str] = false
                    } else {
                        obj.can_submit = true
                        obj['is' + str] = true
                    }
                } else {
                    obj['is' + str] = false
                }
                break;
        }
    }


    // 发送验证码
    obj.authCode = function () {
        obj.timeNum = 59
        if ((preg.mobile.test(obj.phone)) || obj.userInfo.phone != "") {
            if (obj.userInfo.phone == "") {
                $http.post("/member/Sms/add", { mobile: obj.phone, type: 1 }).success(function (data) {

                    if (data.statusCode == 200) {
                        $("#timeCount").removeClass("hidden")
                        $("#getCode").addClass("hidden")
                        // 验证码倒计时
                        int = setInterval(function () {
                            obj.timeNum--
                            $("#d-sec").text(obj.timeNum)
                            if (obj.timeNum <= 0) {
                                $("#getCode").removeClass("hidden")
                                $("#timeCount").addClass("hidden")
                                obj.msg = ""
                                $("#d-sec").text('')
                                clearInterval(int)
                            }
                        }, 1000)
                    } else {
                        obj.msg = data.message
                        setTimeout(function () {
                            obj.msg = ''
                        }, 2000);
                    }
                })
            } else {

                $http.post("/member/Sms/add", { mobile: obj.userInfo.phone, type: 1 }).success(function (data) {
                    if (data.statusCode == 200) {
                        $("#timeCount").removeClass("hidden")
                        $("#getCode").addClass("hidden")
                        // 验证码倒计时
                        int = setInterval(function () {
                            obj.timeNum--
                            $("#d-sec").text(obj.timeNum)
                            if (obj.timeNum <= 0) {
                                $("#getCode").removeClass("hidden")
                                $("#timeCount").addClass("hidden")
                                obj.msg = ""
                                $("#d-sec").text('')
                                clearInterval(int)
                            }
                        }, 1000)
                    } else {
                        obj.msg = data.message
                        setTimeout(function () {
                            obj.msg = ''
                        }, 2000);
                    }
                })
            }

        } else {
            //    $scope.btnDisabled = true     
        }

    }

    return obj
})

