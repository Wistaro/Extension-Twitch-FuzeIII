var stateNotif = "waiting";

checkStreamFuze();
setInterval(function(){
	checkStreamFuze();
	console.log(stateNotif);


}, 60000 );

function checkStreamFuze(){
//background task to get the status of the livestream of Fuze
var user = "FuzeIII";

var xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.twitch.tv/kraken/streams/"+user+"?client_id=uewl7eqqjnnukdvhjzqxvieuoxilzs", true);

xhr.onreadystatechange = function(){

	if(xhr.readyState == 4){
		var data = JSON.parse(xhr.responseText);

		if(data["stream"] == null){
			//Fuze is no in stream
			$('#thirdWordStatusLink').html("[OFFLINE]");
			$('#thirdWordStatusLink').css('color', 'red');
			chrome.browserAction.setIcon({path: "img/logo_red_38.png"});
			
		}else{
			//Fuze is streaming
			$('#thirdWordStatusLink').html("[ONLINE]");
			$('#thirdWordStatusLink').css('color', 'green');
			chrome.browserAction.setIcon({path: "img/logo_green_38.png"});	
			stateNotif = "go";

			/*Notification handler*/
				if(stateNotif == "go"){
					var notif = new Notification('Live Twitch de FuzeIII!',	{
										icon : 'img/logo_green_256.png',
										body : 'FuzeIII est actuellement en live sur Twitch!'

					});

					notif.onclick = function(event) {
					  event.preventDefault(); 
					  window.open('http://twitch.tv/FuzeIII', '_blank');
					  stateNotif = "clicked";
					}

					 if(stateNotif == "go"){
					 	stateNotif = "nop";
					 }
				}
			
		}
	}
}

xhr.send();
}

