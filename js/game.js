// WWM Battle Royale - Game Logic (FIXED VERSION)


const gameState = {
    roomCode: '',
    playerName: '',
    playerId: null,
    players: [],
    currentQuestion: null,
    currentQuestionIndex: 0,
    playerAnswers: {},
    timer: 0,
    timerInterval: null,
    eliminated: false,
    gameOver: false,
    myAnswerTime: null,
    gameStarted: false,
    allReady: false
};


let socket = null;


// Initialize game
function initGame() {
    console.log('🎮 Initializing game...');

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    gameState.roomCode = urlParams.get('room');
    gameState.playerName = urlParams.get('player');
    gameState.playerId = parseInt(urlParams.get('playerId'));

    // Get players from URL (passed from lobby)
    const playersParam = urlParams.get('players');
    if (playersParam) {
        try {
            gameState.players = JSON.parse(decodeURIComponent(playersParam));
            console.log('📋 Loaded players from lobby:', gameState.players);
        } catch (e) {
            console.error('Error parsing players:', e);
            gameState.players = [{
                id: gameState.playerId,
                name: gameState.playerName,
                eliminated: false
            }];
        }
    } else {
        gameState.players = [{
            id: gameState.playerId,
            name: gameState.playerName,
            eliminated: false
        }];
    }

    console.log('Room:', gameState.roomCode);
    console.log('Player:', gameState.playerName);
    console.log('Player ID:', gameState.playerId);
    console.log('Total players:', gameState.players.length);

    // Update UI
    updatePlayerNameDisplay();
    updatePlayersGrid();

    // Connect WebSocket
    connectWebSocket();
}


// Update player name in header
function updatePlayerNameDisplay() {
    const elem = document.getElementById('player-name-display');
    if (elem) {
        elem.textContent = gameState.playerName;
    }
}


// Update 2D players grid
function updatePlayersGrid() {
    const container = document.getElementById('players-container');
    if (!container) return;

    container.innerHTML = '';

    gameState.players.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.id = `player-${player.id}`;

        const isYou = player.id === gameState.playerId;
        if (isYou) {
            card.classList.add('player-you');
        }

        if (player.eliminated) {
            card.classList.add('player-eliminated');
        }

        card.innerHTML = `
            <div class="player-card-inner">
                <div class="player-name">${player.name}</div>
                <div class="player-status">${player.eliminated ? '💀 Eliminiert' : '✓ Aktiv'}</div>
                ${isYou ? '<div class="player-badge">DU</div>' : ''}
            </div>
        `;

        container.appendChild(card);
    });
}


// Connect to WebSocket
function connectWebSocket() {
    socket = new WebSocket('wss://nosch.uber.space/web-rooms/');

    socket.addEventListener('open', (event) => {
        console.log('WebSocket connected');
        socket.send(JSON.stringify(['*enter-room*', gameState.roomCode]));

        // Send player-ready message
        setTimeout(() => {
            sendRequest('*broadcast-message*', JSON.stringify({
                type: 'game-player-ready',
                id: gameState.playerId,
                name: gameState.playerName
            }));

            // Check if we can start after a delay
            setTimeout(() => {
                checkIfAllReady();
            }, 500);
        }, 100);
    });

    socket.addEventListener('message', (event) => {
        handleMessage(event.data);
    });

    socket.addEventListener('close', () => {
        console.log('WebSocket disconnected');
    });
}


// Send WebSocket request
function sendRequest(selector, ...args) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify([selector, ...args]));
    }
}


// Handle incoming messages
function handleMessage(data) {
    try {
        const parsed = JSON.parse(data);
        const [selector, ...args] = parsed;

        if (Array.isArray(args) && args.length > 0 && typeof args[0] === 'string') {
            try {
                const broadcastData = JSON.parse(args[0]);
                handleGameMessage(broadcastData);
            } catch (e) {
                // Not a JSON string
            }
        }

    } catch (e) {
        console.error('Error handling message:', e);
    }
}


// Handle game-specific messages
function handleGameMessage(data) {
    console.log('📨 Received game message:', data.type);

    switch (data.type) {
        case 'game-player-ready':
            handlePlayerReady(data);
            break;
        case 'start-game':
            if (!gameState.allReady) {
                handleGameStart();
            }
            break;
        case 'player-answer':
            handlePlayerAnswer(data);
            break;
        case 'player-eliminated':
            handlePlayerEliminated(data);
            break;
    }
}


// Handle player ready
function handlePlayerReady(data) {
    const existing = gameState.players.find(p => p.id === data.id);
    if (!existing && data.id !== gameState.playerId) {
        console.log('➕ Player joined:', data.name);
        gameState.players.push({
            id: data.id,
            name: data.name,
            eliminated: false
        });
        updatePlayersGrid();
    }

    checkIfAllReady();
}


// ✅ FIX 1: Check if all players ready - improved
function checkIfAllReady() {
    const readyCount = gameState.players.length;

    document.getElementById('status-text').textContent = 
        `Warte auf Spieler... ${readyCount}/${readyCount} Spieler sind bereit`;

    const activePlayers = gameState.players.filter(p => !p.eliminated);
    document.getElementById('players-left').textContent = activePlayers.length;

    // Start with at least 1 player (for testing), only once
    if (readyCount >= 1 && !gameState.allReady) {
        gameState.allReady = true;

        console.log('✅ ALL PLAYERS READY! Broadcasting start...');

        sendRequest('*broadcast-message*', JSON.stringify({
            type: 'start-game'
        }));

        setTimeout(() => {
            handleGameStart();
        }, 2000);
    }
}


// ✅ FIX 2: Handle game start - only once
function handleGameStart() {
    if (gameState.gameStarted) {
        console.log('⚠️ Game already started, ignoring duplicate start message');
        return;
    }

    gameState.gameStarted = true;
    console.log('🎮 STARTING GAME!');

    showCountdown(3, () => {
        startQuestion(0);
    });
}


// Start a question
function startQuestion(index) {
    console.log('📝 Starting question', index);

    if (typeof QUESTIONS === 'undefined' || !QUESTIONS || QUESTIONS.length === 0) {
        console.error('❌ FEHLER: questions.js nicht geladen!');
        document.getElementById('status-text').innerHTML = 
            '❌ FEHLER: Fragen konnten nicht geladen werden!';
        return;
    }

    if (index >= QUESTIONS.length) {
        console.log('🏁 No more questions - showing winner');
        showWinner();
        return;
    }

    gameState.currentQuestionIndex = index;
    gameState.currentQuestion = QUESTIONS[index];
    gameState.myAnswerTime = null;

    // ✅ FIX 3: Properly hide/show screens using classList
    document.getElementById('waiting-screen').classList.add('hidden');
    document.getElementById('question-screen').classList.remove('hidden');

    const activePlayers = gameState.players.filter(p => !p.eliminated);
    document.getElementById('players-left').textContent = activePlayers.length;

    document.getElementById('question-number').textContent = `Frage ${index + 1}`;
    document.getElementById('question-text').textContent = gameState.currentQuestion.question;
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('submit-btn').disabled = false;

    if (gameState.currentQuestion.type === 'sort') {
        renderSortQuestion();
    } else {
        renderMultipleChoice();
    }

    startTimer();
}


// Render multiple choice
function renderMultipleChoice() {
    const container = document.getElementById('answers-container');
    container.innerHTML = '';
    container.className = 'answers-grid';

    gameState.currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-option';
        button.textContent = `${String.fromCharCode(65 + index)}) ${answer}`;
        button.onclick = () => selectAnswer(index);
        container.appendChild(button);
    });
}


// Render sort question
function renderSortQuestion() {
    const container = document.getElementById('answers-container');
    container.innerHTML = '<div class="sort-instructions">📌 Ziehe die Elemente in die richtige Reihenfolge:</div>';
    container.className = 'sort-container';

    const sortList = document.createElement('div');
    sortList.id = 'sort-list';
    sortList.className = 'sort-list';

    const shuffled = [...gameState.currentQuestion.answers]
        .map((item, index) => ({ item, index, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(obj => obj.item);

    shuffled.forEach(item => {
        const div = document.createElement('div');
        div.className = 'sort-item';
        div.draggable = true;
        div.textContent = item;

        div.addEventListener('dragstart', handleDragStart);
        div.addEventListener('dragover', handleDragOver);
        div.addEventListener('drop', handleDrop);
        div.addEventListener('dragend', handleDragEnd);

        sortList.appendChild(div);
    });

    container.appendChild(sortList);
}


// Drag and drop handlers
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.target.parentElement, e.clientY);
    if (afterElement == null) {
        e.target.parentElement.appendChild(draggedElement);
    } else {
        e.target.parentElement.insertBefore(draggedElement, afterElement);
    }
}

function handleDrop(e) {
    e.preventDefault();
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.sort-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


// Select answer
let selectedAnswerIndex = null;

function selectAnswer(index) {
    document.querySelectorAll('.answer-option').forEach(btn => {
        btn.classList.remove('selected');
    });

    const buttons = document.querySelectorAll('.answer-option');
    if (buttons[index]) {
        buttons[index].classList.add('selected');
        selectedAnswerIndex = index;
    }
}


// ✅ FIX 4: Submit answer - store own answer immediately
function submitAnswer() {
    let userAnswer;

    if (gameState.currentQuestion.type === 'sort') {
        const sortItems = document.querySelectorAll('.sort-item');
        userAnswer = Array.from(sortItems).map(item => item.textContent);
    } else {
        if (selectedAnswerIndex === null) {
            showFeedback('Bitte wähle eine Antwort!', false);
            return;
        }
        userAnswer = selectedAnswerIndex;
    }

    const isCorrect = checkAnswer(userAnswer);

    if (isCorrect) {
        stopTimer();
        gameState.myAnswerTime = gameState.timer;

        // ✅ Store MY OWN answer IMMEDIATELY
        gameState.playerAnswers[gameState.playerId] = {
            time: gameState.timer,
            name: gameState.playerName
        };

        console.log('✅ I answered! Time:', gameState.timer.toFixed(1) + 's');
        console.log('📊 My playerAnswers:', gameState.playerAnswers);

        showFeedback(`🎉 Du bist eine Runde weiter! (Zeit: ${gameState.timer.toFixed(1)}s)`, true);

        // Broadcast answer
        sendRequest('*broadcast-message*', JSON.stringify({
            type: 'player-answer',
            playerId: gameState.playerId,
            playerName: gameState.playerName,
            time: gameState.timer,
            questionIndex: gameState.currentQuestionIndex
        }));

        document.getElementById('submit-btn').disabled = true;

        // ✅ Check if all answered (including myself!)
        checkIfAllAnswered();

    } else {
        showFeedback('✗ Falsche Antwort! Versuche es erneut...', false);
    }
}


// Check if answer is correct
function checkAnswer(userAnswer) {
    if (gameState.currentQuestion.type === 'sort') {
        return JSON.stringify(userAnswer) === JSON.stringify(gameState.currentQuestion.correct);
    } else {
        return userAnswer === gameState.currentQuestion.correct;
    }
}


// Show feedback
function showFeedback(message, isCorrect) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = isCorrect ? 'correct' : 'incorrect';
    feedback.style.display = 'block';
}


// Timer
function startTimer() {
    gameState.timer = 0;

    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    gameState.timerInterval = setInterval(() => {
        gameState.timer += 0.1;
        updateTimerDisplay();

        // ✅ FIX 5: Auto-eliminate after 45 seconds
        if (gameState.timer >= 45 && gameState.myAnswerTime === null) {
            console.log('⏱️ TIME OUT! Auto-eliminating...');
            stopTimer();
            autoEliminateMe();
        }
    }, 100);
}


function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}


function updateTimerDisplay() {
    const timerElem = document.getElementById('timer');
    if (timerElem) {
        timerElem.textContent = gameState.timer.toFixed(1) + 's';

        // Warning color after 35 seconds
        if (gameState.timer > 35) {
            timerElem.classList.add('warning');
        } else {
            timerElem.classList.remove('warning');
        }
    }
}


// ✅ FIX 6: Auto-eliminate on timeout
function autoEliminateMe() {
    console.log('💀 I was too slow - auto-eliminating myself');

    // Store my timeout answer (999 = timeout)
    gameState.playerAnswers[gameState.playerId] = {
        time: 999,
        name: gameState.playerName
    };

    // Broadcast timeout
    sendRequest('*broadcast-message*', JSON.stringify({
        type: 'player-answer',
        playerId: gameState.playerId,
        playerName: gameState.playerName,
        time: 999,
        questionIndex: gameState.currentQuestionIndex
    }));

    showFeedback('⏱️ Zeit abgelaufen! Du wirst eliminiert...', false);

    document.getElementById('submit-btn').disabled = true;

    // Check if all answered
    checkIfAllAnswered();
}


// Show waiting screen
function showWaitingScreen() {
    document.getElementById('question-screen').classList.add('hidden');
    document.getElementById('waiting-screen').classList.remove('hidden');
    document.getElementById('status-text').textContent = 'Warte auf andere Spieler...';
    document.getElementById('waiting-title').textContent = 'Warteraum';

    updatePlayersGrid();
}


// ✅ FIX 7: Show countdown with proper styling
function showCountdown(seconds, callback) {
    document.getElementById('question-screen').classList.add('hidden');
    document.getElementById('waiting-screen').classList.remove('hidden');
    document.getElementById('waiting-title').textContent = 'Nächste Frage...';

    let count = seconds;
    const countdownElement = document.getElementById('status-text');
    countdownElement.classList.add('countdown');
    countdownElement.textContent = count;

    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownElement.textContent = count;
        } else {
            clearInterval(countdownInterval);
            countdownElement.classList.remove('countdown');
            callback();
        }
    }, 1000);
}


// ✅ FIX 8: Check if all answered - new function
function checkIfAllAnswered() {
    const activePlayers = gameState.players.filter(p => !p.eliminated);
    const answeredCount = Object.keys(gameState.playerAnswers).length;

    console.log('📊 Check: ' + answeredCount + '/' + activePlayers.length + ' players answered');
    console.log('📝 Who answered:', Object.values(gameState.playerAnswers).map(a => a.name));

    if (answeredCount === activePlayers.length) {
        console.log('✅ ALL PLAYERS ANSWERED!');

        setTimeout(() => {
            findAndEliminateSlowest();
        }, 1000);
    } else {
        console.log('⏳ Still waiting for ' + (activePlayers.length - answeredCount) + ' more player(s)');

        setTimeout(() => {
            showWaitingScreen();
        }, 2000);
    }
}


// ✅ FIX 9: Handle player answer from others
function handlePlayerAnswer(data) {
    // Don't process my own answer again
    if (data.playerId === gameState.playerId) {
        console.log('⚠️ Received my own answer, ignoring');
        return;
    }

    console.log('📨 Received player-answer message:', data);
    console.log('   Player ID:', data.playerId);
    console.log('   My ID:', gameState.playerId);
    console.log('   Is from me?', data.playerId === gameState.playerId);

    console.log('✅ Player answered:', data.playerName, 'Time:', data.time + 's');

    // Store answer
    gameState.playerAnswers[data.playerId] = {
        time: data.time,
        name: data.playerName
    };

    console.log('💾 Stored answer in playerAnswers');
    console.log('📊 Current playerAnswers:', gameState.playerAnswers);

    // Check if all answered
    const activePlayers = gameState.players.filter(p => !p.eliminated);
    console.log('👥 Active players:', activePlayers.map(p => p.name));

    const answeredCount = Object.keys(gameState.playerAnswers).length;
    console.log('📊 Progress:', answeredCount + '/' + activePlayers.length, 'players answered');
    console.log('📝 Who answered:', Object.values(gameState.playerAnswers).map(a => a.name));

    if (answeredCount === activePlayers.length) {
        console.log('✅ ALL PLAYERS ANSWERED!');

        setTimeout(() => {
            findAndEliminateSlowest();
        }, 1000);
    } else {
        console.log('⏳ Still waiting for ' + (activePlayers.length - answeredCount) + ' more player(s)');
    }
}


// Find and eliminate slowest player
function findAndEliminateSlowest() {
    const answers = Object.entries(gameState.playerAnswers);

    if (answers.length === 0) {
        console.log('⚠️ No answers to process');
        return;
    }

    console.log('🔍 Processing elimination...');
    console.log('📊 All answers:', answers);

    // Find slowest
    const slowest = answers.reduce((prev, curr) => {
        return curr[1].time > prev[1].time ? curr : prev;
    });

    const slowestId = parseInt(slowest[0]);
    const slowestPlayer = gameState.players.find(p => p.id === slowestId);

    console.log('💀 Slowest player:', slowestPlayer.name, 'Time:', slowest[1].time + 's');

    // Broadcast elimination
    sendRequest('*broadcast-message*', JSON.stringify({
        type: 'player-eliminated',
        playerId: slowestId,
        playerName: slowestPlayer.name,
        time: slowest[1].time
    }));

    // Handle locally
    handlePlayerEliminated({
        playerId: slowestId,
        playerName: slowestPlayer.name
    });
}


// ✅ FIX 10: Handle player elimination - improved
function handlePlayerEliminated(data) {
    console.log('💀 Player eliminated:', data.playerName);

    // Mark player as eliminated
    const player = gameState.players.find(p => p.id === data.playerId);
    if (player) {
        player.eliminated = true;
    }

    // Check if I was eliminated
    if (data.playerId === gameState.playerId) {
        gameState.eliminated = true;
        document.getElementById('status-text').textContent = 
            `Du wurdest eliminiert!`;
        setTimeout(() => {
            showEliminatedScreen();
        }, 3000);
        return;
    }

    // Update grid
    updatePlayersGrid();

    // Show elimination message
    document.getElementById('waiting-screen').classList.remove('hidden');
    document.getElementById('question-screen').classList.add('hidden');
    document.getElementById('waiting-title').textContent = 'Eliminierung';
    document.getElementById('status-text').textContent = 
        `${data.playerName} wurde eliminiert!`;

    // Check remaining players
    const remaining = gameState.players.filter(p => !p.eliminated);

    if (remaining.length === 1) {
        // Only one left - winner!
        setTimeout(() => {
            showWinner();
        }, 3000);
    } else {
        // Reset answers and show countdown before next question
        setTimeout(() => {
            gameState.playerAnswers = {};
            selectedAnswerIndex = null;

            showCountdown(3, () => {
                startQuestion(gameState.currentQuestionIndex + 1);
            });
        }, 3000);
    }
}


// Show eliminated screen
function showEliminatedScreen() {
    stopTimer();

    document.getElementById('question-screen').classList.add('hidden');
    document.getElementById('waiting-screen').classList.add('hidden');
    document.getElementById('eliminated-screen').classList.remove('hidden');
}


// Show winner
function showWinner() {
    stopTimer();
    gameState.gameOver = true;

    const remaining = gameState.players.filter(p => !p.eliminated);

    if (remaining.length === 1 && remaining[0].id === gameState.playerId) {
        document.getElementById('question-screen').classList.add('hidden');
        document.getElementById('waiting-screen').classList.add('hidden');
        document.getElementById('winner-screen').classList.remove('hidden');
    }
}


// Event listeners
document.getElementById('submit-btn')?.addEventListener('click', submitAnswer);


// Initialize on load
window.addEventListener('DOMContentLoaded', initGame);