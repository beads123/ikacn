app.controller("ctrlArea", function ($scope, $http, $filter) {
    $scope.data_type = 'p' // 类型  p:pv i:ip  u:uv
    $scope.info = {}
    $scope.type_str = 'PV'
    $scope.newTime = new Date().format('yyyy-MM-dd').split('-').join('')

    $scope.oneTime = 24 * 60 * 60*1000;
    $scope.atime = $scope.newTime
    $scope.endTime = $scope.newTime
    $scope.data_stime = new Date().format('yyyy-MM-dd')
    $scope.data_etime = new Date().format('yyyy-MM-dd')
    $scope.stime = $scope.data_stime
    $scope.etime = $scope.data_etime

    $scope.curr = 1;
    $scope.tabshow = function (str) {
        $scope.curr = str;
        if (str == 2) {
            $scope.sell_flow()
        } else {
            $scope.buy_flow()
        }
    }
    $scope.id = ''
    $scope.change_id = function(id){
        $scope.id = id;
        $scope.getData($scope.atime, $scope.endTime, $scope.data_type)
    }

    $scope.change_str = function(){
        switch ($scope.data_type){
            case 'p':
            $scope.type_str = 'PV';
            break;
            case 'u':
            $scope.type_str = 'UV';
            break;
            case 'i':
            $scope.type_str = 'IP';
            break;
        }
    }
    
    $scope.plan = plan
    $scope.data = data
    $scope.trClass = { p: true, u: false, i: false }
    $scope.getData = function (atime, etime, str1) {   ///获取数据  图表调用-----------
        var arr1 = [];//获得的
        $http.post('/member/Trafficsales/salesIndex', { stime: atime, etime: etime ,adid:$scope.id}).success(function (data) {
            $scope.top_data = data.data.countList
            if (data.statusCode == 200) {
                $scope.source = data.data.source
                if (etime == atime) { //单天显示小时              
                    for (var i in data.data.list.data.im) {
                        var item1 = {}
                        if (data.data.list.data.im[i] == 0) {
                            item1.i = 0
                            item1.p = 0
                            item1.u = 0
                        } else {
                            item1.i = data.data.list.data.im[i].i
                            item1.p = data.data.list.data.im[i].p
                            item1.u = data.data.list.data.im[i].u
                        }
                        arr1.push(item1)
                    }

                } else {
                    var leg = Object.keys(data.data).length
                    var index = leg
                    var dataKey = Object.keys(data.data)             
                    for (var i in data.data.list) {
                        var item1 = {}
                        if (data.data.list[i] == 0) {
                            item1.i = 0
                            item1.p = 0
                            item1.u = 0
                        }else{
                            item1.i = data.data.list[i].ImIP
                            item1.p = data.data.list[i].ImPV
                            item1.u = data.data.list[i].ImUV
                        }
                        
                        
                        arr1[i] = item1;
                    };
              
                }
                dealData(arr1,str1)
            }
        })
    }

    $scope.getData($scope.newTime, $scope.newTime, 'p')


    //     $('.listpage').createPage({
    //        pageCount:100,    // 总页数
    //        current:11,        // 当前页
    //        total:1000,        // 总条数
    //        showTotal:true,   // 显示总条数
    //        showInput:true,   // 显示输入跳转
    //        backFn:function(p){   // 当前页码
    //         
    //        }
    //    })

    //     $('.listpage2').createPage({
    //        pageCount:100,    // 总页数
    //        current:11,        // 当前页
    //        total:1000,        // 总条数
    //        showTotal:true,   // 显示总条数
    //        showInput:true,   // 显示输入跳转
    //        backFn:function(p){   // 当前页码
    //         
    //        }
    //    })



    // 购买流量
    $scope.buy_flow = function () {
        $http.post('/member/Trafficsales/salesIndex').success(function (data) {
        
            if (data.statusCode == 200) {
                $scope.list = data
            } else {
                modal_alert(data.message)
            }
        })
    }
    // $scope.buy_flow()


    // 选择时间----最近几天
    $scope.choiceTime = function (time) {
        if (time == 1) {
            $scope.atime = new Date(new Date().getTime() - $scope.oneTime).format("yyyy-MM-dd").split('-').join('') ;
            $scope.endTime = $scope.atime
            // time = 24;  
            $scope.data_stime =  new Date(new Date().getTime() - $scope.oneTime).format("yyyy-MM-dd")
            $scope.data_etime = new Date(new Date().getTime() - $scope.oneTime).format("yyyy-MM-dd")
            $scope.getData($scope.atime, $scope.endTime, $scope.data_type)
        }
        else if (time == 0) {
            $scope.atime = new Date().format('yyyy-MM-dd').split('-').join('')
            $scope.endTime = new Date().format('yyyy-MM-dd').split('-').join('')
         
            $scope.data_stime = new Date().format('yyyy-MM-dd')
            $scope.data_etime = new Date().format('yyyy-MM-dd')
            $scope.stime = new Date().format('yyyy-MM-dd')
            $scope.etime = new Date().format('yyyy-MM-dd')
            // $('#startTime').val(new Date(($scope.atime * 1000)).format("yyyy-MM-dd"))
            // $('#endTime').val(new Date(($scope.endTime * 1000)).format("yyyy-MM-dd"))
            $scope.getData($scope.atime, $scope.endTime, $scope.data_type)
        } else {
            $scope.endTime = $scope.newTime;
            $scope.atime = new Date(new Date().getTime() - (time - 1) * $scope.oneTime).format('yyyy-MM-dd').split('-').join('')

            $scope.data_stime = new Date(new Date().getTime() - (time - 1) * $scope.oneTime).format("yyyy-MM-dd");
            $scope.data_etime = new Date().format("yyyy-MM-dd");
            $scope.getData($scope.atime, $scope.endTime,  $scope.data_type)

        }





    }


    //  图表类型
    $scope.changeType = function (str) {
        if ($scope.data_type == str) {
            return
        }
        $scope.trClass = { P: false, u: false, i: false }
        $scope.data_type = str
        $scope.trClass[str] = true
        $scope.change_str()
        $scope.getData($scope.atime, $scope.endTime, $scope.data_type)

    }
    $scope.s_time = $scope.newTime - 90 * $scope.oneTime;

    $scope.$watch('stime', function (oldVal, newVal) {
        if (new Date($scope.stime).getTime() > new Date($scope.etime).getTime()) {
            $scope.data_stime = ''
            modal_alert('开始时间不能大于结束时间')
            return false
        }
        $scope.ad_status = function (item) {
            if (item.status == '通过') {
                return item.exchange
            } else {
                return item.status
            }
        }

        if (oldVal != newVal) {
            if ($scope.etime && $scope.stime) {
                $('.menu-date li').removeClass('active')
                $scope.atime = $scope.stime
                $scope.endTime =$scope.etime
                $scope.getData($scope.atime, $scope.endTime, $scope.data_type)
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
                $scope.atime = $scope.stime
                $scope.endTime =$scope.etime
                $scope.getData($scope.atime, $scope.endTime,  $scope.data_type)
            }
        }

    })

    function dealData(arr1,str1) {
     
        var valArr1 = []
        var k = Object.keys(arr1)
        for (var i in arr1) {
            valArr1.push(arr1[i][str1])
        }

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
                // '#7cb5ec',//蓝
            ],
            xAxis: {
                categories: k, //日期
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
                name: $scope.type_str,
                data: valArr1,
                marker: {
                    enabled: true, /*数据点是否显示*/
                    radius: 0,  /*数据点大小px*/
                    //fillColor:'#ff3300'         /*数据点颜色*/
                }
            }]
        });

    }

    $scope.show_time = function(time){
        return new Date(time * 1000).format('yyyy-MM-dd')
    }
    // 出售的流量
    $scope.sell_flow  = function(){
        $http.post('/member/Trafficsales/sellGoodsList').success(function(data){
            if(data.statusCode == 200){
              $scope.sell_data = data.data
            }
        })
    }
    
    //出售-- 详情
    
    $scope.details = function(gid){
        $('.Billing_details').modal('show')
        $http.post('/member/Trafficsales/settlement',{gid:gid}).success(function(data){
            if(data.statusCode == 200){
                $scope.details_item = data.data
            }
        })

    }
  var ad_type = getQueryString('type')
  if(ad_type){
      if(ad_type == 'buy'){
        $scope.tabshow(1)
      }else if(ad_type == 'sell'){
        $scope.tabshow(2)
      }
   
  }

})


