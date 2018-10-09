<?php
namespace app\member\controller;
use app\common\controller\Base;
class Index extends Base
{
    public function _initialize()
    {
        parent::_initialize();
        if(!cookie('sys_key')){
            $this->redirect(url('user/login','',true,'www'));
        }
    }
    public function index() {
        return $this->fetch();
    }
    public function login_out(){
        // session('userstatus', null);
        // session('grades', null);
        // session('userhead', null);
        // session('username', null);
        // session('userid', null);
        // session('point', null);
        cookie('sys_key',null);
        $this->redirect(url('user/login','',true,'www'));
    }
    public function getcate(){
        $id = input('id',0);
        $cat = model('Category')->where(['status'=>0,'pid'=>$id])->field('id,cname as name')->select();
        return json($cat);
    }
    public function fileuploadImg(){
        $img = input('post.image');
        $path = 'upload';
        return json(['image'=>$this->base64_image_content($img,$path)]);
    }
    /**
     * [将Base64图片转换为本地图片并保存]
     * @E-mial wuliqiang_aa@163.com
     * @TIME   2017-04-07
     * @WEB    http://blog.iinu.com.cn
     * @param  [Base64] $base64_image_content [要保存的Base64]
     * @param  [目录] $path [要保存的路径]
     */
    public function base64_image_content($base64_image_content,$path){
        //匹配出图片的格式
        if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $base64_image_content, $result)){
            $type = $result[2];
            $new_file = $path."/".date('Ymd',time())."/";
            if(!file_exists($new_file)){
                //检查是否有该文件夹，如果没有就创建，并给予最高权限
                mkdir($new_file, 0700);
            }
            $new_file = $new_file.time().".{$type}";
            if (file_put_contents($new_file, base64_decode(str_replace($result[1], '', $base64_image_content)))){
                return '/'.$new_file;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
    public function addwebsite(){
        $name = input('post.name');
        $url = input('post.url');
        $cid = input('post.cid');
        $sens = input('post.sensitive_advertising');
        $image = input('post.image','');

        model('Web')->save(['name'=>$name,'url'=>$url,'cid'=>$cid,'image'=>$image]);
        // 获取自增ID
        $web_id = model('Web')->id;
        return json(['statusCode'=>200,'message'=>'登录成功','web_id'=>$web_id]);
    }
    public function webinfo(){
        $p = input('post.px');
        $size = input('post.pz',10);
        $search = input('post.search');
        $where = [];
        if(!empty($search)){
            $where['w.cname'] = ['like','%'.$search.'%'];
        }
        $web = model('Web')->alias('w')->join('__WEB___ext we','w.id = we.webid','LEFT')->field('w.*,w.id as url_id,"" as adver,0 as autochain,image as image_fmt,false as yqlj,false as twgg,false as mfhl,false as wzjy,false as lljh,c1.cname as catename2,c2.cname as catename')->join('__CATEGORY__ c1','c1.id = w.cid','LEFT')->join('__CATEGORY__ c2','c2.id = c1.pid','LEFT')->where($where)->limit(($p-1)*$size,$size)->select();

        return json(['data'=>$web,'page'=>["num_rows"=>$size,"px"=>$p,"pz"=>$size,"num_page"=>$p],'statusCode'=>200]);
    }

    public function getupdweb(){
    	$wid = input('post.wid');
    	$data = model('Web')->where(['id'=>$wid])->field('*,image as image_fmt')->find();
    	return json($data);
    }

    public function updateweb(){
    	$name = input('post.name');
        $wid = input('post.wid');
        $cid = input('post.cid');
        $sens = input('post.sens');
        $image = input('post.image','');

        model('Web')->save(['name'=>$name,'cid'=>$cid,'image'=>$image],['id'=>$wid]);
        return json(['statusCode'=>200,'message'=>'登录成功','data'=>['image_fmt'=>$image,'list'=>[]]]);
    }

    public function refresh_caiji(){
    	$wid = input('post.wid');
    	return json(['statusCode'=>200,'message'=>'登录成功','res'=>false]);
    }
    
}
