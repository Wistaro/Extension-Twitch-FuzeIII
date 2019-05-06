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
});