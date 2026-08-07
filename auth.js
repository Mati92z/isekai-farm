// auth.js - Synchronisiertes Cloud-Login & Geräteübergreifende Spielstands-Sicherung

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
        crops: (typeof exportCategoryState === 'function') ? exportCategoryState(crops) : {},
        trees: (typeof exportCategoryState === 'function') ? exportCategoryState(trees) : {},
        animals: (typeof exportCategoryState === 'function') ? exportCategoryState(animals) : {},
        ores: (typeof exportCategoryState === 'function') ? exportCategoryState(ores) : {},
        kitchen: (typeof exportCategoryState === 'function') ? exportCategoryState(kitchen) : {},
        gilde: (typeof exportCategoryState === 'function') ? exportCategoryState(gilde) : {},
        alchemie: (typeof exportCategoryState === 'function') ? exportCategoryState(alchemie) : {},
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
                    'X-Bin-Name': currentUserEmail,
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

// CLOUD LADEN (GERÄTEÜBERGREIFENDE SUCHE)
window.loadCloudGame = async function() {
    if (!currentUserEmail) return;

    let binId = localStorage.getItem("isekai_bin_id_" + currentUserEmail);

    // Falls keine binId lokal existiert (z.B. neues Gerät / nach Abmeldung),
    // suchen wir in JSONbin nach einer Bin mit dem Namen currentUserEmail
    if (!binId) {
        try {
            const searchRes = await fetch(`${DB_COLLECTION_URL}`, {
                headers: { 'X-Master-Key': DB_API_KEY }
            });
            const searchData = await searchRes.json();
            if (Array.isArray(searchData)) {
                const match = searchData.find(b => b.snippetMeta && b.snippetMeta.name === currentUserEmail);
                if (match) {
                    binId = match.record;
                    localStorage.setItem("isekai_bin_id_" + currentUserEmail, binId);
                }
            }
        } catch (e) {
            console.error("Fehler bei der Cloud-Suche:", e);
        }
    }

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

            if (typeof importCategoryState === 'function') {
                if (parsed.crops) importCategoryState(crops, parsed.crops);
                if (parsed.trees) importCategoryState(trees, parsed.trees);
                if (parsed.animals) importCategoryState(animals, parsed.animals);
                if (parsed.ores) importCategoryState(ores, parsed.ores);
                if (parsed.kitchen) importCategoryState(kitchen, parsed.kitchen);
                if (parsed.gilde) importCategoryState(gilde, parsed.gilde);
                if (parsed.alchemie) importCategoryState(alchemie, parsed.alchemie);
            }

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

            // Lokalen Speicher aktualisieren
            if (typeof saveGame === 'function') {
                let saveData = {
                    player: player,
                    inventory: inventory,
                    heroines: heroines,
                    storyChapters: storyChapters,
                    crops: (typeof exportCategoryState === 'function') ? exportCategoryState(crops) : {},
                    trees: (typeof exportCategoryState === 'function') ? exportCategoryState(trees) : {},
                    animals: (typeof exportCategoryState === 'function') ? exportCategoryState(animals) : {},
                    ores: (typeof exportCategoryState === 'function') ? exportCategoryState(ores) : {},
                    kitchen: (typeof exportCategoryState === 'function') ? exportCategoryState(kitchen) : {},
                    gilde: (typeof exportCategoryState === 'function') ? exportCategoryState(gilde) : {},
                    alchemie: (typeof exportCategoryState === 'function') ? exportCategoryState(alchemie) : {}
                };
                localStorage.setItem("isekai_farm_save", JSON.stringify(saveData));
            }

            if (typeof initGameSession === 'function') {
                initGameSession();
            } else {
                if (typeof updateUI === 'function') updateUI();
                if (typeof renderCurrentTab === 'function') renderCurrentTab();
            }
        }
    } catch (err) {
        console.error("Fehler beim Laden des Cloud-Spielstands:", err);
    }
};