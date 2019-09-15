/**********************************************************************************************
* This Chrome extension will send a desktop notification when FuzeIII starts a livestream on Twitch.tv
*
* Developed by Wistaro (javascript) and Voltext (HTML/CSS)
/**********************************************************************************************/

/*Configuration*/
var api = 'helix'; //New Twitch API. V5 is depreciated.
var client_id = 'uewl7eqqjnnukdvhjzqxvieuoxilzs';
var user = '41040855';  //user ID of FuzeIII
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
	$.ajax({
		type: "GET",
		beforeSend: function(request) {
		  request.setRequestHeader("Client-Id", client_id);
		},
		url: "https://api.twitch.tv/"+api+"/streams?user_id="+user,
		processData: false,
		success: function(response) {
			var data = response.data[0]; 
			if(typeof data == "undefined"){
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
				var gameId = data["game_id"];
				var liveTitle = data["title"];
				var liveViewersCount = data["viewer_count"];

				//Get Game with ID
				$.ajax({
					type: "GET",
					beforeSend: function(request) {
					  request.setRequestHeader("Client-Id", client_id);
					},
					url: "https://api.twitch.tv/"+api+"/games?id="+gameId,
					processData: false,
					success: function(response) {
						var liveGame = response.data[0]['name'];
						$('#gamePlaying').html(liveGame);	
					}
					});

				if(stateNotif != "notifSent"){
					stateNotif = "ready2sendNotif";	
				} 
				$('#msgOffline').hide();
				$('#thirdWordStatusLink').html("[EN LIVE]");
				$('#thirdWordStatusLink').css('color', 'green');
				$('#viewerCount').html(improveViewersDisplay(liveViewersCount));
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
	  });
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

function improveViewersDisplay(viewers_count){
		return viewers_count.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}