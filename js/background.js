/**********************************************************************************************
* This Chrome extension will send a desktop notification when FuzeIII starts a livestream on Twitch.tv
*
* Developed by Wistaro (javascript) and Voltext (HTML/CSS)
/**********************************************************************************************/

/*Configuration*/
var api = 'kraken';
var client_id = 'uewl7eqqjnnukdvhjzqxvieuoxilzs';
var user = 'FuzeIII'; 
var timeToCheckLive = '30000'; //every 30s
var timeToResetNotifs = '10800000'; //every 3 hours
/**************************************************/

let stateNotif = "waitNotif";
let notif;

checkStreamFuze(user, client_id, api, false);
 
var checkFuze = setInterval(function(){ //background task to get the status of the livestream of Fuze
	checkStreamFuze(user, client_id, api, true);
}, timeToCheckLive );

var resetNotif = setInterval(function(){ //reset notifications every 10h
	stateNotif = "waitNotif";
}, timeToResetNotifs );


function checkStreamFuze(user, client_id, api, notification){

var xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.twitch.tv/"+api+"/streams/"+user+"?client_id="+client_id, true);

xhr.onreadystatechange = function(){

	if(xhr.readyState == 4){
		var data = JSON.parse(xhr.responseText);

		if(data["stream"] == null){
			//Fuze is not streaming
			stateNotif = "waitNotif";
			$('.msgOffline').show();
			$('#thirdWordStatusLink').html("[HORS LIGNE]");
			$('#thirdWordStatusLink').css('color', 'red');
			$('.viewerBox').hide(); 
			$('.titleBox').hide(); 
			$('.gameBox').hide();
			chrome.browserAction.setIcon({path: "img/logo_red_38.png"});
			
		}else{
			//Fuze is streaming
			var liveGame = data["stream"]["game"];
			var liveTitle = data["stream"]["channel"]["status"];
			var liveViewersCount = data["stream"]["viewers"];

			if(stateNotif != "notifSent"){
				stateNotif = "ready2sendNotif";	
			} 
			$('#msgOffline').hide();
			$('#thirdWordStatusLink').html("[EN LIVE]");
			$('#thirdWordStatusLink').css('color', 'green');
			$('#viewerCount').html(liveViewersCount);
			$('#gamePlaying').html(liveGame);	
			$('#liveTitle').html(liveTitle);
			$('.msgOffline').hide();
			$('.gameBox').css('visibility', 'visible');
			chrome.browserAction.setIcon({path: "img/logo_green_38.png"});
		}	
			
			if(stateNotif == "ready2sendNotif" && notification==true){
				cleanNotif(notif);
				notif = sendNotif();
				stateNotif = "notifSent";
			}

				if(typeof notif != "undefined"){
					notif.onclick = function(event) {
						  event.preventDefault(); 
						  window.open('http://twitch.tv/FuzeIII', '_blank');
						  cleanNotif(notif);
					}
				}																				
		}
	}
	xhr.send();
}

function cleanNotif(notif){
	if(typeof notif != "undefined"){
		notif.close();
	}
}
function sendNotif(){
	return new Notification('Live Twitch de FuzeIII!',	{
					icon : 'img/logo_green_256.png',
					title : 'Live Twitch de FuzeIII!', 
					body : 'FuzeIII est actuellement en live sur Twitch! (clique ici pour accéder au live)'
	});
}