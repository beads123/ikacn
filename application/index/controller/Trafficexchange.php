<?php
namespace app\index\controller;
use think\Controller;
class Trafficexchange extends Controller
{
    /**
     * 网站入口
     */
    public function index() {
        return $this->fetch();
    }
    public function salesindex(){
        return $this->fetch();
    }
    public function adverwei_manage(){
        return $this->fetch();
    }
    public function adver_manage(){
        return $this->fetch();
    }
    
}
