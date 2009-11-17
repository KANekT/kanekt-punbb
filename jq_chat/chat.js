/*
 * JS file for jQuery Chat
 *
 * @copyright Copyright (C) 2009 KANekT @ http://blog.teamrip.ru
 * @license http://www.gnu.org/licenses/gpl.html GPL version 2 or higher
 * @package jQuery Chat
*/
 
$(document).ready(function () {

    $("#pac_form").submit(Send); // вешаем на форму с именем и сообщением событие которое срабатывает кодга нажата кнопка "Отправить" или "Enter"
    $("#pac_text").focus(); // по поле ввода сообщения ставим фокус
    setInterval("Load();", 2000); // создаём таймер который будет вызывать загрузку сообщений каждые 2 секунды (2000 миллисекунд)
});  
 
// Функция для отправки сообщения
function Send() {
    // Выполняем запрос к серверу с помощью jquery ajax: $.post(адрес, {параметры запроса}, функция которая вызывается по завершению запроса)
    $.post("extensions/jq_chat/ajax.php", 
        {
        act: "send",  // указываем скрипту, что мы отправляем новое сообщение и его нужно записать
        name: $("#pac_name").val(), // имя пользователя
        text: $("#pac_text").val() //  сам текст сообщения
    },
	 Load_new); // по завершению отправки вызываем функцию загрузки новых сообщений Load()
 
    $("#pac_text").val(""); // очистим поле ввода сообщения
    $("#pac_text").focus(); // и поставим на него фокус
 
    return false; // очень важно из Send() вернуть false. Если этого не сделать то произойдёт отправка нашей формы, те страница перезагрузится
}

var start = 0; // номер последнего сообщения, что получил пользователь
var end = 2; // номер последнего сообщения, что получил пользователь
var met = 1; // номер последнего сообщения, что получил пользователь
var load_in_process = false; // можем ли мы выполнять сейчас загрузку сообщений. Сначала стоит false, что значит - да, можем
 
// Функция для загрузки сообщений
function Load() {
    // Проверяем можем ли мы загружать сообщения. Это сделано для того, чтобы мы не начали загрузку заново, если старая загрузка ещё не закончилась.

    if(!load_in_process)
    {
            load_in_process = true; // загрузка началась
				// отсылаем запрос серверу, который вернёт нам javascript
				$.post("extensions/jq_chat/ajax.php",
				{
					  act: "load", // указываем на то что это загрузка сообщений
					  start: start, // передаём номер последнего сообщения который получил пользователь в прошлую загрузку
					  end: end, // передаём номер последнего сообщения который получил пользователь в прошлую загрузку
					  met: "0",
					  rand: (new Date()).getTime()
				},
				   function (result) { // в эту функцию в качестве параметра передаётся javascript код, который мы должны выполнить
						eval(result); // выполняем скрипт полученный от сервера
						$(".chat").scrollTop($(".chat").get(0).scrollHeight); // прокручиваем сообщения вниз
						load_in_process = false; // говорим что загрузка закончилась, можем теперь начать новую загрузку
				}
			);
    }
}
// Функция для загрузки сообщений
function Load_new() {

    if(!load_in_process)
    {
            load_in_process = true; // загрузка началась
            // отсылаем запрос серверу, который вернёт нам javascript
            $.post("extensions/jq_chat/ajax.php",
            {
                  act: "load", // указываем на то что это загрузка сообщений
                  start: start, // передаём номер последнего сообщения который получил пользователь в прошлую загрузку
                  end: end, // передаём номер последнего сообщения который получил пользователь в прошлую загрузку
  				  met: "1",
  				  mes: "50",
                  rand: (new Date()).getTime()
            },
				   function (result) { // в эту функцию в качестве параметра передаётся javascript код, который мы должны выполнить
						eval(result); // выполняем скрипт полученный от сервера
						$(".chat").scrollTop($(".chat").get(0).scrollHeight); // прокручиваем сообщения вниз
						load_in_process = false; // говорим что загрузка закончилась, можем теперь начать новую загрузку
				}
			);
    }
}
