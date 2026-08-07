// script.js - Gut lesbare System-Texte & Automatische Quest-Start-Engine (Inkl. Vollständiger Forschungs-Sicherung)

const storyDialogs = [
    "Hallo? Kannst du mich hören? Oh je... das ist jetzt echt peinlich.",
    "Ich bin die System-KI des Universums. Mir ist da ein kleiner Fehler unterlaufen...",
    "Und naja... du bist in deiner alten Welt versehentlich gelöscht worden. Mein Fehler! Sorry!",
    "Als Entschädigung habe ich deine Seele in dieser wunderschönen Pixel-Farming-Welt wiedergeboren!",
    "Hier ist dein neues, friedliches Leben. Lass uns direkt anfangen!"
];

let currentDialogIndex = 0;
let player = { name: "Mathias", level: 1, xp: 0, xpNeeded: 100, gold: 100 };
let inventory = {};
let currentTabActive = 0;
let activeTimers = {};
let globalAudioCtx = null;

// SOWND-SYNTHESIZER-ENGINE
function playSound(type) {
    if (!globalAudioCtx) {
        globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume();
    }

    const oscillator = globalAudioCtx.createOscillator();
    const gainNode = globalAudioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(globalAudioCtx.destination);
    const now = globalAudioCtx.currentTime;

    if (type === 'click') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, now);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        oscillator.start(now); oscillator.stop(now + 0.05);
    } 
    else if (type === 'tab') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, now);
        oscillator.frequency.setValueAtTime(450, now + 0.04);
        gainNode.gain.setValueAtTime(0.06, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now); oscillator.stop(now + 0.1);
    } 
    else if (type === 'buy') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.exponentialRampToValueAtTime(350, now + 0.08);
        gainNode.gain.setValueAtTime(0.03, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now); oscillator.stop(now + 0.1);
    } 
    else if (type === 'sell') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, now);
        oscillator.frequency.setValueAtTime(1320, now + 0.06);
        gainNode.gain.setValueAtTime(0.07, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now); oscillator.stop(now + 0.2);
    } 
    else if (type === 'levelup') {
        oscillator.type = 'triangle';
        const notes = [261.6, 329.6, 392.0, 523.3, 659.3];
        notes.forEach((freq, index) => {
            oscillator.frequency.setValueAtTime(freq, now + (index * 0.08));
        });
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        oscillator.start(now); oscillator.stop(now + 0.6);
    }
}

// POP-UP FENSTER IN DER MITTE DES BILDSCHIRMS
function showCustomModal(title, message, icon = "🎉", soundType = "levelup") {
    playSound(soundType);
    let existingModal = document.getElementById('custom-modal-overlay');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'custom-modal-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.8); display: flex; justify-content: center;
        align-items: center; z-index: 99999; backdrop-filter: blur(5px);
    `;

    const box = document.createElement('div');
    box.style.cssText = `
        background: linear-gradient(145deg, #1e1e2f, #2a2a40); border: 3px solid #ffd700;
        border-radius: 16px; padding: 25px 30px; max-width: 450px; width: 85%;
        text-align: center; color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        animation: popupAnim 0.3s ease-out forwards;
    `;

    box.innerHTML = `
        <div style="font-size: 50px; margin-bottom: 10px;">${icon}</div>
        <h2 style="margin: 0 0 10px 0; color: #ffd700; font-size: 22px; font-family: sans-serif;">${title}</h2>
        <div style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.5; color: #ffffff; font-family: sans-serif;">${message}</div>
        <button id="modal-close-btn" style="
            background: linear-gradient(180deg, #4CAF50, #2E7D32); color: white;
            border: none; padding: 12px 28px; font-size: 16px; font-weight: bold;
            border-radius: 8px; cursor: pointer;
        ">OK / Weiter ➔</button>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    document.getElementById('modal-close-btn').addEventListener('click', () => {
        playSound('click');
        overlay.remove();
    });
}

const styleSheet = document.createElement("style");
styleSheet.innerText = `@keyframes popupAnim { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }`;
document.head.appendChild(styleSheet);

// HTML ELEMENTE LADEN
const dialogTextElement = document.getElementById('dialog-text');
const nextArrowBtn = document.getElementById('next-arrow-btn');
const nameFormGroup = document.getElementById('name-form-group');
const startGameBtn = document.getElementById('start-game-btn');
const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');

const playerNameDisplay = document.getElementById('player-name');
const playerNameInput = document.getElementById('player-name-input');
const playerLevelDisplay = document.getElementById('player-level');
const playerXpDisplay = document.getElementById('player-xp');
const playerGoldDisplay = document.getElementById('player-gold');

const fieldSection = document.getElementById('field-section');
const tabTitle = document.getElementById('tab-title');

nextArrowBtn.addEventListener('click', () => {
    playSound('click');
    currentDialogIndex++;
    if (currentDialogIndex < storyDialogs.length) {
        dialogTextElement.textContent = `"${storyDialogs[currentDialogIndex]}"`;
    } else {
        nextArrowBtn.classList.add('hidden');
        nameFormGroup.classList.remove('hidden');
        startGameBtn.classList.remove('hidden');
    }
});

startGameBtn.addEventListener('click', () => {
    playSound('levelup');
    let chosenName = playerNameInput.value.trim();
    if (chosenName === "") chosenName = "Mathias";
    player.name = chosenName;
    inventory.moehren = 15;

    initGameSession();
});

// STARTET ODER SETZT DAS SPIEL FORT
function initGameSession() {
    updateUI();
    introScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    createFloatingQuestButton();
    renderCurrentTab();
    
    if (!window.gameIntervalsStarted) {
        setInterval(gameTick, 1000);
        setInterval(saveGame, 5000);
        window.gameIntervalsStarted = true;
    }

    // AUTOMATISCHER QUEST-START BEI SPIELSTART
    setTimeout(() => {
        triggerActiveQuestPopup();
    }, 2000);
}

// Prüft das aktuellste offene Kapitel und öffnet es automatisch als Popup
function triggerActiveQuestPopup() {
    let activeChapter = storyChapters.find(c => c.unlocked && !c.quest.completed);
    if (activeChapter) {
        readStoryDialog(activeChapter.id);
    }
}

// PRÜFT BEIM LADEN DER SEITE OB BEREITS EIN SPIELSTAND EXISTIERT
window.addEventListener('DOMContentLoaded', () => {
    let hasSave = loadGame();
    if (hasSave) {
        initGameSession();
    }
});

function createFloatingQuestButton() {
    if (document.getElementById('floating-quest-btn')) return;
    const qBtn = document.createElement('button');
    qBtn.id = 'floating-quest-btn';
    qBtn.innerHTML = `📜 [Q] Quests`;
    qBtn.onclick = toggleQuestTab;
    document.body.appendChild(qBtn);
}

function toggleQuestTab() {
    playSound('tab');
    if (currentTabActive === 8) {
        currentTabActive = 0;
    } else {
        currentTabActive = 8;
    }
    
    document.querySelectorAll('.tab-btn').forEach((btn, idx) => {
        if (idx === currentTabActive) btn.classList.add('active');
        else btn.classList.remove('active');
    });
    
    renderCurrentTab();
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'q' || e.key === 'Q') {
        if (!gameScreen.classList.contains('hidden')) {
            toggleQuestTab();
        }
    }
});

function updateUI() {
    playerNameDisplay.textContent = player.name;
    playerLevelDisplay.textContent = player.level;
    playerGoldDisplay.textContent = formatNumber(player.gold);
    playerXpDisplay.textContent = formatNumber(player.xp);
}

function formatNumber(num) {
    if (num >= 1e18) return (num / 1e18).toFixed(2) + " Qi";
    if (num >= 1e15) return (num / 1e15).toFixed(2) + " Qa";
    if (num >= 1e12) return (num / 1e12).toFixed(2) + " Bio";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + " Mrd";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + " Mio";
    if (num >= 1000) return num.toLocaleString('de-DE');
    return num;
}

function replacePlayerName(str) {
    if (!str) return "";
    return str.replaceAll('{PLAYER_NAME}', player.name);
}

document.querySelectorAll('.tab-btn').forEach((button, index) => {
    button.addEventListener('click', () => {
        playSound('tab');
        document.querySelector('.tab-btn.active')?.classList.remove('active');
        button.classList.add('active');
        currentTabActive = index;
        renderCurrentTab();
    });
});

function renderCurrentTab() {
    if (currentTabActive === 0) {
        tabTitle.textContent = "Dein Gemüsebeet";
        renderGenericGrid(crops, "crops");
    } else if (currentTabActive === 1) {
        tabTitle.textContent = "Dein Obstgarten";
        renderGenericGrid(trees, "trees");
    } else if (currentTabActive === 2) {
        tabTitle.textContent = "🐔 Tiere & Bruthaus";
        renderGenericGrid(animals, "animals");
    } else if (currentTabActive === 3) {
        tabTitle.textContent = "⛏️ Die königliche Mine";
        renderGenericGrid(ores, "ores");
    } else if (currentTabActive === 4) {
        tabTitle.textContent = "🍳 Die Isekai-Küche";
        renderGenericGrid(kitchen, "kitchen");
    } else if (currentTabActive === 5) {
        tabTitle.textContent = "⚔️ Abenteurergilde & Monster";
        renderGenericGrid(gilde, "gilde");
    } else if (currentTabActive === 6) {
        tabTitle.textContent = "🔮 Alchemie-Labor";
        renderGenericGrid(alchemie, "alchemie");
    } else if (currentTabActive === 7) {
        tabTitle.textContent = "👑 Deine Heldinnen";
        renderHeroinesTab();
    } else if (currentTabActive === 8) {
        tabTitle.textContent = "📜 Geschichte & Quests";
        renderStoryTab();
    } else if (currentTabActive === 9) {
        tabTitle.textContent = "⚙️ System-Einstellungen & Speichern";
        renderSettingsTab();
    }
}

function getItemIcon(itemKey) {
    if (crops[itemKey]) return crops[itemKey].icon;
    if (trees[itemKey]) return trees[itemKey].icon;
    if (animals[itemKey]) return animals[itemKey].icon;
    if (ores[itemKey]) return ores[itemKey].icon;
    if (kitchen[itemKey]) return kitchen[itemKey].icon;
    if (alchemie[itemKey]) return alchemie[itemKey].icon;
    if (gilde[itemKey]) return gilde[itemKey].icon;
    return "📦";
}

function renderGenericGrid(dataSource, listName) {
    let html = `<div class="crop-grid" id="scroll-grid">`;
    for (let key in dataSource) {
        let item = dataSource[key];
        let count = inventory[key] || 0;
        let timerKey = listName + "_" + key;
        
        if (item.unlocked) {
            let inventoryLabel = "Im Besitz:";
            if (listName === "ores") inventoryLabel = "Im Lager:";
            if (listName === "animals") inventoryLabel = "Im Stall:";
            if (listName === "kitchen") inventoryLabel = "Zubereitet:";
            if (listName === "alchemie") inventoryLabel = "Gebraut:";

            html += `
                <div class="crop-card">
                    <span class="crop-icon">${item.icon}</span>
                    <h4>${item.name}</h4>
                    <p class="crop-desc">${item.description}</p>
                    <p>${inventoryLabel} 📦 <strong id="count-${listName}-${key}">${formatNumber(count)}</strong></p>
                    <div id="btn-container-${listName}-${key}">
                        ${getActionButtonHtml(listName, key, item, timerKey)}
                    </div>
                    <button class="btn-sell" id="sell-${listName}-${key}" onclick="sellItem('${listName}', '${key}')" ${count === 0 ? 'disabled' : ''}>Verkaufen (+💰${formatNumber(item.rewardGold)})</button>
                </div>
            `;
        } else {
            if (item.researchCost) {
                let costItemIcon = crops[item.researchCost.item] ? crops[item.researchCost.item].icon : "📦";
                let goldText = item.researchCost.gold ? ` + 💰${formatNumber(item.researchCost.gold)}` : '';
                html += `
                    <div class="crop-card locked">
                        <span class="crop-icon">🔒</span>
                        <h4>Forschung: ${item.name}</h4>
                        <p class="crop-desc">Analyse läuft...</p>
                        <p>Benötigt: ${item.researchCost.amount}x ${costItemIcon}${goldText}</p>
                        <button class="btn-research" onclick="researchCrop('${key}')">Erforschen</button>
                    </div>
                `;
            } else {
                html += `
                    <div class="crop-card locked">
                        <span class="crop-icon">🔒</span>
                        <h4>Gesperrt</h4>
                        <p class="crop-desc">Schaltet sich schrittweise frei!</p>
                        <button class="btn-research" style="background-color: #777;" disabled>Gesperrt</button>
                    </div>
                `;
            }
        }
    }
    html += `</div>`;
    fieldSection.innerHTML = html;
}

// HELDINNEN TAB
function renderHeroinesTab() {
    let html = `<div class="crop-grid" id="scroll-grid">`;
    for (let key in heroines) {
        let h = heroines[key];
        if (h.unlocked) {
            let currentDialog = h.dialogs.low;
            if (h.affection >= 50) currentDialog = h.dialogs.med;
            if (h.affection >= 100) currentDialog = h.dialogs.high;

            let favIcon = getItemIcon(h.favoriteItem);
            html += `
                <div class="crop-card" style="border: 2px solid #ff4081; text-align: center;">
                    <span class="crop-icon">${h.icon}</span>
                    <h4>${h.name}</h4>
                    <p style="color: #ff80ab; font-weight: bold; margin: 2px 0;">${h.title}</p>
                    <p class="crop-desc" style="font-style: italic; color: #ffe0b2; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px;">"${replacePlayerName(currentDialog)}"</p>
                    <p style="margin: 8px 0;">❤️ Zuneigung: <strong style="color: #ff4081; font-size: 16px;">${h.affection}/100</strong></p>
                    <p style="font-size: 12px; color: #4caf50; margin-bottom: 10px;">✨ Boni: ${h.bonusText}</p>
                    <button class="btn-action" onclick="giveGift('${key}')" style="background-color: #e91e63; width: 100%;">Lieblingsgeschenk geben (-1x ${favIcon})</button>
                </div>
            `;
        } else {
            html += `
                <div class="crop-card locked" style="text-align: center;">
                    <span class="crop-icon">🔒</span>
                    <h4>${h.name}</h4>
                    <p class="crop-desc">${h.title}</p>
                    <p style="margin: 8px 0;">Benötigt: Level ${h.unlockReq.level} & 💰${formatNumber(h.unlockReq.gold)} Gold</p>
                    <button class="btn-research" onclick="unlockHeroine('${key}')" style="width: 100%;">Begleiterin rufen</button>
                </div>
            `;
        }
    }
    html += `</div>`;
    fieldSection.innerHTML = html;
}

// STORY & QUEST TAB
function renderStoryTab() {
    let html = `<div class="crop-grid" id="scroll-grid" style="grid-template-columns: 1fr;">`;
    
    html += `
        <div class="crop-card" style="grid-column: 1/-1; background: linear-gradient(135deg, #2a1b4e, #1b2845); text-align: center;">
            <h3 style="color: #ffd700; margin: 0 0 5px 0;">📜 Die Isekai-Saga von ${player.name}</h3>
            <p style="font-size: 13px; color: #dddddd; margin: 0;">Lies die Geschichte und erfülle die goldenen Aufträge!</p>
        </div>
    `;

    storyChapters.forEach((ch) => {
        let titleFormatted = replacePlayerName(ch.title);
        let q = ch.quest;
        let qTitle = replacePlayerName(q.title);
        let qDesc = replacePlayerName(q.desc);
        let currentCount = inventory[q.item] || 0;
        let icon = getItemIcon(q.item);

        if (ch.unlocked) {
            let questBtnHtml = q.completed 
                ? `<button class="btn-research" disabled style="background-color: #2e7d32; color: #fff; width: 100%; padding: 12px; margin-top: 10px; font-weight: bold;">Kapitel-Auftrag Erfüllt ✅</button>`
                : `<button class="btn-action" onclick="claimChapterQuest(${ch.id})" style="background-color: #f57c00; color: #fff; width: 100%; padding: 12px; margin-top: 10px; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">Auftrag abliefern (${currentCount}/${q.amount} ${icon})</button>`;

            html += `
                <div class="crop-card" style="text-align: left; border: 2px solid #ffd700; background: #1e1e2f; padding: 18px; margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h3 style="color: #ffd700; margin: 0;">${titleFormatted}</h3>
                        <button onclick="readStoryDialog(${ch.id})" style="background: #3f51b5; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold;">📖 Geschichte lesen</button>
                    </div>

                    <div style="background: rgba(255, 215, 0, 0.08); border-left: 4px solid #ffd700; padding: 12px; border-radius: 4px; margin-top: 8px;">
                        <h4 style="color: #ffb74d; margin: 0 0 6px 0; font-size: 16px;">🎯 ${qTitle}</h4>
                        <p style="margin: 0 0 8px 0; font-size: 15px; color: #ffff72; font-weight: bold;">Aufgabe: ${qDesc} (${currentCount}/${q.amount} ${icon})</p>
                        <p style="font-size: 13px; color: #81c784; margin: 0;">Belohnung: 💰<strong>${formatNumber(q.rewardGold)} Gold</strong> | ⭐<strong>${formatNumber(q.rewardXp)} XP</strong></p>
                        ${questBtnHtml}
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="crop-card locked" style="text-align: left; opacity: 0.5; padding: 15px;">
                    <h4 style="color: #888; margin: 0 0 5px 0;">🔒 ${titleFormatted}</h4>
                    <p style="font-size: 13px; color: #aaa; margin: 0;">Schließe das vorherige Kapitel ab und erreiche Level ${ch.reqLevel}, um diesen Abschnitt freizuschalten.</p>
                </div>
            `;
        }
    });

    html += `</div>`;
    fieldSection.innerHTML = html;
}

function readStoryDialog(chapterId) {
    let ch = storyChapters.find(c => c.id === chapterId);
    if (!ch) return;

    let titleFormatted = replacePlayerName(ch.title);
    let textFormatted = replacePlayerName(ch.text);

    showCustomModal(
        titleFormatted, 
        `<div style="text-align: left; max-height: 50vh; overflow-y: auto; padding: 5px; white-space: pre-line; line-height: 1.6; font-size: 15px; color: #ffffff;">${textFormatted}</div>`, 
        "📖", 
        "click"
    );
}

// SYSTEM-TAB MIT HOHEM KONTRAST & PERFEKTER LESBARKEIT
function renderSettingsTab() {
    let lastSave = localStorage.getItem("isekai_farm_save_time") || "Noch nie";
    fieldSection.innerHTML = `
        <div class="crop-grid" id="scroll-grid" style="grid-template-columns: 1fr;">
            <div class="crop-card" style="text-align: left; padding: 25px; border: 2px solid #00bcd4; background: linear-gradient(145deg, #111b29, #1c2a38); color: #ffffff;">
                <h3 style="color: #ffd700; margin: 0 0 20px 0; border-bottom: 2px solid #00bcd4; padding-bottom: 10px; font-size: 20px;">⚙️ System-Einstellungen & Datenverwaltung</h3>
                
                <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid #00bcd4; padding: 18px; border-radius: 10px; margin-bottom: 20px;">
                    <p style="font-size: 16px; margin: 8px 0; color: #ffffff;">👤 Spieler-Identität: <strong style="color: #00e5ff; font-size: 18px;">${player.name}</strong></p>
                    <p style="font-size: 16px; margin: 8px 0; color: #ffffff;">⭐ Reinkarnations-Level: <strong style="color: #ffd700; font-size: 18px;">Level ${player.level}</strong></p>
                    <p style="font-size: 16px; margin: 8px 0; color: #ffffff;">🔄 Automatisches Speichern: <strong style="color: #64ffda; font-size: 16px;">Aktiv (Sofort + Alle 5 Sekunden)</strong></p>
                    <p style="font-size: 16px; margin: 8px 0; color: #ffffff;">🕒 Letzter automatischer Save: <strong style="color: #ffffff;">${lastSave}</strong></p>
                </div>

                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <button class="btn-action" onclick="saveGame(true)" style="background-color: #00838f; padding: 14px 24px; font-size: 16px; font-weight: bold; flex: 1; border: 1px solid #00e5ff;">Manuell Speichern 💾</button>
                    <button class="btn-sell" onclick="resetGame()" style="background-color: #c62828; padding: 14px 24px; font-size: 16px; font-weight: bold; flex: 1; border: 1px solid #ff5252;">Neustart / Reset ⚠️</button>
                </div>
            </div>
        </div>
    `;
}

function claimChapterQuest(chapterId) {
    let ch = storyChapters.find(c => c.id === chapterId);
    if (!ch) return;
    let q = ch.quest;

    if (!q.completed && (inventory[q.item] || 0) >= q.amount) {
        inventory[q.item] -= q.amount;
        q.completed = true;
        player.gold += q.rewardGold;
        player.xp += q.rewardXp;

        let nextCh = storyChapters.find(c => c.id === chapterId + 1);
        
        checkLevelUp();
        updateUI();
        renderCurrentTab();
        saveGame();

        if (nextCh) {
            if (player.level >= nextCh.reqLevel) {
                nextCh.unlocked = true;
                setTimeout(() => {
                    readStoryDialog(nextCh.id);
                }, 400);
            } else {
                showCustomModal(
                    "Kapitel-Auftrag Erfüllt! 🎯", 
                    `Du erhältst 💰<strong>${formatNumber(q.rewardGold)} Gold</strong> und ⭐<strong>${formatNumber(q.rewardXp)} XP</strong>!<br><br>🔒 Das nächste Kapitel benötigt <strong>Level ${nextCh.reqLevel}</strong>!`, 
                    "✨", 
                    "levelup"
                );
            }
        } else {
            showCustomModal("Saga Vollendet! 👑", "Du hast das finale Kapitel abgeschlossen!", "🏆", "levelup");
        }
    } else if (!q.completed) {
        showCustomModal(
            "Auftrag unvollständig!", 
            `Du benötigst <strong>${q.amount}x ${getItemIcon(q.item)}</strong> in deinem Lager!`, 
            "⚠️", 
            "click"
        );
    }
}

function giveGift(key) {
    let h = heroines[key];
    let fav = h.favoriteItem;
    if ((inventory[fav] || 0) >= 1) {
        inventory[fav]--;
        h.affection = Math.min(100, h.affection + 15);
        showCustomModal("Geschenk überreicht! ❤️", `${h.name} freut sich riesig über dein Geschenk! Zuneigung ist gestiegen auf ${h.affection}/100!`, h.icon, "levelup");
        updateUI();
        renderCurrentTab();
        saveGame();
    } else {
        showCustomModal("Fehlendes Geschenk!", `Du hast kein <strong>1x ${getItemIcon(fav)}</strong> in deinem Lager!`, "🎁", "click");
    }
}

function unlockHeroine(key) {
    let h = heroines[key];
    if (player.level >= h.unlockReq.level && player.gold >= h.unlockReq.gold) {
        player.gold -= h.unlockReq.gold;
        h.unlocked = true;
        showCustomModal("Neue Begleiterin!", `${h.name} schließt sich deinem Hof an!`, h.icon, "levelup");
        updateUI();
        renderCurrentTab();
        saveGame();
    } else {
        showCustomModal("Gesperrt!", `Du benötigst Level ${h.unlockReq.level} und 💰${formatNumber(h.unlockReq.gold)} Gold!`, "🔒", "click");
    }
}

function getActionButtonHtml(listName, key, item, timerKey) {
    if (activeTimers[timerKey] === "ready") {
        if (listName === "animals") return `<button class="btn-action" onclick="harvestItem('${listName}', '${key}')" style="background-color: #2196F3;">Ei ausbrüten! 🥚</button>`;
        if (listName === "ores") return `<button class="btn-action" onclick="harvestItem('${listName}', '${key}')" style="background-color: #9C27B0;">Erz bergen! ⛏️</button>`;
        if (listName === "kitchen") return `<button class="btn-action" onclick="harvestItem('${listName}', '${key}')" style="background-color: #FF9800;">Servieren! 🍲</button>`;
        if (listName === "alchemie") return `<button class="btn-action" onclick="harvestItem('${listName}', '${key}')" style="background-color: #00BCD4;">Abfüllen! 🧪</button>`;
        return `<button class="btn-action" onclick="harvestItem('${listName}', '${key}')" style="background-color: #2196F3;">Ernten! 🧺</button>`;
    } else if (typeof activeTimers[timerKey] === "number") {
        return `<button class="btn-action" id="timer-btn-${timerKey}" style="background-color: #9e9e9e;" disabled>⌛ ${activeTimers[timerKey]}s...</button>`;
    } else {
        if (item.recipe) {
            let reqIcon = getItemIcon(item.recipe.item);
            return `<button class="btn-action" onclick="startTimer('${listName}', '${key}')" style="background-color: #e65100;">Herstellen (-${item.recipe.amount}x ${reqIcon})</button>`;
        } else {
            let btnText = "Kaufen / Pflanzen";
            if (listName === "animals") btnText = "In Zuchtbox setzen";
            if (listName === "ores") btnText = "Erz abbauen";
            if (listName === "gilde") btnText = "Monster jagen";
            return `<button class="btn-action" onclick="startTimer('${listName}', '${key}')">${btnText} (-💰${formatNumber(item.cost)})</button>`;
        }
    }
}

function gameTick() {
    let needsRender = false;
    for (let timerKey in activeTimers) {
        if (typeof activeTimers[timerKey] === "number") {
            activeTimers[timerKey]--;
            let timerBtn = document.getElementById(`timer-btn-${timerKey}`);
            if (timerBtn) {
                timerBtn.textContent = `⌛ ${activeTimers[timerKey]}s...`;
            }
            if (activeTimers[timerKey] <= 0) {
                activeTimers[timerKey] = "ready";
                needsRender = true;
            }
        }
    }
    if (needsRender) renderCurrentTab();
}

window.startTimer = function(listName, key) {
    let dataSource = getListByName(listName);
    let item = dataSource[key];
    let timerKey = listName + "_" + key;

    if (item.recipe) {
        let reqItem = item.recipe.item;
        let reqAmount = item.recipe.amount;
        if ((inventory[reqItem] || 0) >= reqAmount) {
            inventory[reqItem] -= reqAmount;
            activeTimers[timerKey] = item.time;
            playSound('buy');
            updateUI();
            renderCurrentTab();
            saveGame();
        } else {
            showCustomModal("Zu wenig Zutaten!", `Du benötigst <strong>${reqAmount}x ${getItemIcon(reqItem)}</strong> im Lager!`, "⚠️", "click");
        }
    } else {
        if (player.gold >= item.cost) {
            player.gold -= item.cost;
            let oldCost = item.cost;
            item.cost = Math.floor(item.cost * 1.15);
            item.rewardGold += (item.cost - oldCost);

            activeTimers[timerKey] = item.time;
            playSound('buy');
            updateUI();
            renderCurrentTab();
            saveGame();
        } else { 
            showCustomModal("Zu wenig Gold!", "Dir fehlen die nötigen Münzen!", "💰", "click"); 
        }
    }
};

window.harvestItem = function(listName, key) {
    let dataSource = getListByName(listName);
    let item = dataSource[key];
    let timerKey = listName + "_" + key;

    delete activeTimers[timerKey];
    inventory[key] = (inventory[key] || 0) + 1;
    player.xp += item.rewardXp;
    
    playSound('tab');

    if (listName !== "crops") {
        let keys = Object.keys(dataSource);
        let nextIndex = keys.indexOf(key) + 1;
        if (nextIndex < keys.length) { 
            dataSource[keys[nextIndex]].unlocked = true; 
        }
    }

    checkLevelUp();
    updateUI();
    renderCurrentTab();
    saveGame();
};

window.sellItem = function(listName, key) {
    let dataSource = getListByName(listName);
    if ((inventory[key] || 0) > 0) {
        inventory[key]--;
        player.gold += dataSource[key].rewardGold;
        playSound('sell');
        updateUI();
        renderCurrentTab();
        saveGame();
    }
};

window.researchCrop = function(key) {
    let crop = crops[key];
    let reqItem = crop.researchCost.item;
    let reqAmount = crop.researchCost.amount;
    let reqGold = crop.researchCost.gold || 0;

    if ((inventory[reqItem] || 0) >= reqAmount && player.gold >= reqGold) {
        inventory[reqItem] -= reqAmount;
        player.gold -= reqGold;
        crop.unlocked = true;
        showCustomModal("Forschung Erfolgreich!", `Du hast <strong>${crop.name}</strong> erforscht!`, "🔓", "levelup");
        updateUI();
        renderCurrentTab();
        saveGame();
    } else { 
        let goldMessage = reqGold > 0 ? ` UND 💰<strong>${formatNumber(reqGold)} Gold</strong>` : '';
        showCustomModal("Forschung gesperrt!", `Du benötigst <strong>${reqAmount}x ${getItemIcon(reqItem)}</strong>${goldMessage} im Lager!`, "🔒", "click"); 
    }
};

function getListByName(name) {
    if (name === "crops") return crops;
    if (name === "trees") return trees;
    if (name === "animals") return animals;
    if (name === "ores") return ores;
    if (name === "kitchen") return kitchen;
    if (name === "gilde") return gilde;
    if (name === "alchemie") return alchemie;
}

function checkLevelUp() {
    if (player.xp >= player.xpNeeded) {
        player.level++;
        player.xp -= player.xpNeeded;
        player.xpNeeded = Math.floor(player.xpNeeded * 1.5);
        
        storyChapters.forEach(c => {
            let prevCh = storyChapters.find(p => p.id === c.id - 1);
            if (player.level >= c.reqLevel && (!prevCh || prevCh.quest.completed)) {
                c.unlocked = true;
            }
        });

        showCustomModal(
            "🎉 LEVEL UP! 🎉", 
            `Herzlichen Glückwunsch an <strong>${player.name}</strong>!<br><br>Du bist auf <strong>Level ${player.level}</strong> aufgestiegen!`, 
            "🌟", 
            "levelup"
        );
    }
}

// HELFER FÜR FORSCHUNG-SPEICHERUNG
function exportCategoryState(catObj) {
    if (!catObj) return {};
    let state = {};
    for (let k in catObj) {
        state[k] = {
            unlocked: catObj[k].unlocked,
            cost: catObj[k].cost,
            rewardGold: catObj[k].rewardGold
        };
    }
    return state;
}

function importCategoryState(catObj, savedState) {
    if (!catObj || !savedState) return;
    for (let k in savedState) {
        if (catObj[k]) {
            if (savedState[k].unlocked !== undefined) catObj[k].unlocked = savedState[k].unlocked;
            if (savedState[k].cost !== undefined) catObj[k].cost = savedState[k].cost;
            if (savedState[k].rewardGold !== undefined) catObj[k].rewardGold = savedState[k].rewardGold;
        }
    }
}

// LOCALSTORAGE SAVE / LOAD
function saveGame(manual = false) {
    let saveData = {
        player: player,
        inventory: inventory,
        heroines: heroines,
        storyChapters: storyChapters,
        crops: exportCategoryState(crops),
        trees: exportCategoryState(trees),
        animals: exportCategoryState(animals),
        ores: exportCategoryState(ores),
        kitchen: exportCategoryState(kitchen),
        gilde: exportCategoryState(gilde),
        alchemie: exportCategoryState(alchemie)
    };
    localStorage.setItem("isekai_farm_save", JSON.stringify(saveData));
    let timeStr = new Date().toLocaleTimeString('de-DE');
    localStorage.setItem("isekai_farm_save_time", timeStr);
    
    if (typeof saveCloudGame === 'function') {
        saveCloudGame();
    }

    if (manual) showCustomModal("Gespeichert!", "Dein Spielstand wurde erfolgreich gesichert!", "💾", "click");
}

function loadGame() {
    let saved = localStorage.getItem("isekai_farm_save");
    if (saved) {
        try {
            let parsed = JSON.parse(saved);
            if (parsed.player) player = parsed.player;
            if (parsed.inventory) inventory = parsed.inventory;
            
            importCategoryState(crops, parsed.crops);
            importCategoryState(trees, parsed.trees);
            importCategoryState(animals, parsed.animals);
            importCategoryState(ores, parsed.ores);
            importCategoryState(kitchen, parsed.kitchen);
            importCategoryState(gilde, parsed.gilde);
            importCategoryState(alchemie, parsed.alchemie);

            if (parsed.heroines) {
                for (let k in parsed.heroines) {
                    if (heroines[k]) {
                        heroines[k].affection = parsed.heroines[k].affection;
                        heroines[k].unlocked = parsed.heroines[k].unlocked;
                    }
                }
            }
            if (parsed.storyChapters) {
                parsed.storyChapters.forEach(sc => {
                    let ch = storyChapters.find(c => c.id === sc.id);
                    if (ch) {
                        ch.unlocked = sc.unlocked;
                        if (sc.quest) ch.quest.completed = sc.quest.completed;
                    }
                });
            }
            updateUI();
            return true;
        } catch(e) {
            console.error("Fehler beim lokalen Laden:", e);
        }
    }
    return false;
}

function resetGame() {
    if (confirm("Möchtest du deinen Spielstand wirklich komplett löschen und neu anfangen?")) {
        localStorage.removeItem("isekai_farm_save");
        localStorage.removeItem("isekai_farm_save_time");
        location.reload();
    }
}