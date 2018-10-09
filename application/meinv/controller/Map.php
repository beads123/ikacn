<?php
namespace app\meinv\controller;

use think\Controller;

class Map  extends Controller{
    public function baidu()
    {
    	 $model = model('Mlist');//thinkphp 数据链接
         $today = date("Y-m-d",time());
         $yesterday  = mktime(0, 0, 0, date("m")  , date("d")-1, date("Y"));
         $lastweek = strtotime("-1 week");
         //$yesterdayArr = $link->query("select * from pre_sethouse where status=1 and time>$yesterday");//昨天
         $yesterdayArr = $model->where("addtime>$yesterday")->order('addtime desc')->select();
         //$lastweekArr = $link->query("select * from pre_sethouse where  status=1 and time>$lastweek");//上周
         //$url = "http://www.hahacn.com/";
         $url="";
         foreach($yesterdayArr as $k=>$v){
          $data_array[$k]['loc'] = $url.url('detail/'.$v['id']);
          $data_array[$k]['lastmod'] = $today;
          $data_array[$k]['changefreq'] = 'always';
          $data_array[$k]['priority'] = '0.6';
          $data_array[$k]['data'] = '<display></display>';
         }
         $content='<?xml version="1.0" encoding="UTF-8"?><urlset>'.chr(13).'';
         $content.='<url>
         <loc>http://mm.hahacn.com</loc>
         <lastmod>'.$today.'</lastmod>
         <changefreq>always</changefreq>
         <priority>0.9</priority>
         <data><display></display></data>
         </url>'.chr(13);
         foreach($data_array as $data){
          $content.=$this->create_item($data);
         }
         $content.='</urlset>';
         $fp=fopen('mmsitemap.xml','w+');
         fwrite($fp,$content);
         fclose($fp);
        
    	echo '生成完成';
    }
    function create_item($data){
        $item="<url>\n";
        $item.="<loc>".$data['loc']."</loc>\n";
        $item.="<lastmod>".$data['lastmod']."</lastmod>\n";
        $item.="<changefreq>".$data['changefreq']."</changefreq>\n";
        $item.="<priority>".$data['priority']."</priority>\n";
        $item.="<data>".$data['data']."</data>\n";
        $item.="</url>\n";
        return $item;
    }
}
