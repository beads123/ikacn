app.controller('articleControl',function($scope,$http) {

	$scope.active = 1;        //设置默认
	$scope.show = function(index){
		$scope.active = index;
	}

});	



$(function(){

	// 大图滚动
    $('.carousel').carousel({
        interval: 5000
    })

	// 微信公众号  切换
	$('.weixin_class').on('click', 'li', function(){
		$(this).addClass('active').siblings().removeClass('active');
		var categoryid = $(this).attr('categoryid');
		getPublicAccountsListByCategoryId({categoryid: categoryid});
	})
});
var apiurl = 'http://api.2898.com/';
//切换微信公众号列表
function getPublicAccountsListByCategoryId(data){
	$.ajax(
		{
			type : "post",
			url : "index/wechat/get_public_accounts_list_by_categoryid",
			async : true,
			dataType: 'json',
			data: data,
			success : function (obj)
			{
				var html = '';
				if(obj){
					for (var i = 0; i < obj.length; i++) {
						if(obj[i].subscription >= 10000){
							obj[i].subscription = (obj[i].subscription/10000).toFixed(1)+'万';
						}
						html += '<li class="clearfix">'
						html += '    <div class="zone-left">'
						html += '        <a href="wxdetails_'+obj[i].id+'.htm" target="_blank" class="zone-img">'
						html += '            <img src="'+apiurl+'readimg.php?type=qr_code&exec='+obj[i].avatar+'" alt="'+obj[i].nickname+'"/>'
						html += '        </a>'
						//html += '        <a href="index.php?route=weixinbuy&wechat='+obj[i].wechat+'" class="btn-white" target="_blank">查看价格</a>'
						html += '    </div>'
						html += '    <div class="zone-right">'
						html += '        <h4><a href="wxdetails_'+obj[i].id+'.htm" target="_blank" rel="nofollow">'+obj[i].nickname+'</a></h4>'
						html += '        <p class="zone-info"><a href="wxdetails_'+obj[i].id+'.htm" target="_blank" rel="nofollow" title="'+obj[i].introduct+'">'+obj[i].introduct+'</a></p>'
						html += '        <p class="has-icon-weixin">公众号：<a title="'+obj[i].wechat+'" href="wxdetails_'+obj[i].id+'.htm" target="_blank" class="tab-img" rel="nofollow">'+obj[i].wechat+'</a></p>'
						html += '        <p class="zone-footer">订阅量：<span class="text-red">'+obj[i].subscription+'</span></p>'
						html += '    </div>'
						html += '</li>'
					};
				}
				$('.weixin_list').html(html);
			},
			error : function (obj)
			{
				modal_alert("网络异常，请检查网络");

			}
		}
	);
}
