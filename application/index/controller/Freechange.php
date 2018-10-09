<?php
namespace app\index\controller;
use think\Controller;
class Freechange extends Controller
{
    /**
     * 网站入口
     */
    public function release() {
        return $this->fetch();
    }
    public function changelist(){
        return $this->fetch();
    }
}
