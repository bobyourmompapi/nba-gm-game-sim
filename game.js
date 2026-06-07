const players = [
    { id: 1, name: "Michael Jordan", rating: 99, cost: 35000000, pos: "G" },
    { id: 2, name: "LeBron James", rating: 98, cost: 33000000, pos: "F" },
    { id: 3, name: "Kareem Abdul-Jabbar", rating: 97, cost: 30000000, pos: "C" },
    { id: 4, name: "Magic Johnson", rating: 96, cost: 28000000, pos: "G" },
    { id: 5, name: "Larry Bird", rating: 96, cost: 28000000, pos: "F" },
    { id: 6, name: "Shaquille O'Neal", rating: 95, cost: 25000000, pos: "C" },
    { id: 7, name: "Kobe Bryant", rating: 95, cost: 25000000, pos: "G" },
    { id: 8, name: "Tim Duncan", rating: 94, cost: 22000000, pos: "F" },
    { id: 9, name: "Stephen Curry", rating: 93, cost: 20000000, pos: "G" },
    { id: 10, name: "Kevin Durant", rating: 93, cost: 20000000, pos: "F" },
    { id: 11, name: "Role Player A", rating: 75, cost: 5000000, pos: "G" },
    { id: 12, name: "Role Player B", rating: 75, cost: 5000000, pos: "F" },
    { id: 13, name: "Role Player C", rating: 75, cost: 5000000, pos: "C" }
];

let gameState = {
    teamName: "",
    budget: 100000000,
    wins: 0,
    losses: 0,
    roster: [],
    market: [...players],
    gameLog: []
};

// UI Elements
const setupScreen = document.getElementById('setup-screen');
const mainScreen = document.getElementById('main-screen');
const rosterList = document.getElementById('roster-list');
const marketList = document.getElementById('market-list');
const gameLog = document.getElementById('game-log');

// Initialization
document.getElementById('start-game-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value || "Default";
    gameState.teamName = city + " Legends";
    setupScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
    updateUI();
});

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.remove('hidden');
    });
});

function updateUI() {
    document.getElementById('team-name').textContent = gameState.teamName;
    document.getElementById('budget').textContent = `$${(gameState.budget / 1000000).toFixed(1)}M`;
    document.getElementById('wins').textContent = gameState.wins;
    document.getElementById('losses').textContent = gameState.losses;

    renderRoster();
    renderMarket();
}

function renderRoster() {
    rosterList.innerHTML = gameState.roster.length ? '' : '<p>No players signed yet.</p>';
    gameState.roster.forEach(player => {
        const card = createPlayerCard(player, 'Release', () => releasePlayer(player.id));
        rosterList.appendChild(card);
    });
}

function renderMarket() {
    marketList.innerHTML = '';
    gameState.market.forEach(player => {
        const card = createPlayerCard(player, 'Sign', () => signPlayer(player.id));
        marketList.appendChild(card);
    });
}

function createPlayerCard(player, actionText, actionFn) {
    const div = document.createElement('div');
    div.className = 'player-card';
    div.innerHTML = `
        <div class="player-info">
            <h4>${player.name} (${player.pos})</h4>
            <p>Rating: ${player.rating} | Salary: $${(player.cost / 1000000).toFixed(1)}M</p>
        </div>
        <button class="action-btn">${actionText}</button>
    `;
    div.querySelector('button').onclick = actionFn;
    return div;
}

function signPlayer(id) {
    const playerIndex = gameState.market.findIndex(p => p.id === id);
    const player = gameState.market[playerIndex];
    
    if (gameState.budget >= player.cost) {
        gameState.budget -= player.cost;
        gameState.roster.push(player);
        gameState.market.splice(playerIndex, 1);
        updateUI();
    } else {
        alert("Not enough budget!");
    }
}

function releasePlayer(id) {
    const playerIndex = gameState.roster.findIndex(p => p.id === id);
    const player = gameState.roster[playerIndex];
    
    gameState.budget += player.cost;
    gameState.market.push(player);
    gameState.roster.splice(playerIndex, 1);
    updateUI();
}

document.getElementById('sim-game-btn').addEventListener('click', () => {
    if (gameState.roster.length < 5) {
        alert("You need at least 5 players to play a game!");
        return;
    }

    const teamRating = gameState.roster.reduce((sum, p) => sum + p.rating, 0) / gameState.roster.length;
    const opponentRating = 80 + Math.random() * 15;
    
    const winProb = 0.5 + (teamRating - opponentRating) / 40;
    const isWin = Math.random() < winProb;

    if (isWin) {
        gameState.wins++;
        addLog(`Victory! Defeated the opponent. Team Rating: ${teamRating.toFixed(1)}`);
    } else {
        gameState.losses++;
        addLog(`Loss. The opponent was too strong. Team Rating: ${teamRating.toFixed(1)}`);
    }
    updateUI();
});

function addLog(msg) {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.textContent = `[Game ${gameState.wins + gameState.losses}] ${msg}`;
    gameLog.prepend(div);
}
