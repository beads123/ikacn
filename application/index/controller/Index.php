<?php
namespace app\index\controller;
use app\common\controller\Base;
class Index extends Base
{
    private $fid = 9;
	public function _initialize()
    {
        parent::_initialize();
        /*$this->assign('keywords','华乐网,今日新闻头条,今日头条新闻,商业评论,科技资讯,互联网金融,科技新闻,移动互联网,网络游戏,手游,行业分析,新兴行业,科技前沿,科技媒体,商业分析,商业创新,科技创新');
        $this->assign('description','华乐网集信息交流融合、IT技术信息、新媒体于一身的媒体平台。分析你的兴趣爱好,为你推荐喜欢的内容,并且越用越懂你.就要你好看,用专业的精神剖析时代，孜孜不倦探索科技与商业的未来。');
        $this->assign('webname','华乐网');
        $this->assign('nav',$this->topcat);*/
    }

    /**
     * 网站入口
     */
    public function index() {
        $data = cache('cache_data_link'.$this->fid); 
        //$data = false;
        if ($data === false) { 
            $data = @file_get_contents('http://api.hahacn.com/other/link/type/'.$this->fid);
            cache('cache_data_link'.$this->fid, $data, 60*60); 
        }
        $flink = json_decode($data,true);
        $news = cache('cache_data_news'); 
        //$news = false;
        if ($news === false) { 
            $news = @file_get_contents('http://www.hahacn.com/index/zz_news.html');
            cache('cache_data_news', $news, 60*60); 
        }
        $mnews = json_decode($news,true);
        $this->assign('news', $mnews);
        $this->assign('flink', $flink);
        return $this->fetch();
    }
    public function detail(){
    	return $this->fetch();
    }
    public function mlist(){
        $id = input('id',0,'intval');
        $tpl = parent::pmlist($id);
        $model = $this->getlist();
        $lmodel = $this->getView();
        if($tpl =='mlist_channel'){
            $ctuijian = $model->limit(2)->where(['typeid'=>['in',$this->clist[$id]],'litpic'=>['neq','']])->cache(3600)->field('id,title,litpic,content')->order('addtime desc')->select();
            foreach ($ctuijian as $kk => &$vvv) {
                //$value['catname'] = $cat[$value['typeid']];
                $vvv['description'] = mb_substr(trim(strip_tags($vvv['content'])), 0,50);
            }
            $chuandeng = $model->limit(5)->where(['typeid'=>['in',$this->clist[$id]],'flag'=>'f'])->cache(3600)->field('id,title,litpic')->order('addtime desc')->select();
            $this->assign('chuandeng',$chuandeng);
            $this->assign('ctuijian',$ctuijian);
        }
        $this->assign('title',$this->allcat[$id]['typename'].'第('.(isset($_GET['page'])?intval($_GET['page']):1).')页-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        return $this->fetch($tpl);
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
            $value['description'] = mb_substr(trim(strip_tags($value['content'])), 0,100);
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
    public function _empty($pname){
        if(in_array($pname,['ad','sm'])){
            $model = model('HhPages');
            $cur = $model->where(['ename'=>$pname])->cache(86400)->find();
            $this->assign('cur', $cur);
            $this->assign('mobile',url('m/page',['p'=>$pname]));
            $this->assign('title',$cur['title'].'-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
            return $this->fetch('page');
        }else{

        }
        //把所有城市的操作解析到city方法
        //return $this->showCity($name);
    }

    /*public function page(){
        $pname = input('p');
        
    }*/
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
    //sso
    public function ssotpl(){
        //跨域访问的时候才会存在此字段
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        if(in_array($origin, $this->allow_origin)){  
            header('Access-Control-Allow-Origin:'.$origin);  
            header('Access-Control-Allow-Methods:POST');  
            header('Access-Control-Allow-Headers:x-requested-with,content-type');  
        }
        header('Content-Type:text/html; charset=utf-8');
        //$this->assign('mwnav',model('MwType')->where(['pid'=>0])->cache(86400)->limit(6)->column('id,pid,typename'));
        return $this->fetch('sso');
    }
    //login form
    public function login(){
        //跨域访问的时候才会存在此字段
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        if(in_array($origin, $this->allow_origin)){  
            header('Access-Control-Allow-Origin:'.$origin);  
            header('Access-Control-Allow-Methods:POST');  
            header('Access-Control-Allow-Headers:x-requested-with,content-type');  
        }
        return jsonp(['error_no'=>0,'error_msg'=>'','data'=>$this->fetch(),'token'=>'BE179FA772BEB215CF6F7D15B4F91F60965182E30E0232C8914165B9009A29F5296C67E226177484B532DD6B86B06CBBDBAB4E26927497CE0F22D5E3EC36FEEBF5FD2A87DF1548873E6CD26587A17FEA3A15ABDD8B04E06B065C48B8B56DD44A766BFA7DA08BB9B26C10F553B4B99AF60C577A04C95D53E6DCEB3B35CF0F6981']);
    }

    public function news(){
        //跨域访问的时候才会存在此字段
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        if(in_array($origin, $this->allow_origin)){  
            header('Access-Control-Allow-Origin:'.$origin);  
            header('Access-Control-Allow-Methods:POST');  
            header('Access-Control-Allow-Headers:x-requested-with,content-type');  
        }
        return jsonp(['error_no'=>0,'error_msg'=>'','anno'=>$this->new]);
    }
    public function pdate(){
        $model = $this->getlist();
        //do{
            $rs = $model->where(['id'=>['gt',656875],'typeid'=>31])->limit(1000)->select();
            foreach ($rs as $key => $value) {
                $rdate = mt_rand(time()-3600*24*60,time());
                //$value['pubdate'] = date("Y-m-d h:i:s",$rdate);
                $data['addtime'] = date("Y-m-d h:i:s",$rdate);
                $model->where(['id'=>$value['id']])->update($data);
            }
            //sleep(2);
        //}while (!empty($rs));
        
    }
    //getkeyword
    function getkeword(){
        $model = $this->getlist();
        $model2 = model('HhKeyword');
        $list = $model->limit(1000)->where(['keyword'=>null])->order('id asc')->select();
        foreach ($list as $key => $value) {
            $kw = $this->get_tags($value['title'],5);
            $tags = [];
            $arr = [];
            foreach ($kw as $k => $v) {
                $arr[] = ['word'=>$v['word'],'url'=>url('detail/'.$value['id']),'weight'=>$v['weight']];
                $tags[] = $v['word'];
            }
            $model2->saveAll($arr);
            $model->where(['id'=>$value['id']])->update(['keyword'=> implode(',', $tags)]);
        }
    }
    function getkeword_v(){
        $model = model('Vlist');
        $model2 = model('HhKeyword');
        $list = $model->limit(100)->where(['v_keyword'=>null])->order('v_id asc')->select();
        foreach ($list as $key => $value) {
            $kw = $this->get_tags($value['v_name'],5);
            $tags = [];
            $arr = [];
            foreach ($kw as $k => $v) {
                $arr[] = ['word'=>$v['word'],'url'=>'http://v.hahacn.com/detail/?'.$value['v_id'].'.html','weight'=>$v['weight']];
                $tags[] = $v['word'];
            }
            $model2->saveAll($arr);
            $model->where(['v_id'=>$value['v_id']])->update(['v_keyword'=> implode(',', $tags)]);
        }
    }
}
