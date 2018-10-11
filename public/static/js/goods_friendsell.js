app.controller("ctrlArea", function ($http, public, $scope, $cookieStore, approve) {

    $scope.public = public
    $scope.webWid = ''  // 网站的wid
    $scope.approve = approve

    $http.post("/goods/getFriendWeb").success(function (data) {
        $scope.checkWebList = data.data

    })
    //   // 从已有的网站中选择
    $scope.check_web = function () {
        $scope.checkEdit = true
        $scope.checkBySelf = false
        if ($scope.checkWebList.length > 0) {
            $('.chooseweb1').modal('show');
        } else {
            modal_alert("无可添加的网站")
        }
    }
    $scope.url_wid = getQueryString('wid');
    if ($scope.url_wid) {
        //alert($scope.url_wid)
    }


    $scope.isCheck1 = true;
    $scope.isCheck2 = false;

    $scope.priceArr = {
        price: { p: '', v: '首页', isCheck: $scope.isCheck1 },
        price_qz: { p: '', v: '全站', isCheck: $scope.isCheck2 },
    }
    $scope.change = function (k) {


        $scope.priceArr[k].isCheck = $scope.priceArr[k].isCheck ? false : true;

    }



    // 从已有的网站中选择网站
    $scope.is_check = {}
    $scope.checkWeb = function (item, k) {
        $scope.is_check = {}
        $scope.is_check[k] = true
        $scope.webWid = item.wid
        $scope.approve.webWid = item.wid
        $scope.listitem = item
    }

    // 确定添加
    $scope.addWeb = function () {
        $scope.webInfo = $scope.listitem
        if (!$('.addWeb li').hasClass('cur')) {
            modal_alert('未选择网站')
            return false;
        }
        if ($scope.webInfo) {
            $scope.checkEdit = false
            $scope.checkBySelf = true
        }
        $('.chooseweb1').modal('hide');
    }
    // 自己选择已有网站-取消
    $scope.cancalEdit = function () {
        $scope.checkEdit = true
        $scope.checkBySelf = false
    }

    // 进行下一步
    $scope.checkEdit = true  //自己编辑
    $scope.checkBySelf = false  //从已有的网站中选择 
    //  $scope.check_web = function () {
    //      $http.post("/goods/getFriendWeb").success(function (data) {
    //      	$scope.checkEdit = true
    //      	$scope.checkBySelf = false
    //          $scope.checkWebList = data.data
    //          if ($scope.checkWebList.length > 0) {
    //              $('.chooseweb1').modal('show');
    //          } else {
    //              modal_alert("无可添加的网站")
    //          }
    //      })
    //
    //
    //  }
    $scope.quxiao = function () {
        if (!$('.select_single').hasClass('checked')) {
            $scope.checkEdit = true
            $scope.checkBySelf = false
        } else {
            $scope.checkEdit = false
            $scope.checkBySelf = true
        }
    }
    $scope.nextByEdit = function () {
        if($scope.check_name)return;
        if ($scope.public.editOneCate) {
            var typeTwo = $scope.public.editweb.filter(function (item) {
                return item.name == $scope.public.editTwoCate
            });
        }

        if (!$scope.webName) {
            modal_alert("请输入网站名称")
            return
        } else if (!$scope.webUrl) {
            modal_alert("请输入网站域名")
            return

        } else if (!$scope.public.editOneCate) {
            modal_alert("请选择行业分类")
            return
        } else if ($scope.priceArr.price.isCheck == false && $scope.priceArr.price_qz.isCheck == false) {
            modal_alert('请至少选择一个价格');
            return false;
        }

        $scope.saveWebInfo = {
            name: $scope.webName,
            url: $scope.webUrl,
            sensitive_advertising: $('input:radio[name="editWeb"]:checked').val(),
            show_style: $('input:radio[name="fenge"]:checked').val(),
            auto_accept: $('input:radio[name="order"]:checked').val(),
            cid: typeTwo[0].id,
        }
        if ($scope.priceArr.price.isCheck == false) {
            $scope.priceArr.price.p = 0;
        } else {
            if ($scope.priceArr.price.p < 2) {
                modal_alert('友链的价格最低2元')
                return false;
            } else {
                $scope.saveWebInfo.price = $scope.priceArr.price.p
            }
        }
        if ($scope.priceArr.price_qz.isCheck == false) {
            $scope.priceArr.price_qz.p = 0;
        } else {
            if ($scope.priceArr.price_qz.p < 2) {
                modal_alert('友链的价格最低2元')
                return false;
            } else {
                $scope.saveWebInfo.price_qz = $scope.priceArr.price_qz.p
            }
        }

        // 自己编辑的网站
        $('.next_btn').attr('disabled', true).css('cursor', 'not-allowed')
        $http.post("/goods/addFriendWeb", $scope.saveWebInfo).success(function (data) {
            if (data.statusCode == 200) {
                $(".checkwebsite").modal("show")
                $scope.approve.web_url = $scope.webUrl
                $scope.approve.webWid = data.insert_wid
                $scope.approve.getApproveInfo()
                $('.next_btn').attr('disabled', false).css('cursor', 'pointer')
            } else {
                modal_alert(data.message)
                $('.next_btn').attr('disabled', false).css('cursor', 'pointer')
            }

        })
    }

    $scope.nextBySelf = function () {

        if ($scope.priceArr.price.isCheck == false && $scope.priceArr.price_qz.isCheck == false) {
            modal_alert('请至少选择一个价格');
            return false;
        }

        $scope.saveSelf = {
            wid: $scope.webInfo.wid,
            show_style: $('input:radio[name="fenge2"]:checked').val(),
            auto_accept: $('input:radio[name="order2"]:checked').val(),
        }

        if ($scope.priceArr.price.isCheck == false) {
            $scope.priceArr.price.p = 0;
        } else {
            if ($scope.priceArr.price.p < 2) {
                modal_alert('友链的价格最低2元')
                return false;
            } else {
                $scope.saveSelf.price = $scope.priceArr.price.p
            }
        }
        if ($scope.priceArr.price_qz.isCheck == false) {
            $scope.priceArr.price_qz.p = 0;
        } else {
            if ($scope.priceArr.price_qz.p < 2) {
                modal_alert('友链的价格最低2元')
                return false;
            } else {
                $scope.saveSelf.price_qz = $scope.priceArr.price_qz.p
            }
        }
        $('.next_btn').attr('disabled', true).css('cursor', 'not-allowed')
        $http.post("/goods/addFriend", $scope.saveSelf).success(function (data) {
            if (data.statusCode == 200) {
                if (data.validate == 2) {
                    $scope.approve.web_url = $scope.webInfo.url
                    $(".checkwebsite").modal("show")
                    $scope.approve.getApproveInfo()
                } else {
                    // modal_alert('网站已认证')
                    $('.friend_sj').modal('show')
                }
                $('.next_btn').attr('disabled', false).css('cursor', 'pointer')
            } else {
                if (data.message == '该网站已存在不能重复添加') {
                    modal_alert('该网站已存在不能重复添加，点击“从已添加的网站选择”按钮从已有网站列表中添加')
                } else {
                    modal_alert(data.message)
                }
                $('.next_btn').attr('disabled', false).css('cursor', 'pointer')
            }
        }).error(function (err) {

        })
    }


    // 继续出售
    $scope.re_sell = function () {
        document.location.reload();
        $scope.webName = ''
        $scope.webUrl = ''
        $scope.webPrice = ''
        $scope.selfPrice = ''
        $("input[type = 'radio'][name = 'editWeb']").eq(0).attr("checked", false)
        $("input[type = 'radio'][name = 'editWeb']").eq(0).attr("checked", true)
        $scope.public.editOneCate = ''
        $scope.public.editTwoCate = ''
        $scope.checkEdit = true
        $scope.checkBySelf = false
    }

    //域名失去焦点   
    $scope.checkwebsite = function () {
        var yz = preg.wurl.test($scope.webUrl)
        if (yz == false) {
            modal_alert('请输入正确的域名');
            return false;
        }

        $http.post('/goods/checkwebsite', { url: $scope.webUrl }).success(function (data) {
            if (data.statusCode == 200) {
            } else {
                modal_alert('<p class="text-red sbs">' + $scope.webUrl + '网站已经有认证出售，您网站认证通过后，会下架原来卖家的所有商品，您出售的商品会上架！</p>')
            }
        })
    }

    //	勾选自动上链

    $(document).on('click', 'label span.dagou', function () {
        if (!$(this).hasClass('blue-g')) {
            $(this).addClass('blue-g');
            $('.chain-set').modal('show');
        } else {
            $(this).removeClass('blue-g');
            $('.chain-set').modal('hide');
        }

    })

    //返回格式切换
    $scope.active = 1
    $scope.show = function (type) {
        $scope.active = type
    }

    $(document).on('click', '.cancel-chain', function () {
        $('.onchain input[type="checkbox"]').attr('checked', false)
    })

    //  语言切换
    $scope.language = function (type) {
        $scope.curr = type
    }


    //  $(document).on('click','.chain-set .weblanguage a',function(){
    //		$(this).addClass('active').siblings().removeClass('active');
    //	})
    // 取消认证-返回列表
    $scope.cal_auth = function () {
        window.location.href = memberUrl('/goods/friendgoods')
    }


    $(document).on('click', '.renzheng', function () {
        $(".checkwebsite").modal("show");
        $scope.approve.getApproveInfo();
    })

    $scope.getvl = function (name) {
        var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
        if (reg.test(location.href))
            return unescape(RegExp.$2.replace(/\+/g, " "));
        return "";
    };

    $scope.getUrlData = function () {
        var wid = $scope.getvl('wid')
        if (wid) {
            $http.post("/goods/getFriendWeb", { wid: wid }).success(function (data) {
                if (data.data.length > 0) {
                    $scope.webInfo = data.data[0]
                    if ($scope.webInfo) {
                        $scope.checkEdit = false
                        $scope.checkBySelf = true
                    }
                    $('.chooseweb1').modal('hide');
                }
            })

        }
    }

    $scope.getUrlData()
    $scope.check_webStr = function(data){
        if(data){
            if (getLength(data) < 6 || getLength(data) > 20) {
              $scope.check_name = true       
            } else {
                $scope.check_name = false
            }
        } 
    }
})