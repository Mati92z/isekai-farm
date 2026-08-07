// story.js - 40 Kapitel & 40 synchrone Quests (50% Isekai-Fantasy & 50% Dark Romance)

const storyChapters = [
    {
        id: 1, title: "Kapitel 1: Erwachen im Feuchten Moos", reqLevel: 1, unlocked: true,
        text: `Kaiserreich Valoria, Jahr 742 nach der Großen Spaltung.\n\nAls {PLAYER_NAME} die Augen aufschlägt, ist der Geruch von feuchter Erde und Bärlauch überwältigend. Die System-KI entschuldigt sich leise für das Versehen in deiner alten Welt. Ein Rascheln im Gebüsch lässt dich aufschauen.\n\nElaria, eine wunderschöne Elfe mit tiefgrünen Augen, tritt hervor. Ihr Blick saugt sich an dir fest. "Deine Aura...", flüstert sie und tritt so nah heran, dass du ihren süßen Atem spürst. "Sie lässt das Land atmen. Ich werde dich nicht mehr gehen lassen, {PLAYER_NAME}."`,
        quest: { title: "Auftrag 1: Nahrung für die Elfe", desc: "Sammle 10x Möhren", item: "moehren", amount: 10, rewardGold: 100, rewardXp: 50, completed: false }
    },
    {
        id: 2, title: "Kapitel 2: Der Blutige Pakt", reqLevel: 2, unlocked: false,
        text: `Deine Erntemagie lässt die Felder nachts leuchten. Ein eiskalter Windzug fegt durch dein Gemach, und du spürst eine kühle, weiche Hand auf deiner Brust.\n\nLilith, die Vampirfürstin, beugt sich über dich. "Ein Mensch, der das Mana der Erde lenkt...", schnurrt sie. Sie beißt sanft in deinen Hals – nicht um zu töten, sondern um dich zu markieren. "Dein Blut berauscht mich, {PLAYER_NAME}. Ab heute schütze ich dein Reich!"`,
        quest: { title: "Auftrag 2: Blutrote Medizin", desc: "Sammle 10x Bärlauch", item: "baerlauch", amount: 10, rewardGold: 250, rewardXp: 100, completed: false }
    },
    {
        id: 3, title: "Kapitel 3: Der Neid der Sterblichen", reqLevel: 3, unlocked: false,
        text: `Drei vermummte Spione der valorischen Handelsgilde wollen deine Ernte stehlen. Sie ahnen nicht, wer in {PLAYER_NAME}s Schatten lauert.\n\nElaria fesselt sie mit Ranken, während Lilith mit leuchtend roten Augen vortritt. "Niemand stiehlt von meinem Meister", zischt die Vampirin und streicht dir besitzergreifend über die Wange. Die Spione fliehen voller Panik.`,
        quest: { title: "Auftrag 3: Würzige Barriere", desc: "Sammle 10x Basilikum", item: "basilikum", amount: 10, rewardGold: 500, rewardXp: 200, completed: false }
    },
    {
        id: 4, title: "Kapitel 4: Drachenfeuer und Rosmarin", reqLevel: 4, unlocked: false,
        text: `Ein Beben erschüttert den Hof. Pyra, eine Drachenkriegerin in feuerroter Rüstung, landet krachend vor dir. "Man sagt, ein Mensch namens {PLAYER_NAME} maßt sich an, mächtiger zu sein als Drachen!"\n\nStatt zu kämpfen, reichst du ihr gelassen einen brutzelnden Rosmarinbraten. Pyra beißt hinein, ihre feurige Miene schmilzt. "Das... ist zu gut für Sterbliche! Hör zu, Mensch. Du gehörst jetzt zu meinem Hort!"`,
        quest: { title: "Auftrag 4: Scharfer Proviant", desc: "Sammle 15x Radieschen", item: "radieschen", amount: 15, rewardGold: 800, rewardXp: 350, completed: false }
    },
    {
        id: 5, title: "Kapitel 5: Die Süße Klinge", reqLevel: 5, unlocked: false,
        text: `In der Nacht spürst du kalten Stahl an deiner Kehle. Katsumi, die Neko-Kunoichi, sitzt rittlings auf dir im Bett. "Der Kaiser zahlt gut für deinen Kopf, {PLAYER_NAME}..."\n\nDoch als sie deine magische Aura riecht, zögert sie. Sie lässt den Dolch fallen, lehnt sich schnurrend an deine Brust und reibt ihren Kopf an deinem Hals. "Vergiss den Kaiser. Dein Geruch macht mich verrückt. Ich bleibe bei dir!"`,
        quest: { title: "Auftrag 5: Eiweiß für die Katze", desc: "Sammle 15x Erbsen", item: "erbsen", amount: 15, rewardGold: 1200, rewardXp: 500, completed: false }
    },
    {
        id: 6, title: "Kapitel 6: Der Gefallene Engel", reqLevel: 6, unlocked: false,
        text: `Ein blendender Lichtstrahl schlägt im Garten ein. Celestia liegt mit versengten Flügeln im Krater. "Der Himmel hat mich verstoßen", schluchzt sie.\n\nAls sie in deine Augen blickt, weicht ihre Trauer einer sündigen Faszination. "{PLAYER_NAME}... deine Seele leuchtet heller als die Hallen der Götter. Wenn der Himmel dich nicht hat, erschaffe ich mein Paradies in deinen Armen."`,
        quest: { title: "Auftrag 6: Kraft-Nahrung", desc: "Sammle 15x Bohnen", item: "bohnen", amount: 15, rewardGold: 1800, rewardXp: 750, completed: false }
    },
    {
        id: 7, title: "Kapitel 7: Die Feen-Invasion", reqLevel: 7, unlocked: false,
        text: `Dein Obstgarten glitzert. Sylphia die Feenkönigin verwandelt sich in ein lebensgroßes Mädchen und umarmt dich stürmisch.\n\n"Oh {PLAYER_NAME}! Mein Hofstaat und ich ziehen bei dir ein! Deine Magie ist so süß wie Nektar." Sie drückt ihre weichen Lippen auf deine Wange. "Als Dank wache ich nachts an deinem Bett..."`,
        quest: { title: "Auftrag 7: Magische Knollen", desc: "Sammle 15x Fenchel", item: "fenchel", amount: 15, rewardGold: 2500, rewardXp: 1000, completed: false }
    },
    {
        id: 8, title: "Kapitel 8: Blutige Rüstungen", reqLevel: 8, unlocked: false,
        text: `Freya, die Gildenkriegerin, stolpert verwundet auf deinen Hof. Du versorgst ihre Wunden mit Alchemietränken.\n\nAls sie erwacht, zieht sie dich am Hemd zu sich heran. "Kein Mann hat je mein Leben gerettet, {PLAYER_NAME}", murmelt sie heiser. "Mein Schwert, mein Körper... alles, was ich bin, gehört ab heute dir!"`,
        quest: { title: "Auftrag 8: Wundheilung", desc: "Sammle 20x Mangold", item: "mangold", amount: 20, rewardGold: 3500, rewardXp: 1400, completed: false }
    },
    {
        id: 9, title: "Kapitel 9: Sirenen-Gesang", reqLevel: 9, unlocked: false,
        text: `Du stehst am See, als Aria aus den Fluten steigt. Ihr Gesang soll Männer in den Wahnsinn treiben. Doch als sie dich ansieht, bricht ihre Stimme.\n\n"Du hast meinem Zauber widerstanden, {PLAYER_NAME}...", flüstert sie fasziniert, schlingt ihre feuchten Arme um dich und zieht dich für einen langen Kuss ins seichte Wasser.`,
        quest: { title: "Auftrag 9: Bäumchen der Macht", desc: "Sammle 20x Brokkoli", item: "brokkoli", amount: 20, rewardGold: 5000, rewardXp: 2000, completed: false }
    },
    {
        id: 10, title: "Kapitel 10: Sündige Gebete", reqLevel: 10, unlocked: false,
        text: `Hestia, die Hohepriesterin, besucht deine Farm zur Prüfung. Doch als sie deine Hand berührt, durchströmt sie ein magischer Schauer.\n\nErrötend sinkt sie auf die Knie. "Die Schriften haben gelogen. Du bist kein Bauer... du bist das wahre Göttliche, {PLAYER_NAME}." Sie blickt zu dir auf: "Lass mich dir als deine Frau dienen."`,
        quest: { title: "Auftrag 10: Weiße Ernte", desc: "Sammle 20x Blumenkohl", item: "blumenkohl", amount: 20, rewardGold: 8000, rewardXp: 3000, completed: false }
    },
    {
        id: 11, title: "Kapitel 11: Der Besessenheitstrank", reqLevel: 11, unlocked: false,
        text: `Morgana die Hexe mischt einen Liebestrank in deinen Wein. Du trinkst ihn, doch deine Isekai-Immunität neutralisiert die Wirkung. Verwirrt trinkt Morgana den Rest selbst.\n\nIhre Wangen glühen auf. "{PLAYER_NAME}...", keucht sie und wirft sich in deine Arme. "Was hast du getan? Ich bin... süchtig nach dir! Ich diene nur noch dir!"`,
        quest: { title: "Auftrag 11: Fruchtige Verlockung", desc: "Besitze 10x Äpfel", item: "apfel", amount: 10, rewardGold: 12000, rewardXp: 4500, completed: false }
    },
    {
        id: 12, title: "Kapitel 12: Liliths Eifersucht", reqLevel: 12, unlocked: false,
        text: `Als du mit Freya trainierst, hüllt Lilith den Raum in Schatten. Sie zieht dich vor Freyas Augen in einen leidenschaftlichen Kuss.\n\n"Er gehört mir", zischt die Vampirin. Zu dir gewandt flüstert sie besessen: "{PLAYER_NAME}, blickst du noch einmal eine andere an, kette ich dich in meiner Gruft an. Du bist mein!"`,
        quest: { title: "Auftrag 12: Süßer Saft", desc: "Besitze 10x Birnen", item: "birne", amount: 10, rewardGold: 18000, rewardXp: 6000, completed: false }
    },
    {
        id: 13, title: "Kapitel 13: Der Hort des Drachen", reqLevel: 13, unlocked: false,
        text: `Pyra zerrt dich in die Minen zu ihrem Goldberg. Doch sie beachtet die Schätze nicht, sondern drückt dich rittlings auf die Goldbarren.\n\n"All dieses Gold ist wertlos, {PLAYER_NAME}", schnurrt sie besitzergreifend. "Mein wahrer Schatz bist du. Und ich teile dich mit niemandem!"`,
        quest: { title: "Auftrag 13: Kirschblüten-Opfer", desc: "Besitze 10x Kirschen", item: "kirsche", amount: 10, rewardGold: 25000, rewardXp: 8500, completed: false }
    },
    {
        id: 14, title: "Kapitel 14: Die Unterwerfung der Spione", reqLevel: 14, unlocked: false,
        text: `Katsumi weckt dich. Vor deinem Bett liegen gefesselt die Berater des Kaisers. Katsumi räkelt sich schnurrend an deinen Beinen.\n\n"Ich habe Mäuse für dich gefangen, {PLAYER_NAME}. Sollen wir sie töten? Für dich brenne ich das ganze Kaiserreich nieder!"`,
        quest: { title: "Auftrag 14: Samtige Genüsse", desc: "Besitze 10x Pfirsiche", item: "pfirsich", amount: 10, rewardGold: 35000, rewardXp: 12000, completed: false }
    },
    {
        id: 15, title: "Kapitel 15: Heilige Sünde", reqLevel: 15, unlocked: false,
        text: `Du findest Celestia und Hestia im Gebet vor einer Statue, die dich darstellt. Sie knien nieder und kriechen auf dich zu.\n\n"Unser wahrer Gott {PLAYER_NAME}... lass uns dir heute Nacht gemeinsam dienen", flüstern sie voller Hingabe.`,
        quest: { title: "Auftrag 15: Blaue Früchte", desc: "Besitze 15x Pflaumen", item: "pflaume", amount: 15, rewardGold: 50000, rewardXp: 16000, completed: false }
    },
    {
        id: 16, title: "Kapitel 16: Elarias Fluch", reqLevel: 16, unlocked: false,
        text: `Dornenranken haben dein Haus eingeschlossen. Elaria schlingt ihre Arme von hinten um dich. "Der Wald hat uns eingesperrt, {PLAYER_NAME}."\n\n"Die Außenwelt ist schmutzig. Hier drinnen sind wir sicher... für die nächsten tausend Jahre nur du und ich."`,
        quest: { title: "Auftrag 16: Sauer-Ernte", desc: "Besitze 15x Zitronen", item: "zitrone", amount: 15, rewardGold: 70000, rewardXp: 22000, completed: false }
    },
    {
        id: 17, title: "Kapitel 17: Dunkle Verlockung", reqLevel: 17, unlocked: false,
        text: `Aria bringt das Schiff des Kaisers zum Sinken und legt dir die Krone des Kapitäns zu Füßen.\n\n"Jeder, der {PLAYER_NAME} Tribut verweigert, geht unter", säuselt die Sirene und zieht dich für einen endlosen Kuss ins Wasser.`,
        quest: { title: "Auftrag 17: Sonnen-Süße", desc: "Besitze 15x Orangen", item: "orange", amount: 15, rewardGold: 100000, rewardXp: 30000, completed: false }
    },
    {
        id: 18, title: "Kapitel 18: Die Armee der Hexe", reqLevel: 18, unlocked: false,
        text: `Morgana zeigt dir hunderte Obsidian-Golems. "Sie gehorchen nur deinem Blut, {PLAYER_NAME}. Mit einem Wort von dir reißen wir das Kaiserreich ein."`,
        quest: { title: "Auftrag 18: Tropen-Proviant", desc: "Besitze 15x Bananen", item: "banane", amount: 15, rewardGold: 150000, rewardXp: 40000, completed: false }
    },
    {
        id: 19, title: "Kapitel 19: Freyas Geständnis", reqLevel: 19, unlocked: false,
        text: `Freya kehrt verwundet zurück, drückt dich grob an die Wand und vergräbt ihr Gesicht an deinem Hals. "Ich sehe nur noch dich, {PLAYER_NAME}. Mach mich zu deiner Frau!"`,
        quest: { title: "Auftrag 19: Eier-Vorrat", desc: "Besitze 10x Hühner-Eier", item: "huhn", amount: 10, rewardGold: 220000, rewardXp: 55000, completed: false }
    },
    {
        id: 20, title: "Kapitel 20: Der Biss der Ewigkeit", reqLevel: 20, unlocked: false,
        text: `Lilith besucht dich hüllenlos bei Neumond. Ihre Reißzähne bohren sich tief in deinen Nacken. Unendliche Lust durchströmt dich. "Du bist nun unsterblich, {PLAYER_NAME}. Mein König für ewig."`,
        quest: { title: "Auftrag 20: Federn der Macht", desc: "Besitze 10x Enten-Federn", item: "ente", amount: 10, rewardGold: 350000, rewardXp: 80000, completed: false }
    },
    {
        id: 21, title: "Kapitel 21: Der Fall von Valoria", reqLevel: 21, unlocked: false,
        text: `Kaiser Valorius wird in Ketten vor dich geschleift. Pyra und Freya zwingen ihn auf die Knie. "Verschont mich, Lord {PLAYER_NAME}! Das Reich gehört euch!" deine Macht ist absolut.`,
        quest: { title: "Auftrag 21: Wachtposten", desc: "Besitze 10x Gänse-Federn", item: "gans", amount: 10, rewardGold: 500000, rewardXp: 120000, completed: false }
    },
    {
        id: 22, title: "Kapitel 22: Thron aus Adamantit", reqLevel: 22, unlocked: false,
        text: `Deine Arbeiter bergen Adamantit. Morgana graviert Runen hinein. "Nimm Platz, {PLAYER_NAME}. Dein Thron wartet."`,
        quest: { title: "Auftrag 22: Geflügel-Ertrag", desc: "Besitze 10x Puter-Federn", item: "truthahn", amount: 10, rewardGold: 700000, rewardXp: 150000, completed: false }
    },
    {
        id: 23, title: "Kapitel 23: Sylphias Illusion", reqLevel: 23, unlocked: false,
        text: `Sylphia erschafft eine Illusion aus Feenstaub. Hundert Feen mit ihrem Gesicht schlingen sich um dich. "Du kannst mir nicht entkommen, {PLAYER_NAME}."`,
        quest: { title: "Auftrag 23: Nachwuchs-Segen", desc: "Besitze 15x Küken", item: "kueken", amount: 15, rewardGold: 1000000, rewardXp: 200000, completed: false }
    },
    {
        id: 24, title: "Kapitel 24: Das Dunkle Ritual", reqLevel: 24, unlocked: false,
        text: `Hestia legt im Tempel ihre Ornate ab. "Vollziehe das Ritual mit mir, {PLAYER_NAME}. Lass uns die alten Götter verhöhnen."`,
        quest: { title: "Auftrag 24: Tauben-Post", desc: "Besitze 15x Botentauben-Briefe", item: "taube", amount: 15, rewardGold: 1500000, rewardXp: 280000, completed: false }
    },
    {
        id: 25, title: "Kapitel 25: Katsumis Beute", reqLevel: 25, unlocked: false,
        text: `Katsumi legt dir den Kopf eines Mantikors zu Füßen. "Streichel mich, {PLAYER_NAME}. Ich war ein armes, treues Kätzchen."`,
        quest: { title: "Auftrag 25: Schwanen-Anmut", desc: "Besitze 15x Schwanen-Federn", item: "schwan", amount: 15, rewardGold: 2200000, rewardXp: 380000, completed: false }
    },
    {
        id: 26, title: "Kapitel 26: Arias Unterwasser-Käfig", reqLevel: 26, unlocked: false,
        text: `Aria baut eine Glaskuppel auf dem Meeresgrund. "Hier bist du sicher vor den anderen Frauen, {PLAYER_NAME}." Du besänftigst ihre Eifersucht mit einem Kuss.`,
        quest: { title: "Auftrag 26: Stein-Fundament", desc: "Besitze 20x Basis-Stein", item: "stein", amount: 20, rewardGold: 3000000, rewardXp: 500000, completed: false }
    },
    {
        id: 27, title: "Kapitel 27: Der Engelssturz", reqLevel: 27, unlocked: false,
        text: `Celestias Flügel färben sich schwarz. "Es ist vollbracht. Ich bin nun vollständig dein gefallener Racheengel, {PLAYER_NAME}."`,
        quest: { title: "Auftrag 27: Feuersteine", desc: "Besitze 20x Flintstein", item: "feuerstein", amount: 20, rewardGold: 4500000, rewardXp: 750000, completed: false }
    },
    {
        id: 28, title: "Kapitel 28: Pyras Brut", reqLevel: 28, unlocked: false,
        text: `Pyra schlingt ihre Arme von hinten um dich. "Ein Kaiserreich braucht Erben, {PLAYER_NAME}. Unsere Drachenbrut wird die Sterne beherrschen!"`,
        quest: { title: "Auftrag 28: Kalk-Bauten", desc: "Besitze 20x Kalkstein", item: "kalkstein", amount: 20, rewardGold: 6000000, rewardXp: 1000000, completed: false }
    },
    {
        id: 29, title: "Kapitel 29: Elarias Wurzeln", reqLevel: 29, unlocked: false,
        text: `Elaria lässt die Wurzeln deines Hofes bis zum Planetenkern wachsen. "Wir kontrollieren das Mana der ganzen Welt, {PLAYER_NAME}!"`,
        quest: { title: "Auftrag 29: Schwarzes Feuer", desc: "Besitze 25x Kohle", item: "kohle", amount: 25, rewardGold: 8500000, rewardXp: 1400000, completed: false }
    },
    {
        id: 30, title: "Kapitel 30: Liliths Hofstaat", reqLevel: 30, unlocked: false,
        text: `Die Adligen von Valoria servieren euch als Ghule den Wein. Lilith lacht: "Die Welt ist viel gehorsamer, wenn ich sie für {PLAYER_NAME} erziehe."`,
        quest: { title: "Auftrag 30: Schiefer-Platten", desc: "Besitze 25x Schiefer", item: "schiefer", amount: 25, rewardGold: 12000000, rewardXp: 2000000, completed: false }
    },
    {
        id: 31, title: "Kapitel 31: Der Dämonenlord weicht zurück", reqLevel: 31, unlocked: false,
        text: `Ein Erzdämon bricht durch ein Portal. Als er sieht, wie deine Heldinnen dir gehorsam zu Füßen sitzen, weicht er zitternd zurück. "Ihr habt ein Monster erschaffen!"`,
        quest: { title: "Auftrag 31: Kupfer-Schmelze", desc: "Besitze 25x Kupfererz", item: "kupfer", amount: 25, rewardGold: 18000000, rewardXp: 3000000, completed: false }
    },
    {
        id: 32, title: "Kapitel 32: Freyas Kriegszug", reqLevel: 32, unlocked: false,
        text: `Freya kehrt vom Nachbarkontinent zurück. "Der Südkontinent gehört dir, {PLAYER_NAME}." Sie bricht erschöpft in deine Arme. "Belohnst du mich?"`,
        quest: { title: "Auftrag 32: Eisen-Rüstung", desc: "Besitze 25x Hämatit-Eisen", item: "eisen", amount: 25, rewardGold: 25000000, rewardXp: 4500000, completed: false }
    },
    {
        id: 33, title: "Kapitel 33: Hexenkunst und Leidenschaft", reqLevel: 33, unlocked: false,
        text: `Morgana verzaubert deinen Körper. "Ich mache dich unzerstörbar, {PLAYER_NAME}. Ich ertrage den Gedanken nicht, dich je zu verlieren!"`,
        quest: { title: "Auftrag 33: Warme Suppe", desc: "Koche 5x Möhrensuppe", item: "moehrensuppe", amount: 5, rewardGold: 35000000, rewardXp: 6000000, completed: false }
    },
    {
        id: 34, title: "Kapitel 34: Katzenhafte Hingabe", reqLevel: 34, unlocked: false,
        text: `Katsumi hält dir ein goldenes Halsband hin. "Lege es mir vor allen an, {PLAYER_NAME}. Alle sollen wissen, dass ich dein Haustier bin."`,
        quest: { title: "Auftrag 34: Pesto-Kochen", desc: "Koche 5x Bärlauch-Pesto", item: "baerlauchpesto", amount: 5, rewardGold: 50000000, rewardXp: 8500000, completed: false }
    },
    {
        id: 35, title: "Kapitel 35: Feenstaub und Obsession", reqLevel: 35, unlocked: false,
        text: `Sylphia lächelt süß: "Jemand hat dich falsch angesehen, {PLAYER_NAME}. Ich habe ihn in einen Baum verwandelt. Er stört nie wieder."`,
        quest: { title: "Auftrag 35: Kräuter-Gourmet", desc: "Koche 5x Pesto Genovese", item: "basilikumsosse", amount: 5, rewardGold: 75000000, rewardXp: 12000000, completed: false }
    },
    {
        id: 36, title: "Kapitel 36: Der Ozean weicht", reqLevel: 36, unlocked: false,
        text: `Aria verdrängt das Meer mit ihrem Gesang für deinen Hof. "{PLAYER_NAME}, für dich lasse ich den Ozean austrocknen!"`,
        quest: { title: "Auftrag 36: Knackiger Salat", desc: "Bereite 5x Radieschen-Salat zu", item: "radieschensalat", amount: 5, rewardGold: 100000000, rewardXp: 18000000, completed: false }
    },
    {
        id: 37, title: "Kapitel 37: Göttliche Blasphemie", reqLevel: 37, unlocked: false,
        text: `Hestia setzt dir die Papstkrone auf. "Es gibt keine Götter über dir, {PLAYER_NAME}. Nur wir, deine unterwürfigen Frauen."`,
        quest: { title: "Auftrag 37: Slime-Glibber", desc: "Besiege Slimes (10x Slime-Beute)", item: "slime", amount: 10, rewardGold: 150000000, rewardXp: 25000000, completed: false }
    },
    {
        id: 38, title: "Kapitel 38: Der Schattenmond", reqLevel: 38, unlocked: false,
        text: `Lilith hüllt die Welt in eine ewige Sonnenfinsternis. "Das Licht störte nur, {PLAYER_NAME}. Nun herrschen wir ewig in Finsternis."`,
        quest: { title: "Auftrag 38: Heilige Braukunst", desc: "Braue 5x Kleine Heilung", item: "heiltrank", amount: 5, rewardGold: 220000000, rewardXp: 35000000, completed: false }
    },
    {
        id: 39, title: "Kapitel 39: Das Ende der Isekai-Regeln", reqLevel: 39, unlocked: false,
        text: `Die System-KI bricht zusammen. Deine Macht überschreibt den Code. "{PLAYER_NAME}, du bist nun der Programmierer dieser Realität!"`,
        quest: { title: "Auftrag 39: Magisches Elixier", desc: "Braue 5x Kleinen Mana-Trank", item: "manatrank", amount: 5, rewardGold: 350000000, rewardXp: 50000000, completed: false }
    },
    {
        id: 40, title: "Kapitel 40: Der Ewige Gottkaiser", reqLevel: 40, unlocked: false,
        text: `Im Thronraum knien die zehn mächtigsten Frauen des Universums vor dir. Elaria küsst deine Hand. "Mein geliebter {PLAYER_NAME}... Die Welt gehört uns. Wir dienen dir ewig!"`,
        quest: { title: "Auftrag 40: Das Finale Olymp-Festmahl", desc: "Koche 1x Olymp-Festmahl", item: "goetter_menu", amount: 1, rewardGold: 999999999, rewardXp: 99999999, completed: false }
    }
];