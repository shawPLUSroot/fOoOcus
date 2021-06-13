var app = new Vue({
    el: '#app',
    data: function() {
        return { visible: false }
    }
});
var emotionArray = [0,0,0,0,0,0,0];
var emotion = document.getElementById("emotion");
var homepage = document.getElementById("homepage");
var faq = document.getElementById("faq");
var website = document.getElementById("website");
homepage.addEventListener('click',function(){
    console.log("I'm here");
    chrome.tabs.update({url:"/homePage.html"});
});
faq.addEventListener('click',function(){
    chrome.tabs.create({url:"https://github.com/shawPLUSroot/fOoOcus/issues/5"});
})
website.addEventListener('click',function(){
    chrome.tabs.create({url:"/website.html"});
})



chrome.storage.sync.get(['key'],function(result){
    var dataStored = result.key;
    console.log(dataStored);
    var startTime = null;
    var endTime = null;
    var timeData = [];
    var concentrationData = [];
    var totalTime = 0;
    var hardestSlot = 0;
    var adviseButton = document.getElementById("adviseButton");
    var reportButton = document.getElementById("reportButton");
    var myChart = echarts.init(document.getElementById('main'));
    adviseButton.addEventListener('click',function(){
        var suggestions=document.getElementById("suggestion");
        suggestions.innerHTML = "Get organized and try to study in the morning instead of evening since you are distracted a lot at that time."
    })

     
    var option = {
        angleAxis: {
            type: 'category',
            data: ['0800','1000', '1200', '1400', '1600', '1800', '2000']
        },
        radiusAxis: {
        },
        polar: {
        },
        series: [{
            name:"Concentration",
            step: 'end',
            data: [20, 32, 1, 34, 29, 33, 100],
            type: 'bar',
            coordinateSystem: 'polar',
            itemStyle:{
                normal:{
                    color: new echarts.graphic.LinearGradient(0,0,0,1,[
                        {offset: 0, color:'#c1cbd7'},
                        {offset:0.5, color:'#9ca8b8'},
                        {offset:1,color:'#8696a7'}
                    ])
                }
            }
        }],
        legend: {
            show: true,
            data:['Concentration']
        }
    };
    myChart.setOption(option);
    console.log(dataStored === "undefined");

    if(dataStored ===null || typeof dataStored === "undefined"){
        console.log("Nothing happens");
    }else{
        startTime=dataStored[0][0];
        endTime=dataStored[dataStored.length-1][1];
        for(var i =0; i < dataStored.length; i++){
            timeData.push(dataStored[i][0]);
            timeData.push(dataStored[i][1]);
            concentrationData.push(dataStored[i][3]);
            concentrationData.push(0);
            totalTime = totalTime + dataStored[i][2];
            if(dataStored[i][4]==='neutral'){
                emotionArray[0]++;
            }else if(dataStored[i][4]==='happy'){
                emotionArray[1]++;
            }else if(dataStored[i][4]==='sad'){
                emotionArray[2]++;
            }else if(dataStored[i][4]==='angry'){
                emotionArray[3]++;
            }else if(dataStored[i][4]==='fearful'){
                emotionArray[4]++;
            }else if(dataStored[i][4]==='disgusted'){
                emotionArray[5]++;
            }else{
                emotionArray[6]++;
            }
            if(dataStored[i][3] > dataStored[hardestSlot][3]){
                hardestSlot = i;
            }
        }

        function getEmotion(num){
            if(num===0) return 'neutral';
            if(num===1) return 'happy';
            if(num===2) return 'sad';
            if(num===3) return 'angry';
            if(num===4) return 'fearful';
            if(num===5) return 'disgusted';
            if(num===6) return 'surprised';
        }

        function getNum(arr){
            var i = 0;
            for(var j = 0; j < arr.length; j++){
                if(arr[j]>arr[i]){
                    i = j;
                }
            }
            return i;
        }

        reportButton.addEventListener('click',function(){
            myChart.setOption({
                angleAxis:{
                    data:timeData
                },
                series:[{
                    data:concentrationData
                }]
            });
            var startStudyTime = document.getElementById("startStudyTime");
            var stopStudyTime = document.getElementById("stopStudyTime");
            var totalStudyTime = document.getElementById("totalTime");
            var slot1=document.getElementById("slot1");
            var slot2=document.getElementById("slot2");
            slot1.innerHTML = dataStored[hardestSlot][0];
            slot2.innerHTML = dataStored[hardestSlot][1];
            startStudyTime.innerHTML=startTime;
            stopStudyTime.innerHTML =endTime;
            totalStudyTime.innerHTML = totalTime/60000 + " mintues";
            emotion.innerHTML = getEmotion(getNum(emotionArray));
        })


    }
    





})