<?php
namespace app\index\controller;
use think\Controller;
class Websitetrade extends Controller
{
    /**
     * 网站入口
     */
    public function sellwebsite() {
        return $this->fetch();
    }
    public function buywebsite(){
        return $this->fetch();
    }
}
