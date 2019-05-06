/*Configuration*/
var api = 'kraken';
var client_id = 'uewl7eqqjnnukdvhjzqxvieuoxilzs';
var user = 'froggedtv'; 
var timeToCheckLive = '60000'; //every 1min
var timeToResetNotifs = '3600000'; //every hour
/**************************************************/


var stateNotif = "waiting";
checkStreamFuze(user, client_id, api);

var checkFuze = setInterval(function(){
	checkStreamFuze(user, client_id, api);

}, timeToCheckLive );

var resetNotif = setInterval(function(){ //reset notifications every 10h
	stateNotif = "waiting";
}, timeToResetNotifs );

function checkStreamFuze(user, client_id, api){
//background task to get the status of the livestream of Fuze

var xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.twitch.tv/"+api+"/streams/"+user+"?client_id="+client_id, true);

xhr.onreadystatechange = function(){

	if(xhr.readyState == 4){
		var data = JSON.parse(xhr.responseText);

		if(data["stream"] == null){
			//Fuze is not streaming
			$('#thirdWordStatusLink').html("[HORS LIGNE]");
			$('#thirdWordStatusLink').css('color', 'red');
			chrome.browserAction.setIcon({path: "img/logo_red_38.png"});
			
		}else{
			//Fuze is streaming
			$('#thirdWordStatusLink').html("[EN LIVE]");
			$('#thirdWordStatusLink').css('color', 'green');
			chrome.browserAction.setIcon({path: "img/logo_green_38.png"});	
			
			if(stateNotif != "clicked"){
				console.log("[DEBUG - Wistaro] Notification sent to desktop");
				var notif = new Notification('Live Twitch de FuzeIII!',	{
										icon : 'img/logo_green_256.png',
										body : 'FuzeIII est actuellement en live sur Twitch! (clique ici pour arrêter les notifications)'
					});

				notif.onclick = function(event) {
					  event.preventDefault(); 
					  window.open('http://twitch.tv/FuzeIII', '_blank');
					  stateNotif = "clicked";
					  notif.close();
					}
				}
			}										
			
		}
	}
	xhr.send();
}




