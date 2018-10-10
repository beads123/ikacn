app.factory('incorder',function($http) {
    var obj = {};
    obj.data = {};
    obj.orderData = orderData;
    obj.o_status  = o_status;
    obj.o_type = ["所有","图片广告","文字广告","友情链接"];
    obj.o_status['list'][0] = [[false],false,false,'所有']
    obj.data.px = 1 //页数
    obj.data.pz = 10 // 每页条数
    obj.data.status = 0;
    obj.scrollDisabled = false;
    var url = [
        '/Order/indexSell',
        '/Order/index',
        '/Account/records'//消费记录
    ];

    obj.formatDate = function(time){
        if(!time)return;
        return new Date(time*1000).format('yyyy-MM-dd hh:mm')
    }

    obj.retType = function(f){
        return rtype[f];
    }

    obj.showStatus = function(status,arg,s,nin){
        var tmpStatus = obj.o_status['value'][status][s];
        var btn = [];
        if(tmpStatus){
            for(var n in tmpStatus){
                if(nin != n){
                    btn.push('<a href="'+replaceArg(tmpStatus[n],arg)+'" target="_blank">'+n+'</a>');
                }
            }
        }
        return btn.join('');
    }
    obj.isShow = function(n,arr){
        return in_array(n,arr);
    }
    //返回配置中的名称，比如已解决
    obj.getKeyName = function(s1,s2,s3){
        var tmpStatus = obj.o_status['value'][s1][s2];
        var i=0;
        for(var n in tmpStatus){
            if(s3){
                if(s3==i)return n;
            }else{
                return n;
            }
            i++;
        }
    }
    obj.changeStatus = function(k,u){
        obj.data.status = k;
        obj.submitData(false,u);
    }
    obj.data_type = '所有';
    obj.changeType = function(k,u){
        obj.data_type = k;
        obj.submitData(false,u);
    }
    obj.submitData = function(t,s){
        if(!t)obj.data.px = 1;
        if(obj.data_type == '所有'){
            obj.data.type = '';
        }else{
            obj.data.type = obj.data_type;
        }
        obj.data.stime = obj.stime;
        obj.data.etime = obj.etime;
        obj.data.e_stime = obj.endstime;
        obj.data.e_etime = obj.endetime;
        $http.post(memberUrl(url[s]), obj.data).success(function(data){
            if(data.statusCode==200){
                obj.data.pageMax = data.page.num_page
                if(obj.data.px==1){ //如果是第一页，那么把变量重新赋值
                    obj.orderData = data.data;
                    if(s==2){
                    	obj.countMsg = data; 
                    }
                }else{//否则把返回的结果累加进变量里面
                    if(data.data.length>0){
                        for(var g in data.data){
                            obj.orderData.push(data.data[g]);
                        }
                    }
                }
                if(obj.data.px >= data.page.num_page){ //如果当前页面大于等于总页面，那么不可以禁用滚动
                    obj.scrollDisabled = true;
                    return false;
                }
            }else{
                modal_alert(data.message)
            }
            
            obj.scrollDisabled = false;
           
        });

    }
    obj.loadMore = function(s){
        if(obj.scrollDisabled)return false;
        obj.scrollDisabled = true;
        if(obj.data.px < obj.data.pageMax)obj.data.px +=1;
        obj.submitData(true,s);
    }
    return obj;
});
