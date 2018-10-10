$(function() {
    getPuttime();
    getReading();
    $('#huanyipi').click(function() {
        get_same_category_by_wechat_id();
    });
});

//每小时更新次数柱状图
function getPuttime(){
    var temStr = [];
    for (var i = 0; i < 24; i++) {
        temStr.push([i+'时',0]);
    };
    $.ajax({
        type:"post",
        url:"/index/wechat/put_time",
        async:false,
        dataType:"json",
        data:{'id':wxid},
        success:function(data){
            if (data.status == 1) {
                if(data.data){
                    var sum = 0;
                    for (var i = 0; i < data.data.length; i++) {
                        sum += Number(data.data[i]['num'])
                    }
                    $.each(data.data,function(i,item){
                        temStr[Number(item.put_time_fmt)][1] = (Number(item.num)/sum)*100;
                        column(temStr);
                    });
                } else {
                    sb = '<p style="margin-left:-24px;margin-top:16px !important;font-size:18px;text-align:center;">暂无数据</p>';
                    $('#container').css('height', '60px').html(sb);
                }
            }else{
                sb = '<p style="margin-left:-24px;margin-top:16px !important;font-size:18px;text-align:center;">暂无数据</p>';
                $('#container').css('height', '60px').html(sb);
            }
        },
        error:function(obj){
            sb = '<p style="margin-left:-24px;margin-top:16px !important;font-size:18px;text-align:center;">暂无数据</p>';
            $('#container').css('height', '60px').html(sb);
            alert("网络异常，请检查网络！");
        }
    });
}

//封装柱状图
function column(datas){
    // console.log(datas);
    //柱型图
    $('#container').highcharts({
        colors: ['#fcc55a'],
        chart: {
            type: 'column',
        },
        title: {
            text: '平均24小时发文时段'
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -0,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '占比 (%)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<b>{point.y:.1f}%</b>'
        },
        series: [{
            name: 'Population',
            data:datas,
            dataLabels: {
                enabled: false,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });
}

//阅读数和点赞数
function getReading() {
    $.ajax({
        type:"post",
        url:"/index/wechat/get_recently_7days_views",
        async:true,
        dataType:"json",
        data:{'id':wxid},
        success:function(obj) {
            if (obj.status == 1) {
                if(obj.data){
                    var data_x = [];
                    for (var i = 0; i < obj.data.length; i++) {
                        data_x.unshift(obj.data[i]['put_time_fmt'].slice(5))
                    };
                    var data = [{}];
                    data[0]['name'] = '阅读数';
                    // data[1]['name'] = '点赞数';
                    data[0]['data'] = [];
                    for (var i = 0; i < obj.data.length; i++) {
                        data[0]['data'].unshift(Number(obj.data[i]['sum_views']))
                    };
                    // data[1]['data'] = [];
                    // for (var i = 0; i < obj.liked.data.length; i++) {
                    //     data[1]['data'].unshift(Number(obj.liked.data[i]['sum_liked']))
                    // };
                    putReading(data_x, data);
                } else {
                    var sb = '<p style="margin-left:-24px;margin-top:16px !important;font-size:18px;text-align:center;">暂无数据</p>';
                    $('#reading_chart').css('height', '60px').html(sb);
                }
            }else{
                var sb = '<p style="margin-left:-24px;margin-top:16px !important;font-size:18px;text-align:center;">暂无数据</p>';
                $('#reading_chart').css('height', '60px').html(sb);
            }
        },
        error:function(obj){
            alert("网络异常，请检查网络！");
            var sb = '<p style="margin-left:-24px;margin-top:16px !important;font-size:18px;text-align:center;">暂无数据</p>';
            $('#reading_chart').css('height', '60px').html(sb);
        }
    });
}

function putReading(data_x, data){
    // 折线图
    $('#reading_chart').highcharts({
        colors: ['red'],
        title: {
            text: '',
            x: -20 //center
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: data_x
        },
        yAxis: {
            title: {
                text: ''
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ''
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth: 0
        },
        series: data
    });
}

//根据分类获取推荐
function get_same_category_by_wechat_id(){
    var sb = "";
    $.ajax({
        type:"post",
        url:"/index/wechat/get_same_category_by_wechat_id",
        async:false,
        dataType:"json",
        data:{'id':wxid},
        success:function(obj){
            if (obj.status == 1) {
                $.each(obj.data,function(i,item){
                    sb+= '<li class="clearfix">'
                    sb+= '      <div class="zone-left">'
                    sb+= '          <a href="wxdetails_'+item.id+'.htm" target="_blank" class="zone-img">'
                    sb+= '              <img src="' + item.image + '" alt="'+item.nickname+'">'
                    sb+= '          </a>'
                    sb+= '      </div>'
                    sb+= '      <div class="zone-right">'
                    sb+= '          <h4><a href="wxdetails_'+item.id+'.htm" target="_blank" >'+item.nickname+'</a></h4>'
                    sb+= '          <p class="account">'
                    sb+= '              <span class="icon-weixin-green"></span>'
                    sb+= '              <a title="'+item.wechat+'" href="wxdetails_'+item.id+'.htm" target="_blank" rel="nofollow">'+item.wechat+'</a>'
                    sb+= '          </p>'
                    sb+= '          <p class="zone-footer">粉丝数量：<span class="text-red">'+item.subscription+'</span></p>'
                    sb+= '          <a href="wxdetails_'+item.id+'.htm" target="_blank" rel="nofollow" class="btn-white">查看详情</a>'
                    sb+= '      </div>'
                    sb+= '  </li>'
                });

                $('.weixin_account ul').html(sb);
            } else {
                sb += '<p style="text-align:center;font-size:18px;">暂无推荐微信公众号</p>';
                $('.weixin_account ul').css('height','27px');
                $('.weixin_account ul').html(sb);
            }
        },
        error:function(obj){
            sb += '<p style="text-align:center;font-size:18px;">暂无推荐微信公众号</p>';
            $('.weixin_account ul').css('height','27px');
            $('.weixin_account ul').html(sb);
        }
    });
}
