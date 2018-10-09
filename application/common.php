<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用公共文件
use think\Db;
define('GOOGLE_MAGIC', 0xE6359A60);

function updategrade($data){
    $map['score']=array('elt',$data['point']);
    $res=Db::name('usergrade')->where($map)->order('score desc')->limit(1)->value('id');
    if(!empty($res)&&$res!=$data['ik_grades']){
        model('User')->where('id',$data['id'])->setField('ik_grades',$res);
    }
    $data['grades']=$res;
    return $data;
}

function systemSetKey($user=''){
    if(is_array($user) && !empty($user)){
        cookie('sys_key',encrypt(serialize($user)),3600);
    }
}

/**
 * 加密函数
 * @param string $txt 需要加密的字符串
 * @param string $key 密钥
 * @return string 返回加密结果
 */
function encrypt($txt, $key = ''){
    if (empty($txt)) return $txt;
    if (empty($key)){
        $salt=model('User')->where('id',1)->value('salt');
        $key = md5($salt);
    }
    $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.";
    $ikey ="-x6g6ZWm2G9g_vr0Bo.pOq3kRIxsZ6rm";
    $nh1 = rand(0,64);
    $nh2 = rand(0,64);
    $nh3 = rand(0,64);
    $ch1 = $chars{$nh1};
    $ch2 = $chars{$nh2};
    $ch3 = $chars{$nh3};
    $nhnum = $nh1 + $nh2 + $nh3;
    $knum = 0;$i = 0;
    while(isset($key{$i})) $knum +=ord($key{$i++});
    $mdKey = substr(md5(md5(md5($key.$ch1).$ch2.$ikey).$ch3),$nhnum%8,$knum%8 + 16);
    $txt = base64_encode(time().'_'.$txt);
    $txt = str_replace(array('+','/','='),array('-','_','.'),$txt);
    $tmp = '';
    $j=0;$k = 0;
    $tlen = strlen($txt);
    $klen = strlen($mdKey);
    for ($i=0; $i<$tlen; $i++) {
        $k = $k == $klen ? 0 : $k;
        $j = ($nhnum+strpos($chars,$txt{$i})+ord($mdKey{$k++}))%64;
        $tmp .= $chars{$j};
    }
    $tmplen = strlen($tmp);
    $tmp = substr_replace($tmp,$ch3,$nh2 % ++$tmplen,0);
    $tmp = substr_replace($tmp,$ch2,$nh1 % ++$tmplen,0);
    $tmp = substr_replace($tmp,$ch1,$knum % ++$tmplen,0);
    return $tmp;
}
/**
 * 解密函数
 * @param string $txt 需要解密的字符串
 * @param string $key 密匙
 * @return string 字符串类型的返回结果
 */
function decrypt($txt, $key = '', $ttl = 0){
    if (empty($txt)) return $txt;
    if (empty($key)){
        $salt=model('User')->where('id',1)->value('salt');
        $key = md5($salt);
    }
    $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.";
    $ikey ="-x6g6ZWm2G9g_vr0Bo.pOq3kRIxsZ6rm";
    $knum = 0;$i = 0;
    $tlen = @strlen($txt);
    while(isset($key{$i})) $knum +=ord($key{$i++});
    $ch1 = @$txt{$knum % $tlen};
    $nh1 = strpos($chars,$ch1);
    $txt = @substr_replace($txt,'',$knum % $tlen--,1);
    $ch2 = @$txt{$nh1 % $tlen};
    $nh2 = @strpos($chars,$ch2);
    $txt = @substr_replace($txt,'',$nh1 % $tlen--,1);
    $ch3 = @$txt{$nh2 % $tlen};
    $nh3 = @strpos($chars,$ch3);
    $txt = @substr_replace($txt,'',$nh2 % $tlen--,1);
    $nhnum = $nh1 + $nh2 + $nh3;
    $mdKey = substr(md5(md5(md5($key.$ch1).$ch2.$ikey).$ch3),$nhnum % 8,$knum % 8 + 16);
    $tmp = '';
    $j=0; $k = 0;
    $tlen = @strlen($txt);
    $klen = @strlen($mdKey);
    for ($i=0; $i<$tlen; $i++) {
        $k = $k == $klen ? 0 : $k;
        $j = strpos($chars,$txt{$i})-$nhnum - ord($mdKey{$k++});
        while ($j<0) $j+=64;
        $tmp .= $chars{$j};
    }
    $tmp = str_replace(array('-','_','.'),array('+','/','='),$tmp);
    $tmp = trim(base64_decode($tmp));
    if (preg_match("/\d{10}_/s",substr($tmp,0,11))){
        if ($ttl > 0 && (time() - substr($tmp,0,11) > $ttl)){
            $tmp = null;
        }else{
            $tmp = substr($tmp,11);
        }
    }
    return $tmp;
}

function __urljudge($url){
    $suffixes="com|net|org|gov|biz|com.tw|com.hk|com.ru|net.tw|net.hk|net.ru|info|cn|com.cn|net.cn|org.cn|gov.cn|mobi|name|sh|ac|la|travel|tm|us|cc|tv|jobs|asia|hn|lc|hk|bz|com.hk|ws|tel|io|tw|ac.cn|bj.cn|sh.cn|tj.cn|cq.cn|he.cn|sx.cn|nm.cn|ln.cn|jl.cn|hl.cn|js.cn|zj.cn|ah.cn|fj.cn|jx.cn|sd.cn|ha.cn|hb.cn|hn.cn|gd.cn|gx.cn|hi.cn|sc.cn|gz.cn|yn.cn|xz.cn|sn.cn|gs.cn|qh.cn|nx.cn|xj.cn|tw.cn|hk.cn|mo.cn|org.hk|is|edu|mil|au|jp|int|kr|de|vc|ag|in|me|edu.cn|co.kr|gd|vg|co.uk|be|sg|it|ro|com.mo";
    if(!preg_match("/^(www\.)?([A-Za-z0-9-])+\.($suffixes)$/",$url)){
        echo "<script language='javascript'>alert('您输入的网址不符合规格，请重新输入!');</script>";
        exit;
    }else {return $url;}
}
function get_real_ip(){
    $ip=false;
    if(!empty($_SERVER["HTTP_CLIENT_IP"])){
        $ip = $_SERVER["HTTP_CLIENT_IP"];
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode (", ", $_SERVER['HTTP_X_FORWARDED_FOR']);
        if ($ip) { array_unshift($ips, $ip); $ip = FALSE; }
        for ($i = 0; $i < count($ips); $i++) {
            if (!eregi ("^(10|172\.16|192\.168)\.", $ips[$i])) {
                $ip = $ips[$i];
                break;
            }
        }
    }
    return ($ip ? $ip : $_SERVER['REMOTE_ADDR']);
}
function is_ip($str) {
    $ip = explode(".", $str);
    if (count($ip)<4 || count($ip)>4) return 0;
    foreach($ip as $ip_addr) {
        if ( !is_numeric($ip_addr) ) return 0;
        if ( $ip_addr<0 || $ip_addr>255 ) return 0;
    }
    return 1;
}
function is_utf8($str){
     $length=strlen($str);
     for($i=0;$i<$length;$i++){
     $high=ord($str{$i});
     if(($high==0xC0)||($high==0xC1)){
     return false;
     }elseif($high<0x80){
     continue;
     }elseif($high<0xC0){
     return false;
     }elseif($high<0xE0){
     if(++$i>=$length)
         return true;
     elseif(($str{$i}&"\xC0")=="\x80")
         continue;
     }elseif($high<0xF0){
     if(++$i>=$length){
         return true;
     }elseif(($str{$i}&"\xC0")=="\x80"){
         if(++$i>=$length)
         return true;
         elseif(($str{$i}&"\xC0")=="\x80")
         continue;
     }
     }elseif($high<0xF5){
     if(++$i>=$length){
         return true;
     }elseif(($str{$i}&"\xC0")=="\x80"){
         if(++$i>=$length){
         return true;
         }elseif(($str{$i}&"\xC0")=="\x80"){
         if(++$i>=$length)
         return true;
         elseif(($str{$i}&"\xC0")=="\x80")
         continue;
         }
     }
     }
     return false;
     }
     return true;
}
function GoogleCH($url, $length=null, $init=GOOGLE_MAGIC) {
    if(is_null($length)) {
    $length = sizeof($url);
    }
    $a = $b = '0x9E3779B9';
    $c = $init;
    $k = 0;
    $len = $length;
    while($len >= 12) {
    $a += ($url[$k+0] +($url[$k+1]<<8) +($url[$k+2]<<16) +($url[$k+3]<<24));
    $b += ($url[$k+4] +($url[$k+5]<<8) +($url[$k+6]<<16) +($url[$k+7]<<24));
    $c += ($url[$k+8] +($url[$k+9]<<8) +($url[$k+10]<<16)+($url[$k+11]<<24));
    $mix = mix($a,$b,$c);
    $a = $mix[0]; $b = $mix[1]; $c = $mix[2];
    $k += 12;
    $len -= 12;
    }
    $c += $length;
    switch($len) 
    {
    case 11: $c+=($url[$k+10]<<24);
    case 10: $c+=($url[$k+9]<<16);
    case 9 : $c+=($url[$k+8]<<8);
    case 8 : $b+=($url[$k+7]<<24);
    case 7 : $b+=($url[$k+6]<<16);
    case 6 : $b+=($url[$k+5]<<8);
    case 5 : $b+=($url[$k+4]);
    case 4 : $a+=($url[$k+3]<<24);
    case 3 : $a+=($url[$k+2]<<16);
    case 2 : $a+=($url[$k+1]<<8);
    case 1 : $a+=($url[$k+0]);
    }
    $mix = mix($a,$b,$c);
    return $mix[2];
}
function zeroFill($a, $b){
    $z = hexdec(80000000);
    if ($z & $a)
    {
    $a = ($a>>1);
    $a &= (~$z);
    $a |= '0x40000000';
    $a = ($a>>($b-1));
    }
    else
    {
    $a = ($a>>$b);
    }
    return $a;
}
function mix($a,$b,$c) {
    $a -= $b; $a -= $c; $a ^= (zeroFill($c,13));
    $b -= $c; $b -= $a; $b ^= ($a<<8);
    $c -= $a; $c -= $b; $c ^= (zeroFill($b,13));
    $a -= $b; $a -= $c; $a ^= (zeroFill($c,12));
    $b -= $c; $b -= $a; $b ^= ($a<<16);
    $c -= $a; $c -= $b; $c ^= (zeroFill($b,5));
    $a -= $b; $a -= $c; $a ^= (zeroFill($c,3));
    $b -= $c; $b -= $a; $b ^= ($a<<10);
    $c -= $a; $c -= $b; $c ^= (zeroFill($b,15));
    return array($a,$b,$c);
}
function strord($string) {
    for($i=0;$i<strlen($string);$i++) {
    $result[$i] = ord($string{$i});
    }
    return $result;
}

function get_server($domain,$server_list) {
    $serverarray = file($server_list);
    $i = 0;
    foreach($serverarray as $key=>$val) {
        if(substr($val,0,1) != "#") {
            $server_p = explode("|",$val);
            $server[$i]['tld'] = $server_p[0];
            $server[$i]['server'] = $server_p[1];
            $server[$i]['avail'] = $server_p[2];
            $server[$i]['infoserver'] = $server_p[3];
            $server[$i]['backserver'] = $server_p[4];
            $server[$i]['info'] = isset($server_p[5])?$server_p[5]:'';
        }
        $i++;
    }

    $domain_c = explode(".",$domain);
    $partnum = count($domain_c);
    $last_part_1 = $domain_c[$partnum-1];
    $last_part_2 = $domain_c[$partnum-2];
    
    foreach($server as $key=>$val) {
        if($val['tld'] == $last_part_2.".".$last_part_1) {
            Return $val;
        } elseif($val['tld'] == $last_part_1) {
            Return $val;
        }
    }
    Return false;
}

function whois_request($server, $query)
{
    $data = "";
    if(!$fp = @fsockopen($server, 43)) {
        Return false;
    } else {
        fputs($fp, $query . "\r\n");
        while (!feof($fp)) {
            $data .= fread($fp, 1000);
        } 
        fclose($fp);
    }
    return nl2br($data);
}



function chang_pic($pic){
    if(!empty($pic)){
       $host = '';
        if(strpos($pic,'image.tianjimedia.com')){
            $host = 'image.tianjimedia.com';
        }elseif(strpos($pic,'pic5.qiyipic.com')){
            $host = 'pic5.qiyipic.com';
        }elseif(strpos($pic,'pic8.qiyipic.com')){
            $host = 'pic8.qiyipic.com';
        }elseif(strpos($pic,'pic4.qiyipic.com')){
            $host = 'pic4.qiyipic.com';
        }elseif(strpos($pic,'s.cimg.163.com')){
            $host = 's.cimg.163.com';
        }elseif(strpos($pic,'img.1985t.com')){
            $host = 'img.1985t.com';
        }
        if(!empty($host)){
            $pic = 'http://api.hahacn.com/other/getimg?host='.$host.'&url='.base64_encode($pic);
        }
   }
   return $pic;
}
/** 获取指定URL内容 */
function get_url_content($url) {
    if (empty($url)) {
        return false;
    }
    
    if (substr($url, 0, 7) != 'http://') {
        $url = 'http://'.$url;
    }
    
    $timeout = 30;
    $data = '';
    for ($i = 0; $i < 5 && empty($data); $i++) {
        if (function_exists('curl_init')) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
            
            $data = curl_exec($ch);
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($http_code != '200') {
                return false;
            }
        } elseif (function_exists('fsockopen')) {
            $params = parse_url($url);
            $host = $params['host'];
            $path = $params['path'];
            $query = $params['query'];
            $fp = @fsockopen($host, 80, $errno, $errstr, $timeout);
            if (!$fp) {
                return false;
            } else {
                $result = '';
                $out = "GET /" . $path . '?' . $query . " HTTP/1.0\r\n";
                $out .= "Host: $host\r\n";
                $out .= "Connection: Close\r\n\r\n";
                @fwrite($fp, $out);
                $http_200 = preg_match('/HTTP.*200/', @fgets($fp, 1024));
                if (!$http_200) {
                    return false;
                }

                while (!@feof($fp)) {
                if ($get_info) {
                    $data .= @fread($fp, 1024);
                } else {
                    if (@fgets($fp, 1024) == "\r\n") {
                        $get_info = true;
                    }
                }
            }
            @fclose($fp);
        }
        } elseif (function_exists( 'file_get_contents')) {
            if (!get_cfg_var('allow_url_fopen')) {
                return false;
            }
            $context = stream_context_create(
                array('http' => array('timeout' => $timeout))
            );
            $data = @file_get_contents($url, false, $context);
        } else {
            return false; 
        }
    }
    
    if (!$data) {
        return false;
    } else {
        $encode = mb_detect_encoding($data, array('ascii', 'gb2312', 'utf-8', 'gbk'));
        if ($encode == 'EUC-CN' || $encode == 'CP936') {
            $data = @mb_convert_encoding($data, 'utf-8', 'gb2312');
        }
        
        return $data;
    }
}
/** thumbs */
function get_webthumb($web_url) {
    return 'http://www.5118.com/static/'.$web_url.'/'.$web_url.'_s.jpg';
}
function format_url($url) {
    if ($url != "") {
        $url_parts = parse_url($url);
        $scheme = isset($url_parts['scheme'])?$url_parts['scheme']:'';
        $host = isset($url_parts['host'])?$url_parts['host']:'';
        $path = isset($url_parts['path'])?$url_parts['path']:'';
        $port = !empty($url_parts['port']) ? ':'.$url_parts['port'] : '';
        $url = (!empty($scheme) ? $scheme.'://'.$host : (!empty($host) ? 'http://'.$host : 'http://'.$path)).$port.'/';
        
        return $url;
    }
}
/** website */
function get_website_url($web_id, $abs_path = false) {
    return url('detail/'.$web_id);
}
/** format tags */
function get_format_tags($str) {
    $arrstr = !empty($str) && strpos($str, ',') > 0 ? explode(',', $str) : (array) $str;
    $count = count($arrstr);
    
    $newarr = array();
    for ($i = 0; $i < $count; $i++) {
        $tag = trim($arrstr[$i]);
        $newarr[$i]['tag_name'] = $tag;
        $newarr[$i]['tag_link'] = get_search_url('tags', $tag);
    }
    unset($arrstr);
    
    return $newarr;
}
/** search */
function get_search_url($type = 'name', $query, $page = 1) {

    $query = isset($query) && !empty($query) ? urlencode($query) : '';
    $page = isset($page) && $page > 0 ? $page : 1;
    
    $strurl = url('index/search',['type'=>$type,'query'=>$query]);
    
    return $strurl;
}
