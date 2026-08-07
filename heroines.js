// heroines.js - Die 10 Begleiterinnen deiner Isekai-Welt

const heroines = {
    elaria: {
        name: "Elaria die Waldelfe",
        title: "Hüterin des Smaragdwaldes",
        icon: "🧝‍♀️",
        affection: 0,
        unlocked: true,
        favoriteItem: "moehrensuppe",
        bonusText: "+10% Ernte-Tempo im Gemüsebeet",
        dialogs: {
            low: "Mmh, hallo Mathias... deine Arme sehen heute so stark aus vom Feld bestellen.",
            med: "Weißt du... bei der Hitze im Gewächshaus würde ich zu gern etwas Stoff ablegen... nur für dich.",
            high: "Mathias, mein Herz und mein Körper gehören ganz dir. Lass uns zusammen im Wald verweilen..."
        }
    },
    lilith: {
        name: "Lilith die Vampirfürstin",
        title: "Dominante Schatten-Herrscherin",
        icon: "🧛‍♀️",
        affection: 0,
        unlocked: false,
        unlockReq: { level: 3, gold: 300 },
        favoriteItem: "heiltrank",
        bonusText: "+15% Gold-Ertrag bei allen Verkäufen",
        dialogs: {
            low: "Ein einfacher Farmer wagt es, mich zu rufen? Nun gut... zeig mir, was du zu bieten hast, Kleiner.",
            med: "Mmh, du arbeitest ja wirklich hart... Solche Hingabe verlangt nach einer ganz besonderen Belohnung.",
            high: "Mein Herz schlägt schon lange nicht mehr... aber bei deiner Berührung spüre ich wieder echte Hitze!"
        }
    },
    pyra: {
        name: "Pyra die Drachenkriegerin",
        title: "Feurige Vulkan-Prinzessin",
        icon: "💃",
        affection: 0,
        unlocked: false,
        unlockReq: { level: 5, gold: 1000 },
        favoriteItem: "rosmarinbraten",
        bonusText: "-20% Kampfzeit in der Abenteurergilde",
        dialogs: {
            low: "Fass meine Schuppen bloß nicht ungefragt an! Ich bin eine stolze Drachin... verstehst du?",
            med: "Gar nicht übel, Mathias. Du hast Stärke bewiesen. Vielleicht erlaube ich dir, mir näher zu kommen...",
            high: "Ich beuge mein Knie vor keinem König... aber auf deinem Schoß mache ich eine leidenschaftliche Ausnahme."
        }
    },
    sylphia: {
        name: "Sylphia die Feenkönigin",
        title: "Verspielter Windgeist",
        icon: "🧚‍♀️",
        affection: 0,
        unlocked: false,
        unlockReq: { level: 7, gold: 3500 },
        favoriteItem: "himbeereis",
        bonusText: "+15% XP bei allen Ernteschritten",
        dialogs: {
            low: "Huhu Mathias! Ich bin so winzig... schlüpfe ich lieber in deine Hemdtasche oder auf deine Schulter?",
            med: "Ich habe mich im Bettchen in deinen Kissen versteckt... kommst du mich suchen?",
            high: "Mit meiner Feenmagie kann ich meine Größe anpassen... nun bin ich genauso groß wie du. Küss mich!"
        }
    },
    katsumi: {
        name: "Katsumi die Neko-Kunoichi",
        title: "Verführerische Katzen-Assassinin",
        icon: "🐈‍⬛",
        affection: 0,
        unlocked: false,
        unlockReq: { level: 10, gold: 8000 },
        favoriteItem: "dill_fisch",
        bonusText: "+20% Chance auf doppelte Erntebeute",
        dialogs: {
            low: "Miau~ Wer schleicht denn da herum? Wenn du mir Fisch gibst, erlaube ich dir, meine Ohren zu kraulen.",
            med: "Schnurr... Genau an dieser Stelle unter dem Kinn! Du weißt genau, wie man eine Katze verwöhnt.",
            high: "Ich brauche keine Aufträge mehr. Mein einziger Meister bist jetzt du, Mathias!"
        }
    },
    celestia: {
        name: "Celestia die Gefallene",
        title: "Sündige Erzengel-Dame",
        icon: "🪽",
        affection: 0,
        unlocked: false,
        unlockReq: { level: 12, gold: 20000 },
        favoriteItem: "lichtelixier",
        bonusText: "+25% Ertrag in Alchemie & Mine",
        dialogs: {
            low: "Der Himmel hat mich verbannt, weil meine Gelüste zu weltlich waren... Zeigst du mir deine Sünden?",
            med: "Meine Flügel zittern, wenn du mich so intensiv ansiehst. Du verleitest mich schon wieder...",
            high: "Vergiss das Paradies im Himmel. Mein einziges Paradies liegt in deinen Armen!"
        }
    },
    freya: {
        name: "Freya die Gilden-Kriegerin",
        title: "Ausschnitt-Verfechterin der Taverne",
        icon: "⚔️",
        affection: 0,
        unlocked: false,
        unlockReq: { level: 15, gold: 50000 },
        favoriteItem: "bohnenpfanne",
        bonusText: "+30% Gold-Bonus bei Gilden-Monstern",
        dialogs: {
            low: "Hach, nach der Monsterjagd ist meine Rüstung so eng und verschwitzt... Hilfst du mir beim Ausziehen?",
            med: "Ein starker Mann wie du sollte nicht alleine schlafen. Soll ich heute Nacht Wache an deinem Bett halten?",
            high: "Kein Monster der Welt kann mir Angst machen... aber der Gedanke, dich zu verlieren, bricht mein Herz."
        }
    },
    aria: {
        name: "Aria die Meeres-Sirene",
        title: "Verlockung der Ozeane",
        icon: "🧜‍♀️",
        affection: 0,
        unlocked: false,
        unlockReq: { level: 18, gold: 120000 },
        favoriteItem: "gurkensalat",
        bonusText: "-30% Timer im Obstgarten",
        dialogs: {
            low: "Mein Gesang bringt Seemänner zum Träumen... aber für dich singe ich lauter süße Liebeslieder.",
            med: "Komm zu mir ins kühle Wasser... Ich verspreche dir, ich ziehe dich nicht hinunter, sondern ganz nah an mich.",
            high: "Meine Schuppen glänzen nur für deine Augen. Du bist mein wahrer König der Meere!"
        }
    },
    hestia: {
        name: "Hestia die Tempel-Hohepriesterin",
        title: "Sündige Dienerin der Erntegöttin",
        icon: "📿",
        affection: 0,
        unlocked: false,
        unlockReq: { level: 20, gold: 300000 },
        favoriteItem: "fencheltee",
        bonusText: "Halbiert alle Lizenz-Forschungskosten",
        dialogs: {
            low: "Ich bete jeden Tag für deine Ernte... aber nachts bete ich für deine private Aufmerksamkeit.",
            med: "Die heiligen Schriften verbieten solche Gedanken... doch bei dir vergesse ich alle Gelübde.",
            high: "Die Göttin verzeiht mir sicher... denn deine Liebe ist das heiligste Gefühl dieser Welt, Mathias."
        }
    },
    morgana: {
        name: "Morgana die Alchemie-Hexe",
        title: "Verführerische Tränkemeisterin",
        icon: "🔮",
        affection: 0,
        unlocked: false,
        unlockReq: { level: 25, gold: 1000000 },
        favoriteItem: "manatrank",
        bonusText: "+50% Effizienz auf ALLES im Spiel",
        dialogs: {
            low: "Mmh, ich brauche noch eine Zutat für meinen Liebestrank... Darf ich etwas von deinem Schweiß opfern?",
            med: "Ein Schluck von diesem Elixier und wir werden die ganze Nacht kein Auge zutun, Hihi...",
            high: "Ich habe tausend Zauber gelernt... aber der mächtigste Bann ist der, den du über mein Herz gelegt hast!"
        }
    }
};