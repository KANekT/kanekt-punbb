function viewThanks(src)
{

 viewer = window.open(src, "PREV", "width=300,height=300,toolbar=no,status=no,scrollbars=no,menubar=no,resizable=no");
   
 viewer.focus();
 
 return false;
}


function apk_thanks(poster_id, poster_tid, id, ut, pt)
{
	var otvet;
	if ($T('thanks' + id))
	{
		sendRequestThanks('user=' + poster_id + '&user_t=' + poster_tid + '&post=' + id);
	}
	if ($T('u' + id))
	{
		$T('u' + id).innerHTML = ut + 1;
	}
	else
	{
		otvet = Thanks + '1\n\n';
	}
	if ($T('n' + id))
	{
		$T('n' + id).innerHTML = pt + 1;
	}
	else
	{
		if (otvet)
		{
		otvet = otvet + ThanksPost + '1\n\n';
		}
		else
		{
		otvet = ThanksPost + '1\n\n';
		}
	}
		if (otvet)
		{
			$T('t' + id).innerHTML = otvet;
		}
		$T('button_t' + id).innerHTML = ThanksSaid;

}

// Detect Internet Explorer
var ie = /msie/i.test (navigator.userAgent);

function sendRequestThanks(data)
{
	// Without this IE don't get second reply (i think there's something wrong with onreadystatechange function)
	if (ie)
		httpThanks = getHTTPObjectThanks();
	httpThanks.open('POST', base_url_thanks + '/extensions/thanks/thanks.php', true);
	httpThanks.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
	httpThanks.send(data);
}

function makeRequest(postS) { 
	httpThanks.onreadystatechange = function()
	{
		if (httpThanks.readyState == 4)
			document.getElementById('button_sp' + postS).innerHTML = httpThanks.responseText; 
	};
httpThanks.open('POST', base_url_thanks + '/extensions/thanks/spoiler.php', true); 
httpThanks.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
httpThanks.send('po=' + postS); 
} 

/*
	Function creating ajax request object
*/
function getHTTPObjectThanks()
{
	var xmlhttp;
	/*@cc_on
	@if (@_jscript_version >= 5)
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (E) {
				xmlhttp = false;
			}
		}
	@else
		xmlhttp = false;
	@end @*/
	if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
		try {
			xmlhttp = new XMLHttpRequest();
		} catch (e) {
			xmlhttp = false;
		}
	}
	return xmlhttp;
}


/*
	Function returning element from elid
*/
function $T(el_id)
{
	return document.getElementById(el_id);
}

// We create the HTTP Object
var httpThanks = getHTTPObjectThanks(); 