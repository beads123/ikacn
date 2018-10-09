<?php
namespace app\member\controller;
use app\common\controller\Base;
class Goods extends Base
{
    /**
     * 网站入口
     */
    public function friendgoods() {
		$p = input('post.px',1);
		$size = input('post.pz',10);
		$status = input('post.status','');
		$where = [];
		if(!empty($status)){
		    $where['f.status'] = $status;
		}
		$list = model('friendlink_sell')->field('w.id as wid,w.id as gid,w.name as webname,url as weburl,type as autochain,indexprice as price,allprice as price_qz,if(f.status=0,"上架","下架") as sellstatus,"-" as position,"首页" as dispage,"-" as size,1 as sense,c1.cname as cid1name,c2.cname as cid2name,c2.id as cid,c2.id as cid2,c1.id as cid1,"友情链接" as type,null as image,null as details,url as goods_url,style as show_style,isauto as auto_accept,0 as countO,0 as countS,2 as carding,"-" as position_fmt,"首页" as dispage_fmt')->alias('f')->join('__WEB__ w','w.id = f.webid','LEFT')->join('__CATEGORY__ c1','c1.id = w.cid','LEFT')->join('__CATEGORY__ c2','c2.id = c1.pid','LEFT')->where($where)->limit(($p-1)*$size,$size)->select();
		$this->assign('list',json_encode($list));
        return $this->fetch();
    }
    public function checkData(){
    	return json(['statusCode'=>200,'message'=>'操作成功','data'=>$this->user]);
    }
    public function friendsell($value=''){
    	return $this->fetch();
    }
    public function indexsell(){
        return $this->fetch();
    }
}
