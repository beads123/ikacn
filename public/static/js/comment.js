//console.log(newDate.format('yyyy-MM-dd h:m:s'));
Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
function replaceArg(url,arg){
    if(!url)return false;
    for(var i=0;i<arg.length;i++){
        url = url.replace(/({arg})/,arg[i]);
    }
    return url;
}
//判断数据组是否有对应的值
//在array中查找needle，bool为布尔量，如果为true则返回needle在array中的位置
function in_array(needle,array,bool){
    if(typeof needle=="string"||typeof needle=="number"){
        for(var i in array){
            if(needle===array[i]){
                if(bool){
                    return i;
                }
                return true;
            }
        }
        return false;
    }
}

