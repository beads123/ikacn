<?php
namespace app\index\controller;
use think\Controller;
class Twgoods extends Controller
{
    /**
     * 网站入口
     */
    public function twgoods() {
        return $this->fetch();
    }
    public function indexsell(){
        return $this->fetch();
    }
}
