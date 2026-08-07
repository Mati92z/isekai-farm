// auth.js - Globale Multi-User Cloud-Datenbank

const DB_API_KEY = "$2a$10$vI0Hq0E43UqOaN6v5M8O4.4W8.O8cO.MvQ8z6vM5M8O4.4W8.O8cO";
const GLOBAL_BIN_ID = "65d8a8b1dc74654018aa3e9a"; // Fest definierter globaler Speicher-Vault
const DB_URL = `https://api.jsonbin.io/v3/b/${GLOBAL_BIN_ID}`;

let currentUserEmail = null;

// ERZWINGT ANMELDUNG ODER AUTO-LOGIN BEIM LADEN
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

// LOGIN & REGISTRIERUNG
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

// CLOUD SPEICHERN (In den zentralen Speicher-Vault)
window.saveCloudGame = async function() {
    if (!currentUserEmail) return;

    const currentSave = {
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
        // 1. Gesamte Datenbank abrufen
        const res = await fetch(`${DB_URL}/latest`, {
            headers: { 'X-Master-Key': DB_API_KEY }
        });
        const data = await res.json();
        let db = data.record || {};

        // 2. Den eigenen Spielstand in der Datenbank aktualisieren
        db[currentUserEmail] = currentSave;

        // 3. Datenbank zurückschreiben
        await fetch(DB_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': DB_API_KEY
            },
            body: JSON.stringify(db)
        });
        console.log("Cloud-Sync erfolgreich!");
    } catch (err) {
        console.error("Fehler beim Cloud-Speichern:", err);
    }
};

// CLOUD LADEN (Lädt deinen Account aus dem zentralen Vault)
window.loadCloudGame = async function() {
    if (!currentUserEmail) return;

    try {
        const res = await fetch(`${DB_URL}/latest`, {
            headers: { 'X-Master-Key': DB_API_KEY }
        });
        const data = await res.json();
        const db = data.record || {};

        // Prüfen, ob für diese E-Mail bereits ein Spielstand existiert
        if (db[currentUserEmail]) {
            const parsed = db[currentUserEmail];
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

            // Lokalen Speicher mit Cloud-Daten überschreiben
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
        console.error("Fehler beim Laden aus der Cloud:", err);
    }
};