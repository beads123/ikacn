<?php
namespace app\meinv\controller;

use app\common\controller\Base;

/**
 * 网站入口控制器
 * Class Index
 * @package app\index\controller
 * @author Anyon <zoujingli@qq.com>
 * @date 2017/04/05 10:38
 */
class Index extends Base {
    protected $cat_cache = 'mm_clist';
    protected $fid = 3;
    public function _initialize()
    {
        parent::_initialize();
        $this->assign('keywords','妹子图,妹子,美女图片,性感美女,美女写真,华乐美图网,性感妹子,图片新闻');
        $this->assign('description','华乐美图网(mm.hahacn.com)每日分享最新最全最好看的性感美女图片、高清美女写真,图片新闻,妹子自拍分享,做最好的美图网站！');
    }
    public function getModel(){
        return model('Type');
    }

    /**
     * 网站入口
     */
    public function index() {
        $model = model('Mlist');
        $list = $model->limit(40)->order('id desc')->select();
        foreach ($list as $key => &$value) {
            $value['catname'] = $this->allcat[$value['typeid']]['typename'];
            if($value['imgcount'] == 0){
                $value['imgcount'] = count($value['detail']);
            }
            $value['imgurl'] = chang_pic($value['imgurl']);
        }
        $this->assign('list',$list);
        $this->assign('mobile','/m');
        $this->assign('title','华乐美图网 - 每日分享性感妹子,高清美女图片,优质图片新闻');
        return $this->fetch();
    }
    public function detail(){
        $id = input('id',0,'intval');
        $model = model('Mlist');
        $count = 1;
        $cpos = input('p',1,'intval');
        $cur = $model->where(['id'=>$id])->cache(120)->find();
        if(empty($cur)){
            $cur = $model->where(['lid'=>$id])->cache(120)->find();
            if(!empty($cur)){
                header("Location:".url('detail/'.$cur['id']));
                exit();
            }else{
                header("Location:/");
                exit();
            }
        }
        $pre = $model->where(['id'=>['lt',$id]])->cache(120)->order('id desc')->find();
        $next = $model->where(['id'=>['gt',$id]])->cache(120)->order('id asc')->find();
        $tuijian = $model->limit(10)->order('id desc')->cache(120)->select();
        foreach ($tuijian as $key => &$value) {
            $value['catname'] = $this->allcat[$value['typeid']]['typename'];
            if(empty($value['imgcount'])){
                $value['imgcount'] = count(json_decode($value['detail'],true));
            }
            $value['imgurl'] = chang_pic($value['imgurl']);
        }
        $detail = json_decode($cur['detail'],true);
        if(!empty($detail)){
            $count = count($detail);
        }else{
            $detail[] = $cur['imgurl'];
        }
        $cur['catname'] = $this->allcat[$cur['typeid']]['typename'];
        $cimg = chang_pic($detail[$cpos-1]);
        $this->assign('cimg',$cimg);
        $this->assign('cur',$cur);
        $this->assign('cpos',$cpos);
        $this->assign('count',$count);
        $this->assign('pre',$pre);
        $this->assign('tuijian',$tuijian);
        $this->assign('next',$next);
        $this->assign('mobile',url('m_detail/'.$id.'/'.$cpos));
        
        $this->assign('title',$cur['title'].'('.$cpos.')-华乐美图网 - 每日分享性感妹子,高清美女图片,优质图片新闻');
        return $this->fetch();
    }
    public function mlist(){
        $id = input('id',0,'intval');
        $model = model('Mlist');
        $this->clist[$id][] = $id;
        $list = $model->where(['typeid'=>['in',$this->clist[$id]]])->cache(120)->order('id desc')->paginate(40);
        foreach ($list as $key => &$value) {
            $value['catname'] = $this->allcat[$value['typeid']]['typename'];
            if(empty($value['imgcount'])){
                $value['imgcount'] = count(json_decode($value['detail'],true));
            }
            $value['imgurl'] = chang_pic($value['imgurl']);
        }
        $page = $list->render();
        // 模板变量赋值
        $this->assign('list', $list);
        $this->assign('page', $page);
        $this->assign('cname', $this->allcat[$id]['typename']);
        $this->assign('mobile',url('m_list/'.$id).'?page='.(isset($_GET['page'])?$_GET['page']:1));
        $this->assign('title',$this->allcat[$id]['typename'].'第('.(isset($_GET['page'])?intval($_GET['page']):1).')页-华乐美图网 - 每日分享性感妹子,高清美女图片,优质图片新闻');
        return $this->fetch();
    }
    public function getnew(){
        $model = model('Mlist');
        $list = $model->limit(8)->cache(2*60*60)->order('id desc')->select();
        foreach ($list as $key => &$value) {
            $value['imgurl'] = chang_pic($value['imgurl']);
        }
        return json($list);
    }
    function logout(){
        $this->lout();
    }
    public function clear(){
        echo "ddd";
        cache('qingchu');
    }
}