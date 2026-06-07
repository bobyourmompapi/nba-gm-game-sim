const ALL_LEGENDS = [
    { id: 1, name: "Michael Jordan", pos: "SG", rating: 99, shooting: 98, defense: 99, playmaking: 85, physical: 99, cost: 45000000, desc: "The GOAT. Unmatched scoring and perimeter defense." },
    { id: 2, name: "LeBron James", pos: "SF", rating: 98, shooting: 85, defense: 90, playmaking: 99, physical: 99, cost: 42000000, desc: "A freight train with the IQ of a grandmaster." },
    { id: 3, name: "Kareem Abdul-Jabbar", pos: "C", rating: 98, shooting: 95, defense: 96, playmaking: 70, physical: 94, cost: 40000000, desc: "The skyhook is unguardable. Master of the post." },
    { id: 4, name: "Magic Johnson", pos: "PG", rating: 97, shooting: 80, defense: 85, playmaking: 99, physical: 92, cost: 38000000, desc: "Showtime leader. Can see plays before they happen." },
    { id: 5, name: "Larry Bird", pos: "SF", rating: 96, shooting: 99, defense: 88, playmaking: 95, physical: 80, cost: 36000000, desc: "Cold-blooded shooter and legendary trash talker." },
    { id: 6, name: "Shaquille O'Neal", pos: "C", rating: 96, shooting: 50, defense: 92, playmaking: 60, physical: 99, cost: 35000000, desc: "The most dominant force to ever play the game." },
    { id: 7, name: "Kobe Bryant", pos: "SG", rating: 95, shooting: 94, defense: 95, playmaking: 82, physical: 93, cost: 34000000, desc: "Mamba Mentality. Five rings, zero quit." },
    { id: 8, name: "Tim Duncan", pos: "PF", rating: 94, shooting: 85, defense: 98, playmaking: 75, physical: 88, cost: 30000000, desc: "The Big Fundamental. A defensive anchor." },
    { id: 9, name: "Stephen Curry", pos: "PG", rating: 93, shooting: 99, defense: 75, playmaking: 90, physical: 82, cost: 32000000, desc: "Greatest shooter ever. Changed the game forever." },
    { id: 10, name: "Kevin Durant", pos: "SF", rating: 94, shooting: 98, defense: 88, playmaking: 80, physical: 90, cost: 33000000, desc: "A 7-foot guard. Unguardable scoring range." },
    { id: 11, name: "Giannis Antetokounmpo", pos: "PF", rating: 92, shooting: 70, defense: 95, playmaking: 80, physical: 99, cost: 28000000, desc: "The Greek Freak. Unstoppable in transition." },
    { id: 12, name: "Hakeem Olajuwon", pos: "C", rating: 96, shooting: 88, defense: 99, playmaking: 75, physical: 95, cost: 35000000, desc: "The Dream Shake. Greatest footwork in history." },
    { id: 13, name: "Wilt Chamberlain", pos: "C", rating: 97, shooting: 75, defense: 96, playmaking: 80, physical: 99, cost: 38000000, desc: "The man of 100 points. Physical anomaly." },
    { id: 14, name: "Bill Russell", pos: "C", rating: 95, shooting: 60, defense: 99, playmaking: 70, physical: 94, cost: 30000000, desc: "11 rings. The ultimate winner and defender." }
];

let gameState = {
    teamCity: "",
    teamName: "",
    budget: 120000000,
    wins: 0,
    losses: 0,
    roster: [],
    market: [...ALL_LEGENDS],
    trainingPoints: 10,
    chemistry: 0
};

// UI Elements
const setupScreen = document.getElementById('setup-screen');
const mainScreen = document.getElementById('main-screen');
const rosterList = document.getElementById('roster-list');
const marketList = document.getElementById('market-list');
const gameLog = document.getElementById('game-log');

// Initialization
document.getElementById('start-game-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value || "Metro";
    gameState.teamCity = city;
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

function calculateTeamRatings() {
    if (gameState.roster.length === 0) return { off: 0, def: 0, chem: 0 };
    
    const off = gameState.roster.reduce((sum, p) => sum + (p.shooting + p.playmaking) / 2, 0) / gameState.roster.length;
    const def = gameState.roster.reduce((sum, p) => sum + (p.defense + p.physical) / 2, 0) / gameState.roster.length;
    
    // Chemistry bonus: increases with roster stability (simplified: more players = more potential synergy)
    const chem = Math.min(100, (gameState.roster.length * 15) + (gameState.wins * 2));
    
    return { off: off.toFixed(1), def: def.toFixed(1), chem: chem };
}

function updateUI() {
    const ratings = calculateTeamRatings();
    
    document.getElementById('team-name').textContent = gameState.teamName;
    document.getElementById('budget').textContent = \`$\${(gameState.budget / 1000000).toFixed(1)}M\`;
    document.getElementById('record').textContent = \`\${gameState.wins} - \${gameState.losses}\`;
    
    document.getElementById('off-rating').textContent = ratings.off;
    document.getElementById('def-rating').textContent = ratings.def;
    document.getElementById('chem-rating').textContent = ratings.chem + "%";

    renderRoster();
    renderMarket();
}

function renderRoster() {
    rosterList.innerHTML = gameState.roster.length ? '' : '<p style="grid-column: 1/-1; text-align: center; padding: 50px;">Your roster is empty. Go to the Trade Market to sign legends.</p>';
    gameState.roster.forEach(player => {
        const card = createPlayerCard(player, true);
        rosterList.appendChild(card);
    });
}

function renderMarket() {
    marketList.innerHTML = '';
    gameState.market.forEach(player => {
        const card = createPlayerCard(player, false);
        marketList.appendChild(card);
    });
}

function createPlayerCard(player, isRoster) {
    const div = document.createElement('div');
    div.className = 'player-card';
    div.innerHTML = \`
        <div class="card-header">
            <span class="player-pos">\${player.pos}</span>
            <span class="player-rating-badge">\${player.rating}</span>
        </div>
        <div class="player-name">\${player.name}</div>
        <div class="player-desc">\${player.desc}</div>
        <div class="stats-grid">
            <div class="mini-stat"><label>SHT</label><span>\${player.shooting}</span></div>
            <div class="mini-stat"><label>DEF</label><span>\${player.defense}</span></div>
            <div class="mini-stat"><label>PLY</label><span>\${player.playmaking}</span></div>
            <div class="mini-stat"><label>PHY</label><span>\${player.physical}</span></div>
        </div>
        <div class="card-footer">
            <span class="player-price">$\${(player.cost / 1000000).toFixed(1)}M</span>
            <div style="display: flex; gap: 5px;">
                \${isRoster ? \`<button class="btn-action btn-train" onclick="trainPlayer(\${player.id})">TRAIN</button>\` : ''}
                <button class="btn-action" onclick="\${isRoster ? \`releasePlayer(\${player.id})\` : \`signPlayer(\${player.id})\`}">\${isRoster ? 'WAIVE' : 'SIGN'}</button>
            </div>
        </div>
    \`;
    return div;
}

window.signPlayer = function(id) {
    const idx = gameState.market.findIndex(p => p.id === id);
    const p = gameState.market[idx];
    if (gameState.budget >= p.cost) {
        gameState.budget -= p.cost;
        gameState.roster.push(p);
        gameState.market.splice(idx, 1);
        updateUI();
    } else {
        alert("Salary cap exceeded!");
    }
}

window.releasePlayer = function(id) {
    const idx = gameState.roster.findIndex(p => p.id === id);
    const p = gameState.roster[idx];
    gameState.budget += p.cost;
    gameState.market.push(p);
    gameState.roster.splice(idx, 1);
    updateUI();
}

window.trainPlayer = function(id) {
    const p = gameState.roster.find(p => p.id === id);
    if (p.rating < 99) {
        p.shooting = Math.min(99, p.shooting + 1);
        p.defense = Math.min(99, p.defense + 1);
        p.rating = Math.floor((p.shooting + p.defense + p.playmaking + p.physical) / 4);
        updateUI();
    }
}

document.getElementById('sim-game-btn').addEventListener('click', async () => {
    if (gameState.roster.length < 5) {
        alert("You need at least 5 legends for a valid rotation!");
        return;
    }

    const btn = document.getElementById('sim-game-btn');
    btn.disabled = true;
    gameLog.innerHTML = '';
    
    const ratings = calculateTeamRatings();
    const oppOff = 85 + Math.random() * 10;
    const oppDef = 85 + Math.random() * 10;
    
    let userScore = 0;
    let oppScore = 0;

    for (let q = 1; q <= 4; q++) {
        await addLogEntry(\`--- QUARTER \${q} ---\`, 'quarter');
        await sleep(600);

        const qUser = Math.floor((ratings.off / 4) + (Math.random() * 10) + (ratings.chem / 20));
        const qOpp = Math.floor((oppOff / 4) + (Math.random() * 10));

        userScore += qUser;
        oppScore += qOpp;

        const highlights = [
            \`\${gameState.roster[Math.floor(Math.random()*gameState.roster.length)].name} hits a clutch jumper!\`,
            \`Excellent team defense leads to a fast break.\`,
            \`Physical play in the paint is defining this quarter.\`,
            \`Ball movement is looking \${ratings.chem > 50 ? 'fluid' : 'clunky'}.\`
        ];
        
        await addLogEntry(highlights[Math.floor(Math.random()*highlights.length)]);
        await addLogEntry(\`Score: \${gameState.teamCity} \${userScore} - Opponent \${oppScore}\`, 'score');
        await sleep(800);
    }

    if (userScore >= oppScore) {
        gameState.wins++;
        await addLogEntry("FINAL: VICTORY!", 'quarter');
    } else {
        gameState.losses++;
        await addLogEntry("FINAL: DEFEAT", 'quarter');
    }

    btn.disabled = false;
    updateUI();
});

async function addLogEntry(text, className = '') {
    const entry = document.createElement('div');
    entry.className = 'log-entry ' + className;
    entry.textContent = text;
    gameLog.prepend(entry);
    gameLog.scrollTop = 0;
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
