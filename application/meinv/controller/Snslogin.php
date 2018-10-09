<?php

// +----------------------------------------------------------------------
// | Think.Admin
// +----------------------------------------------------------------------
// | 版权所有 2016~2017 广州楚才信息科技有限公司 [ http://www.cuci.cc ]
// +----------------------------------------------------------------------
// | 官方网站: http://think.ctolog.com
// +----------------------------------------------------------------------
// | 开源协议 ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | github开源项目：https://github.com/zoujingli/Think.Admin
// +----------------------------------------------------------------------

namespace app\index\controller;

use think\Controller;
use service\HelperService;
use helper\OAuth;

class Snslogin extends Controller{
	protected $config = [];
	public function _initialize(){
        $this->config = config('qq_config');
        $this->config['app_key'] = sysconf('qq_app_key');
        $this->config['app_secret'] = sysconf('app_app_secret');
    }

    /**
     * 此处应当考虑使用空控制器来简化代码
     * 同时应当考虑对第三方渠道名称进行检查
     * $config配置参数应当放在配置文件中
     * callback对应了普通PC版的返回页面和移动版的页面
     */
    public function qq() {
        $OAuth  = OAuth::getInstance($this->config, 'qq');
        $OAuth->setDisplay('mobile'); //此处为可选,若没有设置为mobile,则跳转的授权页面可能不适合手机浏览器访问
        return redirect($OAuth->getAuthorizeURL());
    }

    public function callback($channel) {
        $OAuth    = OAuth::getInstance($this->config, $channel);
        $OAuth->getAccessToken();
        /**
         * 在获取access_token的时候可以考虑忽略你传递的state参数
         * 此参数使用cookie保存并验证
         */
//        $ignore_stat = true;
//        $OAuth->getAccessToken(true);
        $sns_info = $OAuth->userinfo();
        /**
         * 此处获取了sns提供的用户数据
         * 你可以进行其他操作
         */
    }

}