app.controller('articleControl', function ($scope, $http, common, $rootScope) {
    $rootScope.common = common;
    $rootScope.common.getCart();  //购物车
    $scope.data = res

    $scope.bdweightTime = $scope.data.bdweightTime
    $scope.bdweightData = true
    $scope.bdincludedTime = $scope.data.bdincludedTime
    $scope.bdincludedData = true
    $scope.getWebSiteTitleTime = $scope.data.getWebSiteTitleTime
    $scope.titleUP = false;


    $scope.regoods = regoods
    $scope.list = list
    $scope.recomend = recomend

    $scope.Fid = $scope.list.fid
    $scope.beianDataUP = false;
    $scope.domainUP = false;
    $scope.serverUP = false;
    $scope.webTrade = $scope.list.webTrade;
    $scope.one_image_fmt = true;
    $scope.two_image_fmt = true;
    if (!$scope.list.one_image_fmt) {
        $scope.one_image_fmt = false;
    }
    if (!$scope.list.two_image_fmt) {
        $scope.two_image_fmt = false;
    }
    $scope.tools_uptime = $scope.data.tools_uptime
    $scope.tools_company = $scope.data.tools_company
    $scope.tools_nature = $scope.data.tools_nature
    $scope.tools_no = $scope.data.tools_no
    $scope.tools_name = $scope.data.tools_name
    $scope.tools_url = $scope.data.tools_url

    $scope.whoisQueryTime = $scope.data.whoisQueryTime
    $scope.whoisQueryTimeCuo = $scope.data.whoisQueryTimeCuo
    $scope.domain_name = $scope.data.domain_name
    $scope.registrar = $scope.data.registrar
    $scope.name_DNS_server = $scope.data.name_DNS_server
    $scope.creation_date = $scope.data.creation_date
    $scope.registry_expiry_date = $scope.data.registry_expiry_date

    $scope.queryIP_time = $scope.data.queryIP_time
    $scope.ip = $scope.data.ip
    $scope.country = $scope.data.country
    $scope.web_server = $scope.data.web_server
    $scope.web_code = $scope.data.web_code


    $scope.goods = $scope.data.goods
    console.log($scope.goods)
    $scope.yqljpd = false;
    $scope.yqljpd_qz = false;
    $scope.wzggpd = false;
    $scope.tpggpd = false;
    $scope.mfhlpd = false;
    if ($scope.goods.yqlj.cur == true) {
        $scope.yqljPrice = $scope.goods.yqlj.price
        $scope.yqljID = $scope.goods.yqlj.id
        $scope.yqljpd = true
    }

    if ($scope.goods.yqlj.cur == false && $scope.goods.yqlj.cur_qz == false) {
        $scope.yqljPrice = "未发布"
        $scope.yqljpd = false;
        $scope.yqljpd_qz = false;
    }else if($scope.goods.yqlj.cur == true && $scope.goods.yqlj.cur_qz == false){
        $scope.yqljPrice = $scope.goods.yqlj.price
        $scope.yqljID = $scope.goods.yqlj.id
        $scope.yqljpd = true
        $scope.yqljpd_qz = false;
    }else if($scope.goods.yqlj.cur == false && $scope.goods.yqlj.cur_qz == true){
        $scope.yqljPrice_qz = $scope.goods.yqlj.price_qz
        $scope.yqljID = $scope.goods.yqlj.id
        $scope.yqljpd = false;
        $scope.yqljpd_qz = true
    }else{
        $scope.yqljPrice = $scope.goods.yqlj.price
        $scope.yqljPrice_qz = $scope.goods.yqlj.price_qz
        $scope.yqljID = $scope.goods.yqlj.id
        $scope.yqljpd = true
        $scope.yqljpd_qz = true
    }
console.log($scope.yqljpd_qz)
    if ($scope.goods.wzgg.cur == true) {
        $scope.wzggPrice = $scope.goods.wzgg.price
        $scope.wzggID = $scope.goods.wzgg.id
        $scope.wzggpd = true;
    } else {
        $scope.wzggPrice = "未发布"
    }
    if ($scope.goods.tpgg.cur == true) {
        $scope.tpggPrice = $scope.goods.tpgg.price
        $scope.tpggID = $scope.goods.tpgg.id
        $scope.tpggpd = true;
    } else {
        $scope.tpggPrice = "未发布"
    }
    if ($scope.goods.mfhl.cur == true) {
        $scope.mfhlPrice = "已发布"
        $scope.mfhlpd = true;
    } else {
        $scope.mfhlPrice = "未发布"
    }
    if ($scope.goods.lljh.cur == true) {
        $scope.lljhPrice = "已加盟"
    } else {
        $scope.lljhPrice = "未加盟"
    }

    $scope.add_cart = function (type, id, qz) {
        var ifqz = 2
        if (qz){
            ifqz = qz;
        }
        var iid = ""
        if (type != false) {
            if (type == 1) {
                iid = $scope.yqljID
            } else if (type == 2) {
                iid = $scope.wzggID
            } else if (type == 3) {
                iid = $scope.tpggID
            }
        } else {
            iid = id
        }
        var url = '/index/cart/buy';
        $http.post(url, {gids: iid,qz:ifqz}).then(function (res) {
            if (res.data.statusCode == 200) {

                common.flyImg('/images/demo/cart_font.png', '.fly' + id, '.menu-right .icon-shop', {
                    obj1x: 2, obj1y: 6, obj2x: 2, obj2y: 3, time: 1000
                }, function () {
                    common.itemNum += 1;
                    common.getCart();
                });
            } else if (res.data.statusCode == 505) {
                modal_confirm('登录后才能购买，<br/>请先登录', function () {
                    window.location.href = memberUrl('/user/login') + '?back_href=' + window.location.href;
                }, function () {
                }, {yes: '去登录', no: 'hide'});
            } else {
                modal_alert(res.data.message);
            }
        }, function (res) {
            modal_alert('系统出错，请联系客服。');
        });
    }

    $scope.upBaiduRank = function () {
        $('#change1').addClass('change');
        $http.post("/index/Webdetails/baiduRank", {
            url_id: $scope.data.url_id,
            utime: $scope.bdweightTime
        }).success(function (data) {
            if (data.statusCode == 200) {
                $scope.bdweightData = false;
                if (data.data.d) {
                    $scope.data.bdweight = data.data.d
                }
            } else {
                modal_alert(data.message)
            }
        })
    }
    $scope.isNull = function (text) {
        return text ? text : '--';
    }
    $scope.upBaiduInclude = function () {
        $('#change2').addClass('change');
        $http.post("/index/Webdetails/baiduInclude", {
            url_id: $scope.data.url_id,
            utime: $scope.bdincludedTime
        }).success(function (data) {
            if (data.statusCode == 200) {
                $scope.bdincludedData = false;
                if (data.data[0]) {
                    $scope.data.bdincluded = data.data[0]
                }
                if (data.data[1]) {
                    $scope.data.bdtrans = data.data[1]
                }
            } else {
                modal_alert(data.message)
            }
        })
    }
    $scope.upWhoisQuery = function () {
        $http.post("/index/Webdetails/whoisQuery", {
            url_id: $scope.data.url_id,
            utime: $scope.whoisQueryTimeCuo
        }).success(function (data) {
            if (data.statusCode == 200) {
                $scope.domainUP = true;
                $scope.whoisQueryTime = data.data.whoisQueryTime
                $scope.registrar = data.data.registrar
                $scope.name_DNS_server = data.data.name_DNS_server
                $scope.domain_name = data.data.domain_name
                $scope.creation_date = data.data.creation_date
                $scope.registry_expiry_date = data.data.registry_expiry_date
            } else {
                modal_alert(data.message)
            }
        })
    }
    $scope.upQueryIP = function () {
        $http.post("/index/Webdetails/queryIP", {
            url_id: $scope.data.url_id,
            utime: $scope.queryIP_time
        }).success(function (data) {
            if (data.statusCode == 200) {
                $scope.serverUP = true;
                $scope.queryIP_time = data.data.queryIP_time
                $scope.ip = data.data.ip
                $scope.country = data.data.country
            } else {
                modal_alert(data.message)
            }
        })
        $http.post("/index/Webdetails/getWebSiteTitle", {
            url_id: $scope.data.url_id,
            utime: $scope.getWebSiteTitleTime
        }).success(function (data) {
            if (data.statusCode == 200) {
                $scope.web_server = data.data.web_server
                $scope.web_code = data.data.web_code
            } else {
                modal_alert(data.message)
            }
        })
    }
    $scope.upGetWebSiteTitle = function () {
        $http.post("/index/Webdetails/getWebSiteTitle", {
            url_id: $scope.data.url_id,
            utime: $scope.getWebSiteTitleTime
        }).success(function (data) {
            if (data.statusCode == 200) {
                $scope.titleUP = true
                $scope.data.title = data.data.title
                $scope.data.keywords = data.data.keywords
                $scope.data.description = data.data.description
            } else {
                modal_alert(data.message)
            }
        })
    }

    $scope.beianUP = function () {
        $('#imgverify').attr('src', '/index/tools/getrecordimg?0.14577837871678678')
        $(".bei_modals_tishi").modal("show")
        $scope.verify = ""
    }
    $scope.getverify = function () {
        $("#imgverify").attr('src', '/index/tools/getrecordimg?' + Math.random(0, 1));
    }
    $scope.yzVerify = function () {
        $http.post("/index/tools/getrecord", {
            domain: $scope.data.url,
            verify: $scope.verify
        }).success(function (data) {
            if (data.statusCode == 200) {
                $scope.verify = ""
                $scope.beianDataUP = true;
                $scope.tools_uptime = data.data.tools_uptime
                $scope.tools_company = data.data.company
                $scope.tools_nature = data.data.nature
                $scope.tools_no = data.data.no
                $scope.tools_name = data.data.name
                $scope.tools_url = data.data.domain
                $(".bei_modals_tishi").modal("hide")
            } else {
                modal_alert(data.message)
            }
        })
    }

    //网站截图放大
    $scope.isPic = '';
    $scope.isShow = false
    $scope.pic_url = function (pic) {
        $scope.isPic = pic;
        $scope.isShow = true
    }
    $scope.PicHid = function () {
        $scope.isShow = false
    }
});


$(function () {
    //$('.dataCount').hide();
    // 商品展示区的slide
    $(document).on('mouseover', '.list-slide li.slide', function (index) {
        var $this = $(this);
        if ($this.hasClass('active'))
            return;
        $this.addClass('active').siblings('li').removeClass('active')

        $this.parents('ul').css('borderLeftColor', '#e7ebed')
        $this.siblings('li').css('borderRightColor', '#e7ebed')
        if ($this.index() == 0) {
            $this.parents('ul').css('borderLeftColor', '#00bffc')
        } else {
            $this.prev().css('borderRightColor', '#00bffc')
        }
        $this.css('borderRightColor', '#00bffc')


        $this.siblings('li').stop(true, true).animate({
            'width': '200px'
        }, 600, 'linear')
        $this.siblings('li').find('.list-btn').stop(true, true).fadeOut()
        $this.siblings('li').find('.list-right').stop(true, true).animate({
            'marginTop': '-40px'
        }, 600, 'linear')

        $this.stop(true, true).animate({
            'width': '400px'
        }, 600, 'linear')
        $this.find('.list-btn').stop(true, true).fadeIn()
        $this.find('.list-right').stop(true, true).animate({
            'marginTop': '0px'
        }, 600, 'linear')
    });

    $('.search-btn').click(function () {
        url = $('#input_url').val();
        if (!validateUrl(url)) {
            modal_alert('url不正确');
            return false;
        }
        $.post("/index/Website/get_detail_by_url", {url: url}, function (data) {
            if (data['status'] == 1) {
                window.location.href = 'website_' + data['data']['url_id'] + '.htm';
            } else {
                modal_alert(data['msg']);
            }
        });
    });


//  .zan
    $(document).on('click', '.website-rank span.zan', function () {
        var url_id = $(this).data("id");
        $(this).addClass('bluezan');
        var give = $.cookie("give" + url_id);
        if (!give) {
            $.post("index/Webdetails/give", {url_id: url_id, type: "1"}, function (data) {
                if (data['statusCode'] == 200) {
                    $.cookie("give" + url_id, 1)
                    /* alert(data['message']);*/
                    $(".zan").html(data['data']);
                } else {
                    modal_alert(data['message']);
                    return false;
                }
            })
        } else {
            /* alert("已操作")*/
            modal_alert('您已经点赞了噢！');
            return false;
        }
    });
//   .low
    $(document).on('click', '.website-rank span.low', function () {
        var url_id = $(this).data("id");
        $(this).addClass('bluelow');
        var give = $.cookie("ungive" + url_id);
        if (!give) {
            $.post("index/Webdetails/give", {url_id: url_id, type: "2"}, function (data) {
                if (data['statusCode'] == 200) {
                    $.cookie("ungive" + url_id, 1)
                    $(".low").html(data['data']);
                } else {
                    modal_alert(data['message']);
                    return false;
                }
            })
        } else {
            modal_alert('您已经差评噢！');
            return false;
        }
    })

    $('.list-slide li').each(function () {
        if ($('.list-slide li').eq(0).hasClass('slide')) {
            $('.list-slide li').eq(0).trigger('mouseover');
            return false;
        }
        if ($('.list-slide li').eq(1).hasClass('slide')) {
            $('.list-slide li').eq(1).trigger('mouseover');
            return false;
        }
        if ($('.list-slide li').eq(2).hasClass('slide')) {
            $('.list-slide li').eq(2).trigger('mouseover');
            return false;
        }
        if ($('.list-slide li').eq(3).hasClass('slide')) {
            $('.list-slide li').eq(3).trigger('mouseover');
            return false;
        }
        if ($('.list-slide li').eq(4).hasClass('slide')) {
            $('.list-slide li').eq(4).trigger('mouseover');
            return false;
        }
    })

    //$scope.img_show=false;
    //图片放大缩小
    //$('.thumbnail img ').click(function(){
    //    $(this).toggleClass('max');
    //    $('.bg_black').toggleClass('show')
    //    $scope.img_show=true
    //});


})
