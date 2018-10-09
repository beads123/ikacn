<?php
namespace app\pinglun\controller;
use think\Controller;
use think\Db;
class Index extends Controller
{
    protected $userid=0;
    protected $username=0;
    protected $allow_origin = array( 
        'http://www.hahacn.com',  
        'http://www.cq4a.com',  
        'http://joke.hahacn.com',  
        'http://mm.hahacn.com',
        'http://mw.hahacn.com',
        'http://jk.hahacn.com',
        'http://mall.hahacn.com',
        'http://v.hahacn.com',
        'http://ch.hahacn.com',
        'http://yx.hahacn.com'
    );
	public function _initialize()
    {
        //跨域访问的时候才会存在此字段
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        if(in_array($origin, $this->allow_origin)){  
            header('Access-Control-Allow-Origin:'.$origin);  
            header('Access-Control-Allow-Methods:POST');  
            header('Access-Control-Allow-Headers:x-requested-with,content-type');  
        }
        $user = [];
        if(cookie('sys_key')){
            $user = unserialize(decrypt(cookie('sys_key')));
            if($user['userhead']==''){
                $user['userhead']='http://img.ikanchai.com/images/nohead.jpg';
            }else{
                $user['userhead']='http://bbs.hahacn.com'.$user['userhead'];
            }
            $this->userid = $user['id'];
            $this->username = $user['username'];
        }
        /*$flink = json_decode($data,true);
        $this->assign('flink', $flink);
        $this->assign('user', $user);*/
    }

    public function getModel(){
        return model('HhType');
    }
    public function getView(){
        return model('HhView');
    }
    public function getlist(){
        return model('HhList');
    }

    /**
     * 网站入口
     */
    public function index() {
    	return $this->fetch();
    }
    function subcomment() {
        $data['uid'] = $this->userid; 
        $data['mtype'] = input('post.mtype/int',0); 
        if ($data['uid'] == '') { 
            echo json_encode(array("code" => -1)); 
        } else { 
            $content = addslashes(str_replace("\n", "<br />", $_POST['content']));
            $data['tid'] = input('post.id/int',0);//文章id 
            if (strlen(preg_replace('/\[[^\)]+?\]/x', '', $content)) < 10) { 
                echo json_encode(array("code" => "short than 10", "error" => "评论的内容不能少于10个字符。")); 
                exit; 
            } 
            //if (C("DB_PWD") != '') { 
                if (time() - session("comment_time") < 60 && session("comment_time") > 0) {//2分钟以后发布 
                    echo json_encode(array("code" => "fast", "error" => "您提交评论的速度太快了，请稍后再发表评论。")); 
                    exit; 
                } 
            //}
            $data['pid'] = input('post.pid/int',0);
            $data['pid_sub'] = input('post.pid_sub/int',0);
            $lyid = $data['pid_sub'] > 0 ? $data['pid_sub'] : $data['pid']; 
            if ($lyid > 0) { 
                $lyinfo = model("comment")->field("uid")->where("id='" . $lyid . "'")->find(); 
                $data['touid'] = $lyinfo['uid']; 
            } else { 
                $data['touid'] = 0; 
            }
            if($data['touid'] == $this->userid){
                echo json_encode(array("code" => "not self", "error" => "不能回复自己")); 
                    exit; 
            }
            $data['addtime'] = time(); 
            /*$emots = getTableFile("emot"); 
            foreach ($emots as $v) { 
                $content = str_replace("[" . $v['name'] . "]", "<img alt='" . $v['name'] . "' src='" . __APP__ . "/Public/emot/" . ($v['id'] - 1) . ".gif'>", $content); 
            } */
            $data['content'] = addslashes($content); 
            $info = model("comment")->field("id")->where("content='" . $data['content'] . "'")->find(); 
            if ($info['id']) { 
                echo json_encode(array("code" => "comment_repeat", "error" => "检测到重复评论，您似乎提交过这条评论了")); 
                exit; 
            }
            $lastid = model("comment")->save($data); 
            $points_comment = 20;
            if ($lastid > 0) { 
                $day_start = strtotime(date("Y-m-d")); 
                $day_end = $day_start + 3600 * 24; 
                $comment_num_day = model("comment")->where("uid = " . $data['uid'] . " AND addtime between " . $day_start . " AND " . $day_end . "")->count(); 
                if ($comment_num_day <= 5) { //少于5条每天，则添加积分 
                    //addPoints("comment", $points_comment, $data['uid'], "评论获得" . $points_comment . "积分", 5, 1); 
                } 
                //addMessage('comment', $data['tid'], $data['pid'], $data['mtype'], $data['touid'], $content); 
            } 
            session("comment_time", time());
            echo json_encode(array("code" => 200, "comment" => $content, "points" => $points_comment)); 
        } 
    }
    function comments() {
        $user = Db::connect('mysql://hahacn:hahacn@120.27.125.196:3306/hahacn_multsite#utf8')->name("public_user")->column('id,userhead,username');
        //{id:2,img:"./images/img.jpg",replyName:"匿名",beReplyName:"",content:"到菜市场买菜，看到一个孩子在看摊，我问：“一只鸡多少钱？” 那孩子回答：“23。” 我又问：“两只鸡多少钱？” 孩子愣了一下，一时间没算过来，急中生智大吼一声：“一次只能买一只！”",time:"2017-10-17 11:42:53",address:"深圳",osname:"",browse:"谷歌",replyBody:[{id:3,img:"",replyName:"帅大叔",beReplyName:"匿名",content:"来啊，我们一起吃鸡",time:"2017-10-17 11:42:53",address:"",osname:"",browse:"谷歌"}]},
        $id = input('get.id/int',0); 
        $mtype = input('get.mtype/int',1);
        $page = input('get.page/int',1);
        $totalnum = input('get.totalnum/int',1);
        $start = 10 * ($page - 1);
        $sql = "tid = " . $id . " AND pid = 0"; 
        $total = model("comment")->where($sql)->count();
        if($total % 10 ==0){
            $cpage = intval($total/10);
        }else{
            $cpage = intval($total/10)+1;
        }
        $comments = model("comment")->field("id,uid,content,addtime")->where($sql)->order("id DESC")->limit($start . ",10")->select();
    //        echo M("comment")->getlastsql(); 
        foreach ($comments as $k => $v) {
            $comments[$k]['img'] = '//bbs.hahacn.com'.$user[$v['uid']]['userhead'];
            $comments[$k]['replyName'] = $user[$v['uid']]['username'];
            $rs = model("comment")->field("id,uid,content,touid,pid_sub,from_unixtime(addtime,'%Y-%m-%d %H:%i:%S')  as time")->where("tid = " . $id . " AND pid = " . $v['id'] . "")->order("id ASC")->select();
            foreach ($rs as $key => &$vv) {
                $vv['img'] = '//bbs.hahacn.com'.$vv['uid'];
                $vv['replyName'] = $user[$vv['uid']]['username'];
                $vv['beReplyName'] = $user[$vv['touid']]['username'];
            }
            $comments[$k]['replyBody'] = $rs;
        } 
        echo json_encode(array("code" => 200, "comment" => $comments,'page'=>$page,'total'=>$total,'cpage'=>$cpage));
        exit;
        $this->assign("id", $id); 
        $this->assign("mtype", $mtype); 
        $this->assign("comments", $comments); 
        $this->assign("comments_num", $totalnum - ($page - 1) * 10); 
        $this->display(); 
        //return jsonp(['error_no'=>0,'error_msg'=>'','anno'=>$this->new]);
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
        
        return jsonp(['error_no'=>0,'error_msg'=>'','data'=>$this->fetch(),'token'=>'BE179FA772BEB215CF6F7D15B4F91F60965182E30E0232C8914165B9009A29F5296C67E226177484B532DD6B86B06CBBDBAB4E26927497CE0F22D5E3EC36FEEBF5FD2A87DF1548873E6CD26587A17FEA3A15ABDD8B04E06B065C48B8B56DD44A766BFA7DA08BB9B26C10F553B4B99AF60C577A04C95D53E6DCEB3B35CF0F6981']);
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
}
