let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

const tomato = document.querySelector('.tomato');
const mouth = document.querySelector('.mouth');

const workModeButton = document.getElementById('work-mode');
const restModeButton = document.getElementById('rest-mode');

const fireElement = document.querySelector('.fire');
const iceElement = document.querySelector('.ice');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function setMode(isWork) {
    isWorkTime = isWork;
    timeLeft = isWork ? WORK_TIME : BREAK_TIME;
    
    // Update button states and colors
    workModeButton.classList.toggle('active', isWork);
    restModeButton.classList.toggle('active', !isWork);
    
    // Remove old mode classes
    workModeButton.classList.remove('cooking', 'cooling');
    restModeButton.classList.remove('cooking', 'cooling');
    
    // Toggle fire/ice visibility and update colors
    if (isWork) {
        workModeButton.classList.add('cooking');
        restModeButton.classList.remove('active');
        document.querySelector('.controls').classList.add('cooking');
        document.querySelector('.controls').classList.remove('cooling');
        tomato.style.backgroundColor = '#ff6b6b'; // Start fresh red for cooking
        fireElement.classList.remove('hidden');
        iceElement.classList.add('hidden');
        document.body.style.backgroundColor = '#ff6b6b'; // Tomato red background
    } else {
        restModeButton.classList.add('cooling');
        workModeButton.classList.remove('active');
        document.querySelector('.controls').classList.add('cooling');
        document.querySelector('.controls').classList.remove('cooking');
        tomato.style.backgroundColor = '#a52a2a'; // Start burnt for cooling
        fireElement.classList.add('hidden');
        iceElement.classList.remove('hidden');
        document.body.style.backgroundColor = '#a8d8ff'; // Ice blue background
    }
    
    // Update start button text based on mode
    startButton.textContent = isWork ? 'Start Cooking' : 'Start Cooling';
    
    // Reset mouth to normal
    mouth.style.borderRadius = '0 0 30px 30px';
    
    // Update display
    updateDisplay();
    
    // If timer is running, restart it with new time
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        startTimer();
    }
}

function updateTomatoColor() {
    const progress = 1 - (timeLeft / (isWorkTime ? WORK_TIME : BREAK_TIME));
    const freshColor = [255, 107, 107];  // #ff6b6b (fresh tomato red)
    const burntColor = [165, 42, 42];    // #a52a2a (burnt brown)
    
    // For cooking: fresh -> burnt
    // For cooling: burnt -> fresh
    const startColor = isWorkTime ? freshColor : burntColor;
    const endColor = isWorkTime ? burntColor : freshColor;
    
    const currentColor = startColor.map((start, i) => {
        return Math.round(start + (endColor[i] - start) * progress);
    });
    
    tomato.style.backgroundColor = `rgb(${currentColor.join(',')})`;
    
    // Update expression based on progress
    if (progress > 0.8) {
        mouth.style.borderRadius = '30px 30px 0 0'; // Happy face
    } else {
        mouth.style.borderRadius = '0 0 30px 30px'; // Normal face
    }
}

function startTimer() {
    if (timerId === null) {
        if (timeLeft === undefined) {
            timeLeft = WORK_TIME;
        }
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            updateTomatoColor();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                setMode(true);
                startTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    setMode(true);
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

workModeButton.addEventListener('click', () => setMode(true));
restModeButton.addEventListener('click', () => setMode(false));

// Initialize the display
resetTimer(); 