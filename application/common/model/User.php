<?php 
namespace app\common\model;
use think\Model;
class User extends Model {
	protected $table = 'public_user';
	// 设置当前模型的数据库连接
    protected $connection = [
        // 数据库类型
        'type'        => 'mysql',
        // 服务器地址
        'hostname'    => '120.27.125.196',
        // 数据库名
        'database'    => 'hahacn_multsite',
        // 数据库用户名
        'username'    => 'hahacn',
        // 数据库密码
        'password'    => 'hahacn',
        // 数据库编码默认采用utf8
        'charset'     => 'utf8',
        // 数据库表前缀
        //'prefix'      => 'think_',
        // 数据库调试模式
        'debug'       => false,
    ];
}
?>