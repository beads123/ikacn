<?php
namespace app\index\controller;
use think\Controller;
use service\geetestlib;
class User extends Controller
{
    /**
     * 网站入口
     */
    public function register() {
        return $this->fetch();
    }
    public function login(){
        session_start();
        var_dump($_SESSION);
        $ref = !isset($_SERVER['HTTP_REFERER'])?'':$_SERVER['HTTP_REFERER'];
        if(empty($ref)){
            $ref = url('/','','','my');
        }
        $this->assign('ref',$ref);
        return $this->fetch();
    }
    public function logined(){
        $uname = input('get.account');
        $pass = input('get.password');
        $auto = input('get.autologin');
        $geetest_challenge = input('get.geetest_challenge');
        $geetest_validate = input('get.geetest_validate');
        $geetest_seccode = input('get.geetest_seccode');

        $member = model('User');
        $status['status'] = array('gt',0);
        $user = $member->where($status)->where('usermail|username|mobile', $uname)->find();
        if ($user) {
            $user=updategrade($user);
            if ($user['password'] == md5($pass.$user['salt'])) {
                if($user['userhead']==''){
                    $user['userhead']='/public/images/default.png';
                }

                $GtSdk = new GeetestLib(config('CAPTCHA_ID'), config('PRIVATE_KEY'));
                $data = array(
                    "user_id" => session('user_id'), # 网站用户id
                    "client_type" => "web", #web:电脑上的浏览器；h5:手机上的浏览器，包括移动应用内完全内置的web_view；native：通过原生SDK植入APP应用的方式
                    "ip_address" => "127.0.0.1" # 请在此处传输用户请求验证时所携带的IP
                );
                if (session('gtserver') == 1) {   //服务器正常
                    $result = $GtSdk->success_validate($geetest_challenge, $geetest_validate, $geetest_seccode, $data);
                    if (!$result) {
                        return json(['statusCode'=>508,'message'=>'验证失败']);
                    }
                }else{  //服务器宕机,走failback模式
                    if (!$GtSdk->fail_validate($geetest_challenge, $geetest_validate, $geetest_seccode)){
                        return json(['statusCode'=>508,'message'=>'验证失败']);
                    }
                }


                /*session('userstatus', $user['status']);
                session('grades', $user['ik_grades']);
                session('userhead', '//bbs.hahacn.com'.$user['userhead']);
                session('username', $user['username']);
                session('userid', $user['id']);
                session('point', $user['point']);*/
                $cook=array('id'=>$user['id'], 'status'=>$user['status'], 'point'=>$user['point'],'mobile'=>$user['mobile'], 'username'=>$user['username'], 'userhead'=>'//bbs.hahacn.com'.$user['userhead'], 'grades'=>$user['grades']);
                systemSetKey($cook);
                $member->update(
                        [
                                'last_login_time' => time(),
                                'last_login_ip'   => $this->request->ip(),
                                'id'              => $user['id']
                        ]
                );
                //$member->where('id',session('userid'))->setInc('point',$site_config['jifen_login']);
                //point_note($site_config['jifen_login'],session('userid'),'login');
                return json(['statusCode'=>200,'message'=>'登录成功']);
            } else {
                return json(['statusCode'=>508,'message'=>'密码错误']);
            }
        } else {
            return json(['statusCode'=>500,'message'=>'账号错误或已禁用']);
        }

        
    }
    public function login_post(){

        $GtSdk = new GeetestLib();
        $data = array(
                "user_id" => "test", # 网站用户id
                "client_type" => "web", #web:电脑上的浏览器；h5:手机上的浏览器，包括移动应用内完全内置的web_view；native：通过原生SDK植入APP应用的方式
                "ip_address" => "127.0.0.1" # 请在此处传输用户请求验证时所携带的IP
            );

        $status = $GtSdk->pre_process($data, 1);
        $_SESSION['gtserver'] = $status;
        $_SESSION['user_id'] = $data['user_id'];
        echo $GtSdk->get_response_str();



        


http://www.ikacn.com/member/user/logined?account=15123349&password=dsad&autologin=true&geetest_challenge=d96370b29c900b864d937bb2af601b4565&geetest_validate=a4c6f918a6cbf7e7e583873f76d956ac&geetest_seccode=a4c6f918a6cbf7e7e583873f76d956ac%7Cjordan&rands=0.1096753853161545

        
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
    public function registerEd($pname){
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
