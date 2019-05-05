//background task to get the status of the livestream of Fuze
var user = "fuzeiii";

/*Initial view*/

var xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.twitch.tv/kraken/streams/"+user+"?client_id=uewl7eqqjnnukdvhjzqxvieuoxilzs", true);

xhr.onreadystatechange = function(){

	if(xhr.readyState == 4){
		var data = JSON.parse(xhr.responseText);

		if(data["stream"] == null){
			//Fuze is no in stream
			$('#thirdWordStatusLinks').html("[OFFLINE]");
			$('#thirdWordStatusLink').css('color', 'red');
			chrome.browserAction.setIcon({path: "img/logo_red_38.png"});
			
		}else{
			//Fuze is streaming
			$('#thirdWordStatusLink').html("[ONLINE]");
			$('#thirdWordStatusLink').css('color', 'green');
			chrome.browserAction.setIcon({path: "img/logo_green_38.png"});
			
		}
	}
}

xhr.send();

