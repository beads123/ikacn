<?php
namespace app\meiwen\controller;

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
    protected $cname=[];
    protected $mcat; 
	public function _initialize()
    {
        $model = model('MwType');
        $this->mcat = $model->where(['pid'=>0])->cache(86400)->select();
        $this->assign('nav',$this->mcat);
        $c = $model->where("find_in_set('c',flag)")->cache(86400)->select();
        $this->assign('subnav',$c);
        $this->assign('keywords','美文,美文网,美文摘抄,经典美文,美文欣赏,美文美句,情感美文,散文精选,美文阅读网,华乐美文网');
        $this->assign('description','华乐美文网汇集以爱情,亲情,友情,人生为主题的情感美文网站,内含经典美文,哲理美文,励志等美文欣赏,提供短篇故事,心情随笔日记,优美散文精选,现代诗歌大全,表白情书范文,好词好句好段摘抄大全等读者文摘在线阅读');
        $this->assign('webname','华乐美文网');
    }
    /**
     * 网站入口
     */
    public function index() {
    	$model = model('MwList');
        $cat = model('MwType')->where(['status'=>1])->cache(86400)->column('id,typename');
        foreach ($this->mcat as $key => $value) {
            $this->cid[] = $value['id'];
            $this->sumcatid($value['id']);
            $limit = $value['id'] == 1?10:6;
            $dd = $model->where(['typeid'=>['in',$this->cid]])->order('addtime desc')->cache(3600)->limit($limit)->select();
            $list[$value['id']] = ['data'=>$dd,'catname'=>$cat[$value['id']],'id'=>$value['id']];
            foreach ($list[$value['id']]['data'] as $key => &$vv) {
                $vv['description'] = trim(mb_substr(strip_tags($vv['content']), 0,40));
                if(empty($vv['litpic'])){
                    $vv['litpic'] = '/static/images/mw_nojpg.jpg';
                }
            }
            unset($this->cid);
        }

    	
    	$huandeng = $model->limit(5)->where("find_in_set('f',flag) and litpic <> ''")->cache(3600)->field('id,title,litpic')->order('addtime desc')->select();
        $this->assign('huandeng',$huandeng);
    	$this->assign('list',$list);
    	$this->assign('title','美文阅读网,美文摘抄,经典美文,美文网,足不出户阅尽天下美文-华乐美文网');
        return $this->fetch();
    }
    public function m_detail(){
    	$id = input('id',0,'intval');
    	$model = model('MwList');
    	$cur = $model->where(['id'=>$id])->cache(86400)->find();
    	$pre = $model->where(['id'=>['lt',$id]])->cache(86400)->order('id desc')->find();
    	$next = $model->where(['id'=>['gt',$id]])->cache(86400)->order('id asc')->find();
    	$tuijian = $model->where("find_in_set('c',flag)")->cache(3600)->limit(4)->order('addtime desc')->select();
        $cur['description'] = trim(mb_substr(strip_tags($cur['content']), 0,100));
        $cur['addtime'] = date('Y-m-d H:i',$cur['addtime']);
    	$this->assign('cur',$cur);
    	$this->assign('pre',$pre);
    	$this->assign('tuijian',$tuijian);
    	$this->assign('next',$next);
    	
    	$this->assign('title',$cur['title'].'-美文阅读网,美文摘抄,经典美文,美文网,足不出户阅尽天下美文-华乐美文网');
    	return $this->fetch();
    }
    public function m_list(){
    	$id = input('id',0,'intval');
    	$model = model('MwList');
        $pages = isset($_POST['page'])?intval($_POST['page']):1;
    	$this->cid[] = $id;
    	$this->sumcatid($id);
    	$cat = model('HhType')->where(['status'=>1])->cache(86400)->column('id,typename');
    	$list = $model->where(['typeid'=>['in',$this->cid]])->cache(3600)->order('addtime desc')->paginate(12);
    	foreach ($list as $key => &$value) {
            $value['description'] = mb_substr(trim(strip_tags($value['content'])), 0,50);
            if(empty($value['litpic'])){
                $value['litpic'] = '/static/images/mw_nojpg.jpg';
            }
        }
    	$page = $list->render();
		// 模板变量赋值
		$this->assign('list', $list);
        $this->getcname($id);
        $this->assign('cname', implode(' · ', $this->cname));
        $this->assign('id', $id);
		$this->assign('page', $page);
		$this->assign('title',$cat[$id].'第('.$pages.')页-美文阅读网,美文摘抄,经典美文,美文网,足不出户阅尽天下美文-华乐美文网');
        if($pages>1){
            return json($list);
        }else{
            return $this->fetch();
        }
		
    }
    public function search(){
        $q = input('q','','htmlspecialchars');
        if(empty($q)){
            $this->error('关键字不能为空');
        }
        $pages = isset($_POST['page'])?$_POST['page']:1;
        $model = model('MwList');
        $cat = model('HhType')->where(['status'=>1])->cache(86400)->column('id,typename');
        $list = $model->where(['title'=>['like','%'.$q.'%']])->cache(3600)->order('addtime desc')->paginate(12,false,['query'=>request()->param()]);
        foreach ($list as $key => &$value) {
            $value['description'] = trim(mb_substr(strip_tags($value['content']), 0,50));
        }
        $page = $list->render();
        // 模板变量赋值
        $this->assign('q', $q);
        $this->assign('list', $list);
        $this->assign('page', $page);
        $this->assign('title',$q.'第('.$pages.')页-美文阅读网,美文摘抄,经典美文,美文网,足不出户阅尽天下美文-华乐美文网');
        if($pages>1){
            return json($list);
        }else{
            return $this->fetch();
        }
    }
    public function sumcatid($pid){
    	$cat = model('MwType')->cache(86400)->where(['status'=>1,'pid'=>$pid])->column('id');
    	if(!empty($cat)){
    		$this->cid = array_merge($this->cid,$cat);
    		foreach ($cat as $key => $value) {
    			$this->sumcatid($value);
    		}
    	}
    	return ;
    }

    //获取面包屑路径
    function getcname($id){
        if($id != 0){
            $cat = model('MwType')->cache(86400)->where(['status'=>1,'id'=>$id])->field('id,pid,typename')->find();
            $this->cname[] = $cat['typename'];
            $this->getcname($cat['pid']);
        }
    }
}