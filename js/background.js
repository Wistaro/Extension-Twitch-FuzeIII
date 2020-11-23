/**********************************************************************************************
* This Firefox extension will send a desktop notification when FuzeIII starts a livestream on Twitch.tv
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
let notificationClicked;
checkStreamFuze(false);
$('.version').text('v'+extensionVersion);
 
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
				$('.warningBox').css('display', 'inline-block');
				$("#needUpdateMessage").css("visibility", "visible");
				browser.browserAction.setIcon({path: "img/logo_warn_38.png"});
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
				$('#thirdWordStatusLink').text("[HORS LIGNE]");
				$('#thirdWordStatusLink').css('color', 'red');
				$('.viewerBox').hide(); 
				$('.titleBox').hide(); 
				$('.gameBox').hide();

				if(isUpdate == 1){
					browser.browserAction.setIcon({path: "img/logo_red_38.png"});
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

						$('#gamePlaying').text(liveGame.data[0]['name']);	
					}
					});

				if(stateNotif != "notifSent"){
					stateNotif = "ready2sendNotif";	
				} 
				$('#msgOffline').hide();
				$('#thirdWordStatusLink').text("[EN LIVE]");
				$('#thirdWordStatusLink').css('color', 'green');
				$('#viewerCount').text(improveViewersDisplay(liveViewersCount));
				$('#liveTitle').text(liveTitle);
				$('.msgOffline').hide();
				$('.gameBox').css('visibility', 'visible');

				if(isUpdate == 1){
					browser.browserAction.setIcon({path: "img/logo_green_38.png"});
				}
			}	
				
				if(stateNotif == "ready2sendNotif" && notification==true){
					notif = sendNotif();
					stateNotif = "notifSent";
					notificationClicked = false;
				}

					browser.notifications.onClicked.addListener(function(notificationId){
						
						if(notificationId == notif){

							if(notificationClicked == false){
								var creating = browser.tabs.create({
									url:"https://twitch.tv/fuzeiii"
								});
								notificationClicked = true;
							}
						}
						
					});
					
		}, 
		error: function (xhr, ajaxOptions, thrownError) {
			$('.warningBox').css('display', 'inline-block');
			$("#errorApi").css("visibility", "visible");
			browser.browserAction.setIcon({path: "img/logo_warn_38.png"});
			console.log(thrownError);
		  }
	  }); 

}

function sendNotif(){

	let notifId = getRandomArbitrary(1, 999999);

	browser.notifications.create(notifId.toString(), {	
  		"type": "basic",
  		"iconUrl": browser.extension.getURL("img/logo_green_256.png"),
  		"title": "Live Twitch de FuzeIII!",
  		"message": "FuzeIII est actuellement en live sur Twitch! (clique ici pour accéder au live)"
	});

	return notifId;
}

function improveViewersDisplay(viewers_count){
		return viewers_count.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}