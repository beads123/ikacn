<?php
namespace app\v\controller;
use app\common\controller\Base;
class Index extends Base
{
    protected $cat_cache = 'www_clist';
    protected $fid=1;
	public function _initialize()
    {
        //parent::_initialize();
        //全局标签定义
        //C('TOKEN_ON',false);//C('TOKEN_NAME','form_'.$array['model']);取消前端的表单令牌
        $array = array();
        $array['root'] = config('site_path');
        $module_name = request()->module();//当前操作的模型名
        $controller_name = request()->controller();//当前操作的控制器名
        $action_name = request()->action();//当前操作的方法名


        $array['model'] = strtolower($module_name);
        $array['action'] = strtolower($action_name); 
        $array['public_path'] = $array['root'].'Public/';   
        //$array['tpl_path'] = $array['root'].str_replace('./','',TEMPLATE_PATH).'/'; 
        $array['site_name'] = config('site_name');
        $array['site_domain'] = config('site_domain');
        $array['site_domain_m'] = config('site_domain_m');
        $array['site_url'] = 'http://'.config('site_domain');
        $array['site_title'] = config('site_title');
        $array['site_keywords'] = config('site_keywords');
        $array['site_description'] = config('site_description');
        $array['site_email'] = config('site_email');
        $array['site_copyright'] = config('site_copyright');
        $array['site_tongji'] = config('site_tongji');
        $array['site_icp'] = config('site_icp');
        $array['site_hot'] = $this->ff_site_hot(); 
        //$array['site_sid'] = intval(ff_module2sid($array['model']));
        $user = $this->ff_user_cookie();
        $array['site_user_id'] = $user['user_id'];
        $array['site_user_name'] = $user['user_name'];
        unset($user);
        $this->assign($array);
        $this->assign('feifeicms_version','3.2');
        
        $lmodel = model('HhView');
        $hot = $lmodel->limit(11)->cache(3600)->where("find_in_set('h',flag)")->field('id,title')->select();
        $new = $lmodel->cache(3600)->field('id,title,content')->limit(10)->select();
        foreach ($new as $key => &$value) {
            $value['description'] = trim(mb_substr(strip_tags($value['content']), 0,70));
        }
        /*$wkey = model('HhKeywords')->cache(86400)->limit(20)->order('rand()')->field('id,name')->select();
        $this->assign('wkey',$wkey);*/
        $this->assign('hot',$hot);
        $this->assign('new',$new);
        $this->assign('keywords','华乐网,头条新闻,头条,今日新闻头条,头条网,头条新闻,今日头条新闻,商业评论,科技资讯,互联网金融,科技新闻,移动互联网,网络游戏,电子商务,电信,智能手机,手游,内幕真相,宏观,趋势,创业,精选,有料,干货,有用,细节,内幕');
        $this->assign('description','华乐网(www.hahacn.com)集信息交流融合、IT技术信息、新媒体于一身的媒体平台。分析你的兴趣爱好,为你推荐喜欢的内容,并且越用越懂你.就要你好看,用专业的精神剖析时代，孜孜不倦探索科技与商业的未来。');
        $this->assign('webname','华乐网');
        $this->assign('nav',$this->topcat);
    }

    // 获取COOKIE用户信息
    function ff_user_cookie(){
        $encrypt = cookie('ff_user');
        if($encrypt){
            $user_cookie = explode('$feifeicms$', ff_decrypt($encrypt));
            $array = array();
            $array['user_id'] = intval($user_cookie[0]);
            $array['user_name'] = htmlspecialchars($user_cookie[1]);
            return $array;
        }else{
            return false;
        }
    }

    // 获取热门关键词
    function ff_site_hot($type='home'){
        if(!config('site_hot')){
            return false;
        }
        $array_hot = array();
        foreach(explode(chr(13),trim(config('site_hot'))) as $key=>$value){
            $array = explode('|',$value);
            if(isset($array[2])){
                $target = ' target="'.$array[2].'"';
            }else{
                $target = '';
            }
            if(isset($array[1])){
                $array_hot[$key] = '<a href="'.$array[1].'"'.$target.'>'.trim($array[0]).'</a>';
            }else{
                $array_hot[$key] = '<a href="'.url('vod/search',array('wd'=>urlencode(trim($array[0]))),true).'"'.$target.'>'.trim($array[0]).'</a>';
            }
        }
        if(config('url_html') && $type=='home'){
            return '<span class="ff-site-hot" id="ff-site-hot">'.implode('',$array_hot).'</span>';
        }
        return implode('',$array_hot);
    }

    public function getModel(){
        return model('HhType');
    }

    /**
     * 网站入口
     */
    public function index() {
        $item = $this->ff_mysql_vod('field:*;cid:5;limit:22;cache_name:default;cache_time:default;order:vod_stars desc,vod_id;sort:desc');




    	$model = model('HhView');
        $conlist=[];
        foreach ($this->topcat as $key => $value) {
            $this->clist[$key][] = $key;
            $tui = $model->limit(1)->where(['typeid'=>['in',$this->clist[$key]]])->where("find_in_set('c',flag)")->cache(3600)->field('id,title,litpic,content')->find();
            if(!empty($tui)){
                $tui['description'] = trim(mb_substr(strip_tags($tui['content']), 0,80));
            }
            $a = $model->where(['typeid'=>['in',$this->clist[$key]]])->where("find_in_set('a',flag)")->cache(3600)->field('id,title,content')->limit(2)->select();
            foreach ($a as $kk => &$vv) {
                //$value['catname'] = $cat[$value['typeid']];
                $vv['description'] = trim(mb_substr(strip_tags($vv['content']), 0,50));
            }
            $hot = $model->where(['typeid'=>['in',$this->clist[$key]]])->where("find_in_set('h',flag)")->cache(3600)->field('id,title,litpic')->limit(8)->select();
            $new = $model->where(['typeid'=>['in',$this->clist[$key]]])->where("flag = ''")->cache(3600)->field('id,title,litpic')->limit(5)->select();
            $img = $model->where(['typeid'=>['in',$this->clist[$key]],'litpic'=>['neq','']])->cache(3600)->limit(2)->select();
            foreach ($img as $kk => &$vvv) {
                //$value['catname'] = $cat[$value['typeid']];
                $vvv['description'] = mb_substr(trim(strip_tags($vvv['content'])), 0,60);
            }
            $conlist[] = [
                        'id'=>$key,
                        'typname'=> $this->allcat[$key]['typename'],
                        'tui'=>$tui,
                        'add'=>$a,
                        'hot'=>$hot,
                        'new'=>$new,
                        'img'=>$img,
                        'sub'=>isset($value['child'])?$value['child']:[]
                        ];
        }

/*    	$list = model('HhList')->order('pubdate desc')->limit(15)->select();;
    	foreach ($list as $key => &$value) {
    		$value['catname'] = $cat[$value['typeid']];
            $value['description'] = trim(mb_substr(strip_tags($value['content']), 0,100));
    	}*/
        $huandeng = $model->where("find_in_set('f',flag)")->cache(3600)->field('id,title,litpic')->limit(5)->select();
        $tuijian = $model->where("find_in_set('c',flag)")->cache(3600)->field('id,title,litpic')->limit(4)->select();
        $youce = $model->where("find_in_set('a',flag)")->cache(3600)->field('id,title,litpic')->limit(9)->select();
        $this->assign('week',$youce);
        $this->assign('huandeng',$huandeng);
        $this->assign('first',array_shift($tuijian));
        $this->assign('tuijian',$tuijian);
        //$this->assign('list',$list);
        $this->assign('clist', $conlist);
        $this->assign('mobile','/m');

        $this->assign('item',$item);
    	$this->assign('title',config('site_title'));
        return $this->fetch();
    }
    public function detail(){
    	$id = input('id',0,'intval');
    	$model = model('HhList');
        $lmodel = model('HhView');
    	$cur = $model->where(['id'=>$id])->cache(86400)->find();
        if(empty($cur)){
            $this->redirect('/');
            exit();
        }
    	$pre = $model->where(['id'=>['lt',$id]])->cache(86400)->order('id desc')->find();
    	$next = $model->where(['id'=>['gt',$id]])->cache(86400)->order('id asc')->find();
    	$tuijian = $lmodel->limit(6)->cache(86400)->field('id,title,litpic,typeid')->select();
        foreach ($tuijian as $key => &$vv) {
            $vv['tpname'] = $this->allcat[$vv['typeid']]['typename'];
        }
        $cur['addtime'] = date('Y-m-d H:i',$cur['pubdate']);
    	$cur['catname'] = $this->allcat[$cur['typeid']]['typename'];
        $cur['description'] = trim(mb_substr(strip_tags($cur['content']), 0,100));
        $type = [];
        foreach ($this->clist[$this->allcat[$cur['typeid']]['pid']] as $key => $value) {
            $type[] = ['id'=>$value,'tname'=>$this->allcat[$value]['typename']];
        }
        $this->assign('type', $type);
        $nav = $this->getnav($cur['typeid'],[]);
        krsort($nav);
        $this->assign('subnav', $nav);
    	$this->assign('cur',$cur);
    	$this->assign('pre',$pre);
        $this->assign('typeid', $cur['typeid']);
        $this->assign('ptype',$this->allcat[$cur['typeid']]['pid']>0?$this->allcat[$this->allcat[$cur['typeid']]['pid']]['typename']:$this->allcat[$this->allcat[$cur['typeid']]['id']]['typename']);
    	$this->assign('tuijian',$tuijian);
    	$this->assign('next',$next);
        $this->assign('mobile',url('m_detail/'.$id));
    	
    	$this->assign('title',$cur['title'].'-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
    	return $this->fetch();
    }
    public function mlist(){
    	$id = input('id',0,'intval');
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
    public function getnav($id,$arr){
        $cat = model('HhType')->where(['status'=>1,'id'=>$id])->cache(86400)->field('id,pid,typename')->find();
        //echo model('HhType')->getlastsql();
        //var_dump($cat);
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
    // 生成参数列表,以数组形式返回
    function ff_param_lable($tag = ''){
        //3.3增加传入数组则直接解析
        if(is_array($tag)){
            return $tag;
        }
        $param = array();
        $array = explode(';', $tag);
        foreach ($array as $v){
            list($key,$val) = explode(':',trim($v));
            $param[trim($key)] = trim($val);
        }
        return $param;
    }
    // 循环标签.视频
    function ff_mysql_vod($tag_str){
        $tag = $this->ff_param_lable($tag_str);
        var_dump($tag);
        $where = array();
        //根据参数生成查询条件
        $where['vod_status'] = array('eq',1);   
        if (isset($tag['ids'])) {
            $where['vod_id'] = array('in',$tag['ids']);
        }
        if (isset($tag['ids_not'])) {
            $where['vod_id'] = array('not in',$tag['ids_not']);
        }
        if ($tag['cid']) {
            $where['vod_cid'] = array('in',$tag['cid']);
        }
        if (isset($tag['cid_not'])) {
            $where['vod_cid'] = array('not in',$tag['cid_not']);
        }
        if (isset($tag['stars'])) {
            $where['vod_stars'] = array('in',$tag['stars']);
        }
        if (isset($tag['letter'])) {
            $where['vod_letter'] = array('in',$tag['letter']);
        }
        if (isset($tag['upday'])) {
            $where['vod_addtime'] = array('gt',ff_linux_time($tag['upday']));
        }
        if (isset($tag['lastday'])) {
            $where['vod_hits_lasttime'] = array('gt',ff_linux_time($tag['lastday']));
        }
        if (isset($tag['filmday'])) {
            $where['vod_filmtime'] = array('gt',ff_linux_time($tag['filmday']));
        }
        if (isset($tag['copyright'])) {
            $where['vod_copyright'] = array('gt',$tag['copyright']);
        }
        if(isset($tag['continu'])){
            $where['vod_continu'] = array('neq',0);
        }
        if(isset($tag['pic_slide'])){
            $where['vod_pic_slide'] = array('neq','');
        }
        if(isset($tag['pic_bg'])){
            $where['vod_pic_bg'] = array('neq','');
        }   
        if(isset($tag['scenario'])){
            $where['vod_scenario'] = array('neq','');
        }   
        if (isset($tag['ispay']) && $tag['ispay'] != "") {
            $where['vod_ispay'] = array('eq', intval($tag['ispay']));
        }
        if (isset($tag['list_ename'])) {
            $where['list_dir'] =  array('eq',$tag['list_ename']);
        }
        if(isset($tag['isend']) && $tag['isend'] == 'true'){
            $where['vod_isend'] = array('eq', 1);
        }else if(!isset($tag['isend']) || $tag['isend'] == 'false'){
            $where['vod_isend'] = array('eq', 0);
        }
        if (isset($tag['year'])) {
            $year = explode(',',$tag['year']);
            if (count($year) > 1) {
                $where['vod_year'] = array('between',$year[0].','.$year[1]);
            }else{
                $where['vod_year'] = array('eq',$tag['year']);
            }
        }   
        if (isset($tag['state'])) {
            $where['vod_state'] = array('eq',$tag['state']);
        }
        if (isset($tag['version'])) {
            $where['vod_version'] = array('eq',$tag['version']);
        }
        if (isset($tag['series'])) {
            $where['vod_series'] = array('eq',$tag['series']);
        }
        if (isset($tag['tv'])) {
            $where['vod_tv'] = array('eq',$tag['tv']);
        }   
        if (isset($tag['inputer'])) {
            $where['vod_inputer'] = array('eq',$tag['inputer']);
        }
        if (isset($tag['name'])) {
            $where['vod_name'] = array('like','%'.$tag['name'].'%');
        }
        if (isset($tag['title'])) {
            $where['vod_title'] = array('like','%'.$tag['title'].'%');
        }
        if (isset($tag['actor'])) {
            $where['vod_actor'] = array('like','%'.$tag['actor'].'%');
        }
        if (isset($tag['director'])) {
            $where['vod_director'] = array('like','%'.$tag['director'].'%');
        }
        if (isset($tag['weekday'])) {
            //$where['vod_weekday'] = array('in','周一,周二');
            //$where['vod_weekday'] = array(array('like','周一%'), array('like','周二%'), 'or');
            foreach(explode(',',$tag['weekday']) as $key=>$value){
                $where['vod_weekday'][] = array('like','%'.$value.'%');
            }
            $where['vod_weekday'][] = 'or';
        }
        if (isset($tag['area'])) {
            foreach(explode(',',$tag['area']) as $key=>$value){
                $where['vod_area'][] = array('like','%'.$value.'%');
            }
            $where['vod_area'][] = 'or';
        }
        if (isset($tag['language'])) {
            foreach(explode(',',$tag['language']) as $key=>$value){
                $where['vod_language'][] = array('like','%'.$value.'%');
            }
            $where['vod_language'][] = 'or';
        }
        if (isset($tag['play'])) {
            $where['vod_play'] = array('like','%'.$tag['play'].'%');
        }
        if (isset($tag['wd'])) {
            $search = array();
            $search['vod_name'] = array('like','%'.$tag['wd'].'%');
            $search['vod_title'] = array('like','%'.$tag['wd'].'%');
            $search['vod_actor'] = array('like','%'.$tag['wd'].'%');
            $search['vod_director'] = array('like','%'.$tag['wd'].'%');
            $search['_logic'] = 'or';
            $where['_complex'] = $search;
        }
        if (isset($tag['hits'])) {
            $hits = explode(',',$tag['hits']);
            if (count($hits) > 1) {
                $where['vod_hits'] = array('between',$hits[0].','.$hits[1]);
            }else{
                $where['vod_hits'] = array('gt',$hits[0]);
            }
        }
        if (isset($tag['up'])) {
            $up = explode(',',$tag['up']);
            if (count($up) > 1) {
                $where['vod_up'] = array('between',$up[0].','.$up[1]);
            }else{
                $where['vod_up'] = array('gt',$up[0]);
            }
        }
        if (isset($tag['down'])) {
            $down = explode(',',$tag['down']);
            if (count($down) > 1) {
                $where['vod_down'] = array('between',$down[0].','.$down[1]);
            }else{
                $where['vod_down'] = array('gt',$down[0]);
            }
        }
        if (isset($tag['gold'])) {
            $gold = explode(',',$tag['gold']);
            if (count($gold) > 1) {
                $where['vod_gold'] = array('between',$gold[0].','.$gold[1]);
            }else{
                $where['vod_gold'] = array('gt',$gold[0]);
            }
        }
        if (isset($tag['golder'])) {
            $golder = explode(',',$tag['golder']);
            if (count($golder) > 1) {
                $where['vod_golder'] = array('between',$golder[0].','.$golder[1]);
            }else{
                $where['vod_golder'] = array('gt',$golder[0]);
            }
        }
        //分支加载不同的模型查询数据开始
        if(isset($tag['tag_name'])){//视图模型查询
            $where['tag_name'] = array('in',$tag['tag_name']);
            if($tag['tag_cid']){
                $where['tag_cid'] = array('in',$tag['tag_cid']);
            }
            if($tag['tag_list']){
                $where['tag_list'] = $tag['tag_list'];
            }
            if($tag['tag_ename']){
                $where['tag_ename'] = $tag['tag_ename'];
            }
            $rs = model('TagvodView');
        }else{
            $rs = model('VodView');
        }
        var_dump($rs);
        return $rs->ff_select_page($this->ff_mysql_param($tag), $where);
    }
    // 循环标签查询参数格式化
    function ff_mysql_param($tag){
        $params = array();
        // 数据表字段
        $params['field']= isset($tag['field']) ? $tag['field'] : '*';
        // 查询条目
        $params['limit']= isset($tag['limit']) ? $tag['limit'] : '10';
        // 排序参数
        $params['order']= isset($tag['order']) ? $tag['order'] : '';
        $params['sort']= isset($tag['sort']) ? $tag['sort'] : '';
        // 分组参数
        $params['group']= isset($tag['group']) ? $tag['group'] : '';
        // 分页参数
        $params['page_is']= isset($tag['page_is']) ? $tag['page_is'] : false;
        $params['page_id']= isset($tag['page_id']) ? $tag['page_id'] : '';
        $params['page_p']= isset($tag['page_p']) ? $tag['page_p'] : '';
        // 缓存参数
        if($tag['cache_name'] ==  'default'){
            $params['cache_name'] = md5(config('cache_foreach_prefix').'_'.implode('_',$tag));
        }else{
            $params['cache_name']= isset($tag['cache_name']) ? md5(config('cache_foreach_prefix').'_'.$tag['cache_name']) : '';
        }
        // 缓存时间
        if($tag['cache_time'] == 'default'){
            $params['cache_time']= intval(config('cache_foreach'));
        }else{
            $params['cache_time']= isset($tag['cache_time']) ? intval($tag['cache_time']) : '';
        }
        return $params;
    }
    }
