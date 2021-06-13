const states={
	START:'start',
	PAUSE:'pause',
	STOP:'stop'
}
const clock_states={
    WORK:'work',
    REST:'rest'
}
var audio=document.getElementById("sound");
var theme=document.getElementsByClassName("selected");
var minute=25;
var second=00;

var clock=new Vue({
	el:'#container',
	data(){
    return{
        minutes:minute,
        seconds:second,
        session_value:25,
        break_value:5,
        state:states.STOP,
        clock_state:clock_states.WORK,
        select:[
            {name:"forest",show:true},
            {name:"ocean",show:false},
            {name:"rainy",show:false},
            {name:"peace",show:false},
            {name:"cafe",show:false}
        ],
        bgs:[
            {name:"forest",value:"https://cdn.pixabay.com/photo/2012/09/15/02/22/forest-56930_1280.jpg"},
            {name:"ocean",value:"https://cdn.pixabay.com/photo/2017/03/27/14/49/beach-2179183_1280.jpg"},
            {name:"rainy",value:"http://imgsrc.baidu.com/image/c0%3Dpixel_huitu%2C0%2C0%2C294%2C40/sign=ff44e1376c09c93d13ff06b7f6459db0/5366d0160924ab18a1784a0e3efae6cd7b890b98.jpg"},
            {name:"peace",value:"http://pic1.win4000.com/wallpaper/2/58a53eb5d456e.jpg"},
            {name:"cafe",value:"http://pic1.win4000.com/wallpaper/2018-03-16/5aab633f77eb7.jpg"}
        ]
        };
    },
        computed:{
        min:function(){
        if(this.state===states.STOP){
            if(this.minutes!==this.session_value){
            this.minutes=this.session_value;
            }
        }
        if(this.minutes<10){
            return '0'+this.minutes;
        }
        return this.minutes;
        },
        sec:function(){
        if(this.seconds<10){
            return '0'+this.seconds;
        }
        return this.seconds;
        }
        },
    
    methods:{
        tick:function(){
        if(this.seconds!==0){
            this.seconds--;
            return;
        }
        if(this.minutes!==0){
            this.minutes--;
            this.seconds=59;
            return;
        }
        //judge work or rest
        this.clock_state=
            this.clock_state===clock_states.WORK?clock_states.REST:clock_states.WORK;
        if(this.clock_state===
            clock_states.WORK){
            this.minutes=minute;
        }else {
            this.minutes=this.break_value;
        }
        },
        start:function(){
        this.state=states.START;
        this.tick();
        this.Interval=
            setInterval(this.tick,1000);
        },
        stop_clock:function(){
        this.state=states.STOP;
        clearInterval(this.Interval);
    this.clock_state=clock_states.WORK;
        this.minutes=minute;
        this.seconds=0;
        },
        pause_clock:function(){
        this.state=states.PAUSE;
        clearInterval(this.Interval); 
        },
        selectsound:function(e){  
        console.log(this.$refs.con); 
        this.$refs.con.style.background="url("+this.bgs[1].value+")";
        this.select.forEach(se=>se.show=false);
        switch(e.name){
            case "forest":audio.setAttribute("src","http://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/forest.mp3");          
            e.show=true;
            this.$refs.con.style.backgroundImage="url("+this.bgs[0].value+")";
            break;
        case "ocean": audio.setAttribute("src","http://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/ocean.mp3");
            this.$refs.con.style.backgroundImage="url("+this.bgs[1].value+")";
            e.show=true; break;
        case "rainy": audio.setAttribute("src", "http://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/rain.mp3");
            this.$refs.con.style.backgroundImage="url("+this.bgs[2].value+")";
            e.show=true;break;
        case "peace": audio.setAttribute("src","http://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/peace.mp3");
            this.$refs.con.style.backgroundImage="url("+this.bgs[3].value+")";e.show=true; break;
        case "cafe":              audio.setAttribute("src","http://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/cafe.mp3");
            this.$refs.con.style.backgroundImage="url("+this.bgs[4].value+")";         
            e.show=true;break;
        }             
        },
        //increase&decrease five minutes
        increSession:function(){
        this.session_value+=5;
        },
        decreSession:function(){
        this.session_value-=5;
        },
        increBreak:function(){
        this.break_value+=5;
        },
        decreBreak:function(){
        this.break_value-=5;
        }
    }
});

var btn = document.getElementById("open_url_new_tab");
btn.addEventListener('click',function(){
    chrome.tabs.create({url:"/homePage.html"});
},false)