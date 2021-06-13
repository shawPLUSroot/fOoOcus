var hour,minute,second;//时 分 秒
hour=minute=second=0;//初始化
var millisecond=0;//毫秒
var int;
var s = document.getElementById("start");
s.addEventListener('click',function(){
    start();
})
var st = document.getElementById("stop");
st.addEventListener("click",function(){
    stop();
})
var re = document.getElementById("reset");
re.addEventListener("click",function(){
    Reset();
})
function Reset()//重置
{
    window.clearInterval(int);
    millisecond=hour=minute=second=0;
    document.getElementById('timetext').value='00时00分00秒000毫秒';
}

function start()//开始
{
    int=setInterval(timer,50);
}

function timer()//计时
{
    millisecond=millisecond+50;
    if(millisecond>=1000)
    {
        millisecond=0;
        second=second+1;
    }
    if(second>=60)
    {
        second=0;
        minute=minute+1;
    }

    if(minute>=60)
    {
        minute=0;
        hour=hour+1;
    }
    document.getElementById('timetext').value=hour+'时'+minute+'分'+second+'秒'+millisecond+'毫秒';

}

function stop()//暂停
{
    window.clearInterval(int);
}