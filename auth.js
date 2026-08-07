// auth.js - Schlüsselfertiges Cloud-Login & Speicher-System

const DB_API_KEY = "$2a$10$vI0Hq0E43UqOaN6v5M8O4.4W8.O8cO.MvQ8z6vM5M8O4.4W8.O8cO";
const DB_COLLECTION_URL = "https://api.jsonbin.io/v3/b";

let currentUserEmail = null;

// ERZWINGT DAS LOGIN-WINDOW BEIM LADEN
window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('auth-overlay');
    const savedUser = localStorage.getItem("isekai_user_email");

    if (savedUser) {
        currentUserEmail = savedUser;
        if (overlay) overlay.style.display = 'none';
        loadCloudGame();
        setInterval(saveCloudGame, 10000);
    } else {
        if (overlay) overlay.style.display = 'flex';
    }
});

// LOGIN & REGISTRIERUNGS-BUTTON
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
    localStorage.setItem("isekai_user_display_name", emailInput);
    
    const overlay = document.getElementById('auth-overlay');
    if (overlay) overlay.style.display = 'none';
    
    await loadCloudGame();
    setInterval(saveCloudGame, 10000);
});

// CLOUD SPEICHERN
window.saveCloudGame = async function() {
    if (!currentUserEmail) return;

    const saveData = {
        user: currentUserEmail,
        player: player,
        inventory: inventory,
        heroines: heroines,
        storyChapters: storyChapters,
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
            if (parsed.heroines) heroines = parsed.heroines;
            if (parsed.storyChapters) storyChapters = parsed.storyChapters;

            if (typeof updateUI === 'function') updateUI();
            if (typeof renderCurrentTab === 'function') renderCurrentTab();
        }
    } catch (err) {
        console.error("Fehler beim Laden des Cloud-Spielstands:", err);
    }
};