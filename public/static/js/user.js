app.controller("ctrlArea", function ($scope, $http, public, upimg,complete_info,approve) {
    $scope.approve = approve
    $scope.public = public
    $scope.complete_info = complete_info
    $scope.webSize = []
    $scope.getUrl = {}
    $scope.upimg = upimg
    $scope.upimg.getImg("#adimgUp", "#img", function (data) {
        $scope.picImgData = data
    })

    $scope.upimg.getImg("#fontUpImg", "#fontImg", function (data) {
        $scope.editImgData = data
    })


    var cateArr = ''

    //  // 资源列表


    $scope.AddWeb = false;

    // $scope.pageNumber = 1 //页数
    $scope.pageSize = 10 // 每页条数

    $scope.scrollDisabled = false  //滚动条

    $scope.dataArr = []
    $scope.pageData = []

    $scope.getUrl.px = 1
    $scope.getUrl.pz = $scope.pageSize
    $scope.getUrl.search = $.trim($scope.webString)


    $scope.yzYqlj = function (yqlj, id) {
        var iid = id
        var yzYqlj = ""
        if (yqlj == true) {
            $scope.complete_info.check_user(memberUrl('/goods/friendgoods')) //检测用户信息是否完善    
        } else {
            $scope.complete_info.check_user(memberUrl("/goods/friendsell",{wid:iid}))
        }
    }
    $scope.yzTwgg = function (twgg, id) {
        var iid = id
        var yzTwgg = ""
        if (twgg == true) {
            // yzTwgg = "/member/twgoods/twgoods.htm";
            $scope.complete_info.check_user(memberUrl('/twgoods/twgoods')) 
        } else {
            // yzTwgg = "/member/twgoods/twSell?wid=" + iid;
            $scope.complete_info.check_user(memberUrl("/twgoods/twSell",{wid:iid}))
        }
    }
    $scope.yzMfhl = function (mfhl, id) {
        var iid = id
        var yzMfhl = ""
        if (mfhl == true) {
            $scope.complete_info.check_user(memberUrl('/freechange/release')) 
            // yzMfhl = "/member/freechange/release.htm";
        } else {
            // yzMfhl = "/member/freechange/addchange?wid=" + iid;
            $scope.complete_info.check_user(memberUrl("/freechange/addchange",{wid:iid}))
        }
        // window.location.href = yzMfhl
    }
    $scope.yzLljh = function (lljh, id) {
        var iid = id
        var yzLljh = ""
        if (lljh == true) {
            yzLljh = "/member/trafficexchange/index.htm";
        } else {
            yzLljh = "/member/trafficexchange/newadvert",{wid:iid};
        }
        window.location.href = yzLljh
    }
    $scope.yzWzjy = function (wzjy,id) {
          var iid = id
        var yzWzjy = ""
        if (wzjy == true) {
            yzWzjy = "/member/websitetrade/sellwebsite.htm";
        } else {
            yzWzjy = "/member/websitetrade/addwebsite",{wid:iid};
        }
        window.location.href = yzWzjy
    }


    $scope.list = function () {
        $http.post("/Index/webinfo", $scope.getUrl).success(function (data) {
        	if(data.page.num_rows == null || data.page.num_rows == '' || data.page.num_rows == 0){
        		data.page.num_rows = 0
        	}
            $scope.nums = data.page.num_rows;
            if (data.statusCode == 200) {
                if ($scope.getUrl.px == 1) {
                    $scope.page_max = data.page.num_page
                    $scope.webSize = data.data

                } else {
                    if (data.data.length > 0) {
                        for (var g in data.data) {
                            $scope.webSize.push(data.data[g])
                        }
                    }
                }
                if ($scope.getUrl.px >= data.page.num_page) { //如果当前页面大于等于总页面，那么不可以禁用滚动
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
    $scope.list()
    $scope.loadMore = function () {
        if ($scope.scrollDisabled) {
            return false
        }
        $scope.scrollDisabled = true
        $scope.getUrl.px += 1
        $scope.list()
    }
	$scope.addsure  = function(){
		window.location.reload()
	}

    //    切换分类
    $scope.errmsg = false
    $(document).on('click', '.dropdown-menu li a', function () {
        $(this).parents('li').addClass('hover').siblings().removeClass('hover');
        $(this).parents('.dropdown-menu').hide();
    })
    $scope.rete = function () {
        var yz = preg.wurl.test($scope.webUrl)
        $scope.errmsg = !yz


    }

    // 添加网站
    //	新增网站弹窗
    $(document).on('click', '.add_btn', function () {
    	$scope.picImgData = '';
    	$scope.editImgData = '';
        $('.addwebsite').modal('show');
    })

//  $scope.checkwebsite = function(){
//		$http.post('/member/goods/checkwebsite',{url:$scope.webUrl}).success(function(data){
//			if(data.statusCode == 200){
//				$scope.addWeb();
//			}else{
//				if (!$scope.webUrl) {
//		            modal_alert("请输入网站域名")
//		            return
//				}
//				$scope.addWeb();
//				$('.add_success .cueh5').html('<p>'+$scope.webUrl+'</p>'+'网站已经有认证出售，您网站认证通过后，会下架原来卖家的所有商品，您出售的商品会上架！').css('color','red')
//				
//			}
//		})
//	}

    $scope.addWeb = function () {
        var val = $('input:radio[name="flink"]:checked').val()
        if ($scope.public.addOneCate != undefined && $scope.public.addTwoCate != undefined) {
            var typeTwo = $scope.public.addweb.filter(function (item) {
                return item.name == $scope.public.addTwoCate
            });
            $scope.two_id = typeTwo[0].id

        }
        if (!$scope.webName) {
            modal_alert("请输入网站名称")
            return
        } else if ($scope.webName.length > 10 || $scope.webName.length < 3) {
            modal_alert("请控制网站名称长度在3到10个字之内")
            return

        } else if (!$scope.webUrl) {
            modal_alert("请输入网站域名")
            return
        } else if (!$scope.public.addTwoCate) {
            modal_alert("请选择行业分类")
            return
        } else if (!val) {

            modal_alert("请选择是否接受敏感词")
            return
        }


        $scope.info = {
            name: $scope.webName,
            url: $scope.webUrl,
            cid: $scope.two_id,
            sensitive_advertising: val,
            image: $scope.picImgData
        }
        $scope.AddWeb = true;

        $http({
            url: '/Index/addwebsite',
            data: $scope.info,
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var o in obj)
                    if (obj[o]) str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                return str.join("&");
            }
        }).success(function (data) {
            $scope.msg = data.message
            $scope.AddWeb = false;
            if (data.statusCode == 200) {

                $('.addwebsite').modal('hide');
                $('.add_success').modal('show');
                var add_info = {
                    id: data.web_id,
                    name: $scope.webName,
                    url: $scope.webUrl,
                    cid: typeTwo[0].id,
                    adver: '',
                    catename: $scope.public.addOneCate,
                    validate: "未认证"
                }
                if ($('input:radio[name="flink"]:checked').val() == 1) {
                    add_info.adver = '接受'
                } else {
                    add_info.adver = '拒绝'
                }

                $scope.webSize.unshift(add_info)
                $scope.webName = ""
                $scope.webUrl = ""
                $scope.public.addOneCate = ''
                $scope.public.addTwoCate = ''
                $("input[type='radio'][name ='flink']").eq(0).attr('checked', false)
                $("input[type='radio'][name = 'flink']").eq(1).attr('checked', true)

            } else {
                
                $('.add_waring').modal('show');
            }
        }, function () {
        })


    }


    // 编辑网站
    $scope.webId = ''
    $scope.edit = function (webId, item, index) {

        $('.editwebsite').modal('show');

        $scope.webId = webId
        $scope.public.editOneCate = item.catename
        $scope.public.editTwoCate = item.catename2
        $scope.edit_index = index
      
        if (item.adver == "接受") {
            $("input[type = 'radio'][name = 'editWeb']").eq(0).prop('checked', true)
        } else {
            $("input[type = 'radio'][name = 'editWeb']").eq(1).prop('checked', true)
        }
        $scope.public.findTowArr($scope.public.editOneCate, function (data) {
            $scope.public.editweb = data
        })

        $scope.editsrc = item.image

        $http({
            url: '/Index/getupdweb',
            data: {wid: $scope.webId},
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var o in obj)
                    if (obj[o]) str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                return str.join("&");
            }

        }).success(function (data) {
            $scope.webData = data
            $scope.editWebName = $scope.webData.name  //网站名称   
            $scope.imgUrl = data.image_fmt

            $scope.editImgData = data.image


        }, function () {
        })
    }


    // 保存编辑内容
    $scope.saveEdit = function () {
        // $scope.public.editweb
        $scope.public.findTowArr($scope.public.editOneCate, function (data) {
            $scope.public.editweb = data
            var typeTwo = data.filter(function (item) {
                return item.name == $scope.public.editTwoCate
            });

            if ($scope.editWebName.length < 3 || $scope.editWebName.length > 10) {
                modal_alert("请确保网站名称长度在3至10个字")
                return false
            }

            $scope.saveWebInfo = {
                name: $scope.editWebName,
                wid: $scope.webId,
                sens: $('input:radio[name="editWeb"]:checked').val(),
                cid: typeTwo[0].id,
                image: $scope.editImgData
            }

            $http({
                url: '/Index/updateweb',
                data: $scope.saveWebInfo,
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
                    $scope.editSuccessMsg = data.message
                    $('.edit_success').modal('show');

                    $scope.webSize[$scope.edit_index].name = $scope.editWebName
                    $scope.webSize[$scope.edit_index].catename = $scope.public.editOneCate
                    $scope.webSize[$scope.edit_index].image_fmt = data.data.image_fmt
                    if ($('input:radio[name="editWeb"]:checked').val() == 1) {
                        $scope.webSize[$scope.edit_index].adver = '接受'
                    } else {
                        $scope.webSize[$scope.edit_index].adver = '拒绝'
                    }

                } else {
                    $scope.editErrMsg = data.message
                    $('.edit_waring').modal('show');
                }

            }, function () {
            })

        })
    }

  
    $scope.approve_web = function(item,index){  
        $scope.index = index;
        $(".checkwebsite").modal("show");
        $scope.approve.web_url = item.url   
        $scope.approve.webWid = item.id
        $scope.approve.getApproveInfo()
    }
    $scope.cb = function(data){
        if(data == 'success'){
          $scope.webSize[$scope.index].validate = "已认证"  
        }
    }
    

    // 搜索网站      
    $scope.seachWeb = function () {

        $scope.getUrl.px = 1
        $scope.getUrl.search = $.trim($scope.webString)

        $scope.list()


    }


    $(function () {
        $(document).on('click', function () {
            $('body').css({'padding-right': '0px'})
        })
    })


    //	勾选自动上链

//	$(document).on('click','label span.dagou',function(){
//		if (!$(this).hasClass('blue-g')) {
//			$(this).addClass('blue-g');
//	     	$('.chain-set').modal('show');   	
//	    }else{
//	    	$(this).removeClass('blue-g');
//	    	$('.chain-set').modal('hide');   
//	    }
//		
//	})

    //返回格式切换
    $scope.format = 'json';
    $scope.active = 1
    $scope.show = function (type) {
        $scope.active = type
        if (type == 1) {
            $scope.format = 'json';
        }
        if (type == 2) {
            $scope.format = 'xml';
        }
        if (type == 3) {
            $scope.format = 'html';
        }
        $http.post("/member/Autochain/GetAutoChain", {id: $scope.id}).success(function (data) {
            if (data.statusCode == 200) {
                $scope.chaincode = data.data.url + $scope.format+ "&text=" + $scope.test;
                $scope.codes = $scope.chaincode;
            }
        })
    }


    $scope.test = 'false';
    $scope.act = 1
    $scope.code = function (type) {
        $scope.act = type
        if (type == 1) {
            $scope.test = 'false';
        }
        if (type == 2) {
            $scope.test = 'true';
        }
        $http.post("/member/Autochain/GetAutoChain", {id: $scope.id}).success(function (data) {
            if (data.statusCode == 200) {
                $scope.chaincode = data.data.url + $scope.format + "&text=" + $scope.test;
                $scope.codes = $scope.chaincode;
            }
        })
    }


    $scope.name = ''
    $scope.autochain = function (item,index) {
    	$scope.item = item
    	$scope.index = index
    	$http.post("/member/Autochain/GetAutoChain", {id: item.id}).success(function (data) {
            if (data.statusCode == 200) {
                $scope.chaincode = data.data.url + $scope.format + "&text=false";
                $scope.sign = data.data.sign;
                $scope.codes = $scope.chaincode;
            }
        })
        if (item.autochain == 1) {
            
            $('.chain-set').modal('show');
            $scope.chainame = item.name;
            $scope.id = item.id;
            $scope.wurl = item.url
            $scope.chain = 2;
            $scope.kid = item.id;

//          $http.post("/member/Autochain/JoinAutoChain", {id: item.id, chain: $scope.chain}).success(function (data) {
//              if (data.statusCode == 200) {
//              }
//          })

        } else {
            modal_confirm('确定要取消自动上链吗？', function () {
               $scope.webSize[index].autochain = 1;
                $('.chain-set').modal('hide');
                $scope.chain = 1;
                $http.post("/member/Autochain/JoinAutoChain", {
                    id: item.id,
                    chain: $scope.chain
                }).success(function (data) {
                    if (data.statusCode == 200) {
                        modal_alert(data.message)
                    } else {
                        modal_alert(data.message)
                    }
                })
            })

        }


    }
//$scope.loading   loading图片  1显示  其他不显示      $scope.showbtn  等于 1和3  点击无效不能关弹窗
    //  语言切换
    $scope.curr = 1;
    $scope.language = function (type) {
        $scope.curr = type
    }
	$scope.showbtn = 1;
	$scope.yz = "验证"
    $scope.codetest = function () {
    	$scope.up_data = '代码验证中'
    	$('.modal_cue').modal('show')
    	$scope.loading = 1;
        $http.post("/member/Autochain/CheckAutoChain", {sign: $scope.sign, url: $scope.wurl}).success(function (data) {
            if (data.statusCode == 200) {
            	$('.modal_cue').modal('hide')
    			$scope.loading = 2;
                $scope.returndata = data.message
                $scope.showbtn = 2;
            } else {
            	$scope.yz = "重新验证"
            	$('.modal_cue').modal('hide')
            	$scope.showbtn = 3;
                $scope.returndata = data.message
            }
        })
    }
	
	$scope.check_ok =function(){
		console.log($scope.showbtn)
		if($scope.showbtn == 2){
			$http.post("/member/Autochain/JoinAutoChain", {id: $scope.item.id, chain: $scope.chain}).success(function (data) {
                if (data.statusCode == 200) {
                	$scope.webSize[$scope.index].autochain = 2
                	$('.chain-set').modal('hide')
                }
            })
		}else{
			$scope.up_data = '您未通过验证代码，请先验证代码！'
			$('.modal_cue').modal('show')
			$scope.loading = 2;
			setTimeout(function(){
		        $('.modal_cue').modal('hide')
		    },2000)
			
		}
	}

//	更新数据
    $scope.addcaiji = function (id) {
        $http.get("/Index/refresh_caiji", {
            params: {
                "wid": id
            }
        }).success(function () {
            modal_alert('数据更新提交成功，请稍后查看！')
            $scope.list()
        })


    }
    $scope.reflash = function () {
        window.location.reload();
    }

    $scope.c_chain = function () {
        var jid = $('.kname').attr('kid');
        $scope.chain = 1;
        $http.post("/member/Autochain/JoinAutoChain", {id: jid, chain: $scope.chain}).success(function (data) {
            if (data.statusCode == 200) {
                window.location.reload();
            } else {
                modal_alert(data.message)
            }
        })
    }

    $scope.close = function () {
        $('.yindao').modal('hide')
        $('.luffy').hide()
    }
    $scope.del_soft = function (id, $index,item) {
    	if(item.yqlj !=true && item.twgg !=true && item.mfhl !=true && item.lljh !=true && item.wzjy != true){
    		modal_confirm("确定要删除吗？", function () {
            $http.post("/member/Account/softDelWeb", {wid: id}).success(function (data) {
	                if (data.statusCode == 200) {
	                    $http.post("/member/Account/softDelWeb", {wid: id, type: 1}).success(function (data) {
	                        if (data.statusCode == 200) {
	                            modal_alert(data.message)
	                            $scope.webSize.splice($index, 1)
	                        } else {
	                            modal_alert(data.message)
	                        }
	                    })
	                } 
	            })
	        })
    	}else{
    		modal_alert('该网站还有出售的商品请先删除商品！')
    	}
        
    }
    $scope.guide_close = function () {
        $('.one_step,.two_step,.three_step,.four_step,.member-guide-mask').hide();
    }
    
    


})

