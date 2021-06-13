var blockAll = document.getElementById("blockAll");
var blockPart = document.getElementById("blockPart");

var blackList = ["https://facebook.com/","https://www.reddit.com/","https://www.youtube.com/"];

function deleteFromBlackList(url,arr){
  var index = arr.indexOf(url);
  if(index > -1){
    arr.splice(index,1);
  }
}

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}
var site = document.getElementById("site");
var addURL = document.getElementById("addURL");
var removeURL = document.getElementById("removeURL");

if(addURL){
  addURL.addEventListener('click',function(){
    var tempURL = site.value;
    site.value="";
    if(isURL(tempURL)){
      blackList.push(tempURL);
      console.log(blackList);
      alert("Add successfully");
    }else{
      alert("URL is not valid");
    }
  })
}

if(removeURL){
  removeURL.addEventListener('click',function(){
    var tempURL = site.value;
    site.value="";
    if(isURL(tempURL)){
      deleteFromBlackList(tempURL,blackList);
      alert("Remove successfully");
    }else{
      alert("URL is not valid, We can only block url where the format is https://...");
    }
  })
}


function blockRequest(details) {  
  
  return {cancel: (details.url.indexOf("https://cdn.staticfile.org/echarts/4.3.0/echarts.min.js") == -1 &&
                   details.url.indexOf("https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js") == -1 &&
                   details.url.indexOf("google.com/") == -1 &&
                   details.url.indexOf("https://cdn.bootcss.com") == -1 &&
                   details.url.indexOf("https://cdn.jsdelivr.net/npm/vue@2.6.11") == -1 &&
                   details.url.indexOf("https://cdn.bootcdn.net/ajax/libs/element-ui/2.13.2/index.js") == -1 &&
                   details.url.indexOf("https://cdn.bootcdn.net/ajax/libs/element-ui/2.13.2/theme-chalk/index.css") == -1 &&
                   details.url.indexOf("https://fonts.googleapis.com/css2?family=Quicksand&display=swap") == -1 &&
                   details.url.indexOf("http://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/forest.mp3") == -1 &&
                   details.url.indexOf("http://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/ocean.mp3") == -1 &&
                   details.url.indexOf("http://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/rain.mp3") == -1 &&
                   details.url.indexOf("http://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/peace.mp3") == -1 &&
                   details.url.indexOf("http://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/cafe.mp3") == -1 &&
                   details.url.indexOf("https://cdn.pixabay.com/photo/2012/09/15/02/22/forest-56930_1280.jpg") == -1 &&
                   details.url.indexOf("http://pic1.win4000.com/wallpaper/2018-03-16/5aab633f77eb7.jpg") == -1 &&
                   details.url.indexOf("https://cdn.pixabay.com/photo/2017/03/27/14/49/beach-2179183_1280.jpg") == -1 &&
                   details.url.indexOf("http://imgsrc.baidu.com/image/c0%3Dpixel_huitu%2C0%2C0%2C294%2C40/sign=ff44e1376c09c93d13ff06b7f6459db0/5366d0160924ab18a1784a0e3efae6cd7b890b98.jpg") == -1 &&
                   details.url.indexOf("http://pic1.win4000.com/wallpaper/2/58a53eb5d456e.jpg") == -1
  )}; 
}  


function blockAllWeb(){
  chrome.webRequest.onBeforeRequest.addListener(
    blockRequest,
    {urls: 
      ["http://*/*", "https://*/*"]
    },
    ["blocking"]
  );
 }

 function blockPartWeb(){
  chrome.webRequest.onBeforeRequest.removeListener(
    blockRequest,
    {urls: 
      ["http://*/*", "https://*/*"]
    },
    ["blocking"]
  );
  chrome.webRequest.onBeforeRequest.addListener(
    blockRequest,
    {urls: 
      blackList
    },
    ["blocking"]
  );
 }

 if(blockAll){

  blockAll.addEventListener('click',function(){
    blockAllWeb();
    alert("You have blocked all websites except for google and some other ones to ensure the extension can run normally.")
  
  })
 }

if(blockPart){
  blockPart.addEventListener('click',function(){
    blockPartWeb();
    alert("You have blocked all blacklist websites!")
    
  })
}