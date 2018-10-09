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
        $data = cache('cache_data_link'); 
        //$data = false;
        if ($data === false) { 
            $data = @file_get_contents('http://api.hahacn.com/other/link/type/9');
            cache('cache_data_link', 60*60); 
        }
	}
}