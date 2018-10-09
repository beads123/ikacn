<?php
namespace app\index\controller;
use think\Controller;
class Web extends Controller
{
    public function _initialize()
    {
    }

    /**
     * 网站入口
     */
    public function index() {
        return $this->fetch();
    }
    public function wlist(){
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
}
