<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

return [
    '__pattern__' => [
        'name' => '\w+',
    ],
    '[hello]'     => [
        ':id'   => ['index/hello', ['method' => 'get'], ['id' => '\d+']],
        ':name' => ['index/hello', ['method' => 'post']],
    ],
    //'mlist/:id-:p'   => ['Index/mlist',[],['id'=>'\d+']],
    'fontlink'   => 'Adlink/index',
    'frendlink'   => 'Frendlink/index',
    'web_exchange'   => 'Exchange/index',
    'friendchange'   => 'Exchange/friend',
    'webmain/:type'   => 'Web/wlist',
    'webmain'   => 'Web/index',
    'website/:id'   => 'Index/detail',

    'act/:actname'   => ['Index/act', ['method' => 'get']],
    
    'so/:q$'   => 'Index/so',
    'm_list/:id'   => 'M/m_list',
    'm_detail/:id/:p'   => ['M/m_detail',['cache'=>['__URL__',86400]],['id'=>'\d+']],
    'm_detail/:id'   => ['M/m_detail',['cache'=>['__URL__',86400]]],
    //'detail/:id'   => ['Index/detail',['method' => 'post|put'], ['id' => '\d+']],
    '__domain__'=>[
        'www'      => 'index',
        'my'      => 'member',
    ],
];
