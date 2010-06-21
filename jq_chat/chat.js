/*
 * JS file for jQuery Chat
 *
 * @copyright Copyright (C) 2009 KANekT @ http://blog.kanekt.ru
 * @license http://www.gnu.org/licenses/gpl.html GPL version 2 or higher
 * Donate Web Money Z104136428007 R346491122688
 * @package jQuery Chat
*/
var start = 0; // номер последнего сообщения, что получил пользователь
var end = 0; // номер последнего сообщения, что получил пользователь
var send = 0;
var load_in_process = false; // можем ли мы выполнять сейчас загрузку сообщений. Сначала стоит false, что значит - да, можем
var day4 = '';
 
$(document).ready(function () {
    $("#pac_form").submit(Send); // вешаем на форму с именем и сообщением событие которое срабатывает кодга нажата кнопка "Отправить" или "Enter"
    $("#pac_text").focus(); // по поле ввода сообщения ставим фокус
    setInterval("Load(0);", 1000); // создаём таймер который будет вызывать загрузку сообщений каждые 1 секунды (1000 миллисекунд)
});  

 
// Функция для отправки сообщения
function Send() {
    // Выполняем запрос к серверу с помощью jquery ajax: $.post(адрес, {параметры запроса}, функция которая вызывается по завершению запроса)
    $.post("extensions/jq_chat/ajax.php", 
        {
        act: "send",  // указываем скрипту, что мы отправляем новое сообщение и его нужно записать
        user: $("#pac_name").val(), // имя пользователя
        text: $("#pac_text").val(), //  сам текст сообщения
        uid: $("#pac_id").val(), //  id пользователя
		log: chat_log
    },
	 Load(1)); // по завершению отправки вызываем функцию загрузки новых сообщений Load()
 
    $("#pac_text").val(""); // очистим поле ввода сообщения
    $("#pac_text").focus(); // и поставим на него фокус
 
    return false; // очень важно из Send() вернуть false. Если этого не сделать то произойдёт отправка нашей формы, те страница перезагрузится
}

// Функция для загрузки сообщений
function Load(send) {
    if(!load_in_process)    // Проверяем можем ли мы загружать сообщения. Это сделано для того, чтобы мы не начали загрузку заново, если старая загрузка ещё не закончилась.
    {
            load_in_process = true; // загрузка началась
				// отсылаем запрос серверу, который вернёт нам javascript
				$.post("extensions/jq_chat/ajax.php",
				{
					  act: "load", // указываем на то что это загрузка сообщений
					  start: start, // передаём номер последнего сообщения который получил пользователь в прошлую загрузку
					  adm: adm,
					  send: send,
					  hour: chat_hour,
					  day4: day4,
					  rand: (new Date()).getTime()
				},
				   function (result) { // в эту функцию в качестве параметра передаётся javascript код, который мы должны выполнить
						eval(result); // выполняем скрипт полученный от сервера
						if (end != start)
						{
							start = end;
							$(".chat").scrollTop($(".chat").get(0).scrollHeight); // прокручиваем сообщения вниз
						}
						load_in_process = false; // говорим что загрузка закончилась, можем теперь начать новую загрузку
				}
			);
    }
}

// Функция для удаления сообщения
function DelMsg(msgId) {
    // Выполняем запрос к серверу с помощью jquery ajax: $.post(адрес, {параметры запроса}, функция которая вызывается по завершению запроса)
    $.post("extensions/jq_chat/ajax.php", 
        {
        act: "delmsg",  // указываем скрипту, что мы отправляем новое сообщение и его нужно записать
        msgId: msgId // имя пользователя
    },
		function () { // 
		$("span."+msgId).hide(500);
		}
	); // по завершению вызываем функцию загрузки новых сообщений Load()
}
// Функция для обращения к пользователю
function ReplyMsg(msgId) {
var text = $("span."+msgId).find("a.reply").eq(0).text();
if (text) {
		$("#pac_text").val("[b]"+text+"[/b], ").focus();
	}
}
$(document).ready(
    function() { 
        $("#chat-control").toggle(
            function () {
                $("#chat-room").show();
                $("#chat-control").text('-');
            },
            function () {
                $("#chat-room").hide();
                $("#chat-control").text('+');
            }
        );
    }
);