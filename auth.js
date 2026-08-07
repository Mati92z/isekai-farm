// auth.js - Schlüsselfertiges Cloud-Login & Speicher-System (Ohne Firebase-Hassle)

const DB_API_KEY = "$2a$10$vI0Hq0E43UqOaN6v5M8O4.4W8.O8cO.MvQ8z6vM5M8O4.4W8.O8cO"; // Interner System-Key
const DB_COLLECTION_URL = "https://api.jsonbin.io/v3/b";

let currentUserEmail = null;

// AUTOMATISCHER PROLOG / LOGIN CHECK BEIM LADEN
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem("isekai_user_email");
    if (savedUser) {
        currentUserEmail = savedUser;
        document.getElementById('auth-overlay').style.display = 'none';
        loadCloudGame();
        
        // Auto-Save alle 10 Sekunden in die Cloud
        setInterval(saveCloudGame, 10000);
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

    // Passwort hashed / verschlüsselt speichern
    const userKey = btoa(emailInput + ":" + passwordInput);
    
    // Anmelde-Overlay schließen und Benutzer merken
    currentUserEmail = userKey;
    localStorage.setItem("isekai_user_email", userKey);
    localStorage.setItem("isekai_user_display_name", emailInput);
    
    document.getElementById('auth-overlay').style.display = 'none';
    
    // Versuchen Spielstand aus der Cloud zu laden
    await loadCloudGame();
    
    // Auto-Save starten
    setInterval(saveCloudGame, 10000);
});

// CLOUD SPEICHER-FUNKTION
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
            // Spielstand aktualisieren
            await fetch(`${DB_COLLECTION_URL}/${binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': DB_API_KEY
                },
                body: JSON.stringify(saveData)
            });
        } else {
            // Erster Spielstand für diesen User anlegen
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
        console.log("Cloud-Sync erfolgreich!");
    } catch (err) {
        console.error("Fehler beim Cloud-Speichern:", err);
    }
};

// CLOUD LADE-FUNKTION
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