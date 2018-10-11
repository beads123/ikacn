<?php
namespace app\member\controller;
class Goods extends Common
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
		    $where['f.status'] = $status=='上架'?0:1;
		}
		$list = model('friendlink_sell')->field('w.id as wid,f.id as gid,w.name as webname,url as weburl,type as autochain,price,price_qz,if(f.status=0,"上架","下架") as sellstatus,"-" as position,"首页" as dispage,"-" as size,1 as sense,c1.cname as cid1name,c2.cname as cid2name,c2.id as cid,c2.id as cid2,c1.id as cid1,"友情链接" as type,null as image,null as details,url as goods_url,show_style,auto_accept,0 as countO,0 as countS,2 as carding,"-" as position_fmt,"首页" as dispage_fmt')->alias('f')->join('__WEB__ w','w.id = f.webid','LEFT')->join('__CATEGORY__ c1','c1.id = w.cid','LEFT')->join('__CATEGORY__ c2','c2.id = c1.pid','LEFT')->where($where)->limit(($p-1)*$size,$size)->select();
		
        if(request()->isAjax()){
            return json(['statusCode'=>200,'message'=>'操作成功','data'=>$list,'page'=>['num_rows'=>0,'px'=>$p,'pz'=>$size,'num_page'=>0]]);
        }else{
            $this->assign('list',json_encode($list));
            return $this->fetch();
        }
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
    function getFriendWeb(){
        $list = model('web')->alias('w')->join('__WEB___ext we','w.id = we.webid','LEFT')->join('__FRIENDLINK___sell fs','w.id = fs.webid','LEFT')->field('w.id as wid,w.name as webname,url,c2.cname as cid1name,c1.cname as cid2name,c1.cname as catename,bdweight,validate,c1.id as cid,c2.id as cid2,c1.id as cid1,1 as sense')->join('__CATEGORY__ c1','c1.id = w.cid','LEFT')->join('__CATEGORY__ c2','c2.id = c1.pid','LEFT')->where(['fs.id'=>null])->select();
        return json(['statusCode'=>200,'message'=>'操作成功','data'=>$list]);
    }
    function addFriend(){
        $data['webid'] = input('post.wid');
        $data['show_style'] = input('post.show_style');
        $data['auto_accept'] = input('post.auto_accept');
        $data['price'] = input('post.price','0.00');
        $data['price_qz'] = input('post.price_qz','0.00');
        model('friendlink_sell')->save($data);
        $id = model('friendlink_sell')->id;
        return json(['statusCode'=>200,'message'=>'操作成功','insertId'=>$id,'validate'=>2,'url'=>'']);
    }
    function upDownState(){
        $gid = input('post.gid');
        $state = input('post.state');
        $status = $state=='下架'?1:0;
        model('friendlink_sell')->save(['status'=>$status],['id'=>$gid]);
        return json(['statusCode'=>200,'message'=>'操作成功']);
    }
    function editfriendsell(){
        $gid = input('get.gid');
        $list = model('friendlink_sell')->field('w.id as wid,f.id as gid,w.name as webname,url as weburl,type as autochain,price,price_qz,if(f.status=0,"上架","下架") as sellstatus,"-" as position,"首页" as dispage,"-" as size,1 as sense,c1.cname as cid1name,c2.cname as cid2name,c2.id as cid,c2.id as cid2,c1.id as cid1,"友情链接" as type,null as image,null as details,url as goods_url,show_style,auto_accept,0 as countO,0 as countS,2 as carding,"-" as position_fmt,"首页" as dispage_fmt,"1.00" as chain_rate')->alias('f')->join('__WEB__ w','w.id = f.webid','LEFT')->join('__CATEGORY__ c1','c1.id = w.cid','LEFT')->join('__CATEGORY__ c2','c2.id = c1.pid','LEFT')->where(['f.id'=>$gid])->select();
        $this->assign('list',json_encode($list));
        $this->assign('d',$list[0]);
        return $this->fetch();
    }
    function goodsdel(){
        $gid = input('post.gid');
        model('friendlink_sell')->where(['id'=>$gid])->delete();
        return json(['statusCode'=>200,'message'=>'操作成功']);
    }
}
