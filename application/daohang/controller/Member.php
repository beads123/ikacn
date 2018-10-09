<?php
namespace app\daohang\controller;
use app\common\controller\Base;
use service\pagerank;
class Member extends Base
{
    protected $cat_cache = 'dh_clist';
    protected $fid=8;
	public function _initialize()
    {
        parent::_initialize();
        $this->assign('keywords','华乐网,头条新闻,头条,今日新闻头条,头条网,头条新闻,今日头条新闻,商业评论,科技资讯,互联网金融,科技新闻,移动互联网,网络游戏,电子商务,电信,智能手机,手游,内幕真相,宏观,趋势,创业,精选,有料,干货,有用,细节,内幕');
        $this->assign('description','华乐网(www.hahacn.com)集信息交流融合、IT技术信息、新媒体于一身的媒体平台。分析你的兴趣爱好,为你推荐喜欢的内容,并且越用越懂你.就要你好看,用专业的精神剖析时代，孜孜不倦探索科技与商业的未来。');
        $this->assign('webname','华乐网');
        $this->assign('sitepath','当前位置：<a href="/">华乐网</a> &raquo; <a href="'.url('member/home').'">会员中心</a>');
    }
    public function getModel(){
        return model('Categories');
    }

    /**
     * 网站入口
     */
    public function home() {
    	$this->assign('title','会员中心-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        $this->assign('path', '');
        return $this->fetch();
    }
    /** category */
    public function category() {
        $key = $_GET['key'];
        $ids = explode(',', $key);
        $cid = array_pop($ids);
        $cid = intval($cid);
        $categories = model('Categories')->where(['pid'=>$cid])->order('sort asc,id asc')->field('id,typename')->select();
        if (!empty($categories) && is_array($categories)) {
            $temp = array();
            foreach ($categories as $row) {
                $temp[$row['id']]  = $row['typename'];
            }
            unset($categories);
            
            return json($temp);
        }
    }
    function is_valid_domain($domain) {
        if (preg_match("/^([0-9a-z-]{1,}.)?[0-9a-z-]{2,}.([0-9a-z-]{2,}.)?[a-z]{2,}$/i", $domain)) {
            return true;
        } else {
            return false;
        }
    }
    /** crawl */
    public function crawl() {
        $url = trim($_GET['url']);
        if (empty($url)) {
            exit('请输入网站域名！');
        } else {
            if (!$this->is_valid_domain($url)) {
                exit('请输入正确的网站域名！');
            }
        }
        
        $meta = $this->get_sitemeta($url); 
        echo '<script type="text/javascript">';
        echo '$("#web_name").attr("value", "'.$meta['title'].'");';
        echo '$("#web_tags").attr("value", "'.$meta['keywords'].'");';
        echo '$("#web_intro").attr("value", "'.$meta['description'].'");';
        echo '</script>';
        unset($meta);
    }
    
    /** check site */
    function check(){
        $url = trim($_GET['url']);
        
        if (empty($url)) {
            exit('请输入网站域名！');
        } else {
            if (!$this->is_valid_domain($url)) {
                exit('请输入正确的网站域名！');
            }
        }
        $query = model('Website')->where(['web_url'=>$url])->field('web_id')->find();
        if (!empty($query)) {
            echo('该域名已存在，请勿重复提交！');
        } else {
            echo('<a href="javascript: void(0);" onclick="getmeta(\''.$url.'\'); getrank(\''.$url.'\')">自动抓取&raquo;</a>');
        } 
    }
    
    /** 获取META信息 */
    function get_sitemeta($url) {
        $url = format_url($url);
        $data = get_url_content($url);
            
        $meta = array();
        if (!empty($data)) {
            #Title
            preg_match('/<TITLE>([\w\W]*?)<\/TITLE>/si', $data, $matches);
            if (!empty($matches[1])) {
                $meta['title'] = $matches[1];
            }
            
            #Keywords
            preg_match('/<META\s+name="keywords"\s+content="([\w\W]*?)"/si', $data, $matches);      
            if (empty($matches[1])) {
                preg_match("/<META\s+name='keywords'\s+content='([\w\W]*?)'/si", $data, $matches);          
            }
            if (empty($matches[1])) {
                preg_match('/<META\s+content="([\w\W]*?)"\s+name="keywords"/si', $data, $matches);          
            }
            if (empty($matches[1])) {
                preg_match('/<META\s+http-equiv="keywords"\s+content="([\w\W]*?)"/si', $data, $matches);            
            }
            if (!empty($matches[1])) {
                $meta['keywords'] = $matches[1];
            }
            
            #Description
            preg_match('/<META\s+name="description"\s+content="([\w\W]*?)"/si', $data, $matches);       
            if (empty($matches[1])) {
                preg_match("/<META\s+name='description'\s+content='([\w\W]*?)'/si", $data, $matches);           
            }
            if (empty($matches[1])) {
                preg_match('/<META\s+content="([\w\W]*?)"\s+name="description"/si', $data, $matches);                   
            }
            if (empty($matches[1])) {
                preg_match('/<META\s+http-equiv="description"\s+content="([\w\W]*?)"/si', $data, $matches);         
            }
            if (!empty($matches[1])) {
                $meta['description'] = $matches[1];
            }
        }

        return $meta; 
    }
    function get_domain($url) {
        if (preg_match("/^(http:\/\/)?([^\/]+)/i", $url, $domain)) {
            return $domain[2];
        } else {
            return false;
        }
    }
    /** Server IP */
    function get_serverip($url) {
        $domain = $this->get_domain($url);
        if ($domain) {
            $ip = gethostbyname($domain);
        } else {
            $ip = 0;
        }
        
        return $ip;
    }
    /** Google Pagerank */
    function get_pagerank($url) {
        $pr = new PageRank();
        $rank = $pr->getGPR($url);
        return $rank;
    }

    /** Baidu Pagerank */
    function get_baidurank($url) {
         $data= file_get_contents('http://mytool.chinaz.com/baidusort.aspx?host='.$url);
            preg_match_all("/<div class=\"siteinfo\">(.*)<font color=\"blue\">(.*)<\/font>(.*)<font color=\"blue\">(.*)<\/font>(.*)<font color=\"blue\">(.*)<\/font>(.*)<font color=\"blue\">(.*)<\/font>(.*)<\/div>/siU",$data,$arr);
             // print_r($arr);
             if(isset($arr[2][0])){
               return  $arr[2][0];  //返回权重值
             }else{
               return  "0";
             }
    }

    /** Sogou Pagerank */
    function get_sogourank($url) {
        $data = get_url_content("http://rank.ie.sogou.com/sogourank.php?ur=http://$url");
        if (preg_match('/sogourank=(\d+)/i', $data, $matches)) {
            $rank = intval($matches[1]);
        } else {
            $rank = 0;
        }
        return $rank;
    }

    /** Alexa Rank */
    function get_alexarank($url) {
        $data = get_url_content("http://xml.alexa.com/data?cli=10&dat=nsa&ver=quirk-searchstatus&url=$url");
        if (preg_match('/<POPULARITY[^>]*URL[^>]*TEXT[^>]*\"([0-9]+)\"/i', $data, $matches)) {
            $rank = strip_tags($matches[1]);
        } else {
            $rank = 0;
        }
        return $rank;
    }

    /** data */
    public function data() {
        $url = trim($_GET['url']);
        if (empty($url)) {
            exit('请输入网站域名！');
        } else {
            if (!$this->is_valid_domain($url)) {
                exit('请输入正确的网站域名！');
            }
        }
        
        $ip = $this->get_serverip($url);
        $grank = $this->get_pagerank($url);
        $brank = $this->get_baidurank($url);
        $srank = $this->get_sogourank($url);
        $arank = $this->get_alexarank($url);
        echo '<script type="text/javascript">';
        echo '$("#web_ip").attr("value", "'.$ip.'");';
        echo '$("#web_grank").attr("value", "'.$grank.'");';
        echo '$("#web_brank").attr("value", "'.$brank.'");';
        echo '$("#web_srank").attr("value", "'.$srank.'");';
        echo '$("#web_arank").attr("value", "'.$arank.'");';
        echo '</script>';
    }
    public function add(){
        $this->assign('category_option', $this->get_category_option(0, 0, 0));

        $this->assign('title','网站提交-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        $this->assign('path', ' &raquo; 网站提交'); 
        return $this->fetch();
    }
    /** one category */
	function get_one_category($cate_id = 0) {
		$row = model('Categories')->where(['pid'=>$cate_id])->cache(86400)->field('id,typename')->find();
	}
	/** 检查非法关键词 */
	function censor_words($keywords = '', $content = '') {
		$checked = true;
		if (!empty($keywords) && !empty($content)) {
			$wordarr = explode(',', $keywords);
			foreach ($wordarr as $val) {
				if (preg_match('/'.$val.'/i', $content)) {
					$checked = false;
				}
			}
		}
		
		return $checked;
	}
    public function save(){
    	$filter_words = 'sb,共产党,发票';
    	$cate_id = intval($_POST['cate_id']);
		$web_name = trim($_POST['web_name']);
		$web_url = trim($_POST['web_url']);
		$web_tags = trim($_POST['web_tags']);
		$web_intro = trim($_POST['web_intro']);
		$web_ip = trim($_POST['web_ip']);
		$web_grank = intval($_POST['web_grank']);
		$web_brank = intval($_POST['web_brank']);
		$web_srank = intval($_POST['web_srank']);
		$web_arank = intval($_POST['web_arank']);
		$web_time = time();
		$web_id = intval($_POST['web_id']);
		
		if ($cate_id <= 0) {
			$this->error('请选择网站所属分类！');
		} else {
			$cate = $this->get_one_category($cate_id);
			if (!empty($cate)) {
				$this->error('指定的分类下有子分类，请选择子分类进行操作！');
			}
		}
	
		if (empty($web_name)) {
			$this->error('请输入网站名称！');
		} else {
			if (!$this->censor_words($filter_words, $web_name)) {
				$this->error('网站名称中含有非法关键词！');	
			}
		}
		
		if (empty($web_url)) {
			$this->error('请输入网站域名！');
		} else {
			if (!$this->is_valid_domain($web_url)) {
				$this->error('请输入正确的网站域名！');
			}
		}
		
		if (!empty($web_tags)) {
			if (!$this->censor_words($filter_words, $web_tags)) {
				$this->error('TAG标签中含有非法关键词！');
			}
			
			$web_tags = str_replace('，', ',', $web_tags);
			$web_tags = str_replace(',,', ',', $web_tags);
			if (substr($web_tags, -1) == ',') {
				$web_tags = substr($web_tags, 0, strlen($web_tags) - 1);
			}
		}
			
		if (empty($web_intro)) {
			$this->error('请输入网站简介！');
		} else {
			if (!$this->censor_words($filter_words, $web_intro)) {
				$this->error('网站简介中含有非法关键词！');	
			}
		}
		
		$web_ip = sprintf("%u", ip2long($web_ip));
		
		$web_data = array(
			'cate_id' => $cate_id,
			'user_id' => $this->userid,
			'web_name' => $web_name,
			'web_url' => $web_url,
			'web_tags' => $web_tags,
			'web_intro' => $web_intro,
			'web_status' => 2,
			'web_ctime' => $web_time,
		);
		if($web_id>0){
			$where = array('web_id' => $web_id);
			model('Website')->save($web_data,$where);
			$stat_data = array(
				'web_ip' => $web_ip,
				'web_grank' => $web_grank,
				'web_brank' => $web_brank,
				'web_srank' => $web_srank,
				'web_arank' => $web_arank,
				'web_utime' => $web_time,
			);
			model('Webdata')->save($stat_data,$where);
			$this->success('网站编辑成功！', url('mlist'));
		}else{
			$query = model('Website')->field('web_id')->where(['web_url'=>$web_url])->find();
    		if (!empty($query)) {
        		$this->error('您所提交的网站已存在！');
    		}
    		model('Website')->save($web_data);
			$insert_id = model('Website')->web_id;
			
			$stat_data = array(
				'web_id' => $insert_id,
				'web_ip' => $web_ip,
				'web_grank' => $web_grank,
				'web_brank' => $web_brank,
				'web_srank' => $web_srank,
				'web_arank' => $web_arank,
				'web_utime' => $web_time,
			);
			model('Webdata')->save($stat_data);
		
			$this->success('网站提交成功！', url('mlist'));	
		}
    }
    public function mlist(){
    	$model = model('Website');
        $where = '1=1';
        if($this->userid != 2){
            $where .= ' and w.user_id='.$this->userid;
        }
		$web = $model->alias('w')->join('categories c','w.cate_id=c.id','left')->join('webdata d','w.web_id=d.web_id','left')->where("w.user_id=".$this->userid)->field('w.web_id, w.web_name, w.web_url, w.web_intro, w.web_status, w.web_ctime, c.typename, d.web_ip, d.web_grank, d.web_brank, d.web_srank, d.web_arank, d.web_instat, d.web_outstat, d.web_views, d.web_utime')->order("w.web_istop DESC,w.web_ctime DESC")->paginate(10);
        foreach ($web as $key => &$value) {
        	switch ($value['web_status']) {
				case 1 :
					$status = '黑名单';
					break;
				case 2 :
					$status = '待审核';
					break;
				case 3 :
					$status = '已审核';
					break;
			}
			$value['web_thumb'] = get_webthumb($value['web_url']);
			$value['web_url'] = format_url($value['web_url']);
			$value['web_link'] = get_website_url($value['web_id']);
			$value['web_status'] = $status;
			$value['web_ctime'] = date('Y-m-d', $value['web_ctime']);
			$value['web_utime'] = date('Y-m-d', $value['web_utime']);
        }
        $page = $web->render();
		$this->assign('weblist', $web);
		//$smarty->assign('total', $total);
		$this->assign('showpage', $page);

		$this->assign('title','网站管理-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        $this->assign('path', ' &raquo; 网站管理'); 
        return $this->fetch();
    }
    public function ok(){
        $web_id = request()->param('wid');
        $model = model('Website')->update(['web_status'=>3],['web_id'=>$web_id]);
        $this->success('网站提交成功！');
    }
    public function fail(){
        $web_id = request()->param('wid');
        $model = model('Website')->update(['web_status'=>1],['web_id'=>$web_id]);
        $this->success('网站提交成功！');
    }
    public function edit(){
		$web_id = request()->param('wid');
		$model = model('Website');
		$web = $model->alias('a')->join('webdata b','a.web_id=b.web_id','left')->where("a.user_id='".$this->userid."' AND a.web_id='".$web_id."'")->field('a.user_id, a.cate_id, a.web_id, a.web_name, a.web_url, a.web_tags, a.web_intro, a.web_istop, a.web_isbest, a.web_status, a.web_ctime, b.web_ip, b.web_grank, b.web_brank, b.web_srank, b.web_arank, b.web_instat, b.web_outstat, b.web_views, b.web_utime')->find();
		if (empty($web)) {
			$this->error('您要修改的内容不存在或无权限！');
		}

		#分类ID
		$parent_cids = $this->get_category_parent_ids($web['cate_id']).','.$web['cate_id'];
		if (strpos($parent_cids, ',') !== false) {
			$cate_pids = explode(',', $parent_cids);
			array_shift($cate_pids);
		} else {
			$cate_pids = (array) $parent_cids;
		}

		$web['web_ip'] = long2ip($web['web_ip']);	
		$this->assign('cate_pids', $cate_pids);
		$this->assign('category_option', $this->get_category_option(0, $web['cate_id'], 0));
		$this->assign('web', $web);
		$this->assign('title','网站编辑-华乐网_头条新闻,读懂智能&未来,引领未来商业与生活新知');
        $this->assign('path', ' &raquo; 网站编辑');
        return $this->fetch();
    }
    public function logout()
    {
        session("userid", NULL);
        session("username", NULL);
        return json(array('code' => 200, 'msg' => '退出成功'));
      //  return NULL;
    }
    /** category option */
    function get_category_option($root_id = 0, $cate_id = 0, $level_id = 0) {
        $categories = model('Categories')->where(['pid'=>$root_id])->order('sort asc,id asc')->field('id,typename')->select();
        $optstr = '';
        foreach ($categories as $cate) {
            $optstr .= '<option value="'.$cate['id'].'"';
            if ($cate_id > 0 && $cate_id == $cate['id']) $optstr .= ' selected';
            
            if ($level_id == 0) {
                $optstr .= ' style="background: #EEF3F7;">';
                $optstr .= '├'.$cate['typename'];
            } else {
                $optstr .= '>';
                for ($i = 2; $i <= $level_id; $i++) {
                    $optstr .= '│&nbsp;&nbsp;';
                }
                $optstr .= '│&nbsp;&nbsp;├'.$cate['typename'];
            }
            $optstr .= '</option>';
            $optstr .= $this->get_category_option($cate['id'], $cate_id, $level_id + 1);
        }
        unset($categories);
            
        return $optstr;
    }
    /** category parent ids */
	function get_category_parent_ids($cate_id) {
		$ids = model('Categories')->where(['id'=>$cate_id])->order('sort asc,id asc')->field('pid')->select();
		$idstr = '';
		if (!empty($ids) && is_array($ids)) {
			foreach ($ids as $id) {
				if ($id['pid'] > 0) {
					$idstr .= $this->get_category_parent_ids($id['pid']);
					$idstr .= ','.$id['pid'];
				} else {
					$idstr = '0';
				}
			}
		}
		return $idstr;
	}
}
