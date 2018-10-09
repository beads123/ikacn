<?php
namespace app\daohang\controller;
use app\common\controller\Base;
class Index extends Base
{
    protected $cat_cache = 'dh_clist';
    protected $fid=8;
	public function _initialize()
    {
        parent::_initialize();

        $this->assign('keywords','华乐网,头条新闻,头条,今日新闻头条,头条网,头条新闻,今日头条新闻,商业评论,科技资讯,互联网金融,科技新闻,移动互联网,网络游戏,电子商务,电信,智能手机,手游,内幕真相,宏观,趋势,创业,精选,有料,干货,有用,细节,内幕');
        $this->assign('description','华乐网(www.hahacn.com)集信息交流融合、IT技术信息、新媒体于一身的媒体平台。分析你的兴趣爱好,为你推荐喜欢的内容,并且越用越懂你.就要你好看,用专业的精神剖析时代，孜孜不倦探索科技与商业的未来。');
        $this->assign('webname','华乐网');
    }
    public function getModel(){
        return model('Categories');
    }

    /**
     * 网站入口
     */
    public function index() {
        $top = $this->get_websites(0, 20, false, 'instat');
        $model = model('Website');
        $categories = model('Categories')->field('id,typename')->where("find_in_set('c',flag)")->order('sort asc,id asc')->select();
        foreach ($categories as $key => &$value) {
            $value['cate_link'] = $this->get_category_url($value['id']);
            $value['child'] = $this->get_websites($value['id'], 9);
        }
        $new = $this->get_websites(0, 13);


        $this->assign('top',$top);
        $this->assign('categories',$categories);
        $this->assign('new',$new);
        $this->assign('category',model('Categories')->count());
        $this->assign('website',model('Website')->where(['web_status'=>3])->count());
        $this->assign('apply',model('Website')->where(['web_status'=>2])->count());
    	$this->assign('title','华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        return $this->fetch();
    }
    public function detail(){
        $web_id = input('id',0,'intval');
        $model = model('Website');
        $where = "a.web_status=3 AND a.web_id=$web_id";
        $web = $model->alias('a')->join('webdata b','a.web_id=b.web_id','left')->where($where)->field('a.user_id, a.cate_id, a.web_id, a.web_name, a.web_url, a.web_tags, a.web_intro, a.web_istop, a.web_isbest, a.web_status, a.web_ctime, b.web_ip, b.web_grank, b.web_brank, b.web_srank, b.web_arank, b.web_instat, b.web_outstat, b.web_views, b.web_utime')->find();
        if (!$web) {
            unset($web);
            redirect('/');
        }
        $dmodel = model('Webdata');
        $dmodel->where(['web_id'=>$web['web_id']])->setInc('web_views');
        
        $cate = $this->get_one_category($web['cate_id']);

        $this->assign('title',$web['web_name'].' - '.$cate['cate_name'].'-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        !empty($web['web_tags']) && $this->assign('keywords',$web['web_tags']) ;
        !empty($web['web_intro']) && $this->assign('description',$web['web_intro']) ;
        $this->assign('site_path', $this->get_sitepath($web['cate_id']).' &raquo; 站点详细');
        $this->assign('site_rss', $this->get_rssfeed($web['cate_id']));
        
        $this->assign('cate_id', $cate['cate_id']);
        $this->assign('cate_name', $cate['cate_name']);
        $this->assign('cate_keywords', $cate['cate_keywords']);
        $this->assign('cate_description', $cate['cate_description']);

        $web['web_furl'] = format_url($web['web_url']);
        $web['web_thumb'] = get_webthumb($web['web_url']);
        $web['web_ip'] = long2ip($web['web_ip']);
        $web['web_ctime'] = date('Y-m-d', $web['web_ctime']);
        $web['web_utime'] = date('Y-m-d', $web['web_utime']);
        
        /** tags */
        $web_tags = get_format_tags($web['web_tags']);
        $this->assign('web_tags', $web_tags);
        $this->assign('web', $web);
        $this->assign('related_website', $this->get_websites($web['cate_id'], 10, false, 'ctime'));
    	return $this->fetch();
    }
    public function mlist(){
    	$id = 
    	$model = model('HhList');
        $this->clist[$id][] = $id;
        //echo "dddd";
        //var_dump($this->clist[$id]);
        //exit();
        if(!empty($this->allcat[$id]['listtpl'])){
            $list = $model->where(['typeid'=>['in',$this->clist[$id]]])->cache(3600)->paginate(10);
        }else{
            $list = $model->where(['typeid'=>['in',$this->clist[$id]]])->cache(3600)->order('pubdate desc')->paginate(49);
        }
    	foreach ($list as $key => &$value) {
            $value['addtime'] = date('Y-m-d H:i',$value['pubdate']);
    		$value['catname'] = $this->allcat[$value['typeid']]['typename'];
            $value['description'] = trim(mb_substr(strip_tags($value['content']), 0,100));
    		if(empty($value['litpic'])){
    			$value['litpic'] = 'http://img.ikanchai.com/images/nopic.gif';
    		}

    	}
    	$page = $list->render();
		// 模板变量赋值
        $type = [];
        foreach ($this->clist[$this->allcat[$id]['pid']] as $key => $value) {
            $type[] = ['id'=>$value,'tname'=>$this->allcat[$value]['typename']];
        }
        $this->assign('type', $type);   // 
        $nav = $this->getnav($id,[]);
        krsort($nav);
        $this->assign('subnav', $nav);   // 
		$this->assign('list', $list);
		$this->assign('page', $page);
        $this->assign('typeid', $id);
        $len = $nav[count($nav)-1]['id'];
		$this->assign('ptype',$this->allcat[$len]['typename']);
        $this->assign('ctype',$this->allcat[$id]['typename']);
        $this->assign('mobile',url('m_list/'.$id).'?page='.(isset($_GET['page'])?intval($_GET['page']):1));
		$this->assign('title',$this->allcat[$id]['typename'].'第('.(isset($_GET['page'])?intval($_GET['page']):1).')页-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        if(!empty($this->allcat[$id]['listtpl']) && $this->allcat[$id]['listtpl'] == 'mlist_channel'){
            $cat = model('HhType')->where(['status'=>1,'pid'=>$id])->cache(86400)->column('id,pid,typename');
            $clist=[];
            $lmodel = model('HhView');
            foreach ($cat as $key => $value) {
                $this->clist[$key][] = $key;
                $tui = $lmodel->limit(1)->where(['typeid'=>['in',$this->clist[$key]],'litpic'=>['neq','']])->where("find_in_set('c',flag)")->cache(3600)->field('id,title,litpic,content')->find();
                if(!empty($tui)){
                    $tui['description'] = trim(mb_substr(strip_tags($tui['content']), 0,40));
                }
                $new = $lmodel->limit(6)->where(['typeid'=>['in',$this->clist[$key]]])->where("flag = ''")->cache(3600)->field('id,title,litpic,addtime')->select();
                $clist[] = [
                            'id'=>$key,
                            'typname'=> $this->allcat[$key]['typename'],
                            'tui'=>$tui,
                            'new'=>$new,
                            ];
            }
            $ctuijian = $lmodel->limit(2)->where("find_in_set('c',flag)")->where(['typeid'=>['in',$this->clist[$id]],'litpic'=>['neq','']])->cache(3600)->field('id,title,litpic,content')->select();
            foreach ($ctuijian as $kk => &$vvv) {
                //$value['catname'] = $cat[$value['typeid']];
                $vvv['description'] = trim(mb_substr(strip_tags($vvv['content']), 0,50));
            }
            $chuandeng = $lmodel->limit(5)->where("find_in_set('f',flag)")->where(['typeid'=>['in',$this->clist[$id]]])->cache(3600)->field('id,title,litpic')->select();
            $this->assign('chuandeng',$chuandeng);
            $this->assign('ctuijian',$ctuijian);
            $this->assign('clist', $clist);
            return $this->fetch($this->allcat[$id]['listtpl']);
        }if(!empty($this->allcat[$id]['listtpl'])){
            return $this->fetch($this->allcat[$id]['listtpl']);
        }else{
            return $this->fetch();
        }
		
    }
    public function search(){
        $q = input('q','','htmlspecialchars');
        if(empty($q)){
            $this->error('关键字不能为空');
        }
        $model = model('HhList');
        $list = $model->where(['title'=>['like','%'.$q.'%']])->cache(3600)->order('pubdate desc')->paginate(49,false,['query'=>request()->param()]);
        foreach ($list as $key => &$value) {
            $value['title'] = str_replace($q, "<font color='red'>".$q."</font>", $value['title']);
            $value['description'] = trim(mb_substr(strip_tags($value['content']), 0,100));
            $value['catname'] = $this->allcat[$value['typeid']]['typename'];
        }
        $page = $list->render();
        // 模板变量赋值
        $this->assign('q', $q);
        $this->assign('list', $list);
        $this->assign('page', $page);
        $this->assign('ptype','');
        $this->assign('mobile','/m/search?q='.$q);
        $this->assign('title',$q.'-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        return $this->fetch();
    }
    public function page(){
        $pname = input('p');
        $model = model('HhPages');
        $cur = $model->where(['ename'=>$pname])->cache(86400)->find();
        $this->assign('cur', $cur);
        $this->assign('mobile',url('m/page',['p'=>$pname]));
        $this->assign('title',$cur['title'].'-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        return $this->fetch();
    }
    public function act(){
        $pname = input('actname');
        return $this->fetch($pname);
    }
    function getTreeArray($arr,$pid,$lev=0,$tree=[]){
        //$tree=array();
        foreach ($arr as $key => $value) {
            if($value['pid']==$pid){
                $value['lev']=$lev;
                //$tree[]=$value;
                $tree[]=$value['id'];
                $tree = $this->getTreeArray($arr,$value['id'],$lev+1,$tree);
            }
        }
        return $tree;
    }
    public function getnav($id,$arr){
        $cat = model('HhType')->where(['status'=>1,'id'=>$id])->cache(86400)->find();
        $arr[] = ['id'=>$cat['id'],'tname'=>$cat['typename']];
        if(!empty($cat) && $cat['pid'] != 0){
            return $this->getnav($cat['pid'],$arr);
        }else{
            return $arr;
        }
    }
    public function logout()
    {
        session("userid", NULL);
        session("username", NULL);
        return json(array('code' => 200, 'msg' => '退出成功'));
      //  return NULL;
    }
    //

    function get_websites($cate_id = 0, $top_num = 10, $is_best = false, $field = 'ctime', $order = 'desc') {
        $model = model('Website');
        
        $where = 'w.web_status=3';
        if (!in_array($field, array('grank', 'brank', 'srank', 'arank', 'instat', 'outstat', 'views', 'ctime'))) $field = 'ctime';
        /*if ($cate_id > 0) {
            $cate = get_one_category($cate_id);
            if (!empty($cate)) $where .= " AND w.cate_id IN (".$cate['cate_arrchildid'].")";
        }*/
        if ($is_best == true) $where .= " AND w.web_isbest=1";
        switch ($field) {
            case 'grank' :
                $sortby = "d.web_grank";
                break;
            case 'brank' :
                $sortby = "d.web_brank";
                break;
            case 'srank' :
                $sortby = "d.web_srank";
                break;
            case 'arank' :
                $sortby = "d.web_arank";
                break;
            case 'instat' :
                $sortby = "d.web_itime";
                break;
            case 'outstat' :
                $sortby = "d.web_otime";
                break;
            case 'views' :
                $sortby = "d.web_views";
                break;
            case 'ctime' :
                $sortby = "w.web_ctime";
                break;
            default :
                $sortby = "w.web_ctime";
                break;
        }
        $order = strtoupper($order);
        $web = $model->alias('w')->join('categories c','w.cate_id=c.id','left')->join('webdata d','w.web_id=d.web_id','left')->where($where)->field('w.web_id, w.web_name, w.web_url, w.web_intro, w.web_ctime, c.id, c.typename, d.web_grank,  d.web_brank, d.web_srank, d.web_arank, d.web_instat, d.web_outstat, d.web_views,web_tags,cate_id')->order("$sortby $order")->limit($top_num)->select();
        //cache(3600)->
        foreach ($web as $key => &$value) {
            $value['web_thumb'] = get_webthumb($value['web_url']);
            $value['web_url'] = format_url($value['web_url']);
            $value['web_link'] = get_website_url($value['web_id']);
            $value['web_tags'] = get_format_tags($value['web_tags']);
            $value['web_ctime'] = date('Y-m-d', $value['web_ctime']);
            $value['cate_link'] = $this->get_category_url($value['cate_id']);
        }
        return $web;
    }
    /** category */
    function get_category_url($cate_id = 0, $page = 1) {
        if ($cate_id > 0) {
            $cate = model('Categories')->where(['id'=>$cate_id])->cache(86400)->field('id,typename')->find();
            $cate_dir = !empty($cate['cate_dir']) ? $cate['cate_dir'] : 'category';
            unset($cate);
            $page = isset($page) && $page > 0 ? $page : 1;
            $strurl = url('index/mlist',['id'=>$cate_id]);  
        }

        return $strurl;
    }
    /** one category */
    function get_one_category($cate_id = 0) {
        $row = model('Categories')->where(['id'=>$cate_id])->cache(86400)->field('id,typename')->find();
    }
    /** site path */
    function get_sitepath($cate_id = 0) {
        $strpath = '当前位置：<a href="/">华乐网</a>'.($cate_id > 0 ? $this->get_category_path($cate_id) : '');
        
        return $strpath;
    }
    /** category path */
    function get_category_path($cate_id = 0, $separator = ' &raquo; ') {
        $cate = $this->get_one_category($cate_id);
        if (!isset($cate)) return '';
        $categories = model('Categories')->where(['pid'=>$cate_id])->select();
        foreach ($categories as $row) {
            $strpath .= $separator.'<a href="'.$this->get_category_url($row['id']).'">'.$row['typename'].'</a>';
        }
        unset($cate, $categories);
        
        return $strpath;
    }
    /** rss link */
    function get_rssfeed($cate_id = 0) {
        return '<a href="'.url('Index/rssfeed',['cid'=>$cate_id]).'" target="_blank"><img src="/static/images/rss.gif" alt="订阅RssFeed" border="0" /></a>';
    }
}
