<?php
namespace app\index\controller;
use think\Controller;
class Goods extends Controller
{
    /**
     * 网站入口
     */
    public function friendgoods() {
        return $this->fetch();
    }
    public function indexsell(){
        return $this->fetch();
    }
}
