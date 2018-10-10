app.controller("ctrlArea", function ($scope, $http, $filter) {  
    $scope.itemLoad = false;
    $scope.data_type = 'p' // 类型  p:pv i:ip  u:uv
    $scope.data_time = 24//默认24小时
    $scope.info = {}

    var todayYear = (new Date()).getFullYear();
    var todayMonth = (new Date()).getMonth();
    var todayDay = (new Date()).getDate();
    $scope.newTime = ((new Date(todayYear, todayMonth, todayDay, '23', '59', '59')).getTime() + 990) / 1000;

    $scope.oneTime = 24 * 60 * 60;
    $scope.atime = $scope.newTime
    $scope.endTime = $scope.newTime
    $scope.data_stime = new Date($scope.newTime * 1000).format("yyyy-MM-dd");
    $scope.data_etime = new Date($scope.newTime * 1000).format("yyyy-MM-dd");
    $scope.stime = $scope.data_stime
    $scope.etime = $scope.data_etime
    $scope.goods = $list.goods //广告位
    $scope.import = $list.import// 获得的流量
    $scope.export = $list.export   //贡献的流量
    $scope.advert = $list.advert // 广告
    if ($scope.goods.length > 0 && $scope.advert.length == 0) {
        $('.ggmodal').modal('show')
    } else if ($scope.goods.length == 0 && $scope.advert.length > 0) {
        $('.ggwmodal').modal('show')
    }

    $scope.trClass = {p:true,u:false,i:false}
    $scope.getData = function (atime, etime, time, str1, str2) {   ///获取数据  图表调用-----------

        var arr1 = [];//获得的
        var arr2 = [];//贡献的
        $http.post('/member/Trafficexchange/getCountExchange', { atime: atime, etime:etime }).success(function (data) {

            if (data.statusCode == 200) {
                if ((etime - atime) < $scope.oneTime) { //单天显示小时
                    $scope.info.ExIP = data.data.ExIP
                    $scope.info.ExPV = data.data.ExPV
                    $scope.info.ExUV = data.data.ExUV
                    $scope.info.ImIP = data.data.ImIP
                    $scope.info.ImPV = data.data.ImPV
                    $scope.info.ImUV = data.data.ImUV
                    $scope.tableData = []
                    for (var i in data.data.date.im) {
                        var item1 = {}
                        if (data.data.date.im[i] == 0) {
                            item1.i = 0
                            item1.p = 0
                            item1.u = 0
                        } else {
                            item1 = data.data.date.im[i]
                        }
                        arr1.push(item1)
                    }
                    for (var i in data.data.date.ex) {
                        var item2 = {}
                        if (data.data.date.ex[i] == 0) {
                            item2.i = 0
                            item2.p = 0
                            item2.u = 0

                        } else {
                            item2 = data.data.date.ex[i]
                        }
                        arr2.push(item2)
                    }

                    // dealData(arr1,arr2,time, str1, str2)
                } else {
                    //显示日期 

                    $scope.info.ExIP = 0
                    $scope.info.ExPV = 0
                    $scope.info.ExUV = 0
                    $scope.info.ImIP = 0
                    $scope.info.ImPV = 0
                    $scope.info.ImUV = 0

                    var leg = Object.keys(data.data).length
                    var index = leg

                    var dataKey = Object.keys(data.data)
                    var dk = dataKey.concat().slice(-time,leg);
                   
                    for (var i in data.data) {

                        if (data.data[i] == 0) {

                            data.data[i] = {}
                            data.data[i].ex_ip = 0
                            data.data[i].ex_pv = 0
                            data.data[i].ex_uv = 0
                            data.data[i].im_ip = 0
                            data.data[i].im_pv = 0
                            data.data[i].im_uv = 0
                        }

                        
                       
                       
                            if (dk.indexOf(i) > -1) {
                                $scope.info.ExIP += data.data[i].ex_ip
                                $scope.info.ExPV += data.data[i].ex_pv
                                $scope.info.ExUV += data.data[i].ex_uv
                                $scope.info.ImIP += data.data[i].im_ip
                                $scope.info.ImPV += data.data[i].im_pv
                                $scope.info.ImUV += data.data[i].im_uv
                            }

                        
                     

                        var item1 = {}
                        var item2 = {}
                        item1.i = data.data[i].im_ip
                        item1.p = data.data[i].im_pv
                        item1.u = data.data[i].im_uv
                        item2.i = data.data[i].ex_ip
                        item2.p = data.data[i].ex_pv
                        item2.u = data.data[i].ex_uv
                        arr1[i] = item1;
                        arr2[i] = item2

                    };
                }
            
                //  var timeNum = Math.abs(Math.floor( ( new Date().getTime() / 1000 - etime  ) /$scope.oneTime))
                var timeNum = Math.floor((etime - atime) / $scope.oneTime)
                if((etime - atime) < $scope.oneTime){
                    var lg = 0
                }else{
                    var lg = Math.floor(($scope.newTime - etime) / $scope.oneTime)
                }
               

                dealData(arr1, arr2, time, str1, str2, timeNum, lg)

            }
        })
    }

    $scope.getData($scope.newTime, $scope.newTime, 24, 'p', 'p')

    // 对应日期的数组




    $scope.AdvertFlowExchange = function () {
        $scope.itemLoad = true;
        $('.get_traffic').modal("show")
        $http.post("/member/Trafficexchange/advertDetails").success(function (data) {
            $scope.AdvertFE = data.data;
            $scope.itemLoad = false;
        })
    }
    $scope.GoodsFlowExchange = function () {
        $scope.itemLoad = true;
        $('.out_traffic').modal('show')
        $http.post("/member/Trafficexchange/goodsDetails").success(function (data) {
            $scope.GoodsFE = data.data;
            $scope.itemLoad = false;
        })
    }
    $scope.source = $source;



    // 选择时间----最近几天
    $scope.choiceTime = function (time) {
        // if ($scope.data_time == time) {
        //     return
        // }

            if (time == 1) {
              
                $scope.atime = (new Date().getTime() / 1000) - $scope.oneTime;
                $scope.endTime = $scope.atime
                // time = 24;
                $scope.data_time = 24;
                $scope.data_stime = new Date(($scope.atime * 1000)).format("yyyy-MM-dd");
                $scope.data_etime = new Date(($scope.endTime * 1000)).format("yyyy-MM-dd");
                $scope.getData($scope.atime, $scope.endTime, $scope.data_time, $scope.data_type, $scope.data_type)
            } 
            else if(time == 0) {
              
                $scope.atime = (new Date().getTime() / 1000)
                $scope.endTime = (new Date().getTime() / 1000)
                $scope.data_time = 24;
              
                
                $scope.data_stime = new Date(($scope.atime * 1000)).format("yyyy-MM-dd");
                $scope.data_etime = new Date(($scope.endTime * 1000)).format("yyyy-MM-dd");
                $scope.stime =  new Date(($scope.atime * 1000)).format("yyyy-MM-dd");
                $scope.etime =  new Date(($scope.endTime * 1000)).format("yyyy-MM-dd");
                $('#startTime').val(new Date(($scope.atime * 1000)).format("yyyy-MM-dd"))
                $('#endTime').val(new Date(($scope.endTime * 1000)).format("yyyy-MM-dd"))
                $scope.getData($scope.atime, $scope.endTime, $scope.data_time, $scope.data_type, $scope.data_type)
     
               
            }else{
                $scope.endTime = $scope.newTime;
            $scope.atime = $scope.endTime - (time - 1) * $scope.oneTime;
        $scope.data_time = time;
        $scope.data_stime = new Date(($scope.atime * 1000)).format("yyyy-MM-dd");
        $scope.data_etime = new Date(($scope.endTime * 1000)).format("yyyy-MM-dd");
        $scope.getData($scope.atime, $scope.endTime, $scope.data_time, $scope.data_type, $scope.data_type)
        
            }
            

        
            

    }
  
     
    //  图表类型
    $scope.changeType = function (str) {     
        if ($scope.data_type == str) {
            return
        }  
        $scope.trClass = {P:false,u:false,i:false}
        $scope.data_type = str
        $scope.trClass[str] = true
        $scope.getData($scope.atime, $scope.endTime, $scope.data_time, $scope.data_type, $scope.data_type)

    }
    $scope.s_time = $scope.newTime - 90 * $scope.oneTime;

    $scope.$watch('stime', function (oldVal, newVal) {
        if (new Date($scope.stime).getTime() > new Date($scope.etime).getTime()) {
            $scope.data_stime = ''
            modal_alert('开始时间不能大于结束时间')
            return false
        }
    $scope.ad_status = function(item){
        if(item.status == '通过'){
            return item.exchange
        }else{
            return item.status
        }
    }
       
        if (oldVal != newVal) {
            if ($scope.etime && $scope.stime) {
                $('.menu-date li').removeClass('active')
                $scope.atime = new Date($scope.stime).getTime() / 1000 < $scope.s_time ? $scope.s_time : new Date($scope.stime).getTime() / 1000

                $scope.endTime = new Date($scope.etime).getTime() / 1000 > $scope.newTime ? $scope.newTime : (new Date($scope.etime).getTime() / 1000);


                if ($scope.endTime - $scope.atime >= $scope.oneTime) {
                    $scope.data_time = Math.floor(($scope.endTime - $scope.atime) / $scope.oneTime) + 1

                } else {
                    $scope.data_time = 24
                }

                $scope.getData($scope.atime, $scope.endTime, $scope.data_time, $scope.data_type, $scope.data_type)
            }
        }
    })

    $scope.$watch('etime', function (oldVal, newVal) {


        if (new Date($scope.stime).getTime() > new Date($scope.etime).getTime()) {
            $scope.data_etime = ''
            modal_alert('结束时间不能小于开始时间')
            return false
        }


        if (oldVal != newVal) {
            $('.menu-date li').removeClass('active')
            if ($scope.etime && $scope.stime) {
                $scope.atime = new Date($scope.stime).getTime() / 1000 < $scope.s_time ? $scope.s_time : new Date($scope.stime).getTime() / 1000
                $scope.endTime = new Date($scope.etime).getTime() / 1000 > $scope.newTime ? $scope.newTime : (new Date($scope.etime).getTime() / 1000);

                if ($scope.endTime - $scope.atime >= $scope.oneTime) {
                    $scope.data_time = Math.floor(($scope.endTime - $scope.atime) / $scope.oneTime) + 1

                } else {
                    $scope.data_time = 24
                }

                $scope.getData($scope.atime, $scope.endTime, $scope.data_time, $scope.data_type, $scope.data_type)
            }
        }

    })

    function dealData(arr1, arr2, time, str1, str2, timeNum, lg) {

        var k = Object.keys(arr1)
        var kl = k.length
        var keyLength
        if (timeNum > 0) {
            keyLength = 0
        } else {
            keyLength = timeNum
        }
        var kk = k.concat()
        var keyArr = kk.slice(time * (-1) - lg, kl - lg)
        var valArr1 = [];
        var valArr2 = [];


        for (var i in arr1) {
            valArr1.push(arr1[i][str1])
            valArr2.push(arr2[i][str2])
        }
        var val1 = valArr1.slice(time * (-1) - lg, kl - lg)
        var val2 = valArr2.slice(time * (-1) - lg, kl - lg)
        $('.data_chart').highcharts({
            chart: {
                type: 'spline',
            },
            title: {
                text: null,
                x: -20 //center
            },
            subtitle: {
                text: '',
                x: -20
            },
            colors: [
                '#ff9900',//黄
                '#7cb5ec',//蓝
            ],
            xAxis: {
                categories: keyArr, //日期
                min: 0,
                //  max:6,                 
            },
            yAxis: {
                title: {
                    text: null
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }],
                gridLineDashStyle: 'ShortDash',
                gridLineWidth: 0.5,
                //  tickPositions: [0, 1, 2, 3, 4, 5]
            },
            tooltip: {
                valueSuffix: '个'   //单位
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0,
                // enabled: false
            },
            series: [{
                name: '获得的',
                data: val1,
                marker: {
                    enabled: true, /*数据点是否显示*/
                    radius: 0,  /*数据点大小px*/
                    //fillColor:'#ff3300'         /*数据点颜色*/
                }
            }, {
                name: '贡献的',
                data: val2,
                marker: {
                    enabled: true, /*数据点是否显示*/
                    radius: 0,  /*数据点大小px*/
                    //fillColor:'#ff3300'         /*数据点颜色*/
                }
            }]
        });

    }

    // {true:已暂停',false:'交换中'}[item.status == '暂停']
    $scope.show_status = function (status) {
        if (status == '暂停') {
            return '已暂停'
        } else {
            return '交换中'
        }
    }



    // 交换状况数据
    $scope.dataInfo = function (str) {
        if (str == '' || str == null) {
            return 0
        } else {
            return str
        }
    }


    // 修改广告位状态
    // 暂停
    $scope.stopGoods = function (item, index, status) {
        $scope.stopgoodsItem = item
        $scope.stopgoodsIndex = index
        // $scope.stopgoodsStatus = status
        $(".suspend").modal("show")

    }
    // 确定暂停
    $scope.stopUserGoods = function () {
        $http.post("/member/Trafficexchange/upGoodsStatus", {
            id: $scope.stopgoodsItem.id,
            status: 1
        }).success(function (data) {

            if (data.statusCode == 200) {
                $scope.goods[$scope.stopgoodsIndex].status = "暂停"
            } else {
            }
            modal_alert(data.message)
        })
    }

    // 开启
    $scope.openGoods = function (item, index, status) {
        $http.post("/member/Trafficexchange/chackExchange", { gid: item.id }).success(function (data) {
            if (data.statusCode == 200) {
                $http.post("/member/Trafficexchange/upGoodsStatus", { id: item.id, status: 2 }).success(function (data) {

                    if (data.statusCode == 200) {
                        $scope.goods[index].status = "开启"
                        status = "暂停"
                        modal_alert(data.message)
                    } else {
                        $(".openfail").modal("show")
                    }


                })
            } else {
                //              modal_alert(data.message);
                if (data.message == '未检测到广告代码，请确认加入后重试') {
                    modal_alert('开启失败，无法检测到您插入的代码，请先确认代码无误后，再次点击【开启】验证，如无法开启请联系客服！')
                } else {
                    modal_alert(data.message)
                }
            }
        })
    }


    // 修改广告状态  status ->  要修改的状态
    $scope.changeADstate = function (id, status, exchange, index) {
        $http.post("/member/Trafficexchange/upAdvertStatus", { id: id, exchange: status }).success(function (data) {

            if (data.statusCode == 200) {
                if (exchange == "交换中") {
                    exchange = "已暂停"
                } else {
                    exchange = "交换中"
                }
                $scope.advert[index].exchange = exchange
            } else {

            }
            modal_alert(data.message)
        })
    }


    $scope.stopADstate = function (item, index) {
        // 2
        $scope.editADindex = index
        $scope.editADinfo = item  //修改广告信息

        $(".stop").modal("show")
    }

    // 确定暂停
    $scope.stopAdver = function () {

        $http.post("/member/Trafficexchange/upAdvertStatus", {
            id: $scope.editADinfo.id,
            exchange: 2
        }).success(function (data) {

            modal_alert(data.message)
            if (data.statusCode == 200) {
                $scope.advert[$scope.editADindex].exchange = "已暂停"
            }
        })
    }

    // 广告位流量查看
    $scope.lookGoods = function (id) {
        $('.seeflow').modal('show');
        $http.post("/member/Trafficexchange/flow_see", { id: id, type: 1 }).success(function (data) {

            $scope.goodsInfo = data
        })

    }
    //    删除广告位
    $scope.delGoods = function (id, index) {
        $scope.goodsId = id
        $scope.goodsIndex = index
        $('.cutout').modal('show')
    }

    $scope.deleteGoods = function () {
        $http.post("/member/Trafficexchange/delGoods", { id: $scope.goodsId }).success(function (data) {

            modal_alert(data.message)
            if (data.statusCode == 200) {
                $scope.goods.splice($scope.goodsIndex, 1)
            }
        })

    }

    // 删除广告
    $scope.del = function (id, index) {
        $(".cutout2").modal("show")
        $scope.delADid = id
        $scope.delADindex = index
    }

    $scope.deleteAD = function () {
        $http.post("/member/Trafficexchange/delAdvert", { id: $scope.delADid }).success(function (data) {

            modal_alert(data.message)
            if (data.statusCode == 200) {
                $scope.advert.splice($scope.delADindex, 1)
            }
        })
    }

    // 广告查看
    $scope.lookAD = function (id) {
        $(".seeflow2").modal("show")
        $http.post("/member/Trafficexchange/flow_see", { id: id, type: 2 }).success(function (data) {

            $scope.ADinfo = data
        })

    }

    $scope.lookAdInfo = function (str) {
        if (str == null || str == '') {
            return 0
        } else {
            return str
        }
    }

    $(document).on('click', '.copys', function () {

        var con = $(this).attr('value');
        //modal_alert("<p>当前浏览器不支持该复制方法，请按Ctrl+c复制，Ctrl+v粘贴</p>"+ww);
        $('.copymodal').modal('show');
        $('.copymodal .copytext textarea').val(con)

    })

    $scope.copyCode = function () {
        var textCode = $(".copymodal .copytext textarea")
        textCode.select();
        document.execCommand("Copy");
        $scope.ok = 1;  //1显示 2：隐藏
    }
    $scope.g_num = function (num) {
        if (!$scope.show_table) {
            return ''
        } else {
            return num + 1
        }
    }

    // 查看更多
    $scope.look_px = 1
    $scope.more_data = []
    $scope.show_table = false
    $scope.look_more = function () {
        // $scope.itemLoad = true;
        // $('.look_more').modal('show')
        $http.post('/member/Trafficexchange/getDetails').success(function (data) {
            if (data.statusCode == 200) {
                $scope.more_data = data.data
                $scope.show_table = true
            } else {
                $scope.show_table = false
            }

            $scope.itemLoad = false;
        })
    }
    $scope.look_more()
    $(function () {
        // 图片放大
        $(document).on('mouseover', '.fd-img', function () {
            $(this).find('.big').show();
        })
        $(document).on('mouseout', '.fd-img', function () {
            $(this).find('.big').hide();
        })



    })

	$scope.tiao = function(url){
		url = url.substr(0,7).toLowerCase() == "http://" ? url : "http://" + url;
		console.log(url)
		window.open(url)
	}
	$(function(){
		 var strRegex = "^((https|http)?://)"; 
  		var reUrl =new RegExp(strRegex); 
		$('.flow-source table td a').each(function(){
			var thref = $(this).attr("href")
			console.log(thref)
		})
	})


    $scope.seemore = function (type) {
        if (type == 1) {
            $('.join-table').toggleClass('h650');
            $('#adv').toggleClass('shou')
        } else {
            $('.myad-table').toggleClass('h650');
            $('#adv2').toggleClass('shou')
        }

    }


    $scope.cutStr = function (str, len) {
        if (str.length * 2 <= len) {
            return str;
        }

        var strlen = 0;
        var newstr = '';
        for (var i = 0; i < str.length; i++) {
            newstr = newstr + str.charAt(i);

            if (str.charCodeAt(i) > 128) {
                strlen = strlen + 2;
                if (strlen >= len) {
                    return newstr.substring(0, newstr.length - 1) + '...';
                }
            } else {
                strlen = strlen + 1;
                if (strlen >= len) {
                    return newstr.substring(0, newstr.length - 2) + '...';
                }
            }
        }
        return newstr;
    }



})


