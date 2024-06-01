document.addEventListener('DOMContentLoaded', () => {
    let flashTimeout;

    const grid = document.getElementById('grid');
    const startButton = document.getElementById('startButton');
    const levelDisplay = document.getElementById('level');
    const themesContainer = document.getElementById('themes');
    const resetButton = document.getElementById('resetButton');
    const winStreakDisplay = document.getElementById('winStreak');
    const dailyStreakDisplay = document.getElementById('dailyStreak');
    const confirmationPopup = document.getElementById('confirmationPopup');
    const confirmResetButton = document.getElementById('confirmReset');
    const cancelResetButton = document.getElementById('cancelReset');
    const allWinsDisplay = document.getElementById('allWins');
    const allLossesDisplay = document.getElementById('allLosses');
    const bestWinStreakDisplay = document.getElementById('bestWinStreak');
    const bestDailyStreakDisplay = document.getElementById('bestDailyStreak');
    const hardModeButton = document.getElementById('hardModeButton');

    let level = parseInt(localStorage.getItem('level')) || 1;
    let flashDuration = 1000;
    let activeCells = new Set();
    let clickedCells = new Set();
    let isFlashing = false;
    let gameActive = true;
    let equippedTheme = localStorage.getItem('equippedTheme') || 'Default';
    let purchasedThemes = JSON.parse(localStorage.getItem('purchasedThemes')) || { 'Default': true };
    let winStreak = parseInt(localStorage.getItem('winStreak')) || 0;
    let dailyStreak = parseInt(localStorage.getItem('dailyStreak')) || 0;
    let lastPlayedDate = localStorage.getItem('lastPlayedDate') || '';
    let allWins = parseInt(localStorage.getItem('allWins')) || 0;
    let allLosses = parseInt(localStorage.getItem('allLosses')) || 0;
    let bestWinStreak = parseInt(localStorage.getItem('bestWinStreak')) || 0;
    let bestDailyStreak = parseInt(localStorage.getItem('bestDailyStreak')) || 0;


    let hardMode = false;
    let hardLevel = parseInt(localStorage.getItem('hardLevel')) || 1;
    let hardWinStreak = parseInt(localStorage.getItem('hardWinStreak')) || 0;
    let hardDailyStreak = parseInt(localStorage.getItem('hardDailyStreak')) || 0;
    let hardAllWins = parseInt(localStorage.getItem('hardAllWins')) || 0;
    let hardAllLosses = parseInt(localStorage.getItem('hardAllLosses')) || 0;
    let hardBestWinStreak = parseInt(localStorage.getItem('hardBestWinStreak')) || 0;
    let hardBestDailyStreak = parseInt(localStorage.getItem('hardBestDailyStreak')) || 0;

    updateDisplays();

    const themes = {
        "themes": {
            "Default": {
                "css": `
                    :root {
                        --base-color: #555555;
                        --flash-color: #e6b800;
                        --correct-color: #33cc33;
                        --wrong-color: #cc0000;
                    }
                    body {
                        background-color: #1f1f1f;
                        opacity: 1;
                        background-image:
                        radial-gradient(#262626 2px, transparent 2px),
                        radial-gradient(#262626 2px, #1f1f1f 2px);
                        background-size: 5em 5em;
                        background-position: 0 0,40px 40px;
                    }
                    .sidebar {
                        box-shadow: 0 0 10px rgba(0, 0, 0, 1);
                        background-color: #151515;
                        opacity: 1;
                        background-image:
                        radial-gradient(#2a2a2a 2px, transparent 2px),
                        radial-gradient(#2a2a2a 2px, #151515 2px);
                        background-size: 80px 80px;
                        background-position: 0 0,40px 40px;
                    }
                    .grid-item.active {
                        background-color: var(--flash-color);
                        box-shadow: 0 0 10px var(--flash-color);
                    }
                    .grid-item.correct {
                        background-color: var(--correct-color);
                        box-shadow: 0 0 10px var(--correct-color);
                    }
                    .grid-item.wrong {
                        background-color: var(--wrong-color);
                        box-shadow: 0 0 10px var(--wrong-color);
                    }
                `
            },
            "Cotton": {
                "css": `
                    :root {
                        --base-color: #555555;
                        --flash-color: #CCD5FF;
                        --correct-color: #FFFFFF;
                        --wrong-color: #E7BBE3;
                    }
                    body {
                        background:
                        radial-gradient(circle, transparent 20%, #1f1f1f 20%, #1f1f1f 90%, transparent 90%, transparent),
                        radial-gradient(circle, transparent 20%, #1f1f1f 20%, #1f1f1f 90%, transparent 90%, transparent) 50px 50px,
                        linear-gradient(#262626 2px, transparent 2px) 0 -1px,
                        linear-gradient(90deg, #262626 2px, #1f1f1f 2px) -1px 0;
                        background-size: 100px 100px, 100px 100px, 50px 50px, 50px 50px;
                    }
                    .sidebar {
                        box-shadow: 0 0 10px #000;
                        background:
                        radial-gradient(circle, transparent 20%, #151515 20%, #151515 90%, transparent 90%, transparent),
                        radial-gradient(circle, transparent 20%, #151515 20%, #151515 90%, transparent 90%, transparent) 50px 50px,
                        linear-gradient(#2a2a2a 2px, transparent 2px) 0 -1px,
                        linear-gradient(90deg, #2a2a2a 2px, #151515 2px) -1px 0;
                        background-size: 100px 100px, 100px 100px, 50px 50px, 50px 50px;
                    }
                    .grid-item.active {
                        background-color: var(--flash-color);
                        box-shadow: 0 0 10px var(--flash-color);
                    }
                    .grid-item.correct {
                        background-color: var(--correct-color);
                        box-shadow: 0 0 10px var(--correct-color);
                    }
                    .grid-item.wrong {
                        background-color: var(--wrong-color);
                        box-shadow: 0 0 10px var(--wrong-color);
                    }
                `
            },
            "Phoenix": {
                "css": `
                    :root {
                        --base-color: #555555;
                        --flash-color: #FFAC00;
                        --correct-color: #FF7A00;
                        --wrong-color: #FF4200;
                    }
                    body {
                        background-image:  linear-gradient(#222 2.2px, transparent 2.2px), linear-gradient(to right, #222 2.2px, #1f1f1f 2.2px);
                        background-size: 4em 4em;
                    }
                    .sidebar {
                        box-shadow: 0 0 10px #000;
                        background-image:  linear-gradient(#1a1a1a 2.2px, transparent 2.2px), linear-gradient(to right, #1a1a1a 2.2px, #151515 2.2px);
                        background-size: 4em 4em;
                    }
                    .grid-item.active {
                        background-color: var(--flash-color);
                        box-shadow: 0 0 10px var(--flash-color);
                    }
                    .grid-item.correct {
                        background-color: var(--correct-color);
                        box-shadow: 0 0 10px var(--correct-color);
                    }
                    .grid-item.wrong {
                        background-color: var(--wrong-color);
                        box-shadow: 0 0 10px var(--wrong-color);
                    }
                `
            },
            "Ocean": {
                "css": `
                    :root {
                        --base-color: #555555;
                        --flash-color: #3270FF;
                        --correct-color: #32A8FF;
                        --wrong-color: #C151FF;
                    }
            
                    .sidebar {
                        box-shadow: 0 0 10px #000;
                        background-color: #151515;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        overflow: hidden;
                        background-color: #1f1f1f; /* Ensure dark background color */
                    }
            
            
                    .grid-item.active {
                        background-color: var(--flash-color);
                        box-shadow: 0 0 10px var(--flash-color);
                    }
            
                    .grid-item.correct {
                        background-color: var(--correct-color);
                        box-shadow: 0 0 10px var(--correct-color);
                    }
            
                    .grid-item.wrong {
                        background-color: var(--wrong-color);
                        box-shadow: 0 0 10px var(--wrong-color);
                    }
                    body::before,
                    body::after,
                    body::after::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 200%;
                        height: 200%;
                        background: linear-gradient(to right, #fff 25%, transparent 25%, transparent 50%, #fff 50%, #fff 75%, transparent 75%, transparent);
                        background-size: 50% 50%;
                        z-index: -1;
                        animation: wave 10s linear infinite;
                    }
            
                    body::before {
                        animation-delay: -2s;
                    }
            
                    body::after {
                        animation-delay: -4s;
                    }
            
                    body::after::after {
                        animation-delay: -6s;
                    }
            
                    @keyframes wave {
                        0% {
                            transform: translateX(0) translateY(0) rotate(0);
                        }
                        100% {
                            transform: translateX(-50%) translateY(-50%) rotate(360deg);
                        }
                    }
            
                    .rain {
                        position: absolute;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 2;
                        pointer-events: none; /* Ensure rain does not block interactions */
                    }
            
                    .rain.back-row {
                        display: none;
                        z-index: 1;
                        bottom: 60px;
                        opacity: 1;
                    }
            
                    body.back-row-toggle .rain.back-row {
                        display: block;
                    }
            
                    .drop {
                        position: absolute;
                        bottom: 100%;
                        width: 15px;
                        height: 120px;
                        pointer-events: none;
                        animation: drop 1s linear infinite;
                    }
            
                    @keyframes drop {
                        0% {
                            transform: translateY(0vh);
                        }
                        75% {
                            transform: translateY(90vh);
                        }
                        100% {
                            transform: translateY(90vh);
                        }
                    }
            
                    .stem {
                        width: 1px;
                        height: 60%;
                        margin-left: 7px;
                        background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.25));
                        animation: stem 0.5s linear infinite;
                    }
            
                    @keyframes stem {
                        0% {
                            opacity: 1;
                        }
                        65% {
                            opacity: 1;
                        }
                        75% {
                            opacity: 0;
                        }
                        100% {
                            opacity: 0;
                        }
                    }
            
                    .splat {
                        width: 15px;
                        height: 10px;
                        border-top: 2px dotted rgba(255, 255, 255, 0.5);
                        border-radius: 50%;
                        opacity: 1;
                        transform: scale(0);
                        animation: splat 0.5s linear infinite;
                        display: none;
                    }
            
                    body.splat-toggle .splat {
                        display: block;
                    }
            
                    @keyframes splat {
                        0% {
                            opacity: 1;
                            transform: scale(0);
                        }
                        80% {
                            opacity: 1;
                            transform: scale(0);
                        }
                        90% {
                            opacity: 0.5;
                            transform: scale(1);
                        100% {
                            opacity: 0;
                            transform: scale(1.5);
                        }
                    }
                `
            }
        }
    };

    const makeItRain = () => {
        const frontRow = document.querySelector('.rain.front-row');
        const backRow = document.querySelector('.rain.back-row');

        frontRow.innerHTML = '';
        backRow.innerHTML = '';

        let increment = 0;
        let drops = '';
        let backDrops = '';

        while (increment < 100) {
            const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
            const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
            increment += randoFiver;

            drops += `<div class="drop" style="left: ${increment}%; bottom: ${(randoFiver + randoFiver - 1 + 100)}%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
                        <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
                        <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
                      </div>`;
            backDrops += `<div class="drop" style="right: ${increment}%; bottom: ${(randoFiver + randoFiver - 1 + 100)}%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
                            <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
                            <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
                          </div>`;
        }

        frontRow.innerHTML = drops;
        backRow.innerHTML = backDrops;
    };


    function getGridSize(level) {
        return level <= 100 ? [3, 3] :
            level <= 250 ? [4, 3] :
                level <= 500 ? [4, 4] :
                    level <= 1000 ? [4, 5] : [5, 5];
    }

    function getFlashDuration(level) {
        return level <= 100 ? 1000 :
            level <= 250 ? 800 :
                level <= 500 ? 600 :
                    level <= 1000 ? 500 : 400;
    }



    function applyTheme(theme) {
        console.log(`Applying theme: ${theme}`);
        const themeData = themes.themes[theme];

        if (!themeData) {
            console.error(`Theme "${theme}" does not exist.`);
            return;
        }

        let style = document.getElementById('theme-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'theme-style';
            document.head.appendChild(style);
        }

        style.textContent = themeData.css;

        if (theme === 'Ocean') {
            makeItRain();
        }
    }




    function createGrid(rows, cols) {
        grid.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
        grid.style.gridTemplateRows = `repeat(${rows}, 100px)`;
        grid.innerHTML = '';

        for (let i = 0; i < rows * cols; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-item');
            cell.style.backgroundPosition = `${(i % cols) * (100 / (cols - 1))}% ${(Math.floor(i / cols)) * (100 / (rows - 1))}%`;
            cell.addEventListener('click', handleCellClick);
            cell.dataset.clicked = "false";
            grid.appendChild(cell);
        }
    }

    function startGame() {
        level = 1;
        updateDisplays();
        clickedCells.clear();
        gameActive = true;
        const [rows, cols] = getGridSize(level);
        flashDuration = getFlashDuration(level);
        createGrid(rows, cols);
        flashRandomCells();

        updateDailyStreak();
    }

    function startHardGame() {
        hardLevel = 1;
        updateDisplays();
        clickedCells.clear();
        gameActive = true;
        const [rows, cols] = getGridSize(hardLevel);
        flashDuration = getFlashDuration(hardLevel);
        createGrid(rows, cols);
        flashRandomCells(true);

        updateDailyStreak();
    }

    function restartLevel() {
        clickedCells.clear();
        const [rows, cols] = getGridSize(level);
        flashDuration = getFlashDuration(level);
        setTimeout(() => {
            createGrid(rows, cols);
            flashRandomCells();
            gameActive = true;
        }, 1000);
    }

    function restartHardLevel() {
        clickedCells.clear();
        const [rows, cols] = getGridSize(hardLevel);
        flashDuration = getFlashDuration(hardLevel);
        setTimeout(() => {
            createGrid(rows, cols);
            flashRandomCells(true);
            gameActive = true;
        }, 1000);
    }

    function nextLevel() {
        level++;
        localStorage.setItem('level', level);
        updateDisplays();
        clickedCells.clear();
        const [rows, cols] = getGridSize(level);
        flashDuration = getFlashDuration(level);

        createGrid(rows, cols);
        flashRandomCells();
        gameActive = true;

        updateStreaksAndWins();

        if (winStreak >= 500 && !purchasedThemes["Cotton"]) {
            purchasedThemes["Cotton"] = true;
            localStorage.setItem('newlyUnlockedTheme', "Cotton");
        }
        if (dailyStreak >= 30 && !purchasedThemes["Ocean"]) {
            purchasedThemes["Ocean"] = true;
            localStorage.setItem('newlyUnlockedTheme', "Ocean");
        }
        localStorage.setItem('purchasedThemes', JSON.stringify(purchasedThemes));
        updateShop();
    }

    function nextHardLevel() {
        hardLevel++;
        localStorage.setItem('hardLevel', hardLevel);
        updateDisplays();
        clickedCells.clear();
        const [rows, cols] = getGridSize(hardLevel);
        flashDuration = getFlashDuration(hardLevel);

        createGrid(rows, cols);
        flashRandomCells(true);
        gameActive = true;

        updateHardStreaksAndWins();

        if (hardWinStreak >= 100 && !purchasedThemes["Phoenix"]) {
            purchasedThemes["Phoenix"] = true;
            localStorage.setItem('newlyUnlockedTheme', "Phoenix");
        }
        if (hardDailyStreak >= 30 && !purchasedThemes["Ocean"]) {
            purchasedThemes["Ocean"] = true;
            localStorage.setItem('newlyUnlockedTheme', "Ocean");
        }
        localStorage.setItem('purchasedThemes', JSON.stringify(purchasedThemes));
        updateShop();
    }

    function flashRandomCells(hardMode = false) {
        isFlashing = true;
        activeCells.clear();
        clickedCells.clear();
        const cells = Array.from(document.querySelectorAll('.grid-item'));
        const numberOfFlashes = Math.floor(Math.random() * (cells.length / 2)) + 2

        let randomCells = [];
        while (randomCells.length < numberOfFlashes) {
            const randomIndex = Math.floor(Math.random() * cells.length);
            if (!randomCells.includes(randomIndex)) {
                randomCells.push(randomIndex);
            }
        }

        randomCells.forEach((index, i) => {
            const cell = cells[index];
            activeCells.add(cell);
            cell.dataset.number = i + 1;
            if (hardMode) {
                cell.innerHTML = `<span>${i + 1}</span>`;
            }
            cell.classList.add('active');
        });

        flashTimeout = setTimeout(() => {
            activeCells.forEach(cell => {
                cell.classList.remove('active');
                if (hardMode) {
                    cell.innerHTML = '';
                }
            });
            isFlashing = false;
        }, flashDuration);
    }

    function handleCellClick(event) {
        if (!gameActive || isFlashing) {
            return;
        }

        const clickedCell = event.target;
        if (clickedCell.dataset.clicked === "true") {
            return;
        }

        clickedCell.dataset.clicked = "true";
        if (hardMode) {
            const expectedNumber = clickedCells.size + 1;
            if (parseInt(clickedCell.dataset.number) !== expectedNumber) {
                clickedCell.classList.add('wrong');
                gameActive = false;
                setTimeout(restartHardLevel, 200);
                hardWinStreak = 0;
                localStorage.setItem('hardWinStreak', hardWinStreak);
                winStreakDisplay.textContent = hardWinStreak;

                hardAllLosses++;
                localStorage.setItem('hardAllLosses', hardAllLosses);
                allLossesDisplay.textContent = hardAllLosses;
                return;
            } else {
                clickedCell.classList.add('correct');
                clickedCell.innerHTML = `<span>${clickedCell.dataset.number}</span>`;
            }
        } else {
            if (activeCells.has(clickedCell)) {
                clickedCell.classList.add('correct');
            } else {
                clickedCell.classList.add('wrong');
                gameActive = false;
                setTimeout(restartLevel, 200);
                winStreak = 0;
                localStorage.setItem('winStreak', winStreak);
                winStreakDisplay.textContent = winStreak;

                allLosses++;
                localStorage.setItem('allLosses', allLosses);
                allLossesDisplay.textContent = allLosses;
                return;
            }
        }
        clickedCells.add(clickedCell);

        if (clickedCells.size === activeCells.size) {
            gameActive = false;
            if (hardMode) {
                setTimeout(nextHardLevel, 200);
            } else {
                setTimeout(nextLevel, 200);
            }
        }
    }

    function updateDisplays() {
        levelDisplay.textContent = `Level: ${hardMode ? hardLevel : level} ${hardMode ? '✪' : ''}`;
        winStreakDisplay.textContent = hardMode ? hardWinStreak : winStreak;
        dailyStreakDisplay.textContent = hardMode ? hardDailyStreak : dailyStreak;
        allWinsDisplay.textContent = hardMode ? hardAllWins : allWins;
        allLossesDisplay.textContent = hardMode ? hardAllLosses : allLosses;
        bestWinStreakDisplay.textContent = hardMode ? hardBestWinStreak : bestWinStreak;
        bestDailyStreakDisplay.textContent = hardMode ? hardBestDailyStreak : bestDailyStreak;
    }

    function updateStreaksAndWins() {
        winStreak++;
        localStorage.setItem('winStreak', winStreak);
        winStreakDisplay.textContent = winStreak;

        allWins++;
        localStorage.setItem('allWins', allWins);
        allWinsDisplay.textContent = allWins;

        if (winStreak > bestWinStreak) {
            bestWinStreak = winStreak;
            localStorage.setItem('bestWinStreak', bestWinStreak);
            bestWinStreakDisplay.textContent = bestWinStreak;
        }

        if (dailyStreak > bestDailyStreak) {
            bestDailyStreak = dailyStreak;
            localStorage.setItem('bestDailyStreak', bestDailyStreak);
            bestDailyStreakDisplay.textContent = bestDailyStreak;
        }
    }

    function updateHardStreaksAndWins() {
        hardWinStreak++;
        localStorage.setItem('hardWinStreak', hardWinStreak);
        winStreakDisplay.textContent = hardWinStreak;

        hardAllWins++;
        localStorage.setItem('hardAllWins', hardAllWins);
        allWinsDisplay.textContent = hardAllWins;

        if (hardWinStreak > hardBestWinStreak) {
            hardBestWinStreak = hardWinStreak;
            localStorage.setItem('hardBestWinStreak', hardBestWinStreak);
            bestWinStreakDisplay.textContent = hardBestWinStreak;
        }

        if (hardDailyStreak > hardBestDailyStreak) {
            hardBestDailyStreak = hardDailyStreak;
            localStorage.setItem('hardBestDailyStreak', hardBestDailyStreak);
            bestDailyStreakDisplay.textContent = hardBestDailyStreak;
        }
    }

    function updateDailyStreak() {
        const today = new Date().toISOString().split('T')[0];

        if (lastPlayedDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toISOString().split('T')[0];

            if (lastPlayedDate === yesterdayString) {
                if (hardMode) {
                    hardDailyStreak++;
                    localStorage.setItem('hardDailyStreak', hardDailyStreak);
                    dailyStreakDisplay.textContent = hardDailyStreak;
                } else {
                    dailyStreak++;
                    localStorage.setItem('dailyStreak', dailyStreak);
                    dailyStreakDisplay.textContent = dailyStreak;
                }
            } else {
                if (hardMode) {
                    hardDailyStreak = 1;
                    localStorage.setItem('hardDailyStreak', hardDailyStreak);
                    dailyStreakDisplay.textContent = hardDailyStreak;
                } else {
                    dailyStreak = 1;
                    localStorage.setItem('dailyStreak', dailyStreak);
                    dailyStreakDisplay.textContent = dailyStreak;
                }
            }

            localStorage.setItem('lastPlayedDate', today);
            lastPlayedDate = today;

            if (hardMode) {
                updateHardStreaksAndWins();
            } else {
                updateStreaksAndWins();
            }
        }
    }

    function updateShop() {
        console.log('Updating shop...');
        themesContainer.innerHTML = '';

        // Define unlock requirements for each theme
        const unlockRequirements = {
            "Cotton": 500, // normal winstreak required
            "Ocean": 30, // daily streak required
            "Phoenix": 100 // hard mode winstreak required
        };

        for (const [themeName, themeData] of Object.entries(themes.themes)) {
            const themeButton = document.createElement('button');
            themeButton.classList.add('shop-item');
            themeButton.textContent = themeName;

            if (purchasedThemes[themeName]) {
                if (themeName === equippedTheme) {
                    themeButton.textContent += '\nEquipped';
                    themeButton.classList.add('equipped');
                } else if (localStorage.getItem('newlyUnlockedTheme') === themeName) {
                    themeButton.textContent += '\nUnlocked';
                    themeButton.classList.add('unlocked');
                } else {
                    themeButton.textContent += '\nEquip';
                }
            } else {
                themeButton.classList.add('locked');
                let progress = 0;
                if (unlockRequirements[themeName]) {
                    let currentProgress = 0;
                    if (themeName === "Cotton") {
                        currentProgress = winStreak;
                    } else if (themeName === "Ocean") {
                        currentProgress = dailyStreak;
                    } else if (themeName === "Phoenix") {
                        currentProgress = hardWinStreak;
                    }
                    progress = (currentProgress / unlockRequirements[themeName]) * 100;
                }
                themeButton.textContent += `\nLocked ${progress.toFixed(1)}%`;
            }

            themeButton.addEventListener('click', () => handleThemePurchase(themeName));
            themesContainer.appendChild(themeButton);
        }
    }

    function handleThemePurchase(themeName) {
        if (purchasedThemes[themeName]) {
            equippedTheme = themeName;
            localStorage.setItem('equippedTheme', equippedTheme);


            if (localStorage.getItem('newlyUnlockedTheme') === themeName) {
                localStorage.removeItem('newlyUnlockedTheme');
            }
        }
        updateShop();
        applyTheme(equippedTheme);
    }

    function resetStats() {
        level = 1;
        purchasedThemes = { 'Default': true };
        equippedTheme = 'Default';
        winStreak = 0;
        dailyStreak = 0;
        lastPlayedDate = '';
        allWins = 0;
        allLosses = 0;
        bestWinStreak = 0;
        bestDailyStreak = 0;


        hardLevel = 1;
        hardWinStreak = 0;
        hardDailyStreak = 0;
        hardAllWins = 0;
        hardAllLosses = 0;
        hardBestWinStreak = 0;
        hardBestDailyStreak = 0;

        localStorage.setItem('level', level);
        localStorage.setItem('purchasedThemes', JSON.stringify(purchasedThemes));
        localStorage.setItem('equippedTheme', equippedTheme);
        localStorage.setItem('winStreak', winStreak);
        localStorage.setItem('dailyStreak', dailyStreak);
        localStorage.setItem('lastPlayedDate', lastPlayedDate);
        localStorage.setItem('allWins', allWins);
        localStorage.setItem('allLosses', allLosses);
        localStorage.setItem('bestWinStreak', bestWinStreak);
        localStorage.setItem('bestDailyStreak', bestDailyStreak);

        localStorage.setItem('hardLevel', hardLevel);
        localStorage.setItem('hardWinStreak', hardWinStreak);
        localStorage.setItem('hardDailyStreak', hardDailyStreak);
        localStorage.setItem('hardAllWins', hardAllWins);
        localStorage.setItem('hardAllLosses', hardAllLosses);
        localStorage.setItem('hardBestWinStreak', hardBestWinStreak);
        localStorage.setItem('hardBestDailyStreak', hardBestDailyStreak);

        updateDisplays();
        updateShop();
        applyTheme(equippedTheme);
        startButton.style.display = 'block';
    }

    startButton.addEventListener('click', () => {
        if (hardMode) {
            startHardGame();
        } else {
            startGame();
        }
    });

    resetButton.addEventListener('click', () => {
        confirmationPopup.style.display = 'flex';
    });

    confirmResetButton.addEventListener('click', () => {
        resetStats();
        confirmationPopup.style.display = 'none';
    });

    cancelResetButton.addEventListener('click', () => {
        confirmationPopup.style.display = 'none';
    });

    hardModeButton.addEventListener('click', () => {
        hardModeButton.disabled = true;
        hardMode = !hardMode;
        updateDisplays();


        hardModeButton.textContent = hardMode ? 'Toggle Normal Mode' : 'Toggle Hard Mode';


        clearTimeout(flashTimeout);


        if (hardMode) {
            const [rows, cols] = getGridSize(hardLevel);
            flashDuration = getFlashDuration(hardLevel);
            createGrid(rows, cols);
            flashRandomCells(true);
        } else {
            const [rows, cols] = getGridSize(level);
            flashDuration = getFlashDuration(level);
            createGrid(rows, cols);
            flashRandomCells();
        }

        setTimeout(() => {
            hardModeButton.disabled = false;
        }, 1000);
    });

    const [rows, cols] = getGridSize(level);
    flashDuration = getFlashDuration(level);
    createGrid(rows, cols);
    flashRandomCells();
    startButton.style.display = 'none';
    applyTheme(equippedTheme);
    updateShop();
});
