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
        
        $c_cat = $this->getModel()->where("flag = 'c'")->cache(86400)->column('id,pid,typename');
        $this->assign('c_cat',$c_cat);
        $this->assign('keywords','美文,美文网,美文摘抄,经典美文,美文欣赏,美文美句,情感美文,散文精选,美文阅读网,华乐美文网');
        $this->assign('description','华乐美文网汇集以爱情,亲情,友情,人生为主题的情感美文网站,内含经典美文,哲理美文,励志等美文欣赏,提供短篇故事,心情随笔日记,优美散文精选,现代诗歌大全,表白情书范文,好词好句好段摘抄大全等读者文摘在线阅读');
        $this->assign('webname','华乐美文网');
        
    }
    public function getModel(){
        return model('MwType');
    }
    public function getView(){
        return model('MwView');
    }
    public function getlist(){
        return model('MwList');
    }    

    /**
     * 网站入口
     */
    public function index() {
        parent::index();
        $model = $this->getView();
        //$huandeng = $model->limit(5)->where("find_in_set('f',flag)")->cache(3600)->field('id,title,litpic')->order('addtime desc')->select();
        $huandeng = $model->where("litpic <> ''")->cache(3600)->field('id,title,litpic')->limit(5)->select();
        
        $this->assign('huandeng',$huandeng);
        $this->assign('mobile','/m');
        $this->assign('title','美文阅读网,美文摘抄,经典美文,美文网,足不出户阅尽天下美文-华乐美文网');
        return $this->fetch();
    }
    public function detail(){
        $cur['title'] = parent::detail();
        $this->assign('title',$cur['title'].'-美文阅读网,美文摘抄,经典美文,美文网,足不出户阅尽天下美文-华乐美文网');
        return $this->fetch();
    }
    public function mlist(){
        $id = input('id',0,'intval');
        $tpl = parent::pmlist($id);
        $this->assign('title',$this->allcat[$id]['typename'].'第('.(isset($_GET['page'])?$_GET['page']:1).')页-美文阅读网,美文摘抄,经典美文,美文网,足不出户阅尽天下美文-华乐美文网');
        return $this->fetch($tpl);
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
            $value['description'] = mb_substr(trim(strip_tags($value['content'])), 0,100);
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
