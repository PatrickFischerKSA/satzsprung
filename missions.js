const tenses = ['Präsens','Präteritum','Perfekt','Plusquamperfekt','Futur I','Futur II'];
const voices = ['Aktiv','Vorgangspassiv','Zustandspassiv'];
const forms = [
 ['Die Kugel kippt den Becher um.','Die Kugel kippte den Becher um.','Die Kugel hat den Becher umgekippt.','Die Kugel hatte den Becher umgekippt.','Die Kugel wird den Becher umkippen.','Die Kugel wird den Becher umgekippt haben.'],
 ['Der Becher wird umgekippt.','Der Becher wurde umgekippt.','Der Becher ist umgekippt worden.','Der Becher war umgekippt worden.','Der Becher wird umgekippt werden.','Der Becher wird umgekippt worden sein.'],
 ['Der Becher ist umgekippt.','Der Becher war umgekippt.','Der Becher ist umgekippt gewesen.','Der Becher war umgekippt gewesen.','Der Becher wird umgekippt sein.','Der Becher wird umgekippt gewesen sein.']
];
const timeRules = [
 ['Das finite Vollverb steht im Präsens.','Das finite Vollverb steht im Präteritum.','«hat» + Partizip II','«hatte» + Partizip II','«wird» + Infinitiv','«wird» + Partizip II + «haben»'],
 ['«wird» + Partizip II','«wurde» + Partizip II','«ist» + Partizip II + «worden»','«war» + Partizip II + «worden»','«wird» + Partizip II + «werden»','«wird» + Partizip II + «worden sein»'],
 ['«ist» + Partizip II','«war» + Partizip II','«ist» + Partizip II + «gewesen»','«war» + Partizip II + «gewesen»','«wird» + Partizip II + «sein»','«wird» + Partizip II + «gewesen sein»']
];
const time = tenses.flatMap((tense, t) => [1,2,0].map(v => ({
 title: 'Die Aufnahme beschriften',
 sample: forms[v===0 ? 1 : 0][t],
 brief: 'Setze den Satz in die Form «'+voices[v]+'». Behalte die Zeitform bei ('+tense+').',
 hint: tense + ' · ' + voices[v] + '. ' + timeRules[v][t],
 fields: [['Perspektive', voices], ['Zeitstufe', tenses]], answer: [v,t]
})));

const lab = [
 ['Aussage von Ada','Gib die Meldung indirekt im Konjunktiv I der Gegenwart weiter.','Ada sagt, der Pokal … auf dem Wagen.','stehe','steht','stünde','«Stehe» ist die Konjunktiv-I-Form von «stehen».'],
 ['Stimmen aus dem Archiv','Gib das Öffnen als bereits geschehen in indirekter Rede wieder. Verwende Konjunktiv I Aktiv.','Noah sagt, er … den Schrank …','habe · geöffnet','hätte · geöffnet','hat · geöffnet','Konjunktiv I Perfekt Aktiv: «habe» + Partizip II.'],
 ['Fremdes Signal','Gib eine bereits abgeschlossene Reparatur im Konjunktiv I Vorgangspassiv wieder.','Die Hauswartin meldet, die Kamera …','sei repariert worden','sei repariert','wäre repariert worden','Konjunktiv I Perfekt im Vorgangspassiv verwendet «sei … worden».'],
 ['Prognose','Gib die Prognose im Konjunktiv I Futur I Vorgangspassiv weiter.','Die Hauswartin meldet, die Kamera …','werde repariert werden','wird repariert werden','werde reparieren','«Werde» markiert den Konjunktiv I. «Repariert werden» ist der Passivinfinitiv.'],
 ['Zu wenig Zeit','Setze den irrealen Wunsch in den Konjunktiv II der Gegenwart.','Wenn Ada nur mehr Zeit …!','hätte','hat','habe','«Hätte» ist die Konjunktiv-II-Form von «haben».'],
 ['Zeitparadox','Die Rettung kam zu spät. Funke die irreale Alternative im Konjunktiv II der Vergangenheit, im Vorgangspassiv.','Ohne Störung … der Pokal …','wäre · gerettet worden','sei · gerettet worden','wäre · gerettet','«Wäre … worden» drückt hier einen irrealen Vorgang in der Vergangenheit aus.'],
 ['Sofortstart','Sprich eine einzelne Person mit du an. Verwende den Imperativ.','Dein Befehl an Noah','Lies den Code!','Lese den Code!','Lest den Code!','«Lesen» hat im Imperativ Singular den Stamm «lies».'],
 ['Doppelschicht','Sprich das ganze Team mit ihr an. Verwende den Imperativ.','Dein Befehl an das Team','Haltet euch fest!','Halte dich fest!','Halten Sie sich fest!','Die ihr-Form des Imperativs lautet «haltet».'],
 ['Handbuch','Wähle den erweiterten Infinitiv mit zu.','Ziel des Versuchs','das Signal abzufangen','das Signal zu abfangen','das Signal abgefangen','Bei «abfangen» steht «zu» zwischen Vorsilbe und Verbstamm.'],
 ['Warteschleife','Wähle den Infinitiv Perfekt Aktiv.','Ada behauptet, …','das Signal empfangen zu haben','das Signal zu empfangen','das Signal empfangen zu werden','Partizip II + «zu haben» drückt Vorzeitigkeit aus.'],
 ['Lebendes Signal','Wähle das Partizip I für einen Sender, der gerade blinkt.','Welcher Sender ist gemeint?','der blinkende Sender','der geblinkte Sender','der erloschene Sender','«Blinkend» entsteht aus Infinitiv + d. Als Adjektiv bekommt es eine Endung.'],
 ['Unter dem Tisch','Wähle das Partizip II für ein bereits verlorenes Objekt.','Welches Objekt wird gesucht?','die verlorene Kugel','die verlierende Kugel','die verlierbare Kugel','«Verloren» ist das Partizip II von «verlieren».'],
 ['Startprotokoll','Wähle die 2. Person Singular im Präsens.','Du … den Wagen zur Rampe.','fährst','fahrst','fahrt','«Fahren» wechselt in der 2. und 3. Person Singular von a zu ä.'],
 ['Zurück in der Aula','Wähle das Perfekt des Bewegungsverbs.','Wir … in die Aula zurückgekehrt.','sind','haben','werden','«Zurückkehren» bildet das Perfekt mit «sein».']
].map(([title, brief, sample, correct, first, second, hint], index) => {
 const options = [correct,first,second];
 const offset = index % options.length;
 return {title,brief,sample,hint,fields:[['Funkkanal',options.slice(offset).concat(options.slice(0,offset))]],answer:[(3-offset)%3]};
});

const cases = ['Nominativ','Akkusativ','Dativ','Genitiv'];
const cargo = [
 ['Wer oder was stiess die Kette an?','die','rot','Kugel',0,'die','e','Kugel','Das Subjekt nennt den Auslöser und steht im Nominativ.','Die rote Kugel stiess die Kette an.'],
 ['Wen oder was kippte die Kugel um?','der','leicht','Becher',1,'den','en','Becher','Das Akkusativobjekt bezeichnet hier den Gegenstand, auf den die Kugel einwirkte.','Die Kugel kippte den leichten Becher um. Der Becher setzte die Dominosteine in Bewegung.'],
 ['Wem versetzten die Dominosteine einen Stoss?','der','klein','Wagen',2,'dem','en','Wagen','Bei «jemandem einen Stoss versetzen» steht das Ziel des Stosses im Dativ.','Die Dominosteine versetzten dem kleinen Wagen einen Stoss. Seine Radspur führt hinter den Vorhang.'],
 ['Wessen Inhalt zeigt das letzte Foto vor dem Klappern?','der','klein','Wagen',3,'des','en','Wagens','Der Genitiv zeigt, zu welchem Gegenstand der Inhalt gehört.','Der Inhalt des kleinen Wagens war der Pokal. Auf dem Foto steht er auf der Ladefläche.'],
 ['Wer nimmt die Bilder auf?','die','neu','Kamera',0,'die','e','Kamera','Feminines Nominativsubjekt mit bestimmtem Artikel: «die neue Kamera».'],
 ['Was repariert die Crew?','ein','defekt','Ventil',1,'ein','es','Ventil','Neutrum im Akkusativ nach «ein»: Das Adjektiv bekommt -es.'],
 ['Wem hilft der Pilot? (Plural)','die','jung','Techniker',2,'den','en','Technikern','«Helfen» verlangt den Dativ. Im Dativ Plural erhält «Techniker» ein zusätzliches -n.'],
 ['Wessen Signal fehlt? (Plural)','die','klein','Kameras',3,'der','en','Kameras','Im Genitiv Plural steht «der» und das Adjektiv endet danach auf -en.'],
 ['Was sieht die Crew?','der','verletzt','Pilot',1,'den','en','Piloten','«Pilot» ist ein schwaches Maskulinum. Im Akkusativ Singular lautet es «Piloten».'],
 ['Was dient als Treibstoff?','ohne Artikel','kalt','Gas',0,'—','es','Gas','Ohne Artikel trägt das Adjektiv im Nominativ Neutrum die starke Endung -es.'],
 ['Wem gilt der Dank?','kein','müde','Ärztin',2,'keiner','en','Ärztin','Femininer Dativ mit «kein»: «keiner müden Ärztin».'],
 ['Was benötigt das Labor? (Plural)','ohne Artikel','neu','Filter',1,'—','e','Filter','Ohne Artikel trägt das Adjektiv im Akkusativ Plural die Endung -e.']
].map(([title, article, stem, noun, k, det, end, flex, hint, clue]) => {
 if (clue) {
  const reports = [
   {
    title:'Der Auslöser',sample:'Den leichten Becher stiess vor dem Klappern die rote Kugel an.',
    brief:'Isoliere die Wortgruppe, die den Auslöser nennt. Bestimme ihren Kasus und begründe ihn.',
    phrases:['den leichten Becher','vor dem Klappern','die rote Kugel'],
    reasons:['Die Wortgruppe steht am Satzanfang.','Das Verb steht in der Einzahl und richtet sich nach dieser Wortgruppe.','Die Präposition «vor» verlangt hier den Dativ.'],
    pick:2,reason:1,
    explanation:'«Die rote Kugel» ist das Subjekt. Bei «die roten Kugeln» müsste es «stiessen» heissen. Die erste Wortgruppe ist hier das Akkusativobjekt.'
   },
   {
    title:'Das erste Hindernis',sample:'Die rote Kugel kippte das leichte Trinkgefäss um.',
    brief:'Wähle die Wortgruppe für den Gegenstand, der umkippte. Bestimme ihren Kasus und prüfe ihn mit einer Ersatzprobe.',
    phrases:['die rote Kugel','das leichte Trinkgefäss','im Protokoll'],
    reasons:['Mit einem maskulinen Nomen lautet die Wortgruppe «der leichte Becher».','Der Artikel «das» zeigt eindeutig den Nominativ.','Mit einem maskulinen Nomen lautet die Wortgruppe «den leichten Becher».'],
    pick:1,reason:2,
    explanation:'«Die leichte Tasse» könnte der Form nach auch Nominativ sein. Die Ersatzprobe «den leichten Becher» macht den Akkusativ sichtbar.'
   },
   {
    title:'Die Richtung des Stosses',sample:'Hinter dem Tisch versetzten die Dominosteine dem kleinen Wagen einen Stoss.',
    brief:'Wähle die Wortgruppe für das Ziel des Stosses. Bestimme ihren Kasus und unterscheide sie von der Ortsangabe.',
    phrases:['dem kleinen Wagen','hinter dem Tisch','einen Stoss'],
    reasons:['«Jemandem einen Stoss versetzen» verlangt für das Ziel ein Dativobjekt.','«Hinter» verlangt hier den Dativ für den Ort.','«Einen» zeigt den maskulinen Akkusativ an.'],
    pick:0,reason:0,
    explanation:'«Dem kleinen Wagen» ist ein Dativobjekt. «Hinter dem Tisch» enthält ebenfalls einen Dativ, gibt aber den Ort an.'
   },
   {
    title:'Die Ladung im Foto',sample:'Neben der Tür lag ein Foto der Ladefläche. Darauf sah man den Inhalt des kleinen Wagens.',
    brief:'Wähle die Wortgruppe, die angibt, zu welchem Gegenstand der Inhalt gehörte. Bestimme ihren Kasus und ihre Funktion.',
    phrases:['neben der Tür','der Ladefläche','des kleinen Wagens'],
    reasons:['Sie hängt von «Foto» ab und benennt dessen Motiv.','Sie hängt vom Nomen «Inhalt» ab und gibt an, wozu der Inhalt gehört.','Sie hängt unmittelbar vom Verb «sah» ab.'],
    pick:2,reason:1,
    explanation:'«Des kleinen Wagens» ist ein Genitivattribut zu «Inhalt». «Der Ladefläche» ist ebenfalls ein Genitivattribut, gehört aber zu «Foto».'
   }
  ];
  const report = reports[k];
  return {title:report.title,sample:report.sample,brief:report.brief,hint:report.explanation,clue,
   fields:[['1 · Wortgruppe',report.phrases],['2 · Kasus',cases],['3 · Begründung',report.reasons]],
   answer:[report.pick,k,report.reason]};

 }
 const determinants = {'der':['der','den','dem','des'],'die':['die','der','den','denen'],'ein':['ein','eine','einen','einem'],'kein':['keine','keiner','keinem','keinen'],'ohne Artikel':['—']}[article];
 const nouns = [...new Set([noun,flex,noun+'n',noun+'s'])];
 const endings = ['e','en','er','es','em'];
 return {title,brief:'Beantworte die Frage mit dieser Wortgruppe. Wähle Kasus, Begleiter, Adjektivendung und Nomen. Grundform: '+[article,stem,noun].join(' · '),hint,stem,clue,
 fields:[['Welcher Fall beantwortet die Frage?',cases],['Begleiter',determinants],['Endung',endings],['Nomen',nouns]],answer:[k,determinants.indexOf(det),endings.indexOf(end),nouns.indexOf(flex)]};
});

const routes = [
 ['zwischen','Stell den Becher zwischen die Dominosteine.','zwischen die Dominosteine','Die Lücke ist das Ziel.','lücke',1],
 ['in','Die Kugel rollt in die Schachtel.','in die Schachtel','Die Schachtel ist das Ziel. Darum steht «in» hier mit Akkusativ.','innen',1],
 ['in','Die Kugel rollt in der Schachtel im Kreis.','in der Schachtel','Die Kugel bewegt sich am selben Ort. Darum steht «in» hier mit Dativ.','innen',2],
 ['auf','Lege die Kugel auf die Rampe.','auf die Rampe','Die Rampe ist das Ziel.','dach',1],
 ['auf','Die Kugel liegt auf der Rampe.','auf der Rampe','Die Rampe bezeichnet den Ort.','dach',2],
 ['unter','Schiebe die Schachtel unter den Tisch.','unter den Tisch','Die Schachtel kommt an einen neuen Ort.','unten',1],
 ['über','Die Kamera hängt über dem Tisch.','über dem Tisch','Die Kamera hängt an diesem Ort.','oben',2],
 ['neben','Stell die Lampe neben den Tisch.','neben den Tisch','Die Position neben dem Tisch ist das Ziel.','seite',1],
 ['vor','Der Wagen steht vor dem Tisch.','vor dem Tisch','Der Satz nennt den Standort des Wagens.','vor',2],
 ['hinter','Schieb den Wagen hinter den Tisch.','hinter den Tisch','Die Position hinter dem Tisch ist das Ziel.','hinten',1],
 ['an','Schieb den Wagen an die Wand.','an die Wand','Die Wand ist das Ziel.','wand',1],
 ['durch','Die Kugel rollt durch die Schachtel.','durch die Schachtel','«Durch» verlangt den Akkusativ.','innen',1],
 ['aus','Die Kugel rollt aus der Schachtel.','aus der Schachtel','«Aus» verlangt den Dativ und gibt hier den Ausgangspunkt an.','innen',2],
 ['wegen','Wegen der Schachtel bleibt der Wagen stehen.','wegen der Schachtel','«Wegen» steht hier mit Genitiv und nennt den Grund.','innen',3],
 ['mit','Ada beleuchtet die Spur mit der Lampe.','mit der Lampe','«Mit» verlangt den Dativ und bezeichnet hier das Hilfsmittel.','seite',2],
 ['ohne','Noah trägt den Becher ohne die Schachtel weg.','ohne die Schachtel','«Ohne» verlangt den Akkusativ.','innen',1],
 ['seit','Die Kamera läuft seit einer Stunde.','seit einer Stunde','«Seit» verlangt den Dativ und kennzeichnet einen Zeitraum bis jetzt.','oben',2],
 ['trotz','Trotz der Wand erkennt Ada den Wagen auf dem Bild.','trotz der Wand','«Trotz» steht hier mit Genitiv und nennt den Gegengrund.','wand',3]
].map(([prep,brief,sample,hint,spot,k]) => ({
 title:'Den Aufbau prüfen',brief:'Markiere auf der Skizze das Feld zum Satz. Wähle die Präposition und den Kasus ihrer Wortgruppe.',sample:brief,result:sample,hint,
 fields:[['Präposition',[...new Set(['in','auf','unter','über','neben','vor','hinter','zwischen','an',prep])]],['Kasus',cases]],
 answer:[['in','auf','unter','über','neben','vor','hinter','zwischen','an',prep].indexOf(prep),k],spot
}));
const stations = [
 {name:'Aufnahme',symbol:'◴', missions:time},
 {name:'Befragung',symbol:'⌁',missions:lab},
 {name:'Vier Fälle',symbol:'◇',missions:cargo},
 {name:'Aufbau',symbol:'⊹',missions:routes}
];

const links = [
 {
  title:'Die Tür ging zuerst auf',
  sample:'Noah: «Ich öffnete die Tür. Danach hörte ich ein Klappern.»',
  brief:'Schreibe den zweiten Satz aus Noahs Sicht ins Präsens um. Verbinde beide Ereignisse in der richtigen Reihenfolge.',
  fields:[['Präsens · ich',['hörst','höre','hören']],['Verbindung',['bevor','nachdem','obwohl']]],
  answer:[1,1],hint:'Nach «ich» steht «höre». «Nachdem» zeigt, dass Noah die Tür zuerst öffnete.',
  sentence:([verb,link]) => 'Ich '+verb+' ein Klappern, '+link+' ich die Tür geöffnet habe.'
 },
 {
  title:'Adas Blick auf den Wagen',
  sample:'Ada: «Ich sah den Pokal auf dem Wagen. Erst danach fiel der Becher.»',
  brief:'Erzähle über Ada im Präteritum. Wähle die Verbindung, die ihre Beobachtung zeitlich einordnet.',
  fields:[['Präteritum · Ada',['sahen','siehst','sah']],['Verbindung',['bevor','nachdem','damit']]],
  answer:[2,0],hint:'«Ada sah» ist die 3. Person Singular im Präteritum. «Bevor» setzt ihre Beobachtung vor den Sturz des Bechers.',
  sentence:([verb,link]) => 'Ada '+verb+' den Pokal auf dem Wagen, '+link+' der Becher fiel.'
 },
 {
  title:'Warum der Wagen rollte',
  sample:'«Der Wagen rollt los. Die Dominosteine stossen ihn an.»',
  brief:'Setze den Hauptsatz ins Perfekt. Verbinde ihn mit der Ursache.',
  fields:[['Perfekt · der Wagen',['hat','ist','sind']],['Verbindung',['obwohl','damit','weil']]],
  answer:[1,2],hint:'«Losrollen» bildet das Perfekt mit «sein». «Weil» leitet den Grund ein.',
  sentence:([verb,link]) => 'Der Wagen '+verb+' losgerollt, '+link+' die Dominosteine ihn angestossen haben.'
 }
];
stations.push({name:'Nachtprotokoll',symbol:'☾',missions:links});
