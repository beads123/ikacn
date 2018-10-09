<?php 
namespace app\common\model;
use think\Model;
class Vod extends Model {
	protected $table = 'ff_vod';

	//别名处理
	public function vod_ename(){
		if (!$_POST['vod_ename']) {
			return ff_pinyin(trim($_POST["vod_name"]));
		}else{
			return trim($_POST["vod_ename"]);
		}
	}
	//字母处理
	public function vod_letter(){
		if (!$_POST['vod_letter']) {
			return ff_url_letter(trim($_POST["vod_name"]));
		}else{
			return trim($_POST['vod_letter']);
		}
	}
	//图片处理
	public function vod_pic(){
		return D('Img')->down_load(trim($_POST["vod_pic"]));
	}	
	//内容处理
	public function vod_content($content){
		return ff_content_img($content,'vod');
	}
	//积分处理
	public function vod_gold(){
		if($_POST["vod_gold"] > 10){
			$_POST["vod_gold"] = 10;
		}	
		return 	$_POST["vod_gold"];
	}
	//是否更新时间
	public function vod_addtime(){
		if ($_POST['checktime']) {
			return time();
		}else{
			return strtotime($_POST['vod_addtime']);
		}
	}
	//处理上映日期
	public function vod_filmtime(){
		if ($_POST['vod_filmtime']) {
			return strtotime($_POST['vod_filmtime']);
		}else{
			return 0;
		}
	}
	//处理年代
	public function vod_year(){
		if ($_POST['vod_filmtime']) {
			return date('Y',strtotime($_POST['vod_filmtime']));
		}else{
			return intval($_POST['vod_year']);
		}
	}
	//连载状态
	public function vod_isend(){
		if ($_POST['vod_total'] == $_POST['vod_continu']) {
			return 1;
		}else{
			return 0;
		}
	}
	//分集剧情
	public function vod_scenario($vod_scenario){
		if($vod_scenario){
			//删除空白的 中间有空白的 请填上 暂无简介
			foreach($vod_scenario as $key=>$value){
				foreach($value as $key2=>$value2){
					if(empty($value2)){
						unset($vod_scenario[$key][$key2]);
					}
				}
			}
			return json_encode($vod_scenario);
		}
	}
	//预告片
	public function vod_state($state){
		if ($_POST['vod_play'] == 'yugao') {
			return '预告片';
		}else{
			return $state;
		}
	}
	
	// 通过ID查询详情数据 order主要是用在查上一条 上一条时需要
	public function ff_find($field = '*', $where, $cache_name=false, $relation=true, $order=false){
		//md5处理KEY
		if($cache_name){
			$cache_name = md5($cache_name);
		}
		//优先缓存读取数据
		if( C('cache_page_vod') && $cache_name){
			$cache_info = S($cache_name);
			if($cache_info){
				return $cache_info;
			}
		}
		//数据库获取数据
		$info = $this->field($field)->where($where)->relation($relation)->order($order)->find();
		//dump($this->getLastSql());
		if($info){
			if( $info['vod_play'] && $info['vod_url'] ){
				$info['vod_play_list'] = ff_play_list($info['vod_server'], $info['vod_play'], $info['vod_url']);
			}
			if($info['vod_scenario']){
				$info['vod_scenario'] = json_decode($info['vod_scenario'], true);
			}
			if($info['list_extend']){
				$info['list_extend'] = json_decode($info['list_extend'], true);
			}
			if( C('cache_page_vod') && $cache_name ){
				S($cache_name, $info, intval(C('cache_page_vod')));
			}
    	return $info;
    }
		$this->error = '数据不存在！';
		return false;
	}

	// 新增或更新
	public function updatew($data){
		//自动获取关键词tag
		if(empty($data["vod_keywords"]) && C('collect_tags')){
			$data["vod_keywords"] = ff_tag_auto($data["vod_name"],$data["vod_content"]);
		}
		// 创建安全数据对象TP
		$data = $this->create($data);
		if(false === $data){
			$this->error = $this->getError();
			return false;
		}
		/* 添加或新增行为 */
		if(empty($data['vod_id'])){
			$data['vod_id'] = $this->add();
			if(!$data['vod_id']){
				$this->error = $this->getError();
				return false;
			}
		} else {
			$status = $this->save();
			if(false === $status){
				$this->error = $this->getError();
				return false;
			}
		}
		// 多分类处理
		D('Tag')->tag_update($data['vod_id'],$data["vod_type"],'vod_type');
		// TAG关系处理
		D('Tag')->tag_update($data['vod_id'],$data["vod_keywords"],'vod_tag');
		return $data;
	}	
	
	// 查询多个数据
	public function ff_select_page($params, $where){
		//优先从缓存调用数据及分页变量
		if($params['cache_name'] && $params['cache_time']){
			$infos = S($params['cache_name']);
			if($infos){
				if($params['page_id'] && $params['page_is']){
					$_GET['ff_page_'.$params['page_id']] = S($params['cache_name'].'_page');
				}
				return $infos;
			}
		}
		// 分页变量动态定义
		if($params['page_id'] && $params['page_is']){
			$page = array();
			$page['records'] = $this->ff_select_count($where);
			$page['totalpages'] = ceil($page['records']/$params['limit']);
			$page['currentpage'] = ff_page_max($params['page_p'], $page['totalpages']);
			// 使用GET全局变量传递分页参数 gx_page_default
			$_GET['ff_page_'.$params['page_id']] = $page;
		}else{
			$page['currentpage'] = false;
		}	
		$infos = $this->field($params['field'])->where($where)->limit($params['limit'])->page($page['currentpage'])->order(trim($params['order'].' '.$params['sort']))->select();
		//dump($this->getLastSql());
		// 是否写入数据缓存
		if($params['cache_name'] && $params['cache_time']){
			S($params['cache_name'], $infos, intval($params['cache_time']) );
			if($params['page_id'] && $params['page_is']){
				S($params['cache_name'].'_page', $page, intval($params['cache_time'])+1 );
			}
		}
		return $infos;
	}
	// 符合条件的统计
	public function ff_select_count($where){
		return $this->where($where)->count('vod_id');
	}
}
?>