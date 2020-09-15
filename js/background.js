/**********************************************************************************************
* This Chrome extension will send a desktop notification when FuzeIII starts a livestream on Twitch.tv
*
* Developed by Wistaro (javascript) and Voltext (HTML/CSS)
/**********************************************************************************************/

/*Configuration*/
var extensionVersion = '1.6'; //extension version
var timeToCheckLive = '30000'; //every 30s
var timeToResetNotifs = '10800000'; //every 3 hours
var apiUrl = 'https://wistaro.fr/extensionChromeFuzeIII/api.php';
/**************************************************/

let stateNotif = "waitNotif";
let notif;
let isUpdate = 0;


checkStreamFuze(false);
$('.version').html('v'+extensionVersion);
 
var checkFuze = setInterval(function(){ //background task to get the status of the livestream of Fuze
	checkStreamFuze(true);
}, timeToCheckLive );



var resetNotif = setInterval(function(){ //reset notifications every 10h
	stateNotif = "waitNotif";
}, timeToResetNotifs );


function checkStreamFuze(notification){

	//Check latest version: 

	$.ajax({
		type: "GET",
		url: apiUrl+"?get=latestVersion",
		processData: false,
		success: function(response) {
			if(extensionVersion != response){
				$('#noUpdate').css('display', 'inline-block');
				$("#textUpdate").html('<p>Mise à jour nécessaire<br /><a style="text-decoration: none;" href="https://github.com/Wistaro/Chrome-Extension--Twitch-FuzeIII/releases/latest" target="_blank">Cliquez-ici</a></p>');
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
		url: apiUrl+"?get=liveFuzeTwitchData",
		processData: false,
		success: function(response) {

			var data = JSON.parse(response).data[0];

			//fuze is offline
			if(typeof data == "undefined"){
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
				//fuze is online
				var gameId = data["game_id"];
				var liveTitle = data["title"];
				var liveViewersCount = data["viewer_count"];

				//Get Game with ID
				$.ajax({
					type: "GET",
					url: apiUrl+"?get=getGameWithId&gameId="+gameId,
					processData: false,
					success: function(response) {
						var liveGame = JSON.parse(response);

						$('#gamePlaying').html(liveGame.data[0]['name']);	
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
			$('#noUpdate').css('display', 'inline-block');
			$("#textUpdate").html('<p>Erreur API!<br /><small>Contactez  Wistaro#9487</small></p>');
			chrome.browserAction.setIcon({path: "img/logo_warn_38.png"});

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