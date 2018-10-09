<?php
namespace app\meinv\controller;

use think\Controller;

/**
 * 网站入口控制器
 * Class Index
 * @package app\index\controller
 * @author Anyon <zoujingli@qq.com>
 * @date 2017/04/05 10:38
 */
class M extends Controller {
	protected $cid=[];
	public function _initialize()
    {
        $model = model('Type');
        $cat = $model->where(['pid'=>0])->select();
        $this->assign('nav',$cat);
        $this->assign('keywords','妹子图,妹子,美女图片,性感美女,美女写真,华乐美图网,性感妹子,图片新闻');
        $this->assign('description','华乐美图网(mm.hahacn.com)每日分享最新最全最好看的性感美女图片、高清美女写真,图片新闻,妹子自拍分享,做最好的美图网站！');
    }

    /**
     * 网站入口
     */
    public function index() {
    	$model = model('Mlist');
    	$list = $model->limit(32)->order('addtime desc')->select();
    	$cat = model('Type')->where(['status'=>1])->column('id,title');
    	foreach ($list as $key => &$value) {
    		$value['catname'] = $cat[$value['typeid']];
    		if($value['imgcount'] == 0){
    			$value['imgcount'] = count($value['detail']);
    		}

    	}
    	$this->assign('list',$list);
    	$this->assign('title','华乐美图网 - 每日分享性感妹子,高清美女图片,优质图片新闻');
        return $this->fetch();
    }
    public function m_detail(){
    	$id = input('id');
    	$model = model('Mlist');
    	$count = 1;
    	$cpos = input('p',1);
    	$cur = $model->where(['id'=>$id])->find();
    	$pre = $model->where(['id'=>['lt',$id]])->order('id desc')->find();
    	$next = $model->where(['id'=>['gt',$id]])->order('id asc')->find();
    	$tuijian = $model->limit(4)->order('rand(),addtime desc')->select();
    	$cat = model('Type')->where(['status'=>1])->column('id,title');
    	foreach ($tuijian as $key => &$value) {
    		$value['catname'] = $cat[$value['typeid']];
    		if($value['imgcount'] == 0){
    			$value['imgcount'] = count($value['detail']);
    		}

    	}
    	$detail = json_decode($cur['detail'],true);
    	if(!empty($detail)){
    		$count = count($detail);
    	}else{
    		$detail[] = $cur['imgurl'];
    	}
    	$cur['catname'] = $cat[$value['typeid']];
    	$this->assign('cimg',$detail[$cpos-1]);
    	$this->assign('cur',$cur);
    	$this->assign('cpos',$cpos);
    	$this->assign('count',$count);
    	$this->assign('pre',$pre);
    	$this->assign('tuijian',$tuijian);
    	$this->assign('next',$next);
    	
    	$this->assign('title',$cur['title'].'('.$cpos.')-华乐美图网 - 每日分享性感妹子,高清美女图片,优质图片新闻');
    	return $this->fetch();
    }
    public function m_list(){
    	$id = input('id');
    	$model = model('Mlist');
    	$this->cid[] = $id;
    	$this->sumcatid($id);
    	$cat = model('Type')->where(['status'=>1])->column('id,title');
    	$list = $model->where(['typeid'=>['in',$this->cid]])->order('addtime desc')->paginate(12);
    	foreach ($list as $key => &$value) {
    		$value['catname'] = $cat[$value['typeid']];
    		if($value['imgcount'] == 0){
    			$value['imgcount'] = count($value['detail']);
    		}

    	}
    	$page = $list->render();
		// 模板变量赋值
		$this->assign('list', $list);
		$this->assign('page', $page);
		$this->assign('title',$cat[$id].'第('.(isset($_GET['page'])?$_GET['page']:1).')页-华乐美图网 - 每日分享性感妹子,高清美女图片,优质图片新闻');
		return $this->fetch();
    }
    public function sumcatid($pid){
    	$cat = model('Type')->where(['status'=>1,'pid'=>$pid])->column('id');
    	if(!empty($cat)){
    		$this->cid = array_merge($this->cid,$cat);
    		foreach ($cat as $key => $value) {
    			$this->sumcatid($value['id']);
    		}
    	}
    	return ;
    }

}
