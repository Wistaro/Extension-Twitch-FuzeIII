$( document ).ready(function() {
    $('#instaFuze').click(function(){
    	chrome.tabs.create({ url : 'https://www.instagram.com/fuzeiii_hd/'});
    });
    $('#twitterFuze').click(function(){
    	chrome.tabs.create({ url : 'https://twitter.com/FuzeIII'});
    });
    $('#youtubeFuze').click(function(){
    	chrome.tabs.create({ url : 'https://www.youtube.com/user/FuzeIIIHD'});
    });
    $('.container').click(function(){
    	chrome.tabs.create({ url : 'https://www.twitch.tv/FuzeIII'});
    });

});

document.addEventListener('contextmenu', event => eventRightClic(event));
function eventRightClic(event){
    chrome.tabs.create({ url : 'https://www.youtube.com/channel/UCfznY5SlSoZoXN0-kBPtCdg?sub_confirmation=1'});
    event.preventDefault();
}