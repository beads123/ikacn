<?php
namespace app\index\controller;
use think\Controller;
use service\geetestlib;
class Geetest extends Controller
{
    /**
     * 网站入口
     */
    public function getverfiy() {
        $GtSdk = new GeetestLib(config('CAPTCHA_ID'), config('PRIVATE_KEY'));
        $data = array(
                "user_id" => "test", # 网站用户id
                "client_type" => "web", #web:电脑上的浏览器；h5:手机上的浏览器，包括移动应用内完全内置的web_view；native：通过原生SDK植入APP应用的方式
                "ip_address" => "127.0.0.1" # 请在此处传输用户请求验证时所携带的IP
            );

        $status = $GtSdk->pre_process($data, 1);
        session('gtserver',$status);
        session('user_id',$data['user_id']);
        echo $GtSdk->get_response_str();
    }
}