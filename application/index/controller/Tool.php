<?php

// +----------------------------------------------------------------------
// | Think.Admin
// +----------------------------------------------------------------------
// | 版权所有 2016~2017 广州楚才信息科技有限公司 [ http://www.cuci.cc ]
// +----------------------------------------------------------------------
// | 官方网站: http://think.ctolog.com
// +----------------------------------------------------------------------
// | 开源协议 ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | github开源项目：https://github.com/zoujingli/Think.Admin
// +----------------------------------------------------------------------

namespace app\index\controller;

/*use controller\BasicApi;
use service\FileService;*/
use service\HttpService;
use service\QQWry;
use service\Chinese;
use think\Controller;
class Tool extends Controller {
	public function _initialize()
    {
    }
    public function index(){
        var_dump($this->allcat);
        exit;
        echo "e";
    }
    public function alexa(){
        $url = input('get.url','');
        $TRank = 0;
        $isget = 0;
        if(!empty($url)){
            $url = str_replace('http://', '', $url);
            $url = str_replace('www.', '', $url);
            if($url) {  
                $AlexaUrl = 'http://xml.alexa.com/data?cli=10&dat=nsa&ver=quirk-searchstatus&url=' . $url;
                $AlexaContent = file_get_contents($AlexaUrl);
                preg_match('/<POPULARITY[^>]*URL[^>]*TEXT[^>]*\"([0-9]+)\"/i', $AlexaContent, $re);
                //获得traffic rank值
                if(isset($re[1])){
                    $TRank = $re[1];
                }
                $isget = 1;
                // note 判断是不是存在POPULARITY
                $isExist = preg_match('/POPULARITY/i', $AlexaContent);
                $this->assign('url',$url);
                $this->assign('TRank',$TRank);
            }
        }
        $this->assign('isget',$isget);
        return $this->fetch();
    }
    function inout(){
        $url = input('get.url','');
        $isget = 0;
        if(!empty($url)){
            $isget = 1;
            if(preg_match("/(.*?)\/$/i",$url)){
                $url=preg_replace("/\/$/","",$url);
            }
            $message=__urljudge(str_replace("http://","",$url));
            $Myip=get_real_ip();
            $content=array('url'=>$message,'ip'=>$Myip,'time'=>time());
            model('Inout')->save($content);
            $con = HttpService::get('http://'.$url);
            if(empty($con)){
                exit('<font color=red>对不起，不能正常访问该网站，请更换域名.</font>');
            }
            preg_match_all("/charset=(.*?)>/is",$con,$cod);
            if(!empty($cod[1][0])){
                if(preg_match("/gbk/i",$cod[1][0]) || preg_match("/gb2312/i",$cod[1][0])){
                    $con=iconv("gbk","UTF-8//TRANSLIT",$con);
                }
            }
            preg_match_all("/<a href=(.*?)<\/a>/is",$con,$link);
            foreach($link[0] as $val){
                if(strip_tags($val)){
                    preg_match_all("/<a href=\"(.*?)\"/is",$val,$link_url);
                    if(empty($link_url[1])){
                        preg_match_all("/<a href='(.*?)'/is",$val,$link_url);
                    }
                    $links[] = $val;
                    if(preg_match("/http/i",$link_url[1][0])){
                        if(!preg_match("/$message/i",$link_url[1][0])){
                            $links_out[] = $link_url[1][0];
                            $array[]= '<div class=list_left>'.strip_tags($val).'</div><div class=list_right><a href="'.$link_url[1][0].'">'.$link_url[1][0].'</a></div>';
                        }else{
                            $array[]= '<div class=list_left>'.strip_tags($val).'</div><div class=list_right><a href="'.$link_url[1][0].'">'.$link_url[1][0].'</a></div>';
                        }
                    }else{
                        if(!preg_match("/^\/(.*?)/",$link_url[1][0]))$link_url[1][0]='/'.$link_url[1][0];
                        $array[]= '<div class=list_left>'.strip_tags($val).'</div><div class=list_right><a href="'.$url.$link_url[1][0].'">'.$url.$link_url[1][0].'</a></div>';
                    }
                }
            }
            $this->assign('url',$url);
            $this->assign('allc',count($links));
            $this->assign('ic',count($links)-count($links_out));
            $this->assign('oc',count($links_out));
        }
        $history = model('Inout')->group('url')->select();
        $this->assign('history',$history);
        $this->assign('isget',$isget);
        return $this->fetch();
    }

    function ip(){
        $ip = $url = input('get.url','');
        $QQWry=new QQWry;
        $tip = '';
        $taddr = '';
        $pip = '';
        $paddr = '';
        $isget = 0;
        if(!empty($ip)){
            $isget = 1;
            preg_match('/((\w|-)+\.)+[a-z]{2,4}/i',$ip) ? $ip=gethostbyname($ip) : $ip;
            if(is_ip($ip)){
                $ifErr=$QQWry->QQWry($ip); 
                $sip = $QQWry->Country.$QQWry->Local;
                $ipl= $QQWry->Country;
            }else{
                $sip = 1;
            }
            $this->assign('sip',$sip);
        }
        $ip=get_real_ip();
        if (isset($_SERVER["HTTP_CLIENT_IP"]) or isset($_SERVER['HTTP_X_FORWARDED_FOR'])){
            $ifErr=$QQWry->QQWry($ip); 
            $tip = $ip;
            $taddr = $QQWry->Country.$QQWry->Local;
            $ipl= $QQWry->Country;
            $ip=$_SERVER['REMOTE_ADDR'];
            $ifErr=$QQWry->QQWry($ip); 
            $pip = $ip;
            $paddr = $QQWry->Country.$QQWry->Local;
        }
        else{
            $ip=$_SERVER['REMOTE_ADDR']; 
            $ifErr=$QQWry->QQWry($ip); 
            $tip = $ip;
            $taddr = $QQWry->Country.$QQWry->Local;
        }
        $this->assign('url',$url);
        $this->assign('tip',$tip);
        $this->assign('taddr',$taddr);
        $this->assign('pip',$pip);
        $this->assign('paddr',$paddr);
        $this->assign('isget',$isget);
        return $this->fetch();
    }
    function link(){
        $url = input('get.url','');
        $isget = 0;
        if(!empty($url)){
            $isget = 1;
            if(preg_match("/(.*?)\/$/i",$url)){
                $url=preg_replace("/\/$/","",$url);
            }
            $message=__urljudge(str_replace("http://","",$url));
            if(preg_match("/(.*?)\.(.*?)\.(.*?)/is",$message,$_g))$_gg = $_g[2];
            elseif(preg_match("/(.*?)\.(.*?)/is",$message,$_g))$_gg = $_g[1];

            $Myip=get_real_ip();
            $content=array('url'=>$message,'ip'=>$Myip,'time'=>time());
            model('Inout')->save($content);
            $con = HttpService::get('http://'.$url);
            if(empty($con)){
                exit('<font color=red>对不起，不能正常访问该网站，请更换域名.</font>');
            }
            preg_match_all("/charset=(.*?)>/is",$con,$cod);
            if(!empty($cod[1][0])){
                if(preg_match("/gbk/i",$cod[1][0]) || preg_match("/gb2312/i",$cod[1][0])){
                    $con=iconv("gbk","UTF-8//TRANSLIT",$con);
                }
            }
            preg_match_all("/<a href=(.*?)<\/a>/is",$con,$link);
            $link_out = [];
            $list = [];
            foreach($link[0] as $val){
                if(strip_tags($val)){
                    preg_match_all("/<a href=\"(.*?)\"/is",$val,$link_url);
                    if(empty($link_url[1])){
                        preg_match_all("/<a href='(.*?)'/is",$val,$link_url);
                    }
                    $links[] = $val;
                    if(preg_match("/http/i",$link_url[1][0])){
                        if(!preg_match("/$_gg/i",$link_url[1][0])){
                            $links_out[] = $link_url[1][0];
                            $link_out[]=preg_replace("/\/(.*?)$/","",str_replace(["http://","https://"],["",""],$link_url[1][0]));
                        }else{
                        }
                    }else{
                    }
                }
            }
            if(!empty($link_out)){
                echo "<ul>";
                $link_out=array_unique($link_out);
                sort($link_out);
                foreach($link_out as $v){
                    $list[$v] = gethostbyname($v);
                }
            }
            $this->assign('list',$list);
        }
        $this->assign('url',$url);
        $history = model('Inout')->group('url')->select();
        $this->assign('history',$history);
        $this->assign('isget',$isget);
        return $this->fetch();
    }
    function linkin(){
        $url = $murl = input('get.url','');
        $address=input('address','baidu');
        $isget = 0;
        if(!empty($url)){
            $isget = 1;
            if(preg_match("/(.*?)\/$/i",$url)){
                $url=preg_replace("/\/$/","",$url);
            }
            $message=__urljudge(str_replace("http://","",$url));
            $Myip=get_real_ip();
            $content=array('url'=>$message,'ip'=>$Myip,'time'=>time());
            model('Inout')->save($content);
            $list = [];
            if(preg_match("/baidu/i",$address)){
                $url="http://www.baidu.com/s?wd=link%3A$message";
                $contents = HttpService::get($url);
                preg_match_all("/找到相关结果约(.*?)个/is",$contents,$num);
                $list['baidu'] = ['url'=>$url,'num'=>$num[1][0]];
            }
            if(preg_match("/google/i",$address)){
                $url="http://www.google.com.hk/search?hl=zh-CN&q=link%3A$message";
                $contents = HttpService::get($url);
                preg_match_all("/>获得约 (.*?) 条结果</is",$contents,$num);
                $list['Google'] = ['url'=>$url,'num'=>$num[1][0]];
            }
            if(preg_match("/yahoo/i",$address)){
                $url="http://sitemap.cn.yahoo.com/search?bwm=i&p=$message";
                $contents = HttpService::get($url);
                preg_match_all("/<em>(.*?)<\/em>/is",$contents,$num);
                preg_match_all("/<strong>(.*?)<\/strong>/is",$num[0][0],$num_1);
                $list['Yahoo'] = ['url'=>$url,'num'=>$num[1][0]];

            }
            if(preg_match("/soso/i",$address)){
                $url="http://www.sogou.com/sogou?rfrom=soso&&w=link%3A$message";
                $contents = HttpService::get($url);
                preg_match_all("/找到约(.*?)条相关结果/is",$contents,$num);
                $list['Soso'] = ['url'=>$url,'num'=>$num[1][0]];
            }
            if(preg_match("/sogou/i",$address)){
                $url="http://www.sogou.com/web?query=link%3A$message";
                $contents = HttpService::get($url);
                preg_match_all("/找到约(.*?)条相关结果/is",$contents,$num);
                $list['sogou'] = ['url'=>$url,'num'=>$num[1][0]];
            }
            if(preg_match("/youdao/i",$address)){
                $url="http://www.yodao.com/search?q=link%3A$message";
                $contents = HttpService::get($url);
                $contents = iconv("UTF-8","gbk//TRANSLIT",$contents);
                if(!preg_match('/没有找到链接/',$contents)){
                    $list['Youdao'] = ['url'=>$url,'num'=>0];
                }else{
                    preg_match_all("/共(.*?)条结果/is",$contents,$num);
                    $list['sogou'] = ['url'=>$url,'num'=>$num[1][0]];
                }                
            }
            $this->assign('list',$list);
        }
        $this->assign('url',$murl);
        $history = model('Inout')->group('url')->select();
        $this->assign('history',$history);
        $this->assign('isget',$isget);
        return $this->fetch();
    }
    function links(){
        $url = $murl = input('get.url','');
        $url2 = input('get.url2','');
        $id = input('get.id','');
        $isget = 0;
        if(!empty($url) && !empty($url2) && !empty($id)){
            //if(strpos($url,'www.')!== false)$url=str_replace('www.','',$url);
            $out= strtolower(HttpService::get($url2));
            
            if($out){
                if(!is_utf8($out))$out=mb_convert_encoding($out, "UTF-8", "GBK");
                $out=str_replace("\r\n","",$out);
                $out=str_replace("\r","",$out);
                $out=str_replace("\n","",$out);
                
                echo $havelink=preg_match_all('/<a(.*?)href=(.*?)'.$url.'(.*?)>(.*?)<\/a>/i', $out, $m);
                if($havelink){
                    //if($m[4][0])$m40=mb_convert_encoding($m[4][0], "GBK", "UTF-8");
                    $m40=$m[4][0];
                    if(strpos($m40,"<img")!== false)$m40='图片链接';
                    else $m40=strip_tags($m40);
                    echo "<script type='text/javascript'>parent.document.getElementById('link_$id').innerHTML='<span class=\'green\'>有链接</span> 链接文字:".$m40."';</script>";
                }
                else echo "<script type='text/javascript'>parent.document.getElementById('link_$id').innerHTML='<span class=\'red\'>无链接</span>';</script>";
            }
            else {
                echo "<script type='text/javascript'>parent.document.getElementById('link_$id').innerHTML='<span class=\'blue\'>无法打开</span>';</script>";
                // <input type=\'button\'   value=\'重试\'   onclick=\'document.iframe$id.location.reload();\'>
            }
            exit;
        }
        if(!empty($url)){
            $isget = 1;
            //$title=$url.'的链接情况';
            if(substr($url,0,7) != "http://")$url='http://'.$url;
            //$url2=str_replace('http://','http\:\/\/',$url);
            $url2=str_replace('http://','',$url);
            if(!preg_match ("/^(?:[^\W_](?:[^\W_]|-){0,61}[^\W_]\.)*(?:[^\W_](?:[^\W_]|-){0,61}[^\W_])\.?$/i",$url2)){
                exit;
            }
            $out=strtolower(HttpService::get($url));
            $out=str_replace("\r\n","",$out);
            $list = [];
            if($out){
                if(!is_utf8($out))$out=mb_convert_encoding($out, "UTF-8","GBK");
                preg_match_all('/<a(.*?)href=(.*?)>(.*?)<\/a>/i', $out, $m);
                foreach($m[2] as $num => $k){
                    $k1=explode(" ",$k);
                    $k=strtolower($k1[0]);
                    if(strpos($k,"'")!== false)$k=str_replace("'","",$k);
                    if(strpos($k,'"')!== false)$k=str_replace('"','',$k);
                    $urlx=strtolower($url);
                    if(strpos($url2,'www.')!== false)$urlx=str_replace('www.','',$url2);
                    else $urlx=$url2;
                    if(strpos($k,"http://")!== false&&strpos($k,"?")=== false&&strpos($k,$urlx)=== false&&$m[3][$num]){
                        if(strpos($m[3][$num],"<img")!== false)$text='图片链接';
                        else $text=strip_tags($m[3][$num]);
                        $list[] = ['k'=>$k,'text'=>$text,'url2'=>$url2,'rand'=>rand()];
                    }
                }
            }
            $this->assign('list',$list);
        }
        $this->assign('url',$murl);
        $this->assign('isget',$isget);
        return $this->fetch();            
    }

    function links_pr(){
        $url = input('get.url','','strtolower');
        $id = input('get.id','');
        $userurl=$url;
        $url = 'info:'.$userurl;
        $ch = GoogleCH(strord($url));
        $url='info:'.urlencode($userurl);
        $curl=curl_init("http://216.239.59.18/search?client=navclient-auto&ch=6$ch&ie=UTF-8&oe=UTF-8&features=Rank&q=$url");
        curl_setopt ($curl, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; GoogleToolbar 2.0.110-big; Windows 2000 5.0)");
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $rank=curl_exec($curl);
        curl_close ($curl);
        $rrank=explode(":",$rank);
        $rank=trim($rrank[2]);
        if(!$rank)$rank='0';
        echo "<script type='text/javascript'>parent.document.getElementById('pr_$id').innerHTML='".$rank."';</script>";
    }

    function links_baidu(){
        $url = input('get.url','','strtolower');
        $id = input('get.id','');
        $url=str_replace("http://","",$url);
        echo "http://www.baidu.com/s?wd=site%3A$url";
        $out=HttpService::get("http://www.baidu.com/s?wd=site%3A$url");
        $out= preg_match('/该网站共有 (.*) 个网页被百度收录/',$out);
        $out=str_replace(",","",$out[1]);
        echo "<script type='text/javascript'>parent.document.getElementById('baidu_$id').innerHTML='$out';</script>";
    }
    function links_baidut(){
        $url = input('get.url','','strtolower');
        $id = input('get.id','');
        $url=str_replace("http://","",$url);
        $out=HttpService::get("http://www.baidu.com/s?wd=$url");
        $out1=explode("<font color=#008000>$url",$out);
        $out2=explode("</font>",$out1[1]);
        $out=$out2[0];
        if(strpos($out,"/")!== false)$out=str_replace("/","",$out);
        $out=trim($out);
        if(!$out)$out='首页无该站快照';
        echo "<script type='text/javascript'>parent.document.getElementById('baidut_$id').innerHTML='$out';</script>";
    }
    function position(){
        $value = input('get.value','');
        $SearchE=input('radiobutton','');
        $isget = 0;
        if(!empty($value)){
            $isget = 1;
            $value2 = explode(':', $value);
            $domain = $value2[0];
            $domain = strtolower(str_replace('http://', '', $domain));
            $domain = strip_tags($domain);
            //$domain = !preg_match("/^www\./", $domain) ? 'www.'.$domain : $domain;//这样匹配不了顶级域名例如adminn.com
            $keyword = $value2[1];
            $keyword = str_replace(' ', '+', $keyword);
            $pos = 0;
            if($value && $domain && $keyword) {
                if($SearchE == 'baidu') {
                    $buffer = HttpService::get('http://www.baidu.com/s?tn=baiduadv&rn=100&q1=' . $keyword);
                    echo 'http://www.baidu.com/s?tn=baiduadv&rn=100&q1=' . $keyword;
                    var_dump($buffer);
                    if($buffer) {       
                        $buffer = substr($buffer, 0, strpos($buffer, '<font color=#008000>' . $domain));
                        $pos = substr_count($buffer, 'target="_blank"><font size="3">');
                    }
                }
                if($SearchE == 'google') {
                    $buffer = HttpService::get('http://www.google.cn/search?aq=f&complete=1&num=100&client=pub-6137409832737925&newwindow=1&q=' . $keyword);
                    if($buffer) {   
                        $buffer = substr($buffer, 0, strpos($buffer, '<span class=a>' . $domain));
                        $pos = substr_count($buffer, '<div class=g>');
                    }
                }
            }
            $this->assign('pos',$pos);
        }
        $this->assign('url',$value);
        $this->assign('isget',$isget);
        return $this->fetch();
    }

    function site(){
        $url = $murl = input('get.url','');
        $address=input('address','baidu');
        $isget = 0;
        if(!empty($url)){
            $isget = 1;
            if(preg_match("/(.*?)\/$/i",$url)){
                $url=preg_replace("/\/$/","",$url);
            }
            $message=__urljudge(str_replace("http://","",$url));
            $Myip=get_real_ip();
            $content=array('url'=>$message,'ip'=>$Myip,'time'=>time());
            model('Inout')->save($content);
            $list = [];
            if(preg_match("/baidu/i",$address)){
                $url="http://www.baidu.com/s?&ie=utf-8&word=site%3A$message";
                $contents = HttpService::get($url);
                preg_match_all("/找到相关结果约(.*?)个/is",$contents,$num);
                $list['baidu'] = ['url'=>$url,'num'=>$num[1][0]];
            }
            if(preg_match("/google/i",$address)){
                $url="http://www.google.com.hk/search?hl=zh-CN&q=site%3A$message";
                $contents = HttpService::get($url);
                preg_match_all("/>获得约 (.*?) 条结果</is",$contents,$num);
                $list['Google'] = ['url'=>$url,'num'=>$num[1][0]];
            }
            if(preg_match("/yahoo/i",$address)){
                $url="http://sitemap.cn.yahoo.com/search?p=$message";
                $contents = HttpService::get($url);
                preg_match_all("/<em>(.*?)<\/em>/is",$contents,$num);
                preg_match_all("/<strong>(.*?)<\/strong>/is",$num[0][0],$num_1);
                $list['Yahoo'] = ['url'=>$url,'num'=>$num[1][0]];

            }
            if(preg_match("/soso/i",$address)){
                $url="http://www.sogou.com/sogou?rfrom=soso&&w=site%3A$message";
                $contents = HttpService::get($url);
                preg_match_all("/找到约(.*?)条相关结果/is",$contents,$num);
                $list['Soso'] = ['url'=>$url,'num'=>$num[1][0]];
            }
            if(preg_match("/sogou/i",$address)){
                $url="http://www.sogou.com/web?query=site%3A$message";
                $contents = HttpService::get($url);
                preg_match_all("/找到约(.*?)条相关结果/is",$contents,$num);
                $list['sogou'] = ['url'=>$url,'num'=>$num[1][0]];
            }
            if(preg_match("/youdao/i",$address)){
                $url="http://www.yodao.com/search?q=site%3A$message";
                $contents = HttpService::get($url);
                $contents = iconv("UTF-8","gbk//TRANSLIT",$contents);
                if(!preg_match('/没有找到链接/',$contents)){
                    $list['Youdao'] = ['url'=>$url,'num'=>0];
                }else{
                    preg_match_all("/共(.*?)条结果/is",$contents,$num);
                    $list['sogou'] = ['url'=>$url,'num'=>$num[1][0]];
                }                
            }
            $this->assign('list',$list);
        }
        $this->assign('url',$murl);
        $history = model('Inout')->group('url')->select();
        $this->assign('history',$history);
        $this->assign('isget',$isget);
        return $this->fetch();
    }
    function whois(){
        $url = $domain =  input('get.url','');
        $isget = 0;
        if(!empty($domain)){
            $isget = 1;
            if(preg_match("/(.*?)\/$/i",$domain)){
                $domain=preg_replace("/\/$/","",$domain);
            }
            $domain = str_replace(['http://','www.'],["",""],$domain);
            if(!$server = get_server($domain,'./servers.lst')) {
                die("请输入正确格式的域名, 例如: hahacn.com");
            }
            $result1 = whois_request($server['server'], $domain);
            $result2 = whois_request($server['infoserver'], $domain);
            $result ='';
            if(!$result1 && !$result2) {
                echo "无法连接服务器";
                die();
            } else {
                $result = $result1."<br />".$result2;
                $c = new Chinese('UTF-8', 'GBK');
                $result = $c->Convert($result);
            }
            $this->assign('result',$result);
        }
        $this->assign('url',$url);/*
        $history = model('Inout')->group('url')->select();
        $this->assign('history',$history);*/
        $this->assign('isget',$isget);
        return $this->fetch();
    }
    function _empty($name){
        return $this->fetch($name);
    }
}
/*
$url=$_POST[message];
if(empty($url) || $url == '')$url = $_GET['message'];


function _link($url){
    $contents = @file_get_contents("$url");
    if($contents=="Forbidden" || $contents==""){
        $ch = curl_init();
        $timeout = 5;
        curl_setopt ($ch, CURLOPT_URL, "$url");
        curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt ($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)");
        curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        $contents = curl_exec($ch);
        curl_close($ch);
    }
    
    return $contents;
}
$contents=_link($url);


*/