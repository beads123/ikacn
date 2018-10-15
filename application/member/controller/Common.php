<?php
namespace app\member\controller;
use app\common\controller\Base;
class Common extends Base
{
    public function _initialize()
    {
        parent::_initialize();
        if(!cookie('sys_key')){
            $this->redirect(url('user/login','',true,'www'));
        }
        $left = [
            ['class'=>'zhgs','url'=>'/','name'=>'帐户概述','isnew'=>0,'child'=>[]],
            ['class'=>'ddgl','url'=>'/','name'=>'订单管理','isnew'=>0,'child'=>[
                ['class'=>'','url'=>'/order/index.html','name'=>'购买的订单'],
                ['class'=>'','url'=>'/order/indexsell.html','name'=>'卖出的订单'],
            ]],
            ['class'=>'csyl','url'=>'/goods/friendgoods.html','isnew'=>0,'name'=>'出售友链','child'=>[]],
            ['class'=>'csgg','url'=>'/twgoods/twgoods.html','isnew'=>0,'name'=>'出售广告','child'=>[]],
            ['class'=>'csrw','url'=>'/softtext/softtext.html','isnew'=>0,'name'=>'出售软文','child'=>[]],
            ['class'=>'wzjy','url'=>'/','name'=>'网站交易','isnew'=>0,'child'=>[
                ['class'=>'','url'=>'/websitetrade/sellwebsite.html','name'=>'出售的网站'],
                ['class'=>'','url'=>'/websitetrade/buywebsite.html','name'=>'购买的网站'],
            ]],
            ['class'=>'mfhl','url'=>'/','name'=>'免费换链','isnew'=>0,'child'=>[
                ['class'=>'','url'=>'/freechange/release.html','name'=>'我发布的'],
                ['class'=>'','url'=>'/freechange/changelist.html','name'=>'交换列表'],
            ]],
            ['class'=>'lljh','url'=>'/','name'=>'流量交换','isnew'=>1,'child'=>[
                ['class'=>'','url'=>'/trafficexchange/index.html','name'=>'免费交换'],
                ['class'=>'','url'=>'/trafficexchange/salesindex.html','name'=>'流量买卖'],
                ['class'=>'','url'=>'/trafficexchange/adverwei_manage.html','name'=>'广告位管理'],
                ['class'=>'','url'=>'/trafficexchange/adver_manage.html','name'=>'广告管理'],
            ]],
            ['class'=>'tggl','url'=>'/','name'=>'推广管理','isnew'=>0,'child'=>[
                ['class'=>'','url'=>'/tggl/index.html','name'=>'广告链接管理'],
                ['class'=>'','url'=>'/tggl/softmanage.html','name'=>'软文管理'],
            ]]
        ];
        $this->assign('left',$left);
        $this->assign('path',$_SERVER['REQUEST_URI']);
    }
}
