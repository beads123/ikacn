<?php
namespace app\meiwen\controller;

use app\common\controller\Base;
use think\Db;
/**
 * 网站入口控制器
 * Class Index
 * @package app\index\controller
 * @author Anyon <zoujingli@qq.com>
 * @date 2017/04/05 10:38
 */
class Index extends Base {
    protected $cat_cache = 'mw_clist';
    protected $fid = 6;
    public function _initialize()
    {
        parent::_initialize();
        $hot = self::getView()->limit(12)->cache(3600)->where("flag = 'h'")->field('id,title')->select();
        $new = self::getView()->limit(12)->cache(3600)->field('id,title,content,typeid')->select();
        foreach ($new as $kk => &$vv) {
            $vv['catname'] = $this->allcat[$vv['typeid']]['typename'];
            $vv['description'] = mb_substr(trim(strip_tags($vv['content'])), 0,50);
        }
        $c_cat = $this->getModel()->where("find_in_set('c',flag)")->cache(86400)->column('id,pid,typename');
        $this->assign('c_cat',$c_cat);
        $this->assign('new',$new);
        $this->assign('hot',$hot);
        $this->assign('keywords','美文,美文网,美文摘抄,经典美文,美文欣赏,美文美句,情感美文,散文精选,美文阅读网,华乐美文网');
        $this->assign('description','华乐美文网汇集以爱情,亲情,友情,人生为主题的情感美文网站,内含经典美文,哲理美文,励志等美文欣赏,提供短篇故事,心情随笔日记,优美散文精选,现代诗歌大全,表白情书范文,好词好句好段摘抄大全等读者文摘在线阅读');
        $this->assign('webname','华乐美文网');
        
    }
    public function getModel(){
        return model('MwType');
    }
    public static function getView(){
        return model('MwView');
    }
    

    /**
     * 网站入口
     */
    public function index() {
        $model = self::getView();
        $list=[];
        $i = 0;
        foreach ($this->topcat as $key => $value) {
            if($i>=5){
                break;
            }
            /*Db::field('name')
          ->table('think_user_0')
          ->union(['SELECT name FROM think_user_1','SELECT name FROM think_user_2'])
          ->select();

          $m_acc = model('...');
            $a = $m_acc->field('... as a,...')->where(...)->group('...')->buildSql();
            $b = $m_acc->field('... as a,...')->where(...)->group('...')->buildSql();
            $c = $m_acc->field('... as a,...')->where(...)->group('...')->buildSql();
            $e = $m_acc->field('... as a,...')->where(...)->group('...')->buildSql();
            $e = $m_acc->field('... as a,...')->where(...)->group('...')->union([$a,$b,$c,$d])->buildSql();
            //到这里，已经可以把$e当做一个正常表来进行操作了，什么分页、group by、where随便用，使用"DB::table($e . ' a')"即可
            $res = Db::table($e.' a')
                ->field('...')
                ->group('...')
                ->paginate(5);
            return json($res);*/



            $this->clist[$key][] = $key;
            //$a = $model->where(['typeid'=>['in',$this->clist[$key]],'flag'=>'a'])->cache(3600)->field('id,addtime,title,content,typeid')->limit(8)->select();
            //echo $model->getlastsql();
            $arr = [];
            foreach ($this->clist[$key] as $k => $value) {
                //$arr[] = $model->cache(3600)->where(['typeid'=>$value,'flag'=>'a'])->field('id,addtime,title,content,typeid')->fetchSql(true)->select();
               $arr[] = $model->cache(3600)->where(['typeid'=>$value,'flag'=>'a'])->field('id,addtime,title,content,typeid')->limit(2)->buildSql();
               //var_dump($model->cache(3600)->field('id,addtime,title,content,typeid')->fetchSql(true)->select());
            }
            //$e = $model->cache(3600)->where(['typeid'=>$key,'flag'=>'a'])->field('id,addtime,title,content,typeid')->fetchSql(true)->select();;
            $e = $model->cache(3600)->where(['typeid'=>$key,'flag'=>'a'])->field('id,addtime,title,content,typeid')->limit(2)->union($arr)->buildSql();
            $a = Db::table($e.' a')->cache(3600)->field('id,addtime,title,content,typeid')->limit(8)->select();
            foreach ($a as $kk => &$vv) {
                $vv['ctime'] = date('Y-m-d',$vv['addtime']);
                $vv['catname'] = $this->allcat[$vv['typeid']]['typename'];
                $vv['description'] = mb_substr(trim(strip_tags($vv['content'])), 0,50);
            }
            $hot = $model->where(['typeid'=>['in',$this->clist[$key]],'flag'=>'h'])->cache(3600)->field('id,title,litpic')->limit(12)->select();
            $new = $model->where(['typeid'=>['in',$this->clist[$key]],'flag'=>''])->cache(3600)->field('id,title,typeid,litpic,from_unixtime(addtime,"%Y-%m-%d") as ctime')->limit(8)->select();
            foreach ($new as $kk => &$vv) {
                $vv['catname'] = $this->allcat[$vv['typeid']]['typename'];
                //$vv['description'] = mb_substr(trim(strip_tags($vv['content'])), 0,50);
            }
            $img = $model->where(['typeid'=>['in',$this->clist[$key]],'litpic'=>['neq','']])->cache(3600)->limit(2)->select();
            foreach ($img as $kk => &$vvv) {
                $vvv['description'] = mb_substr(trim(strip_tags($vvv['content'])), 0,60);
            }
            $list[] = [
                        'id'=>$key,
                        'typname'=> $this->allcat[$key]['typename'],
                        'add'=>$a,
                        'hot'=>$hot,
                        'new'=>$new,
                        'img'=>$img,
                        'sub'=>isset($value['child'])?$value['child']:[]
                        ];
            $i++;
        }
        //$huandeng = $model->limit(5)->where("find_in_set('f',flag)")->cache(3600)->field('id,title,litpic')->order('addtime desc')->select();
        $huandeng = $model->where("litpic <> ''")->cache(3600)->field('id,title,litpic')->limit(5)->select();
        
        $this->assign('clist',$list);
        $this->assign('huandeng',$huandeng);
        $this->assign('mobile','/m');
        $this->assign('title','美文阅读网,美文摘抄,经典美文,美文网,足不出户阅尽天下美文-华乐美文网');
        return $this->fetch();
    }
    public function detail(){
        $id = input('id',0,'intval');
        $model = model('MwList');
        $cur = $model->where(['id'=>$id])->cache(86400)->find();
        if(empty($cur)){
            $this->redirect('Index/index');
            exit();
        }
        $pre = $model->where(['id'=>['lt',$id]])->cache(86400)->order('id desc')->find();
        $next = $model->where(['id'=>['gt',$id]])->cache(86400)->order('id asc')->find();
        $tuijian = self::getView()->where(['litpic'=>['neq','']])->cache(86400)->field('id,title,litpic,typeid')->limit(8)->select();
        foreach ($tuijian as $key => &$vv) {
            $vv['tpname'] = $this->allcat[$vv['typeid']]['typename'];
        }
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
        
        $this->assign('title',$cur['title'].'-美文阅读网,美文摘抄,经典美文,美文网,足不出户阅尽天下美文-华乐美文网');
        return $this->fetch();
    }
    public function mlist(){
        $id = input('id',0,'intval');
        $model = model('MwList');
        $this->clist[$id][] = $id;
        if(!empty($this->allcat[$id]['listtpl'])){
            $list = $model->where(['typeid'=>['in',$this->clist[$id]]])->cache(3600)->paginate(10);
        }else{
            $list = $model->where(['typeid'=>['in',$this->clist[$id]]])->cache(3600)->paginate(10);
        }
        foreach ($list as $key => &$value) {
            $value['catname'] = $this->allcat[$value['typeid']]['typename'];
            $value['description'] = mb_substr(trim(strip_tags($value['content'])), 0,100);
            if(empty($value['litpic'])){
                $value['litpic'] = 'http://img.ikanchai.com/images/nopic.gif';
            }

        }
        $page = $list->render();
          
        // 模板变量赋值
        $type = model('MwType')->where(['pid'=>$id])->cache(86400)->column('id,pid,typename');
        if(empty($type)){
            $type = model('MwType')->where(['pid'=>$this->allcat[$id]['pid']])->cache(86400)->column('id,pid,typename');
        }
        $this->assign('type', $type);  // 
        $nav = $this->getnav($id,[]);
        krsort($nav);
        $this->assign('subnav', $nav);   // 
        $this->assign('list', $list);
        $this->assign('page', $page);
        $this->assign('typeid', $id);
        $this->assign('ctype',$this->allcat[$id]['typename']);
        $this->assign('mobile',url('m_list/'.$id).'?page='.(isset($_GET['page'])?$_GET['page']:1));
        $this->assign('title',$this->allcat[$id]['typename'].'第('.(isset($_GET['page'])?$_GET['page']:1).')页-美文阅读网,美文摘抄,经典美文,美文网,足不出户阅尽天下美文-华乐美文网');
        if(!empty($this->allcat[$id]['listtpl']) && $this->allcat[$id]['listtpl'] == 'mlist_channel'){
            $cat = model('MwType')->where(['status'=>1,'pid'=>$id])->cache(86400)->column('id,pid,typename');
            $clist=[];
            foreach ($cat as $key => $value) {
                $this->clist[$key][] = $key;
                $tui = self::getView()->limit(1)->where(['typeid'=>['in',$this->clist[$key]]])->cache(3600)->field('id,title,litpic,addtime,content')->find();
                if(!empty($tui)){
                    $tui['description'] = trim(mb_substr(strip_tags($tui['content']), 0,40));
                }
                $list = self::getView()->limit(8)->where(['typeid'=>['in',$this->clist[$key]]])->cache(3600)->field('id,title,litpic,addtime')->select();
                if(!empty($list)){
                    //foreach ($mlist as $key => &$value) {
                        //$value['description'] = trim(mb_substr(strip_tags($value['content']), 0,40));
                    //}
                }
                $clist[] = [
                            'id'=>$key,
                            'typname'=> $this->allcat[$key]['typename'],
                            'tui'=>$tui,
                            'list'=>$list,
                            ];
            }
            $this->assign('clist', $clist);
            return $this->fetch($this->allcat[$id]['listtpl']);
        }
        if(!empty($this->allcat[$id]['listtpl'])){
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
        $model = model('MwList');
        $list = $model->where(['title'=>['like','%'.$q.'%']])->cache(3600)->order('addtime desc')->paginate(49,false,['query'=>request()->param()]);
        foreach ($list as $key => &$value) {
            $value['title'] = str_replace($q, "<font color='red'>".$q."</font>", $value['title']);
            $value['description'] = trim(mb_substr(strip_tags($value['content']), 0,100));
            $value['catname'] = $this->allcat[$value['typeid']]['typename'];
            $value['addtime'] = date('Y-m-d H:i',$value['addtime']);
        }
        $page = $list->render();
        // 模板变量赋值
        $this->assign('q', $q);
        $this->assign('list', $list);
        $this->assign('page', $page);
        $this->assign('ptype','');
        $this->assign('mobile','/m/search?q='.$q);
        $this->assign('title','搜索页_'.$q.'-美文阅读网,美文摘抄,经典美文,美文网,足不出户阅尽天下美文-华乐美文网');
        return $this->fetch();
    }
    public function getnav($id,$arr){
        $cat = model('MwType')->where(['status'=>1,'id'=>$id])->cache(86400)->find();
        $arr[] = ['id'=>$cat['id'],'tname'=>$cat['typename']];
        if(!empty($cat) && $cat['pid'] != 0){
            return $this->getnav($cat['pid'],$arr);
        }else{
            return $arr;
        }
    }
    public function getnew(){
        $model = model('MwList');
        $list = $model->limit(8)->cache(2*60*60)->order('id desc')->select();
        return json($list);
    }
    function logout(){
        $this->lout();
    }
}
