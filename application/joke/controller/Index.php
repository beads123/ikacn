<?php

// +----------------------------------------------------------------------
// | Think.Admin
// +----------------------------------------------------------------------
// | 版权所有 2014~2017 广州楚才信息科技有限公司 [ http://www.cuci.cc ]
// +----------------------------------------------------------------------
// | 官方网站: http://think.ctolog.com
// +----------------------------------------------------------------------
// | 开源协议 ( https://mit-license.org )
// +----------------------------------------------------------------------
// | github开源项目：https://github.com/zoujingli/Think.Admin
// +----------------------------------------------------------------------

namespace app\joke\controller;

use app\common\controller\Base;

/**
 * 网站入口控制器
 * Class Index
 * @package app\index\controller
 * @author Anyon <zoujingli@qq.com>
 * @date 2017/04/05 10:38
 */
class Index extends Base {
	protected $cid=[];
	public function _initialize()
    {
        parent::_initialize();
        $model = model('JType');
        $cat = $model->where(['pid'=>0])->select();
        $this->assign('nav',$cat);
        $this->assign('type', 'index');
        $this->assign('webname','华乐笑话网');
        $this->assign('keywords','笑话,搞笑图片,冷笑话,谐音笑话,爆笑笑话,幽默笑话,成人笑话,笑话大全,爆笑短信,xiaohua,短信笑话,小笑话集锦,笑话短信,经典笑话,冷笑话大全,短笑话,搞笑短信,笑话吧,搞笑笑话');
        $this->assign('description','华乐笑话网(joke.hahacn.com)，与千万网友一起分享最新最热的爆笑笑话、搞笑图片、动态图、冷笑话、糗事笑话、成人笑话、经典笑话、内涵段子等笑话大全,开心每一天!');
        $model = model('Mlist');
        $list = $model->limit(8)->order('rand()')->select();
        $this->assign('mmtuijian', $list);
    }

    /**
     * 网站入口
     */
    public function index() {
    	$model = model('Jlist');
    	$list = $model->order('addtime desc')->paginate(12);
    	$cat = model('JType')->where(['status'=>1])->column('id,title');
    	foreach ($list as $key => &$value) {
    		$value['catname'] = $cat[$value['typeid']];
    	}
    	$page = $list->render();
		// 模板变量赋值
		$this->assign('list', $list);
		$this->assign('page', $page);
		$this->assign('type', 'index');
    	$this->assign('title','华乐笑话网 - 笑话大全,最新搞笑图片,爆笑冷笑话');
        return $this->fetch();
    }
    /**
     * 网站入口
     */
    public function rand() {
    	$model = model('Jlist');
    	$list = $model->order('rand(),addtime desc')->paginate(12);
    	$cat = model('JType')->where(['status'=>1])->column('id,title');
    	foreach ($list as $key => &$value) {
    		$value['catname'] = $cat[$value['typeid']];
    	}
    	$page = $list->render();
		// 模板变量赋值
		$this->assign('list', $list);
		$this->assign('page', $page);
		$this->assign('type', 'rand');
    	$this->assign('title','华乐笑话网 - 笑话大全,最新搞笑图片,爆笑冷笑话');
        return $this->fetch('index');
    }
    public function detail(){
    	$id = input('id');
    	$model = model('Jlist');
    	$count = 1;
    	$cpos = input('p',1);
    	$cur = $model->where(['id'=>$id])->find();
    	$pre = $model->where(['id'=>['lt',$id]])->order('id desc')->find();
    	$next = $model->where(['id'=>['gt',$id]])->order('id asc')->find();
    	$tuijian = $model->limit(12)->where(['typeid'=>['neq',1]])->order('rand(),addtime desc')->select();
    	$cat = model('JType')->where(['status'=>1])->column('id,title');
    	foreach ($tuijian as $key => &$value) {
    		$value['catname'] = $cat[$value['typeid']];
    	}
    	$cur['catname'] = $cat[$value['typeid']];
    	$this->assign('cur',$cur);
    	$this->assign('cpos',$cpos);
    	$this->assign('count',$count);
    	$this->assign('pre',$pre);
    	$this->assign('tuijian',$tuijian);
    	$this->assign('next',$next);
    	
    	$this->assign('title',$cur['title'].'('.$cpos.')-华乐笑话网 - 笑话大全,最新搞笑图片,爆笑冷笑话');
    	return $this->fetch();
    }
    public function mlist(){
    	$id = input('id');
    	$model = model('Jlist');
    	$this->cid[] = $id;
    	$this->sumcatid($id);
    	$cat = model('Type')->where(['status'=>1])->column('id,title');
    	$list = $model->where(['typeid'=>['in',$this->cid]])->order('addtime desc')->paginate(12);
    	foreach ($list as $key => &$value) {
    		$value['catname'] = $cat[$value['typeid']];
    	}
    	$page = $list->render();
		// 模板变量赋值
		$this->assign('id', $id);
		$this->assign('list', $list);
		$this->assign('page', $page);
		$this->assign('title',$cat[$id].'第('.(isset($_GET['page'])?$_GET['page']:1).')页-华乐笑话网 - 笑话大全,最新搞笑图片,爆笑冷笑话');
		return $this->fetch();
    }
    public function search(){
        $q = input('q');
        if(empty($q)){
            $this->error('关键字不能为空');
        }
        $model = model('Jlist');
        $cat = model('Type')->where(['status'=>1])->column('id,title');
        $list = $model->where(['title'=>['like','%'.$q.'%']])->order('addtime desc')->paginate(12);
        foreach ($list as $key => &$value) {
            $value['catname'] = $cat[$value['typeid']];
        }
        $page = $list->render();
        // 模板变量赋值
        $this->assign('q', $q);
        $this->assign('list', $list);
        $this->assign('page', $page);
        $this->assign('title',$q.'-华乐笑话网 - 笑话大全,最新搞笑图片,爆笑冷笑话');
        return $this->fetch();
    }
    public function so(){
        $q = input('q');
        if(empty($q)){
            $this->error('关键字不能为空');
        }
        $model = model('Jlist');
        $cat = model('Type')->where(['status'=>1])->column('id,title');
        $list = $model->where(['title'=>['like','%'.$q.'%']])->order('addtime desc')->paginate(12);
        foreach ($list as $key => &$value) {
            $value['catname'] = $cat[$value['typeid']];
        }
        $page = $list->render();
        // 模板变量赋值
        $this->assign('q', $q);
        $this->assign('list', $list);
        $this->assign('page', $page);
        $this->assign('title',$q.'-华乐笑话网 - 笑话大全,最新搞笑图片,爆笑冷笑话');
        return $this->fetch('search');
    }
    public function sumcatid($pid){
    	$cat = model('JType')->where(['status'=>1,'pid'=>$pid])->column('id');
    	if(!empty($cat)){
    		$this->cid = array_merge($this->cid,$cat);
    		foreach ($cat as $key => $value) {
    			$this->sumcatid($value['id']);
    		}
    	}
    	return ;
    }

}
