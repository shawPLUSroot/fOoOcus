const increaseWork = document.getElementById('addWorkButton');
const pomodoroBackground = document.getElementById('pomodoro-clock');
const pomodoroTimer = document.querySelector('.pomodoroTimer');

const startButton = document.getElementById('pomodoro-start');
const stopButton = document.getElementById('pomodoro-stop');

let isClockRunning = false;
let workSessionDuration = 1500;
let currentTimeLeftInSession = 1500;
let breakSessionDuration = 300;
let timeSpentInCurrentSession = 0;
let type = "Work";
let currentTaskLabel = document.querySelector('#pomodoro-clock-task');
let updatedWorkSessionDuration;
let updatedBreakSessionDuration;
let workDurationInput = document.querySelector('#input-work-duration');
let breakDurationInput = document.querySelector('#input-break-duration');
workDurationInput.value = '25';
breakDurationInput.value = '5';
let isClockStopped = true;


const progressBar = new ProgressBar.Circle(".pomodoro-timer", {
    strokeWidth: 2,

    text: {
        value: "25:00",
        style: {
            color: 'white',

            position: 'absolute',
            left: '30.5%',
            top: '40%',
            padding: 20,
            letterspacing: 13,
            margin: 0,


        }
    },
    trailColor: "white",
});

startButton.addEventListener('click', () => {
    toggleClock();
})

stopButton.addEventListener('click', () => {
    toggleClock(true);

})



workDurationInput.addEventListener('input', () => {
    updatedWorkSessionDuration = minuteToSeconds(workDurationInput.value)
})

// UPDATE PAUSE TIME
breakDurationInput.addEventListener('input', () => {
    updatedBreakSessionDuration = minuteToSeconds(
        breakDurationInput.value
    )
})

const minuteToSeconds = mins => {
    return mins * 60
}



const toggleClock = reset => {
    togglePlayPauseIcon(reset);
    if (reset) {
        stopClock();

        //stop the timer
    } else {

        if (isClockStopped) {
            setUpdatedTimers();
            isClockStopped = false;
        }

        if (isClockRunning == true) {
            clearInterval(clockTimer);
            isClockRunning = false;


        } else {
            isClockRunning = true;
            clockTimer = setInterval(() => {
                stepDown();
                displayCurrentTimeLeftInSession();
                progressBar.set(calculateSessionProgress());
            }, 1000);

        }
        showStopIcon();
    }
}

const displayCurrentTimeLeftInSession = () => {

    const secondsLeft = currentTimeLeftInSession; // 1500seconds
    let result = '';
    const seconds = secondsLeft % 60; // 1500seconds / 60 =  0 seconds
    const minutes = parseInt(secondsLeft / 60) % 60; // 1500secpnds / 60 = 25  =25 
    let hours = parseInt(secondsLeft / 3600);


    function addLeadingZeroes(time) {
        return time < 10 ? `0${time}` : time
    }
    if (hours > 0) result += `${hours}:`
    result +=
        `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
    progressBar.text.innerText = result.toString();
}

const stopClock = () => {
    setUpdatedTimers();
    displaySessionLog(type);
    clearInterval(clockTimer);
    isClockStopped = true;
    isClockRunning = false;
    currentTimeLeftInSession = workSessionDuration;
    displayCurrentTimeLeftInSession();
    timeSpentInCurrentSession = 0;
    type = 'Work';
}


const stepDown = () => {
    if (currentTimeLeftInSession > 0) {
        currentTimeLeftInSession--;
        timeSpentInCurrentSession++;
    } else if (currentTimeLeftInSession === 0) {
        timeSspentInCurrentSession = 0;
        if (type === 'Work') {
            currentTimeLeftInSession = breakSessionDuration;
            displaySessionLog('Work');
            type = 'Break';
            currentTaskLabel.value = "Break";
            currentTaskLabel.disabled = true;
            setUpdatedTimers();
        } else {
            currentTimeLeftInSession = workSessionDuration;
            type = 'Work';
            setUpdatedTimers();

            if (currentTaskLabel === 'Break') {
                currentTaskLabel.value = workSessionLabel;
            }

            currentTaskLabel.disabled = false;
            displaySessionLog('Break');

        }
    }
    displayCurrentTimeLeftInSession();
}

const displaySessionLog = type => {
    const sessionsList = document.querySelector("#pomodoro-sessions");
    // append li to it
    const li = document.createElement("li");
    if (type === "Work") {
        sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : "Work";
        workSessionLabel = sessionLabel;
    } else {
        sessionLabel = "Break";
    }
    let elapsedTime = parseInt(timeSpentInCurrentSession / 60);
    elapsedTime = elapsedTime > 0 ? elapsedTime : "< 1";

    const text = document.createTextNode(
        `${sessionLabel} : ${elapsedTime} min`
    );
    li.appendChild(text);
    sessionsList.appendChild(li);
};

const setUpdatedTimers = () => {
    if (type === 'Work') {
        currentTimeLeftInSession = updatedWorkSessionDuration ?
            updatedWorkSessionDuration :
            workSessionDuration
        workSessionDuration = currentTimeLeftInSession
    } else {
        currentTimeLeftInSession = updatedBreakSessionDuration ?
            updatedBreakSessionDuration :
            breakSessionDuration
        breakSessionDuration = currentTimeLeftInSession
    }
}


const togglePlayPauseIcon = (reset) => {
    const playIcon = document.querySelector('#play-icon');
    const pauseIcon = document.querySelector('#pause-icon');

    if (reset) {
        if (playIcon.classList.contains('hidden')) {
            playIcon.classList.remove('hidden');
        }
        if (!pauseIcon.classList.contains('hidden')) {
            pauseIcon.classList.add('hidden');
        }
    } else {
        playIcon.classList.toggle('hidden');
        pauseIcon.classList.toggle('hidden');
    }
}



const showStopIcon = () => {
    stopButton.classList.remove('hidden');
}

const calculateSessionProgress = () => {
    // calculate the completion rate of this session
    const sessionDuration =
        type === "Work" ? workSessionDuration : breakSessionDuration;
    return (timeSpentInCurrentSession / sessionDuration) * 1;
};