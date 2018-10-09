<?php
namespace app\index\controller;
use app\common\controller\Base;
class Index extends Base
{
    protected $cid=[];
    protected $fid=1;
	public function _initialize()
    {
        parent::_initialize();
        $model = model('HhType');
        $cat = $model->where(['pid'=>0])->column('id,pid,typename');
        $ids = array_keys($cat);
        $cat2 = $model->where(['pid'=>['in',$ids]])->column('id,pid,typename');
        foreach ($cat2 as $key => $value) {
            //!isset($cat[$value['pid']]['child']) && $cat[$value['pid']]['child'] = [];
            $cat[$value['pid']]['child'][$key] = $value; 
        }
        $hot = model('HhList')->limit(5)->where("find_in_set('h',flag)")->field('id,title')->order('pubdate desc')->select();
        $new = model('HhList')->limit(10)->order('id desc')->field('id,title')->select();
        $wkey = model('HhKeywords')->limit(20)->order('rand()')->field('id,name')->select();
        $this->assign('wkey',$wkey);
        $this->assign('hot',$hot);
        $this->assign('new',$new);
        $this->assign('keywords','华乐网,头条新闻,头条,今日新闻头条,头条网,头条新闻,今日头条新闻,商业评论,科技资讯,互联网金融,科技新闻,移动互联网,网络游戏,电子商务,电信,智能手机,手游,内幕真相,宏观,趋势,创业,精选,有料,干货,有用,细节,内幕');
        $this->assign('description','华乐网(www.hahacn.com)集信息交流融合、IT技术信息、新媒体于一身的媒体平台。分析你的兴趣爱好,为你推荐喜欢的内容,并且越用越懂你.就要你好看,用专业的精神剖析时代，孜孜不倦探索科技与商业的未来。');
        $this->assign('webname','华乐网');
        $this->assign('nav',$cat);
    }

    /**
     * 网站入口
     */
    public function index() {
    	$model = model('HhList');
    	$cat = model('HhType')->where(['status'=>1])->column('id,typename');
    	$list = model('HhList')->order('pubdate desc')->limit(15)->select();;
    	foreach ($list as $key => &$value) {
    		$value['catname'] = $cat[$value['typeid']];
            $value['description'] = trim(mb_substr(strip_tags($value['content']), 0,100));
    		/*if($value['imgcount'] == 0){
    			$value['imgcount'] = count($value['detail']);
    		}*/

    	}
        $huandeng = $model->limit(5)->where("find_in_set('f',flag)")->field('id,title,litpic')->order('pubdate desc')->select();
        $tuijian = $model->limit(3)->where("find_in_set('c',flag)")->field('id,title,litpic')->order('pubdate desc')->select();
        $youce = $model->where("find_in_set('a',flag)")->field('id,title,litpic')->order('pubdate desc')->find();
        $this->assign('youce',$youce);
        $this->assign('huandeng',$huandeng);
        $this->assign('tuijian',$tuijian);
        $this->assign('list',$list);
        $this->assign('mobile','/m');
    	$this->assign('title','华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        return $this->fetch();
    }
    public function detail(){
    	$id = input('id');
    	$model = model('HhList');
    	$cur = $model->where(['id'=>$id])->find();
    	$pre = $model->where(['id'=>['lt',$id]])->order('id desc')->find();
    	$next = $model->where(['id'=>['gt',$id]])->order('id asc')->find();
    	$tuijian = $model->limit(6)->field('id,title,litpic')->order('pubdate desc')->select();
    	$cat = model('HhType')->where(['status'=>1])->column('id,typename');
    	$cur['catname'] = $cat[$cur['typeid']];
        $cur['description'] = trim(mb_substr(strip_tags($cur['content']), 0,100));
    	$this->assign('cur',$cur);
    	$this->assign('pre',$pre);
    	$this->assign('tuijian',$tuijian);
    	$this->assign('next',$next);
        $this->assign('mobile',url('m_detail/'.$id));
    	
    	$this->assign('title',$cur['title'].'-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
    	return $this->fetch();
    }
    public function mlist(){
    	$id = input('id');
    	$model = model('HhList');
    	$this->cid[] = $id;
    	$this->sumcatid($id);
    	$cat = model('HhType')->where(['status'=>1])->column('id,listtpl,typename');
        if(!empty($cat[$id]['listtpl'])){
            $list = $model->where(['typeid'=>['in',$this->cid]])->order('pubdate desc')->paginate(20);
        }else{
            $list = $model->where(['typeid'=>['in',$this->cid]])->order('pubdate desc')->paginate(49);
        }
    	foreach ($list as $key => &$value) {
    		$value['catname'] = $cat[$value['typeid']]['typename'];
            $value['description'] = trim(mb_substr(strip_tags($value['content']), 0,100));
    		if(empty($value['litpic'])){
    			$value['litpic'] = 'http://img.ikanchai.com/images/nopic.gif';
    		}

    	}
    	$page = $list->render();
		// 模板变量赋值
		$this->assign('list', $list);
		$this->assign('page', $page);
		$this->assign('ctype',$cat[$id]['typename']);
        $this->assign('mobile',url('m_list/'.$id).'?page='.(isset($_GET['page'])?$_GET['page']:1));
		$this->assign('title',$cat[$id]['typename'].'第('.(isset($_GET['page'])?$_GET['page']:1).')页-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        if(!empty($cat[$id]['listtpl'])){
            return $this->fetch($cat[$id]['listtpl']);
        }else{
            return $this->fetch();
        }
		
    }
    public function search(){
        $q = input('q');
        if(empty($q)){
            $this->error('关键字不能为空');
        }
        $model = model('HhList');
        $cat = model('HhType')->where(['status'=>1])->column('id,typename');
        $list = $model->where(['title'=>['like','%'.$q.'%']])->order('pubdate desc')->paginate(49,false,['query'=>request()->param()]);
        foreach ($list as $key => &$value) {
            $value['catname'] = $cat[$value['typeid']];
        }
        $page = $list->render();
        // 模板变量赋值
        $this->assign('q', $q);
        $this->assign('list', $list);
        $this->assign('page', $page);
        $this->assign('mobile','/m/search?q='.$q);
        $this->assign('title',$q.'-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        return $this->fetch();
    }
    public function sumcatid($pid){
    	$cat = model('HhType')->where(['status'=>1,'pid'=>$pid])->column('id');
    	if(!empty($cat)){
    		$this->cid = array_merge($this->cid,$cat);
    		foreach ($cat as $key => $value) {
    			$this->sumcatid($value['id']);
    		}
    	}
    	return ;
    }
    public function logout()
    {
        session("userid", NULL);
        session("username", NULL);
        return json(array('code' => 200, 'msg' => '退出成功'));
      //  return NULL;
    }
}
