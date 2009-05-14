<?php
/*
 * index file for thanks
 *
 * @copyright Copyright (C) 2009 KANekT @ http://blog.teamrip.ru
 * @license http://www.gnu.org/licenses/gpl.html GPL version 2 or higher
 * @package thanks
*/

echo '<style>
#thanks-head
{
	background: #1F537B;
	color: #ddd;
	border-color: #1f537b;
	width: 275px;
	padding-left: 5px;
}
#thanks-text-td1
{
	background: #ddd;
	color: navy;
	border-color: #1F537B;
	width: 155px;
	height: 20px;
	float: left;
	padding-left: 5px;
}
#thanks-text-td2
{
	background: #ddd;
	color: navy;
	border-color: #1F537B;
	width: 120px;
	height: 20px;
	float: left;
	font-size: 12px;
	font-family: Georgia;
}
</style>';
// Make sure no one attempts to run this script "directly"
if (!defined('FORUM_ROOT'))	define('FORUM_ROOT', '../../');
if (!defined('FORUM'))	define('FORUM', 1);
require FORUM_ROOT.'config.php';
require FORUM_ROOT.'include/dblayer/common_db.php';
if (file_exists(FORUM_ROOT.'extensions/thanks/lang/'.$forum_user['language'].'.php'))
	require FORUM_ROOT.'extensions/thanks/lang/'.$forum_user['language'].'.php';
else
	require FORUM_ROOT.'extensions/thanks/lang/English.php';
	
$post_id = (isset($_GET['id'])) ? intval($_GET['id']) : '';
if ($post_id < 1)
	$error .=  ($lang_thanks['error_00']);
	else 
	{
$page_id = (isset($_GET['page'])) ? intval($_GET['page']) : 0;
$page_id = $page_id*50;
// 
$query_thanks = array(
	'SELECT'	=> 't.thank_date, u.username',
	'FROM'		=> 'thanks AS t',
	'JOINS'		=> array(
	array(
		'INNER JOIN'	=> 'users AS u',
		'ON'			=> 't.user_thanked_id=u.id'
		)),		
	'WHERE'		=> 't.post_id='.$post_id,
	'LIMIT'		=> $page_id.',50'
);
$result_thanks = $forum_db->query_build($query_thanks) or error(__FILE__, __LINE__);
	if (!$forum_db->num_rows($result_thanks) > 0)
		$error .=  $lang_thanks['error_03'];
	else
	{
		$UserThanks = '<div id="thanks-head">'.$lang_thanks['ThanksUser'].'</div>';
		while($row = $forum_db->fetch_assoc($result_thanks))
		{
			$timeT = date( 'd-m-Y H:h', $row['thank_date']);

			$UserThanks .= '<div style="clear: both"></div><div id="thanks-text-td1"><b>'.$row['username'].'</b></div><div id="thanks-text-td2">'.$timeT.'</div>';
		}
	}
	if (empty($error)) echo $UserThanks;
	else  echo $error;
}
?>