<?php
/*
 * index file for thanks
 *
 * @copyright Copyright (C) 2009 KANekT @ http://blog.teamrip.ru
 * @license http://www.gnu.org/licenses/gpl.html GPL version 2 or higher
 * @package thanks
*/


// Make sure no one attempts to run this script "directly"
if (!defined('FORUM_ROOT'))	define('FORUM_ROOT', '../../');

require FORUM_ROOT.'include/common.php';
if (file_exists(FORUM_ROOT.'extensions/thanks/lang/'.$forum_user['language'].'.php'))
	require FORUM_ROOT.'extensions/thanks/lang/'.$forum_user['language'].'.php';
else
	require FORUM_ROOT.'extensions/thanks/lang/English.php';
	
$user_id = (isset($_GET['id'])) ? intval($_GET['id']) : '';
if ($forum_user['g_read_board'] == '0')
	message($lang_common['No view']);
if ($user_id < 1)
	message($lang_thanks['error_00']);
	else 
	{
$page_id = (isset($_GET['page'])) ? intval($_GET['page']) : 0;
$page_id = $page_id*50;
// 
$query_thanks = array(
	'SELECT'	=> 't.id, t.post_id, t.thank_date, u.username, IF(CHAR_LENGTH(p.message)<70, p.message, CONCAT(LEFT(p.message, 70), "...")) as subject',
	'FROM'		=> 'thanks AS t',
	'JOINS'		=> array(
	array(
		'INNER JOIN'	=> 'users AS u',
		'ON'			=> 't.user_thanked_id=u.id'
		),		
	array(
		'INNER JOIN'	=> 'posts AS p',
		'ON'			=> 't.post_id=p.id'
		),
	array(
		'LEFT JOIN'	=> 'topics AS t1',
		'ON'			=> 't1.id=p.topic_id'
		),
	array(
		'LEFT JOIN'		=> 'forum_perms AS fp',
		'ON'			=> '(fp.forum_id=t1.forum_id AND fp.group_id='.$forum_user['g_id'].')'
		),
	),		
	'WHERE'		=> '(fp.read_forum IS NULL OR fp.read_forum=1) AND t.user_id='.$user_id,
	'LIMIT'		=> $page_id.',50'
);
$result_thanks = $forum_db->query_build($query_thanks) or error(__FILE__, __LINE__);
if ($forum_db->num_rows($result_thanks) > 0)
{
	$UserThanks = '<table>';
	while($row = $forum_db->fetch_assoc($result_thanks))
	{
		$row['subject'] = preg_replace('#\[(.*?)\](.*?)\[/(.*?)\]#ms','$2',$row['subject']);
		$row['subject'] = preg_replace('#\[(.*?)\]#ms','',$row['subject']);
		$row['subject'] = preg_replace('#\[/#ms','',$row['subject']);
		$row['subject'] = preg_replace('#\[(.*?)\](.*?)#ms','$2',$row['subject']);
		$UserThanks .= '<tr><td width="60%"><a href="/viewtopic.php?pid='.$row['post_id'].'#'.$row['post_id'].'">'.$row['subject'].'</td><td width="15%"><i>'.$row['username'].'</i></td><td width="25%">'.format_time($row['thank_date']).'</td></tr>';
	}
	$UserThanks .= '</table>';
	message($UserThanks, '',$lang_thanks['Thanks']);
}
else
{
	message($lang_thanks['ThanksNo'], '',$lang_thanks['Thanks']);
}
}
?>