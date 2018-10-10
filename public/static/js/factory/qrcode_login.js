var connopen,oldCode;
app.factory("qrcodeLogin",function($websocket){
    var flowExchange = window.location.protocol.split(":")[0];
    var http = flowExchange === "https"?'wss':'ws';
    var websocketServer = http+"://www.2898.com/qrcodeLogin";
    //var websocketServer = http+"://192.168.0.153:8001/";
    var obj = {}
    var conn = function(){
        try{
            var dataStream = $websocket(websocketServer);
            dataStream.onMessage(function(message) {
                var tmp = JSON.parse(message.data);
                obj.data = tmp;
                if(!tmp.qrcode){
                    obj.data.qrcode = oldCode;
                }else{
                    oldCode = tmp.qrcode;
                }
                if(obj.data.act == 'success'){
                    $.cookie('token',obj.data.token,{path:'/'});
                    if(referer!=''){
                        window.location.href = referer;
                    }else{
                        window.location.href = memberUrl('/account/member');
                    }
                }
            });
            dataStream.onClose(function(){
                obj.data = {
                    act:'outlink'
                };
            })
            dataStream.onOpen(function(){
                obj.reCode()
            });
            dataStream.onError(function(){
                obj.data = {
                    act:'error'
                };
            })
            return dataStream;
        }catch(e){
            obj.data = {
                act:'error'
            };
            return false;
        }
    }
    obj.isMessage = function(c){
        var ret = false;
        switch (c){
            case 'timeout':
                ret = '已失效, 请刷新'
                break;
            case 'success':
                ret =  '正在登录'
                break;
            case 'scanned':
                ret = '扫码成功，请登录'
                break;
            case 'error':
                ret =  '请用帐号登录'
                break;
            case 'outlink':
                ret =  '请重新连接'
                break;
        }
        return ret;
    }
    obj.reCode = function(){
        var token =  $.cookie('token');
        //已经登录
        if(token){
            return;
        }
        if(!connopen){
            connopen = conn();
        }else{
            connopen.send(JSON.stringify({act:'reCode'}));
        }
    }
    obj.isOpen = function(){
        obj.reCode();
    }
    obj.closeOpen = function(){
        if(connopen){
            connopen.close()
            connopen = null;
        }
    }
    return  obj;
});
