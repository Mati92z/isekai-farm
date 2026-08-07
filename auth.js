// auth.js - Synchronisiertes Cloud-Login & Vollständige Spielstands-Sicherung

const DB_API_KEY = "$2a$10$vI0Hq0E43UqOaN6v5M8O4.4W8.O8cO.MvQ8z6vM5M8O4.4W8.O8cO";
const DB_COLLECTION_URL = "https://api.jsonbin.io/v3/b";

let currentUserEmail = null;

// ERZWINGT ANMELDUNG ODER AUTO-LOGIN
window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('auth-overlay');
    const savedUser = localStorage.getItem("isekai_user_email");

    document.getElementById('btn-logout')?.addEventListener('click', logoutUser);

    if (savedUser) {
        currentUserEmail = savedUser;
        if (overlay) overlay.style.display = 'none';
        loadCloudGame();
        setInterval(saveCloudGame, 10000);
    } else {
        if (overlay) overlay.style.display = 'flex';
    }
});

// LOGIN-BUTTON
document.getElementById('auth-login-btn')?.addEventListener('click', async () => {
    const emailInput = document.getElementById('auth-email').value.trim().toLowerCase();
    const passwordInput = document.getElementById('auth-password').value.trim();

    if (!emailInput || !passwordInput) {
        alert("Bitte gib eine E-Mail und ein Passwort ein!");
        return;
    }

    const userKey = btoa(emailInput + ":" + passwordInput);
    currentUserEmail = userKey;
    localStorage.setItem("isekai_user_email", userKey);
    
    const overlay = document.getElementById('auth-overlay');
    if (overlay) overlay.style.display = 'none';
    
    await loadCloudGame();
    setInterval(saveCloudGame, 10000);
});

// ABMELDEN-FUNKTION
async function logoutUser() {
    if (confirm("Möchtest du dich wirklich abmelden? Dein Spielstand wird gesichert.")) {
        await saveCloudGame();
        localStorage.removeItem("isekai_user_email");
        location.reload();
    }
}
window.logoutUser = logoutUser;

// CLOUD SPEICHERN (VOLLSTÄNDIGER DATENSATZ)
window.saveCloudGame = async function() {
    if (!currentUserEmail) return;

    const saveData = {
        user: currentUserEmail,
        player: (typeof player !== 'undefined') ? player : {},
        inventory: (typeof inventory !== 'undefined') ? inventory : {},
        heroines: (typeof heroines !== 'undefined') ? heroines : {},
        storyChapters: (typeof storyChapters !== 'undefined') ? storyChapters : [],
        
        // Jetzt werden auch alle Forschungs- und Freischaltungs-Zustände gesichert:
        crops: (typeof crops !== 'undefined') ? crops : {},
        trees: (typeof trees !== 'undefined') ? trees : {},
        animals: (typeof animals !== 'undefined') ? animals : {},
        ores: (typeof ores !== 'undefined') ? ores : {},
        kitchen: (typeof kitchen !== 'undefined') ? kitchen : {},
        gilde: (typeof gilde !== 'undefined') ? gilde : {},
        alchemie: (typeof alchemie !== 'undefined') ? alchemie : {},
        
        lastSave: new Date().toLocaleString('de-DE')
    };

    try {
        let binId = localStorage.getItem("isekai_bin_id_" + currentUserEmail);
        
        if (binId) {
            await fetch(`${DB_COLLECTION_URL}/${binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': DB_API_KEY
                },
                body: JSON.stringify(saveData)
            });
        } else {
            const res = await fetch(DB_COLLECTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': DB_API_KEY,
                    'X-Bin-Private': 'true'
                },
                body: JSON.stringify(saveData)
            });
            const data = await res.json();
            if (data.metadata && data.metadata.id) {
                localStorage.setItem("isekai_bin_id_" + currentUserEmail, data.metadata.id);
            }
        }
    } catch (err) {
        console.error("Fehler beim Cloud-Speichern:", err);
    }
};

// HELFER UND SYSTEM-LADEN
function applyCategorySave(targetObj, savedObj) {
    if (!targetObj || !savedObj) return;
    for (let k in savedObj) {
        if (targetObj[k]) {
            if (savedObj[k].unlocked !== undefined) targetObj[k].unlocked = savedObj[k].unlocked;
            if (savedObj[k].cost !== undefined) targetObj[k].cost = savedObj[k].cost;
            if (savedObj[k].rewardGold !== undefined) targetObj[k].rewardGold = savedObj[k].rewardGold;
        }
    }
}

// CLOUD LADEN
window.loadCloudGame = async function() {
    if (!currentUserEmail) return;

    let binId = localStorage.getItem("isekai_bin_id_" + currentUserEmail);
    if (!binId) return;

    try {
        const res = await fetch(`${DB_COLLECTION_URL}/${binId}/latest`, {
            headers: { 'X-Master-Key': DB_API_KEY }
        });
        const data = await res.json();
        
        if (data.record) {
            const parsed = data.record;
            if (parsed.player) player = parsed.player;
            if (parsed.inventory) inventory = parsed.inventory;

            // Forschungen & Freischaltungen aus Cloud übertragen:
            if (parsed.crops && typeof crops !== 'undefined') applyCategorySave(crops, parsed.crops);
            if (parsed.trees && typeof trees !== 'undefined') applyCategorySave(trees, parsed.trees);
            if (parsed.animals && typeof animals !== 'undefined') applyCategorySave(animals, parsed.animals);
            if (parsed.ores && typeof ores !== 'undefined') applyCategorySave(ores, parsed.ores);
            if (parsed.kitchen && typeof kitchen !== 'undefined') applyCategorySave(kitchen, parsed.kitchen);
            if (parsed.gilde && typeof gilde !== 'undefined') applyCategorySave(gilde, parsed.gilde);
            if (parsed.alchemie && typeof alchemie !== 'undefined') applyCategorySave(alchemie, parsed.alchemie);

            if (parsed.heroines && typeof heroines !== 'undefined') {
                for (let k in parsed.heroines) {
                    if (heroines[k]) {
                        heroines[k].affection = parsed.heroines[k].affection;
                        heroines[k].unlocked = parsed.heroines[k].unlocked;
                    }
                }
            }

            if (parsed.storyChapters && typeof storyChapters !== 'undefined') {
                parsed.storyChapters.forEach(sc => {
                    let ch = storyChapters.find(c => c.id === sc.id);
                    if (ch) {
                        ch.unlocked = sc.unlocked;
                        if (sc.quest) ch.quest.completed = sc.quest.completed;
                    }
                });
            }

            if (typeof updateUI === 'function') updateUI();
            if (typeof renderCurrentTab === 'function') renderCurrentTab();
        }
    } catch (err) {
        console.error("Fehler beim Laden des Cloud-Spielstands:", err);
    }
};