app.factory("upimg", function ($http) {
    var obj = {}
    //  图片上传
    obj.imgSize = ''
    obj.imgName = ''
    obj.dataURL = ''
    obj.width = ''
    obj.height = ''
    obj.fileImg
    obj.baseImg = ''
    obj.imgType = '';
    obj.imgData = '' //接口返回的image数据
    //  将图片转成 base64

    obj.convertImgToBase64 = function (url, id, callback) {
        // var file = document.getElementById(id)
        var reader = new FileReader();
        var AllowImgFileSize = 2100000; //上传图片最大值(单位字节)（ 2 M = 2097152 B ）超过2M上传失败
        // var file = $(".img_upload")[0].files[0];
        var file = $(id)[0].files[0]
        var imgUrlBase64;
        if (file) {
            //将文件以Data URL形式读入页面  
            imgUrlBase64 = reader.readAsDataURL(file);
            reader.onload = function (e) {
                callback(reader.result)
            }
        }
    }

    //   图片上传时调用此方法  
    //    upId :上传图片的input的id   
    //    imgId : 预览图片的id
    // log 区分接口 用户头像1

    obj.getImg = function (upId, imgId, callback, log) {
        var file = document.getElementById(upId)

        $(upId).change(function () {

            var $file = $(this);
            var pic = $(imgId)   //预览图片
            var isIE = navigator.userAgent.match(/MSIE/) != null   // 是否为IE浏览器
            isIE = false;
            if (isIE) {
                if (file) {
                    file.select()
                }
                obj.dataURL = document.selection.createRange().text
            } else {
                var fileObj = $file[0];
                fileImg = fileObj.files[0]
                var windowURL = window.URL || window.webkitURL;
                obj.dataURL = windowURL.createObjectURL(fileObj.files[0]);
                obj.imgName = fileObj.files[0].name
                obj.imgSize = fileObj.files[0].size
                obj.imgType = fileObj.files[0].type;

            }
            if (obj.imgSize >= 2040000) {
                modal_alert("图片大小不能大于2M")
                return
            }

            var $this = this
            // var img = $(this).parent().find('img')[0]
            var img = $(imgId)
            obj.convertImgToBase64(obj.dataURL, upId, function (base64Img) {
                obj.imgSuccess = "上传中...";
                baseImg = base64Img //图片base64数据
                var imgurl = ''
                if (log == 1) {
                    imgurl = '/member/Account/fileupload'
                } else if (log == 2) {
                    imgurl = '/admin/User/fileuploadImg'
                } else {
                    imgurl = '/Index/fileuploadImg'
                }
                function getImgData() {
                    $http({
                        url: imgurl,
                        data: { image: baseImg },
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        transformRequest: function (obj) {
                            var str = [];
                            for (var o in obj)
                                if (obj[o]) str.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
                            return str.join("&");
                        }
                    }).success(function (data) {
                        obj.imgData = data.image
                        if (obj.imgData != null) {
                            callback(obj.imgData, obj)
                            obj.imgSuccess = "上传成功"
                            $(upId).val('');
                        } else {
                            // getImgData()
                            modal_alert("上传失败，请选择正确的图片格式上传(网站支持图片的格式为：jpg,png)");
                        }

                    }, function () {
                    })
                }
                getImgData()

            });
            $(imgId).attr('src', obj.dataURL);
            // 获取图片原始尺寸
            $("<img/>").attr("src", $(imgId).attr("src")).load(function () {
                obj.width = this.width
                obj.height = this.height
            })

        });
    }
    return obj
})