<?php

// +----------------------------------------------------------------------
// | Think.Admin
// +----------------------------------------------------------------------
// | 版权所有 2016~2017 广州楚才信息科技有限公司 [ http://www.cuci.cc ]
// +----------------------------------------------------------------------
// | 官方网站: http://think.ctolog.com
// +----------------------------------------------------------------------
// | 开源协议 ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | github开源项目：https://github.com/zoujingli/Think.Admin
// +----------------------------------------------------------------------

namespace app\meiwen\controller;

/*use controller\BasicApi;
use service\FileService;
use service\HelperService;*/
use think\Controller;

class Test extends Controller {
	protected $mtype;
	public function _initialize()
    {
        $this->mtype = model('MwType')->column('id,pid');
        
    }
    public function setreid(){
    	$res = model('MwList')->where(['reid'=>null])->limit(1000)->select();
        if(!empty($res)){
            foreach ($res as $k => $v) {
                model('MwList')->where(['id'=>$v['id']])->update(['reid'=>$this->gettopid($v['typeid'])]);
            }
            sleep(15);
            
            $this->setreid();
        }
    	echo "ok";
    }

    public function index() {
        dump(FileService::oss('fassdfsa', 'fsadfasdf'));
    }
    function sms(){
    	HelperService::sms_send_code('1111');
    }
    function gettopid($tid){
        if($this->mtype[$tid] == 0){
        	return $tid;
        }else{
        	return $this->gettopid($this->mtype[$tid]);
        }
    }

}
