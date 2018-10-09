<?php
namespace app\index\controller;
use think\Controller;
class Weixin extends Controller
{
    /**
     * 网站入口
     */
    public function index() {
        return $this->fetch();
    }
    public function detail(){
        return $this->fetch();
    }
}
