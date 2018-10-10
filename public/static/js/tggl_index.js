app.controller('ctrlArea', function ($scope, $http, upimg) {
    $scope.upimg = upimg
    $scope.type = 1  //类型   1.链接  2.广告
    $scope.pageNum = 1  //链接页数
    $scope.pageNum2 = 1  //广告的页数
    $scope.pageSize = 20 // 每页条数
    $scope.scDis = {1: false, 2: false};//false  //滚动条
    $scope.dataList = []
    $scope.dataList2 = []  //我的广告
    $scope.addWebUrl = 'http://'
    $scope.adUrl = 'http://'
    // 正则匹配网站是否合法
    var strRegex = /(https|http)/i;
    var re = new RegExp(strRegex);
    //    修改图片
    $scope.upimg.getImg("#editImg", "#eimg", function (data) {
        $scope.editImg = data
    })
    // 上传图片
    // adUpImg
    $scope.upimg.getImg("#adUpImg", "#adImg", function (data) {
        $scope.addImg = data
    })


    //modal_confirm()
    $scope.list = function () {
        if ($scope.type == 1) {
            $scope.getUrl = {
                type: $scope.type,
                px: $scope.pageNum,
                pz: $scope.pageSize
            }
        } else if ($scope.type == 2) {
            $scope.getUrl = {
                type: $scope.type,
                px: $scope.pageNum2,
                pz: $scope.pageSize
            }
        }
        $http({
            url: '/member/Account/getreurl',
            data: $scope.getUrl,
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var o in obj)
                    if (obj[o]) str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                return str.join("&");
            }

        }).success(function (data) {
            if (data.statusCode == 200) {
                if ($scope.type == 1) {
                    if ($scope.pageNum == 1) {
                        $scope.dataList = data.data
                    } else {
                        if (data.data.length > 0) {
                            for (var i in data.data) {
                                $scope.dataList.push(data.data[i])
                            }
                        }
                    }
                    if ($scope.pageNum > data.page.num_page) {
                        $scope.scDis[$scope.type] = true;
                        return false
                    }
                } else {
                    if ($scope.pageNum2 == 1) {
                        $scope.dataList2 = data.data
                    } else {
                        if (data.data.length > 0) {
                            for (var i in data.data) {
                                $scope.dataList2.push(data.data[i])
                            }
                        }
                    }
                    if ($scope.pageNum2 > data.page.num_page) {
                        $scope.scDis[$scope.type] = true;
                        return false
                    }
                }
            }
            $scope.scDis[$scope.type] = false;
        }, function () {
        })
    }

    //    下拉加载更多
    $scope.loadMore = function () {
        if ($scope.type == 1) {
            if ($scope.scDis[$scope.type]) return false
            $scope.scDis[$scope.type] = true
            $scope.pageNum += 1

        } else {
            if ($scope.scDis[$scope.type]) return false
            $scope.scDis[$scope.type] = true;
            $scope.pageNum2 += 1

        }
        $scope.list();
    }
    $scope.curr = 1    //默认
    $scope.changeType = function (type) {
        $scope.curr = type;
        $scope.type = type;
        $scope.list();
    }

    $scope.setExecute = function () {
        $http.post('/member/Account/setreurl', {id: $scope.setWinId}).success(function (data) {
            if (data.statusCode == 200) {
                $scope.setContUp = 2
                $scope.setWinCont = '默认链接设置成功，友链和文字广告订单会默认使用这个推广链接！'
                $('.set-win').modal('show')
            } else {
                modal_alert(data.message)
            }
        })
    }

    $scope.setWin = function (index, id, title) {
        $('.set-win').modal('show')
        $scope.setContUp = 1
        $scope.setWinIndex = index
        $scope.setWinId = id
        $scope.setWinTitle = title
        $http.post('/member/Account/yzreurl', {}).success(function (data) {
            if (data.statusCode == 500) {
                $scope.setWinCont = '您已经有设置默认链接，确定要替换吗？';
            } else {
                $scope.setExecute()
            }
        })
    }

    $scope.winUpdate = function () {
        window.location.reload();
    }

    $scope.errmsg = false

    $scope.rete = function (type) {
        var Wurl = new Array()
        Wurl[1] = $scope.addWebUrl
        Wurl[2] = $scope.adUrl
        Wurl[3] = $scope.editWebUrl
        Wurl[4] = $scope.editADurl
        var yz = re.test(Wurl[type])
        $scope.errmsg = !yz
        if($scope.errmsg){
	    	$('.disbtn').attr('disabled',true).css('cursor','not-allowed')
	    }else{
	    	$('.disbtn').attr('disabled',false).css('cursor','pointer')
	    }
    }
    $scope.lengthYz = function (type) {
        var Wtitle = new Array()
        Wtitle[1] = $scope.addWebTitle
        Wtitle[2] = $scope.adTitle
        Wtitle[3] = $scope.editWebTitle
        Wtitle[4] = $scope.editADtitle
        var len = 0;
        for (var i = 0; i < Wtitle[type].length; i++) {
            var a = Wtitle[type].charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null)
            {
                len += 1;
            }
            else
            {
                len += 0.5;
            }
        }
        if(len>10){
            $scope.errmsgYz = true
        }else{
            $scope.errmsgYz = false
        }
    }

    $scope.addlink = function () {
        $scope.addWebTitle = ""
        $scope.addWebUrl = ""
        $scope.errmsgYz = false;
        $scope.errmsg = false;
        $('.addlink').modal('show')
    }
    $scope.addadvert = function () {
        $scope.adTitle = ""
        $scope.adUrl = ""
        $scope.errmsgYz = false;
        $scope.errmsg = false;
        $('.addadvert').modal('show')
    }
    //    新增链接
    $scope.addUrl = function (type) {
        $scope.lengthYz(1)
        if($scope.errmsgYz == true){
            modal_alert("链接标题超出最多字数，请填写10个汉字以内")
            return false;
        }
        if(!$scope.addWebTitle){
            modal_alert("请输入链接标题")
            return false;
        }
        if($scope.errmsg == true){
        	
            return false;
        }
        $scope.lengthYz(1)
        $scope.addInfo = {
            type: $scope.type,
            title: $scope.addWebTitle,
            url: $scope.addWebUrl
        }

        if (re.test($scope.addWebUrl)) {
            $http({
                url: '/member/Account/addreurl',
                data: $scope.addInfo,
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function (obj) {
                    var str = [];
                    for (var o in obj)
                        if (obj[o]) str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                    return str.join("&");
                }

            }).success(function (data) {
                modal_alert(data.message)

                if (data.statusCode == 200) {
                    var addInfo = { id: data.id, title: $scope.addWebTitle, url: $scope.addWebUrl, default: 1 }
                    $scope.dataList.unshift(addInfo)
                    $scope.addWebTitle = ''
                    $scope.addWebUrl = 'http://'
                }
				$('.addlink').modal('hide')
            }, function () { })
        } else {
            modal_alert("请输入合法的网址")
        }

    }

    //    新增广告
    $scope.addAdvertisement = function () {
        $scope.lengthYz(2)
        if($scope.errmsgYz == true){
            modal_alert("链接标题超出最多字数，请填写10个汉字以内")
            return false;
        }
        if(!$scope.adTitle){
            modal_alert("请输入链接标题")
            return false;
        }
        if($scope.errmsg == true){
        	
            return false;
        }
        if($scope.upimg.imgSuccess){
            if( $scope.upimg.imgSuccess != '上传成功'){
                modal_alert('图片正在上传中，请稍候！')
                return false;
            }
        }else{
            modal_alert('请先上传图片！')
            return false;
        }
        
        
        $scope.adAD = {
            type: 2,
            title: $scope.adTitle,
            url: $scope.adUrl,
            image: $scope.addImg,
            size: $scope.upimg.width + "*" + $scope.upimg.height
        }
        if (re.test($scope.adUrl)) {
            $http({
                url: '/member/Account/addreurl',
                data: $scope.adAD,
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function (obj) {
                    var str = [];
                    for (var o in obj)
                        if (obj[o]) str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                    return str.join("&");
                }

            }).success(function (data) {
                modal_alert(data.message)
                if (data.statusCode == 200) {
                    //$scope.list()  //成功刷新页面
                    var addWebInfo = {
                        height: $scope.upimg.height,
                        width: $scope.upimg.width,
                        id: data.id,
                        title: $scope.adTitle,
                        url: $scope.adUrl,
                        img_fmt: data.img_fmt,
                        image: data.image
                    }

                    $scope.dataList2.unshift(addWebInfo)
                    $("#adImg").attr('src', '/images/default-img.png')
                    $scope.adUrl = 'http://'
                    $scope.adTitle = ''
                    $scope.addImg = ''
                    $scope.upimg.imgSuccess = ''

                    $('.addadvert').modal('hide')
                }
            }, function () { })
        } else {
            modal_alert("请输入合法的网址")
        }
    }



    // 删除链接、广告
    $scope.delId = ''
    $scope.deleteUrl = function (index, id, cont) {
        modal_confirm('确认要删除此' + cont + '?',function(){
        $http({
            url: '/member/Account/delreurl',
            data: {id: id},
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var o in obj)
                    if (obj[o]) str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                return str.join("&");
            }

        }).success(function (data) {
            modal_alert(data.message)
            if ($scope.type == 1) {
                $scope.dataList.splice(index, 1)
            } else {
                $scope.dataList2.splice(index, 1)
            }
        
        }, function () {
        })

      } )
        
    }


    //    修改链接
    $scope.editUrlId = ""
    $scope.index = '' //修改、删除的链接位置
    // index, id,title,url,img_fmt,img,height,width

    $scope.edit = function (index, item) {

        $scope.index = index
        $scope.errmsgYz = false;
        $scope.errmsg = false;
        if ($scope.type == 1) {
            $('.editlink').modal('show')
            $scope.editWebTitle = item.title
            $scope.editWebUrl = item.url
            $scope.editDefault = item.default
        } else {
            $('.edit-advert').modal('show')
            $scope.editADtitle = item.title
            $scope.editADurl = item.url
            $scope.editImgFmt = item.img_fmt
            $scope.editImg = item.image
            $scope.upimg.height = item.height
            $scope.upimg.width = item.width
            $scope.editDefault = item.default
        }
        return $scope.editUrlId = item.id
    }

    // 保存修改

    // 1.保存链接修改
    $scope.editUrl = function (type) {
        $scope.lengthYz(3)
        if($scope.errmsgYz == true){
            modal_alert("链接标题超出最多字数，请填写10个汉字以内")
            return false;
        }
        $scope.editInfo = {
            id: $scope.editUrlId,
            type: $scope.type,
            title: $scope.editWebTitle,
            url: $scope.editWebUrl,
            default: $scope.editDefault
        }
        if (re.test($scope.editWebUrl)) {
            $http({
                url: '/member/Account/upreurl',
                data: $scope.editInfo,
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var o in obj)
                        if (obj[o]) str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                    return str.join("&");
                }
            }).success(function (data) {
                modal_alert(data.message)
                if (data.statusCode == "200") {
                    $scope.dataList.splice($scope.index, 1, {
                        id: $scope.editUrlId,
                        title: $scope.editWebTitle,
                        url: $scope.editWebUrl,
                        default: $scope.editDefault
                    })
                    $scope.editWebTitle = ''
                    $scope.editWebUrl = ''
                }
            }, function () {
            })

        } else {
            modal_alert("请输入合法的网址")
        }


    }


    // 2.2保存广告修改
    $scope.editAdvertisement = function () {
        $scope.lengthYz(4)
        if($scope.errmsgYz == true){
            modal_alert("链接标题超出最多字数，请填写10个汉字以内")
            return false;
        }
        $scope.editAD = {
            id: $scope.editUrlId,
            type: 2,
            title: $scope.editADtitle,
            url: $scope.editADurl,
            image: $scope.editImg,
            default: $scope.editDefault,
            size: $scope.upimg.width + "*" + $scope.upimg.height
        }
        if (re.test($scope.editADurl)) {
            $http({
                url: '/member/Account/upreurl',
                data: $scope.editAD,
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var o in obj)
                        if (obj[o]) str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                    return str.join("&");
                }

            }).success(function (data) {

                modal_alert(data.message)
                if (data.statusCode == 200) {

                    var ADwebInfo = {
                        id: $scope.editUrlId,
                        title: $scope.editADtitle,
                        image: $scope.editImg,
                        img_fmt: data.img_fmt,
                        height: $scope.upimg.height,
                        width: $scope.upimg.width,
                        url: $scope.editADurl,
                        default: $scope.editDefault
                    }

                    $scope.dataList2.splice($scope.index, 1, ADwebInfo)

                    $scope.editADtitle = ''
                    $scope.editADurl = ''
                    $("#editImg").val = ''
                }

            }, function () {
            })
        } else {
            modal_alert("请输入合法的网址")
        }

    }


    $scope.list();
})