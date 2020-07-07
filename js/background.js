/**********************************************************************************************
* This Chrome extension will send a desktop notification when FuzeIII starts a livestream on Twitch.tv
*
* Developed by Wistaro (javascript) and Voltext (HTML/CSS)
/**********************************************************************************************/

/*Configuration*/
var extensionVersion = '1.4'; //extension version
var api = 'helix'; //New Twitch API. V5 is depreciated.
var client_id = 'uewl7eqqjnnukdvhjzqxvieuoxilzs';
var user = '41040855';  //user ID of FuzeIII
var Otoken = 'Bearer 0sjmim2ok5u7wl5k50ws5k1mxgrzs7';
var timeToCheckLive = '30000'; //every 30s
var timeToResetNotifs = '10800000'; //every 3 hours
/**************************************************/

let stateNotif = "waitNotif";
let notif;
let isUpdate = 0;


checkStreamFuze(user, client_id, api, false);
$('.version').html('v'+extensionVersion);
 
var checkFuze = setInterval(function(){ //background task to get the status of the livestream of Fuze
	checkStreamFuze(user, client_id, api, true);
}, timeToCheckLive );



var resetNotif = setInterval(function(){ //reset notifications every 10h
	stateNotif = "waitNotif";
}, timeToResetNotifs );


function checkStreamFuze(user, client_id, api, notification){

	//Check latest version: 

	$.ajax({
		type: "GET",
		url: "https://wistaro.fr/extensionChromeFuzeIII/api.php?get=latestVersion",
		processData: false,
		success: function(response) {
			if(extensionVersion != response){
				$('#noUpdate').css('display', 'inline-block');
				chrome.browserAction.setIcon({path: "img/logo_warn_38.png"});
				isUpdate = 0;
			}else{
				$('#noUpdate').css('display', 'none');
				isUpdate = 1
			}
		}
	})



	$.ajax({
		type: "GET",
		beforeSend: function(request) {
		  request.setRequestHeader("Authorization", Otoken);
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

				if(isUpdate == 1){
					chrome.browserAction.setIcon({path: "img/logo_red_38.png"});
				}
				
				
			}else{
				//Fuze is streaming
				var gameId = data["game_id"];
				var liveTitle = data["title"];
				var liveViewersCount = data["viewer_count"];

				//Get Game with ID
				$.ajax({
					type: "GET",
					beforeSend: function(request) {
					  request.setRequestHeader("Authorization", Otoken);
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

				if(isUpdate == 1){
					chrome.browserAction.setIcon({path: "img/logo_green_38.png"});
				}
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
		}, 
		error: function (xhr, ajaxOptions, thrownError) {
			$('.infoMessage').html("Erreur lors de la récupération des données du live!");
			$('#thirdWordStatusLink').html("");
			console.log(thrownError);
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