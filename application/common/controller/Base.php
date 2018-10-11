<?php
namespace app\common\controller;

//use think\Cache;
use think\Controller;
//use pscws4\PSCWS4;
class Base extends Controller
{
    protected $user=[];
    public function _initialize(){
        if(cookie('sys_key')){
            $this->user = unserialize(decrypt(cookie('sys_key')));
            $this->user['grade'] = model('Usergrade')->where(['id'=>$this->user['grades']])->value('name');
        }
        $this->assign('user',$this->user);
	}
}