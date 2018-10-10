<?php

// +----------------------------------------------------------------------
// | Think.Admin
// +----------------------------------------------------------------------
// | 版权所有 2014~2017 广州楚才信息科技有限公司 [ http://www.cuci.cc ]
// +----------------------------------------------------------------------
// | 官方网站: http://think.ctolog.com
// +----------------------------------------------------------------------
// | 开源协议 ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | github开源项目：https://github.com/zoujingli/Think.Admin
// +----------------------------------------------------------------------

namespace service;

use CURLFile;

/**
 * HTTP请求服务
 * Class HttpService
 * @package service
 * @author Anyon <zoujingli@qq.com>
 * @date 2017/03/22 15:32
 */
class HttpService {

    /**
     * HTTP GET 请求
     * @param string $url 请求的URL地址
     * @param array $data GET参数
     * @param int $second 设置超时时间（默认30秒）
     * @param array $header 请求Header信息
     * @return bool|string
     */
    public static function get($url, $data = array(), $second = 30, $header = []) {
        if (!empty($data)) {
            $url .= (stripos($url, '?') === false ? '?' : '&');
            $url .= (is_array($data) ? http_build_query($data) : $data);
        }
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_TIMEOUT, $second);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_ENCODING, "");
        !empty($header) && curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
        self::_setSsl($curl, $url);
        $content = curl_exec($curl);
        $status = curl_getinfo($curl);
        curl_close($curl);
        return (intval($status["http_code"]) === 200) ? $content : false;
    }

    //php脚本开始
    /*POST请求远程内容函数*/
/*    function ppost($url,$data,$ref){ // 模拟提交数据函数
        $curl = curl_init(); // 启动一个CURL会话
        curl_setopt($curl, CURLOPT_URL, $url); // 要访问的地址           
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0); // 对认证证书来源的检查
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 1); // 从证书中检查SSL加密算法是否存在
        curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']); // 模拟用户使用的浏览器
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1); // 使用自动跳转
        curl_setopt($curl, CURLOPT_REFERER, $ref);
        curl_setopt($curl, CURLOPT_POST, 1); // 发送一个常规的Post请求
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data); // Post提交的数据包
        curl_setopt($curl, CURLOPT_COOKIEFILE,$GLOBALS ['cookie_file']); // 读取上面所储存的Cookie信息
        curl_setopt($curl, CURLOPT_COOKIEJAR, $GLOBALS['cookie_file']); // 存放Cookie信息的文件名称
     
        curl_setopt($curl, CURLOPT_HTTPHEADER,array('Accept-Encoding: gzip, deflate'));
        curl_setopt($curl, CURLOPT_ENCODING, 'gzip,deflate');这个是解释gzip内容.................
        curl_setopt($curl, CURLOPT_TIMEOUT, 30); // 设置超时限制防止死循环
        curl_setopt($curl, CURLOPT_HEADER, 0); // 显示返回的Header区域内容
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1); // 获取的信息以文件流的形式返回
        $tmpInfo = curl_exec($curl); // 执行操作
        if (curl_errno($curl)) {
           echo 'Errno'.curl_error($curl);
        }
        curl_close($curl); // 关键CURL会话
        return $tmpInfo; // 返回数据
    } 
*/
    /**
     * POST 请求（支持文件上传）
     * @param string $url HTTP请求URL地址
     * @param array|string $data POST提交的数据
     * @param int $second 请求超时时间
     * @param array $header 请求Header信息
     * @return bool|string
     */
    static public function post($url, $data = [], $second = 30, $header = []) {
        self::_setUploadFile($data);
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_TIMEOUT, $second);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        !empty($header) && curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
        self::_setSsl($curl, $url);
        $content = curl_exec($curl);
        $status = curl_getinfo($curl);
        curl_close($curl);
        return (intval($status["http_code"]) === 200) ? $content : false;
    }

    /**
     * 设置SSL参数
     * @param $curl
     * @param string $url
     */
    private static function _setSsl(&$curl, $url) {
        if (stripos($url, "https") === 0) {
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
            curl_setopt($curl, CURLOPT_SSLVERSION, 1);
        }
    }

    /**
     * 设置POST文件上传兼容
     * @param array $data
     * @return string
     */
    private static function _setUploadFile(&$data) {
        if (!is_array($data)) {
            return null;
        }
        foreach ($data as &$value) {
            if (!(is_string($value) && strlen($value) > 0 && $value[0] === '@')) {
                continue;
            }
            $filename = realpath(trim($value, '@'));
            $filemime = FileService::getFileMine(strtolower(pathinfo($filename, PATHINFO_EXTENSION)));
            $value = class_exists('CURLFile', false) ? new CURLFile($filename, $filemime) : "{$value};type={$filemime}";
        }
    }

}
