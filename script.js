const main = document.getElementById('main');
const app = document.getElementById('app');
const cursor = document.querySelector('.cursor');
const score = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const snowContainer = document.querySelector('.snow');
const startButton = document.getElementById('start');

// Game state variables
let gameActive = false;
let timeLeft = 60;
let timerInterval;
let counter = 0;
let snowflakeInterval;

// Initialize the game when the window loads
if (startButton) {
    startButton.addEventListener('click', startGame);
    console.log('Start button found and handler attached');
} else {
    console.error('Start button not found');
}

// Update high score display immediately
const highScore = localStorage.getItem('highScore') || 0;
if (highScoreDisplay) {
    highScoreDisplay.textContent = `High Score: ${highScore}`;
}

// Cursor tracking
document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    cursor.style.transform = `translate(${x-15}px, ${y-15}px)`;
});

function startTimer() {
    const timeDisplay = document.getElementById('time');
    if (!timeDisplay) {
        console.error('Time display not found');
        return;
    }
    
    timeLeft = 60;
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = `Time: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            endGame("Time's up!");
        }
    }, 1000);
}

function startGame() {
    console.log('Starting game...'); // Debug log
    
    if (!startButton || !snowContainer) {
        console.error('Required elements not found');
        return;
    }
    
    if (gameActive) {
        console.log('Game already active');
        return;
    }
    
    // Reset game state
    gameActive = true;
    counter = 0;
    if (score) score.textContent = "Score: 0";
    
    // Clear existing flies
    snowContainer.innerHTML = '';
    
    // Start systems
    startTimer();
    startSnowflakeGeneration();
    
    // Update button state
    startButton.textContent = "GAME IN PROGRESS";
    startButton.style.opacity = "0.5";
    
    console.log('Game started successfully');
}

function endGame(message) {
    gameActive = false;
    clearInterval(timerInterval);
    clearInterval(snowflakeInterval);
    
    // Save and update high score
    const currentScore = counter;
    const highScore = localStorage.getItem('highScore') || 0;
    if (currentScore > parseInt(highScore)) {
        localStorage.setItem('highScore', currentScore);
        highScoreDisplay.textContent = `High Score: ${currentScore}`;
    }
    
    // Reset button state
    startButton.textContent = "START GAME";
    startButton.style.opacity = "1";
    
    alert(`${message}\nScore: ${currentScore}\nHigh Score: ${Math.max(currentScore, highScore)}`);
}

function startSnowflakeGeneration() {
    const snow = document.querySelector(".snow");
    if (!snow) {
        console.error('Snow container not found in startSnowflakeGeneration');
        return;
    }
    
    let i = 0;
    clearInterval(snowflakeInterval); // Clear any existing interval
    
    snowflakeInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(snowflakeInterval);
            return;
        }
        
        if (i >= 70) {
            clearInterval(snowflakeInterval);
            return;
        }
        
        i++;
        const snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");
        snowflake.style.top = `${Math.random() * 1}vh`;
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.animationDuration = `${Math.random() * 2 + 2}s`;
        snow.appendChild(snowflake);
    }, 1000);
}

// Event listener for clicking flies
document.querySelector(".snow").addEventListener("click", function(event) {
    if (!gameActive) return;
    if (event.target.classList.contains("snowflake")) {
        event.target.remove();
        counter++;
        score.textContent = "Score: " + counter;
        
        // Create explosion at click position instead of fly position
        const explotion = document.createElement('div');
        explotion.classList.add('explotion');
        explotion.style.position = 'fixed';
        explotion.style.left = `${event.clientX}px`;
        explotion.style.top = `${event.clientY}px`;
        app.appendChild(explotion);
        
        setTimeout(() => {
            explotion.remove();
        }, 900);
        
        if (counter === 70) {
            endGame('You won!');
        }
    }
});
