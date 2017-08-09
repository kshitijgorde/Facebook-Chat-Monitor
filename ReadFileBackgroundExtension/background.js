var pollIntervalMin = 0.25;  //  minutes
var pollIntervalMax = 60;  // 1 hour
var requestTimeout = 1000 * 2;  // 2 seconds
var rotation = 0;
var xhr = new XMLHttpRequest();
var oldChromeVersion = !chrome.runtime;
var requestTimerId;
var counter=0;
var xhr_put = new XMLHttpRequest();
var checkyn;

var suspicious_keywords_list = ["crime","crimes","murder","criminal","suicide","knife","weapon","killing","murdering","lets rob a bank","robbery","rob","stabbing","killing him"];
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    //alert("message received");
});

chrome.webRequest.onBeforeRequest.addListener(
        function(details) { return  {redirectUrl: 'https://pisp-chat-monitor-blitzkshitij.c9users.io/block.html'} },
        {urls: ["*://www.pispunsafe.com/*","*://www.pispproject.com/*"]},
        ["blocking"]);

function ReadTextFile() {
xhr.open('POST',  "https://pisp-chat-monitor-blitzkshitij.c9users.io/facebookmsg.txt", true);
xhr.onreadystatechange = function()
{
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
    {
       
	   console.log('OPENED', xhr.readyState);
	   var text = xhr.responseText;
     var tokenizedText = text.split("\n");
	   console.log('tokenizedText',tokenizedText);
     console.log('Response',xhr.response);
	   console.log('Text',xhr.responseText);
	   var checkyn = 0;
     var suspicion_counter = searchStringInArray(tokenizedText,suspicious_keywords_list);
     chrome.browserAction.setBadgeText ( { text: suspicion_counter } );
     if(suspicion_counter>4){
        
         checkyn= 1;
     }
     else{
      checkyn = -1;
     }
console.log('Checkyn', checkyn);
if(checkyn > 0)
{
 	console.log('OPENED', 'inside');
 	notifyMe();
	//Code to clear file
if(checkyn>0)
{
 xhr_put.open('PUT',"https://pisp-chat-monitor-blitzkshitij.c9users.io",true);
	 console.log('Deleteresponse',xhr_put.response)
	// chrome.browserAction.setBadgeText('0');
	 xhr_put.send();
	 console.log('Deleteresponse',xhr_put.response)
	 
	 xhr_put.onreadystatechange = function()
	{
	console.log('File Cleared',"Yes");
	}
}
//code ends here
  
}

    }
};
//xhr.responseType= "document";
xhr.send();


};
function searchStringInArray(tokenizedText,suspicious_keywords_list){
  var counter=0;
  for(var i=0;i<tokenizedText.length;i++){
  	if(tokenizedText[i].search("they")>-1 || tokenizedText[i].search("them")>-1||tokenizedText[i].search("They")>-1){
  		counter--;
  		console.log("Found third party addressing...Not processing this text.");
  		
  	}
    console.log('tokenizedtext[i]',tokenizedText[i]);
    for(var j=0;j<suspicious_keywords_list.length;j++){
      console.log('suspicious_keywords_list[j]',suspicious_keywords_list[j]);
      

      if(tokenizedText[i].search(suspicious_keywords_list[j])>-1){
        console.log('counter>',counter);
        counter++;
      }
        
    }
    
  }
  return counter.toString();
}
/*function scheduleRequest() {
  console.log('scheduleRequest');
  var randomness = Math.random() * 2;
  var exponent = Math.pow(2, localStorage.requestFailureCount || 0);
  var multiplier = Math.max(randomness * exponent, 1);
  var delay = Math.min(multiplier * pollIntervalMin, pollIntervalMax);
  delay = Math.round(delay);
  console.log('Scheduling for: ' + delay);

  if (oldChromeVersion) {
    if (requestTimerId) {
      window.clearTimeout(requestTimerId);
    }
    requestTimerId = window.setTimeout(onAlarm, delay*60*1000);
  } else {
    console.log('Creating alarm');
    // Use a repeating alarm so that it fires again if there was a problem
    // setting the next alarm.
    chrome.alarms.create('refresh', {periodInMinutes: delay});
  }
}*/
function scheduleRequest() {
  console.log('scheduleRequest');
  var randomness = Math.random() * 2;
  var exponent = Math.pow(2, localStorage.requestFailureCount || 0);
  var multiplier = Math.max(randomness * exponent, 1);
  var delay = Math.min(multiplier * pollIntervalMin, pollIntervalMax);
  delay = Math.round(delay);
  console.log('Scheduling for: ' + delay);

  if (oldChromeVersion) {
    if (requestTimerId) {
      window.clearTimeout(requestTimerId);
    }
    requestTimerId = window.setTimeout(onAlarm, 4*1000);
  } else {
    console.log('Creating alarm');
    // Use a repeating alarm so that it fires again if there was a problem
    // setting the next alarm.
    chrome.alarms.create('refresh', {periodInMinutes: 0.25});
  }
}

function startRequest(params) {
  // Schedule request immediately. We want to be sure to reschedule, even in the
  // case where the extension process shuts down while this request is
  // outstanding.
  if (params && params.scheduleRequest) scheduleRequest();

  ReadTextFile();
  
  
};

function onInit() {
  console.log('onInit');
  
  startRequest({scheduleRequest:true});
  if (!oldChromeVersion) {
    // TODO(mpcomplete): We should be able to remove this now, but leaving it
    // for a little while just to be sure the refresh alarm is working nicely.
    chrome.alarms.create('watchdog', {periodInMinutes:5});
  }
}

function onAlarm(alarm) {
  console.log('Got alarm', alarm);
  // |alarm| can be undefined because onAlarm also gets called from
  // window.setTimeout on old chrome versions.
  if (alarm && alarm.name == 'watchdog') {
    onWatchdog();
  } else {
    startRequest({scheduleRequest:true, showLoadingAnimation:false});
  }
}
function onWatchdog() {
  chrome.alarms.get('refresh', function(alarm) {
    if (alarm) {
      console.log('Refresh alarm exists. Yay.');
    } else {
      console.log('Refresh alarm doesn\'t exist!? ' +
                  'Refreshing now and rescheduling.');
      startRequest({scheduleRequest:true, showLoadingAnimation:false});
    }
  });
}

if (oldChromeVersion) {
 
  onInit();
} else {
  chrome.runtime.onInstalled.addListener(onInit);
  chrome.alarms.onAlarm.addListener(onAlarm);
};


//NOTIFICATIONS 

// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function notifyMe() {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('Suspicious Messages Found', {
      icon: 'https://s-media-cache-ak0.pinimg.com/236x/f4/93/50/f49350f4df43fbe2c8f09d8167a33c76.jpg',
      body: "We've detected some suspicious keywords in your chat. Please close the chat window!",
    });

    notification.onclick = function () {
      window.close();      
    };
    
  }

}

//NOTIFICATIONS */







/*var pollIntervalMin = 0.25;  //  minutes
var pollIntervalMax = 60;  // 1 hour
var requestTimeout = 1000 * 2;  // 2 seconds
var rotation = 0;
var xhr = new XMLHttpRequest();
var xhr_put = new XMLHttpRequest();
var oldChromeVersion = !chrome.runtime;
var requestTimerId;
var counter=0;
var suspicious_keywords_list = ["crime","murder","criminal","suicide","knife","weapon","killing","murdering","lets rob a bank","robbery","rob","stabbing","killing him"];
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    alert("message received");
});

chrome.webRequest.onBeforeRequest.addListener(
        function(details) { return  {redirectUrl: 'https://pisp-chat-monitor-blitzkshitij.c9users.io/block.html'} },
        {urls: ["*://www.pispunsafe.com/*","*://www.pispproject.com/*"]},
        ["blocking"]);

function ReadTextFile() {
	console.log('Insidefunction', 'yes');
xhr.open('POST',  "https://pisp-chat-monitor-blitzkshitij.c9users.io/facebookmsg.txt", true);
xhr.onreadystatechange = function()
{
	console.log('Insidefunction', 'post file open');
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
    {
       
	   console.log('OPENED', xhr.readyState);
	   var text = xhr.responseText;
     var tokenizedText = text.split("\n");
	   console.log('tokenizedText',tokenizedText);
     console.log('Response',xhr.response);
	   console.log('Text',xhr.responseText);
	   var checkyn = 0;
     var suspicion_counter = searchStringInArray(tokenizedText,suspicious_keywords_list);

     if(suspicion_counter>5){
        chrome.browserAction.setBadgeText ( { text: suspicion_counter } );
         checkyn= 1;

     }
     else{
      checkyn = -1;
     }
	
console.log('Checkyn', checkyn);
if(checkyn > 0)
{
 //	console.log('OPENED', 'inside');
  window.alert("We've detected some suspicious keywords in your chat. Kindly close the chat window!");
 //notifyMe();
     xhr_put.open('PUT',"https://pisp-chat-monitor-blitzkshitij.c9users.io",true);
	 console.log('Deleteresponse',xhr_put.response)
	 chrome.browserAction.setBadgeText(0);
	 xhr_put.send();
	 console.log('Deleteresponse',xhr_put.response)
	 xhr.send();
	 xhr_put.onreadystatechange = function()
{
	console.log('File Cleared',"Yes");
}
}

    }
};
//xhr.responseType= "document";

};
function searchStringInArray(tokenizedText,suspicious_keywords_list){
  var counter=0;
  for(var i=0;i<tokenizedText.length;i++){
    console.log('tokenizedtext[i]',tokenizedText[i]);
    for(var j=0;j<suspicious_keywords_list.length;j++){
      console.log('suspicious_keywords_list[j]',suspicious_keywords_list[j]);
      if(tokenizedText[i].search(suspicious_keywords_list[j])>-1){
        console.log('counter>',counter);
        counter++;
      }
        
    }
    
  }
  return counter.toString();
}
function scheduleRequest() {
  console.log('scheduleRequest');
  var randomness = Math.random() * 2;
  var exponent = Math.pow(2, localStorage.requestFailureCount || 0);
  var multiplier = Math.max(randomness * exponent, 1);
  var delay = Math.min(multiplier * pollIntervalMin, pollIntervalMax);
  delay = Math.round(delay);
  console.log('Scheduling for: ' + delay);

  if (oldChromeVersion) {
    if (requestTimerId) {
      window.clearTimeout(requestTimerId);
    }
    requestTimerId = window.setTimeout(onAlarm, delay*60*1000);
  } else {
    console.log('Creating alarm');
    // Use a repeating alarm so that it fires again if there was a problem
    // setting the next alarm.
    chrome.alarms.create('refresh', {periodInMinutes: delay});
  }
}
function scheduleRequest() {
  console.log('scheduleRequest');
  var randomness = Math.random() * 2;
  var exponent = Math.pow(2, localStorage.requestFailureCount || 0);
  var multiplier = Math.max(randomness * exponent, 1);
  var delay = Math.min(multiplier * pollIntervalMin, pollIntervalMax);
  delay = Math.round(delay);
  console.log('Scheduling for: ' + delay);

  if (oldChromeVersion) {
    if (requestTimerId) {
      window.clearTimeout(requestTimerId);
    }
    requestTimerId = window.setTimeout(onAlarm, 4*1000);
  } else {
    console.log('Creating alarm');
    // Use a repeating alarm so that it fires again if there was a problem
    // setting the next alarm.
    chrome.alarms.create('refresh', {periodInMinutes: 0.25});
  }
}

function startRequest(params) {
  // Schedule request immediately. We want to be sure to reschedule, even in the
  // case where the extension process shuts down while this request is
  // outstanding.
  if (params && params.scheduleRequest) scheduleRequest();

  ReadTextFile();
  
  
};

function onInit() {
  console.log('onInit');
  
  startRequest({scheduleRequest:true});
  if (!oldChromeVersion) {
    // TODO(mpcomplete): We should be able to remove this now, but leaving it
    // for a little while just to be sure the refresh alarm is working nicely.
    chrome.alarms.create('watchdog', {periodInMinutes:5});
  }
}

function onAlarm(alarm) {
  console.log('Got alarm', alarm);
  // |alarm| can be undefined because onAlarm also gets called from
  // window.setTimeout on old chrome versions.
  if (alarm && alarm.name == 'watchdog') {
    onWatchdog();
  } else {
    startRequest({scheduleRequest:true, showLoadingAnimation:false});
  }
}
function onWatchdog() {
  chrome.alarms.get('refresh', function(alarm) {
    if (alarm) {
      console.log('Refresh alarm exists. Yay.');
    } else {
      console.log('Refresh alarm doesn\'t exist!? ' +
                  'Refreshing now and rescheduling.');
      startRequest({scheduleRequest:true, showLoadingAnimation:false});
    }
  });
}

if (oldChromeVersion) {
 
  onInit();
} else {
  chrome.runtime.onInstalled.addListener(onInit);
  chrome.alarms.onAlarm.addListener(onAlarm);
};
//NOTIFICATIONS 

/*//*// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function notifyMe() {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('Suspicious Messages Found', {
      icon: 'https://s-media-cache-ak0.pinimg.com/236x/f4/93/50/f49350f4df43fbe2c8f09d8167a33c76.jpg',
      body: "We've detected some suspicious keywords in your chat. Click here to close the chat window!",
    });

    notification.onclick = function () {
      window.close();      
    };
    
  }

}*/

//NOTIFICATIONS */*/*/