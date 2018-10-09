<?php
namespace app\common\controller;

//use think\Cache;
use think\Controller;
//use pscws4\PSCWS4;
class Base extends Controller
{
    public function _initialize(){
        $user = [];
        if(cookie('sys_key')){
            $user = unserialize(decrypt(cookie('sys_key')));
            $user['grade'] = model('Usergrade')->where(['id'=>$user['grades']])->value('name');
        }
        $this->assign('user',$user);
        $data = cache('cache_data_link'); 
        //$data = false;
        if ($data === false) { 
            $data = @file_get_contents('http://api.hahacn.com/other/link/type/9');
            cache('cache_data_link', 60*60); 
        }
	}
}