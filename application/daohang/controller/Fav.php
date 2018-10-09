<?php
namespace app\daohang\controller;
use app\common\controller\Base;
class Fav extends Base
{
    protected $cat_cache = 'dh_clist';
    protected $fid=8;
	public function _initialize()
    {
        parent::_initialize();
        $this->assign('keywords','华乐网,头条新闻,头条,今日新闻头条,头条网,头条新闻,今日头条新闻,商业评论,科技资讯,互联网金融,科技新闻,移动互联网,网络游戏,电子商务,电信,智能手机,手游,内幕真相,宏观,趋势,创业,精选,有料,干货,有用,细节,内幕');
        $this->assign('description','华乐网(www.hahacn.com)集信息交流融合、IT技术信息、新媒体于一身的媒体平台。分析你的兴趣爱好,为你推荐喜欢的内容,并且越用越懂你.就要你好看,用专业的精神剖析时代，孜孜不倦探索科技与商业的未来。');
        $this->assign('webname','华乐网');
    }
    public function getModel(){
        return model('Categories');
    }

    /**
     * 网站入口
     */
    public function g() {
        header('Content-type: image/x-icon');
        $url = @$_GET['url'];
        if($url){
            $url = preg_replace('/http\:\/\//i','',$url);
            $url = 'http://'.$url;

            //非法域名时调用默认文件
            if($this->isUrl($url)!='1'){
               $file = "static/i/no.png";
               $file = @file_get_contents($file);
               echo $file;  
               exit;
            }

            $arr = parse_url($url);
            $domain = $arr['host'];
            $http = '';



            $dir = 'static/i';
            $fav = $dir."/".$domain.".ico";
                
            //调用缓存文件
            $file = @file_get_contents($fav);
            if($file){
                echo $file;exit;
            }
            //新建文件
            $curl = $this->get_url_content($http.$domain."/favicon.ico");
            $file = $curl['exec'];
            $zt = $curl['getinfo'];

            if($file && $zt['http_code']=='200' && $zt['content_type']=='image/x-icon' && $domain!='wx.qq.com'){
               $f2 = $file;
               echo $f2;
            }else{
               $curl = $this->get_url_content($url);
               $file = $curl['exec'];
                @preg_match('|href=\"(.*?)\.ico\"|i',$file,$a);
                
                if(isset($a[1])){
                   $a[1] .='.ico';
                   
                   $curl = $this->get_url_content($a[1]);  
                   $file = $curl['exec'];
                   $zt = $curl['getinfo'];  
                   if($zt['http_code']=='200'){//类似昵图网的独立图片存储链接情况处理
                      $f2 = $file;
                      echo $f2;                
                   }else{          
                      $u = $http.$domain.'/'.$a[1];
                      $curl = $this->get_url_content($u);
                     $file = $curl['exec'];
                     $zt = $curl['getinfo'];
                      if($file && $zt['http_code']=='200'){
                         $f2 = $file;
                         echo $f2;
                      }else{
                         $file = "static/i/no.png";              
                         $f2 = @file_get_contents($file);
                         echo $f2;               
                     }
                   }
                }else{
                    $file = "static/i/no.png";
                    $f2 = @file_get_contents($file);
                    echo $f2;
                }
            }
            if($f2)
               $filesize = @file_put_contents($fav,$f2);
        }else{
            header("Content-Type:text/html;charset=utf-8");
            echo 'erro';
        }
    }
    function get_url_content($bbb) { 
       $ch = curl_init(); 
       $timeout = 5;  
       curl_setopt ($ch, CURLOPT_URL, $bbb); 
       curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);  
       curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout); 
       curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, FALSE); // https请求 不验证证书和hosts
       curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
       $file_info['exec']= curl_exec($ch); 
       $file_info['getinfo'] = curl_getinfo($ch); //判断状态 有的情况下无法正确判断ico是否存在
       curl_close($ch); 
       return $file_info; 
    }

    function isUrl($s)  
    {  
        return preg_match('/^http[s]?:\/\/'.  
            '(([0-9]{1,3}\.){3}[0-9]{1,3}'. // IP形式的URL- 199.194.52.184  
            '|'. // 允许IP和DOMAIN（域名）  
            '([0-9a-z_!~*\'()-]+\.)*'. // 三级域验证- www.  
            '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.'. // 二级域验证  
            '[a-z]{2,6})'.  // 顶级域验证.com or .museum  
            '(:[0-9]{1,4})?'.  // 端口- :80  
            '((\/\?)|'.  // 如果含有文件对文件部分进行校验  
            '(\/[0-9a-zA-Z_!~\*\'\(\)\.;\?:@&=\+\$,%#-\/]*)?)$/',  
            $s) == 1;  
    }
}
