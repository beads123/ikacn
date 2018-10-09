<?php
namespace app\index\controller;

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
        $model = model('HhType');
        $this->mcat = $model->where(['pid'=>0])->select();
        $this->assign('nav',$this->mcat);
        $c = $model->where("find_in_set('c',flag)")->select();
        $this->assign('subnav',$c);
        $this->assign('keywords','华乐网,头条新闻,头条,今日新闻头条,头条网,头条新闻,今日头条新闻,商业评论,科技资讯,互联网金融,科技新闻,移动互联网,网络游戏,电子商务,电信,智能手机,手游,内幕真相,宏观,趋势,创业,精选,有料,干货,有用,细节,内幕');
        $this->assign('description','华乐网(www.hahacn.com)集信息交流融合、IT技术信息、新媒体于一身的媒体平台。分析你的兴趣爱好,为你推荐喜欢的内容,并且越用越懂你.就要你好看,用专业的精神剖析时代，孜孜不倦探索科技与商业的未来。');
    }
    /**
     * 网站入口
     */
    public function index() {
    	$model = model('HhList');
        $cat = model('HhType')->where(['status'=>1])->column('id,typename');
        foreach ($this->mcat as $key => $value) {
            $this->cid[] = $value['id'];
            $this->sumcatid($value['id']);
            $limit = $value['id'] == 1?10:6;
            $dd = $model->where(['typeid'=>['in',$this->cid]])->order('addtime desc')->limit($limit)->select();
            $list[$value['id']] = ['data'=>$dd,'catname'=>$cat[$value['id']],'id'=>$value['id']];
            foreach ($list[$value['id']]['data'] as $key => &$vv) {
                $vv['description'] = trim(mb_substr(strip_tags($vv['content']), 0,50));
            }
            unset($this->cid);
        }

    	
    	$huandeng = $model->limit(5)->where("find_in_set('f',flag)")->field('id,title,litpic')->order('addtime desc')->select();
        $this->assign('huandeng',$huandeng);
    	$this->assign('list',$list);
    	$this->assign('title','华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        return $this->fetch();
    }
    public function m_detail(){
    	$id = input('id');
    	$model = model('HhList');
    	$cur = $model->where(['id'=>$id])->find();
    	$pre = $model->where(['id'=>['lt',$id]])->order('id desc')->find();
    	$next = $model->where(['id'=>['gt',$id]])->order('id asc')->find();
    	$tuijian = $model->limit(4)->order('rand(),addtime desc')->select();
        $cur['description'] = trim(mb_substr(strip_tags($cur['content']), 0,100));
    	$this->assign('cur',$cur);
    	$this->assign('pre',$pre);
    	$this->assign('tuijian',$tuijian);
    	$this->assign('next',$next);
    	
    	$this->assign('title',$cur['title'].'-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
    	return $this->fetch();
    }
    public function m_list(){
    	$id = input('id');
    	$model = model('HhList');
        $pages = isset($_POST['page'])?$_POST['page']:1;
    	$this->cid[] = $id;
    	$this->sumcatid($id);
    	$cat = model('HhType')->where(['status'=>1])->column('id,typename');
    	$list = $model->where(['typeid'=>['in',$this->cid]])->order('addtime desc')->paginate(12);
    	foreach ($list as $key => &$value) {
            $value['description'] = trim(mb_substr(strip_tags($value['content']), 0,50));
        }
    	$page = $list->render();
		// 模板变量赋值
		$this->assign('list', $list);
        $this->getcname($id);
        $this->assign('cname', implode(' · ', $this->cname));
        $this->assign('id', $id);
		$this->assign('page', $page);
		$this->assign('title',$cat[$id].'第('.$pages.')页-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        if($pages>1){
            return json($list);
        }else{
            return $this->fetch();
        }
		
    }
    public function search(){
        $q = input('q');
        if(empty($q)){
            $this->error('关键字不能为空');
        }
        $pages = isset($_POST['page'])?$_POST['page']:1;
        $model = model('HhList');
        $cat = model('HhType')->where(['status'=>1])->column('id,typename');
        $list = $model->where(['title'=>['like','%'.$q.'%']])->order('pubdate desc')->paginate(12,false,['query'=>request()->param()]);
        foreach ($list as $key => &$value) {
            $value['description'] = trim(mb_substr(strip_tags($value['content']), 0,50));
        }
        $page = $list->render();
        // 模板变量赋值
        $this->assign('q', $q);
        $this->assign('list', $list);
        $this->assign('page', $page);
        $this->assign('title',$q.'第('.$pages.')页-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        if($pages>1){
            return json($list);
        }else{
            return $this->fetch();
        }
    }
    public function sumcatid($pid){
    	$cat = model('HhType')->where(['status'=>1,'pid'=>$pid])->column('id');
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
            $cat = model('HhType')->where(['status'=>1,'id'=>$id])->field('pid,typename')->find();
            $this->cname[] = $cat['typename'];
            $this->getcname($cat['pid']);
        }
    }
}