const timer = document.getElementById('timer');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');
const lapList = document.getElementById('lapList');

let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let lapCounter = 1;

function saveData() {
    localStorage.setItem('lapCounter', lapCounter);
    localStorage.setItem('lapList', lapList.innerHTML);
    localStorage.setItem('elapsedTime', elapsedTime);
}

function loadData() {
    lapCounter = parseInt(localStorage.getItem('lapCounter')) || 1;
    lapList.innerHTML = localStorage.getItem('lapList') || '';
    elapsedTime = parseInt(localStorage.getItem('elapsedTime')) || 0;
    timer.textContent = formatTimer(elapsedTime);
}
loadData();

function startTimer() {
    startTime = Date.now() - elapsedTime;

    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        timer.textContent = formatTimer(elapsedTime);
    }, 10);
    startButton.disabled = true;
    stopButton.disabled = false;
    lapButton.disabled = false;
}

function stopTimer() {
    clearInterval(timerInterval);
    startButton.disabled = false;
    stopButton.disabled = true;
    lapButton.disabled = false;
}

function resetTimer() {
    clearInterval(timerInterval);

    elapsedTime = 0;
    timer.textContent = "00:00:00";
    lapList.innerHTML = '';

    startButton.disabled = false;
    stopButton.disabled = false;
    lapButton.disabled = true;
    lapCounter = 1;
    saveData();
}

function formatTimer(elapsedTime) {
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    const mseconds = Math.floor((elapsedTime % 1000) / 10);
    return (
        (hours ? (hours > 9 ? hours : "0" + hours) : "00")
        + ":" +
        (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00")
        + ":" +
        (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00")
        + "." +
        (mseconds > 9 ? mseconds : "0" + mseconds)
    );
}

function lap() {
    const lapTime = formatTimer(elapsedTime);
    const lapItem = document.createElement('li');
    lapItem.textContent = `Lap ${lapCounter}: ${lapTime}`;
    lapList.appendChild(lapItem);
    lapCounter++;
    saveData();
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 2000); 
}

lapList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const lapTime = event.target.textContent.split(': ')[1];
        copyToClipboard(lapTime);
        showNotification(`Copied Lap Time: ${lapTime}`);
    }
});

timer.addEventListener('click', () => copyToClipboard(timer.textContent));
lapList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        copyToClipboard(event.target.textContent.split(': ')[1]);
    }
});

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);
lapButton.addEventListener('click', lap);

