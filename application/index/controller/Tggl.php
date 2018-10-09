<?php
namespace app\index\controller;
use think\Controller;
class Tggl extends Controller
{
    /**
     * 网站入口
     */
    public function index() {
        return $this->fetch();
    }
    public function indexsell(){
        return $this->fetch();
    }
}
