const tenses = ['Präsens','Präteritum','Perfekt','Plusquamperfekt','Futur I','Futur II'];
const voices = ['Aktiv','Vorgangspassiv','Zustandspassiv'];
const forms = [
 ['Die Crew öffnet das Schott.','Die Crew öffnete das Schott.','Die Crew hat das Schott geöffnet.','Die Crew hatte das Schott geöffnet.','Die Crew wird das Schott öffnen.','Die Crew wird das Schott geöffnet haben.'],
 ['Das Schott wird geöffnet.','Das Schott wurde geöffnet.','Das Schott ist geöffnet worden.','Das Schott war geöffnet worden.','Das Schott wird geöffnet werden.','Das Schott wird geöffnet worden sein.'],
 ['Das Schott ist geöffnet.','Das Schott war geöffnet.','Das Schott ist geöffnet gewesen.','Das Schott war geöffnet gewesen.','Das Schott wird geöffnet sein.','Das Schott wird geöffnet gewesen sein.']
];
const timeClues = [
 'Funke in der Gegenwartsform.', 'Nutze die einfache Erzählvergangenheit.',
 'Nutze die vollendete Gegenwart.', 'Das Geschehen liegt vor einem anderen Zeitpunkt in der Vergangenheit.',
 'Nutze die einfache Zukunftsform.', 'Betrachte das Geschehen aus der Zukunft als abgeschlossen.'
];
const timeRules = [
 ['Das finite Vollverb steht im Präsens.','Das finite Vollverb steht im Präteritum.','«hat» + Partizip II','«hatte» + Partizip II','«wird» + Infinitiv','«wird» + Partizip II + «haben»'],
 ['«wird» + Partizip II','«wurde» + Partizip II','«ist» + Partizip II + «worden»','«war» + Partizip II + «worden»','«wird» + Partizip II + «werden»','«wird» + Partizip II + «worden sein»'],
 ['«ist» + Partizip II','«war» + Partizip II','«ist» + Partizip II + «gewesen»','«war» + Partizip II + «gewesen»','«wird» + Partizip II + «sein»','«wird» + Partizip II + «gewesen sein»']
];
const time = tenses.flatMap((tense, t) => voices.map((voice, v) => ({
 title: ['Crew am Hebel','Schott in Bewegung','Durchgang frei'][v],
 brief: [ 'Die Crew soll als handelndes Subjekt im Funkspruch vorkommen.', 'Das Schott soll als Subjekt im Funkspruch vorkommen. Melde den Öffnungsvorgang.', 'Das Schott soll als Subjekt im Funkspruch vorkommen. Melde seinen geöffneten Zustand.'][v] + ' ' + timeClues[t],
 hint: tense + ' · ' + voice + '. ' + timeRules[v][t],
 fields: [['Perspektive', voices], ['Zeitstufe', tenses]], answer: [v,t]
})));

const lab = [
 ['Zeugenfunk','Gib die Meldung indirekt im Konjunktiv I der Gegenwart weiter.','Die Technikerin meldet, die Crew … bereit.','sei','ist','wäre','«Sei» ist die Konjunktiv-I-Form von «sein».'],
 ['Stimmen aus dem Archiv','Gib das Öffnen als bereits geschehen in indirekter Rede wieder. Verwende Konjunktiv I Aktiv.','Der Pilot sagt, er … das Schott …','habe · geöffnet','hätte · geöffnet','hat · geöffnet','Konjunktiv I Perfekt Aktiv: «habe» + Partizip II.'],
 ['Fremdes Signal','Gib eine bereits abgeschlossene Reparatur im Konjunktiv I Vorgangspassiv wieder.','Die Crew meldet, die Antenne …','sei repariert worden','sei repariert','wäre repariert worden','Konjunktiv I Perfekt im Vorgangspassiv verwendet «sei … worden».'],
 ['Prognose','Gib die Prognose im Konjunktiv I Futur I Vorgangspassiv weiter.','Die Crew meldet, die Antenne …','werde repariert werden','wird repariert werden','werde reparieren','«Werde» markiert den Konjunktiv I. «Repariert werden» ist der Passivinfinitiv.'],
 ['Paralleluniversum','Setze den irrealen Wunsch in den Konjunktiv II der Gegenwart.','Wenn die Crew nur mehr Zeit …!','hätte','hat','habe','«Hätte» ist die Konjunktiv-II-Form von «haben».'],
 ['Zeitparadox','Die Rettung kam zu spät. Funke die irreale Alternative im Konjunktiv II der Vergangenheit, im Vorgangspassiv.','Ohne Störung … die Kapsel …','wäre · gerettet worden','sei · gerettet worden','wäre · gerettet','«Wäre … worden» drückt hier einen irrealen Vorgang in der Vergangenheit aus.'],
 ['Sofortstart','Sprich einen einzelnen Piloten mit du an. Verwende den Imperativ.','Dein Befehl an den Piloten','Lies den Code!','Lese den Code!','Lest den Code!','«Lesen» hat im Imperativ Singular den Stamm «lies».'],
 ['Doppelschicht','Sprich das ganze Team mit ihr an. Verwende den Imperativ.','Dein Befehl an das Team','Haltet euch fest!','Halte dich fest!','Halten Sie sich fest!','Die ihr-Form des Imperativs lautet «haltet».'],
 ['Handbuch','Wähle den erweiterten Infinitiv mit zu.','Ziel des Versuchs','das Signal abzufangen','das Signal zu abfangen','das Signal abgefangen','Bei «abfangen» steht «zu» zwischen Vorsilbe und Verbstamm.'],
 ['Warteschleife','Wähle den Infinitiv Perfekt Aktiv.','Die Pilotin behauptet, …','das Signal empfangen zu haben','das Signal zu empfangen','das Signal empfangen zu werden','Partizip II + «zu haben» drückt Vorzeitigkeit aus.'],
 ['Lebendes Signal','Wähle das Partizip I für einen Sender, der gerade blinkt.','Welcher Sender ist gemeint?','der blinkende Sender','der geblinkte Sender','der erloschene Sender','«Blinkend» entsteht aus Infinitiv + d. Als Adjektiv bekommt es eine Endung.'],
 ['Schrottfeld','Wähle das Partizip II für ein bereits verlorenes Objekt.','Welches Objekt wird gesucht?','die verlorene Sonde','die verlierende Sonde','die verlierbare Sonde','«Verloren» ist das Partizip II von «verlieren».'],
 ['Startprotokoll','Wähle die 2. Person Singular im Präsens.','Du … die Kapsel zur Rampe.','fährst','fahrst','fahrt','«Fahren» wechselt in der 2. und 3. Person Singular von a zu ä.'],
 ['Gravitation aus','Wähle das Perfekt des Bewegungsverbs.','Wir … zur Erde zurückgekehrt.','sind','haben','werden','«Zurückkehren» bildet das Perfekt mit «sein».']
].map(([title, brief, sample, correct, first, second, hint], index) => {
 const options = [correct,first,second];
 const offset = index % options.length;
 return {title,brief,sample,hint,fields:[['Funkkanal',options.slice(offset).concat(options.slice(0,offset))]],answer:[(3-offset)%3]};
});

const cases = ['Nominativ','Akkusativ','Dativ','Genitiv'];
const cargo = [
 ['Wer blockiert das Tor?','ein','schwer','Koffer',0,'ein','er','Koffer','Das Subjekt steht im Nominativ. Nach «ein» trägt das Adjektiv die Endung -er.'],
 ['Was scannt der Roboter?','der','schwer','Koffer',1,'den','en','Koffer','«Scannen» hat hier ein Akkusativobjekt. Maskulin wird «der» zu «den».'],
 ['Wem folgt die Drohne?','der','klein','Roboter',2,'dem','en','Roboter','«Folgen» verlangt den Dativ. Nach «dem» steht die Endung -en.'],
 ['Wessen Siegel ist gebrochen?','der','alt','Container',3,'des','en','Containers','Maskuline Nomen erhalten im Genitiv Singular häufig -s oder -es. Hier lautet die Form «Containers».'],
 ['Wer sendet das Signal?','die','neu','Sonde',0,'die','e','Sonde','Feminines Nominativsubjekt mit bestimmtem Artikel: «die neue Sonde».'],
 ['Was repariert die Crew?','ein','defekt','Ventil',1,'ein','es','Ventil','Neutrum im Akkusativ nach «ein»: Das Adjektiv bekommt -es.'],
 ['Wem hilft der Pilot? (Plural)','die','jung','Techniker',2,'den','en','Technikern','«Helfen» verlangt den Dativ. Im Dativ Plural erhält «Techniker» ein zusätzliches -n.'],
 ['Wessen Signal fehlt? (Plural)','die','klein','Sonden',3,'der','en','Sonden','Im Genitiv Plural steht «der» und das Adjektiv endet danach auf -en.'],
 ['Was sieht die Crew?','der','verletzt','Pilot',1,'den','en','Piloten','«Pilot» ist ein schwaches Maskulinum. Im Akkusativ Singular lautet es «Piloten».'],
 ['Was dient als Treibstoff?','ohne Artikel','kalt','Gas',0,'—','es','Gas','Ohne Artikel trägt das Adjektiv im Nominativ Neutrum die starke Endung -es.'],
 ['Wem gilt der Dank?','kein','müde','Ärztin',2,'keiner','en','Ärztin','Femininer Dativ mit «kein»: «keiner müden Ärztin».'],
 ['Was benötigt das Labor? (Plural)','ohne Artikel','neu','Filter',1,'—','e','Filter','Ohne Artikel trägt das Adjektiv im Akkusativ Plural die Endung -e.']
].map(([title, article, stem, noun, k, det, end, flex, hint]) => {
 const determinants = {'der':['der','den','dem','des'],'die':['die','der','den','denen'],'ein':['ein','eine','einen','einem'],'kein':['keine','keiner','keinem','keinen'],'ohne Artikel':['—']}[article];
 const nouns = [...new Set([noun,flex,noun+'n',noun+'s'])];
 const endings = ['e','en','er','es','em'];
 return {title,brief:'Ziehe die Teile aufs Frachtschild unten im Fenster oder tippe sie an. Grundform: '+[article,stem,noun].join(' · '),hint,stem,
 fields:[['Kasus',cases],['Begleiter',determinants],['Endung',endings],['Nomen',nouns]],answer:[k,determinants.indexOf(det),endings.indexOf(end),nouns.indexOf(flex)]};
});

const routes = [
 ['in','Fahre in den Hangar hinein.','in den Hangar','Ziel im Inneren → Akkusativ.','innen',1],
 ['in','Kreise im Hangar. Der Kurier bleibt während der Fahrt darin.','im Hangar','Ort der Bewegung → Dativ. «Im» steht für «in dem».','innen',2],
 ['auf','Setze auf dem Hangardach zur Landung an, indem du vom Orbit auf das Dach fliegst.','auf das Hangardach','Der Flug hat das Dach als Ziel → Akkusativ.','dach',1],
 ['auf','Warte auf dem Hangardach auf das Signal.','auf dem Hangardach','Der Warteort bleibt gleich → Dativ.','dach',2],
 ['unter','Fliege unter die Brücke und bleibe dort.','unter die Brücke','Die Position unter der Brücke ist das Ziel → Akkusativ.','unten',1],
 ['über','Schwebe über der Brücke auf der Stelle.','über der Brücke','Die Position über der Brücke ist der Ort → Dativ.','oben',2],
 ['neben','Stelle die Fracht neben den Hangar.','neben den Hangar','Die Fracht bekommt einen neuen Standort → Akkusativ.','seite',1],
 ['vor','Parke vor dem Hangartor. Dein Kurier steht bereits auf dem Vorplatz.','vor dem Hangartor','Der Standort liegt vor dem Tor → Dativ.','vor',2],
 ['hinter','Zieh dich hinter den Hangar zurück.','hinter den Hangar','Die Position hinter dem Hangar ist das Ziel → Akkusativ.','hinten',1],
 ['zwischen','Manövriere in die Lücke zwischen den beiden Modulen hinein.','zwischen die Module','Die Lücke ist das Ziel → Akkusativ.','lücke',1],
 ['an','Docke an der Aussenwand an. Wähle für das Funksignal die Richtung, in die du fliegst.','an die Aussenwand','Die Aussenwand ist das Ziel → Akkusativ.','wand',1],
 ['durch','Durchquere den markierten Tunnel.','durch den Tunnel','«Durch» verlangt den Akkusativ.','innen',1],
 ['aus','Starte aus dem Hangar ins Freie. Markiere den Ausgangspunkt.','aus dem Hangar','«Aus» verlangt den Dativ und bezeichnet hier den Ausgangspunkt.','innen',2],
 ['wegen','Die Trümmer sind der Grund für eine Sperre. Markiere das Trümmerfeld.','wegen der Trümmer','«Wegen» steht hier standardsprachlich mit Genitiv.','unten',3],
 ['mit','Nutze die Seitenfähre für den Transfer. Markiere die Fähre.','mit der Fähre','«Mit» verlangt den Dativ und bezeichnet hier das Transportmittel.','seite',2],
 ['ohne','Der Ersatzakku soll zurückbleiben. Markiere ihn am Vorplatz.','ohne den Ersatzakku','«Ohne» verlangt den Akkusativ.','vor',1],
 ['seit','Die Sperre gilt seit einem Monat. Markiere das Uhrsignal oben.','seit einem Monat','«Seit» verlangt den Dativ und kennzeichnet hier einen Zeitraum bis jetzt.','oben',2],
 ['trotz','Fliege trotz des Sturms. Markiere das Wetterfeld hinter dem Hangar.','trotz des Sturms','«Trotz» steht hier mit Genitiv und signalisiert einen Gegengrund.','hinten',3]
].map(([prep,brief,sample,hint,spot,k]) => ({
 title:'Kurs ' + prep.toUpperCase(),brief,sample,hint,
 fields:[['Präposition',[...new Set(['in','auf','unter','über','neben','vor','hinter','zwischen','an',prep])]],['Kasus',cases]],
 answer:[['in','auf','unter','über','neben','vor','hinter','zwischen','an',prep].indexOf(prep),k],spot
}));
const stations = [
 {name:'Zeitmaschine',symbol:'◴', missions:time},
 {name:'Formlabor',symbol:'⌁',missions:lab},
 {name:'Frachtkammer',symbol:'◇',missions:cargo},
 {name:'Raumschleuse',symbol:'⊹',missions:routes}
];
