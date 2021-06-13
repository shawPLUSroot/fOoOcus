/**
 * Face recognition to detect user's emotion
 * and check if the user is concentrated
 */

var app = new Vue({
    el: '#app',
    data: function() {
        return { visible: false }
    }
    })
var emotion = null;
var isHere = true;
var isConcentrated = true;
const video = document.createElement("video");
var mediaStream = null;
var studyImage = document.getElementById("studyStatus");
var timeSlots = new Array();
var startTime = null;
var startSecond = null;
var endTime = null;
var slot = null;
var concentrationVal = 100;
var faq = document.getElementById("faq");
var goToReport = document.getElementById("report");
var website = document.getElementById("website");
var homepage = document.getElementById("homepage");
var free = document.getElementById("free");
var boom = document.getElementById("boom");
var chong = document.getElementById("chong");
var life = document.getElementById("life");
goToReport.addEventListener('click',function(){
    chrome.tabs.update({url:"/report.html"});
});
faq.addEventListener('click',function(){
    chrome.tabs.create({url:"https://github.com/shawPLUSroot/fOoOcus/issues/5"});
})
website.addEventListener('click',function(){
    chrome.tabs.create({url:"/website.html"});
})

free.addEventListener('click',function(){
    chrome.tabs.create({url:"/free.html"});
})


chong.addEventListener('click',function(){
    chrome.tabs.create({url:"/pomodoro-clock.html"});
})


boom.addEventListener('click',function(){
    chrome.tabs.create({url:"/pomodoro-clock.html"});
})


life.addEventListener('click',function(){
    chrome.tabs.create({url:"/pomodoro-clock.html"});
})


function getTop(arr){
    var yMin = -1;
    for(var index = 0; index < arr.length; index++){
        yMin = Math.min(yMin,arr[index].y);
    }
    return yMin;
}

function getMidPos(arr){
    var xSum = 0;
    var ySum = 0;
    for(var index = 0; index < arr.length; index++){
        xSum = xSum+arr[index].x;
        ySum = ySum+arr[index].y;
    }
    return new Array(xSum/arr.length,ySum/arr.length);
}

var startMo = document.getElementById("startMonitor");
var stopMo = document.getElementById("stopMonitor");
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    faceapi.nets.ageGenderNet.loadFromUri("/models")
]).then(
    startMo.addEventListener('click',function(){
        activeIt();
    }),
    stopMo.addEventListener('click',function(){
        if(mediaStream !== null){
            if(mediaStream.active = true){
                mediaStream.getTracks()[0].stop();
                stopMo.disabled = true;
                startMo.disabled = false;
                var myDate = new Date();
                var tempHour = myDate.getHours();
                var tempMin = myDate.getMinutes();
                if(tempMin < 10){
                    tempMin = "0"+tempMin;
                }
                endSecond = myDate.getTime();
                slot = endSecond - startSecond;
                endTime = tempHour + ":" + tempMin;
                var arr = new Array();
                arr[0] = startTime;
                arr[1] = endTime;
                arr[2] = slot;
                arr[3] = concentrationVal;
                arr[4] = emotion;
                timeSlots.push(arr);
                console.log(timeSlots);
                chrome.storage.sync.set({key: timeSlots},function(){});
        }
        }
    })
)


function activeIt(){
    concentrationVal = 100;
    stopMo.disabled = false;
    startMo.disabled = true;
    var myDate = new Date();
    var tempHour = myDate.getHours();
    var tempMin = myDate.getMinutes();
    startSecond = myDate.getTime();
    if(tempMin < 10){
        tempMin = "0"+tempMin;
    }
    startTime = tempHour + ":" + tempMin;
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.autoplay = true;
    video.srcObject = stream;
    mediaStream = stream;
    video.addEventListener('play',()=>{
        const displaySize = {width: video.videoWidth,height:video.videoHeight};
        const canvas = faceapi.createCanvasFromMedia(video);
        setInterval(async () => {
          const detections=await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
          const resizedDetections = faceapi.resizeResults(detections,displaySize);
          canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
          // Check whether webcam can capture faces
          if(resizedDetections && Object.keys(resizedDetections).length > 0){
              isHere = true;
              // Get user emotions
              const expressions = resizedDetections[0].expressions;
              const maxValue = Math.max(...Object.values(expressions));
              const emotionArray = Object.keys(expressions).filter(
                  item => expressions[item] === maxValue
              );
              emotion = emotionArray[0];
              // Get user landmarks
              const landmarks = resizedDetections[0].landmarks;
              const jaw = getTop(landmarks.getJawOutline());
              const nose = new Array(landmarks.getNose()[3].x,landmarks.getNose()[3].y);
              const mouth = getMidPos(landmarks.getMouth());
              const leftEyeBbrow = landmarks.getLeftEyeBrow();
              const leftPupil = getMidPos(leftEyeBbrow);
              const rightEyeBrow = landmarks.getRightEyeBrow();
              const rightPupil = getMidPos(rightEyeBrow);
              const distLeftX = Math.abs(nose[0]-leftPupil[0]);
              const distRightX = Math.abs(nose[0]-rightPupil[0]);
              const distLeftY = Math.abs(nose[1]-leftPupil[1]);
              const distRightY = Math.abs(nose[1]-rightPupil[1]);
              const absDisX = Math.abs(distLeftX-distRightX);
              const absDisY = Math.abs(distLeftY-distRightY);
              isConcentrated = absDisX <= 50 && absDisY <= 20;
              console.log("Everything works");
              getStudyStatus();
          }else{
              // Unable to detect users
              isHere=false; 
              getStudyStatus();
          }
          
        },700)
    })
  });}
  
  function getStudyStatus(){
      if(!isConcentrated || !isHere){
          concentrationVal -=5
          studyImage.src='img/distracted.png';
      }else{
          studyImage.src='img/focus.png';
      }
  }