const get = id => document.getElementById(id);
const key = 'satzsprung-krimi-v4';
let solved = new Set();
try {
 const current = localStorage.getItem(key);
 const previous = localStorage.getItem('satzsprung-krimi-v3');
 const saved = JSON.parse(current ?? previous ?? localStorage.getItem('satzsprung-krimi-v2') ?? localStorage.getItem('satzsprung-krimi-v1') ?? '[]');
 if (Array.isArray(saved)) solved = new Set(saved.filter(id =>
  (current !== null || !/^4\//.test(id)) &&
  (current !== null || previous !== null || !/^2\/[0-3]$/.test(id)) &&
  stations.some((s,i) => s.missions.some((_,j) => id === i+'/'+j))
 ));
} catch {}
const total = stations.reduce((sum,s) => sum + s.missions.length,0);
const places = [
 ['oben','Kamera über dem Tisch',50,16],['dach','Rampe',17,16],
 ['wand','Wand',17,47],['innen','Schachtel',50,47],
 ['seite','Lampe neben dem Tisch',83,16],['lücke','Zwischen den Dominosteinen',83,47],
 ['vor','Vor dem Tisch',17,80],['unten','Unter dem Tisch',50,80],['hinten','Hinter dem Tisch',83,80]
];
const clues = cargo.filter(m => m.clue);
const clueId = i => '2/'+i;
const allClues = () => clues.every((_,i) => solved.has(clueId(i)));
const nightComplete = () => links.every((_,i) => solved.has('4/'+i));
const canVote = () => allClues() && nightComplete();
let station = 0, index = 0, selected = [], spot = '', locked = false;
const mission = () => stations[station].missions[index];
const id = () => station + '/' + index;

function button(label, action, className = '') {
 const item = document.createElement('button');
 item.type = 'button';
 item.textContent = label;
 item.className = className;
 item.addEventListener('click',action);
 return item;
}

function openStation(i) {
 station = i;
 const pending = stations[i].missions.findIndex((_,j) => !solved.has(i+'/'+j));
 index = pending < 0 ? 0 : pending;
 render();
}

function focusMission() {
 const target = station === 3 && matchMedia('(max-width: 850px)').matches
  ? get('route-brief') : get('mission-title');
 target.focus();
}

function nav() {
 get('stations').replaceChildren(...stations.map((s,i) => {
  const count = s.missions.filter((_,j) => solved.has(i+'/'+j)).length;
  const tab = button(s.symbol+'  '+s.name+'  '+count+'/'+s.missions.length, () => { openStation(i); focusMission(); });
  tab.setAttribute('aria-pressed', String(i === station));
  tab.disabled = i===4 && !allClues();
  return tab;
 }));
 const securedOrder = [...solved].filter(value => /^2\/[0-3]$/.test(value)).map(value => Number(value.slice(2)));
 const clueOrder = [...securedOrder,...clues.map((_,i)=>i).filter(i=>!securedOrder.includes(i))];
 get('clues').replaceChildren(...clueOrder.map(i => {
  const clue = clues[i];
  const item = document.createElement('li');
  item.textContent = solved.has(clueId(i)) ? cases[i]+' · '+clue.clue : 'Spur noch offen';
  return item;
 }));
 const round = !allClues() ? 0 : nightComplete() ? 2 : 1;
 [...get('rounds').children].forEach((item,i) => {
  if (i===round) item.setAttribute('aria-current','step');
  else item.removeAttribute('aria-current');
 });
 get('night').hidden = round !== 1;
 get('verdict').disabled = !canVote();
 get('round-guide').textContent = [
  'Suche mit der Lupe nach vier Spuren im Festsaal.',
  'Das Licht geht aus. Öffne das Nachtprotokoll und verbinde die Aussagen zu einem Ablauf.',
  'Das Licht geht wieder an. Setzt fünf Ereignisse zur Rekonstruktion zusammen.'
 ][round];
 get('progress').textContent = solved.size+' / '+total+' AUFGABEN GELÖST';
}

function moveToken(x,y) {
 get('token').style.left = x+'%';
 get('token').style.top = y+'%';
}

function showCrimeScene() {
 station = 2;
 index = 0;
 render();
 get('mission-title').textContent = 'Untersuche den Tatort';
 get('source').hidden = true;
 get('brief').textContent = 'Untersuche das Bild mit der Lupe. Bei einem Fund öffnet sich die passende Aufgabe.';
 get('controls').replaceChildren();
 get('check').hidden = get('hint').hidden = true;
 get('code').textContent = 'FESTSAAL AM HAFEN';
 get('scene-label').textContent = 'TATORT';
 get('counter').textContent = clues.filter((_,i)=>solved.has(clueId(i))).length+' / '+clues.length+' SPUREN';
 get('scene-caption').textContent = 'Festsaal am Hafen · Vier Spuren';
}

const searchTargets = [
 {name:'Kugel',x:14,y:42},
 {name:'Becher',x:40,y:48},
 {name:'Wagen',x:69,y:79},
 {name:'Foto am Vorhang',x:89,y:47}
];
const searchLens = get('search-lens');
let lensPosition = {x:50,y:30};
let nearbyClue = -1;

function positionLens(x,y) {
 lensPosition = {x:Math.max(0,Math.min(100,x)),y:Math.max(0,Math.min(100,y))};
 searchLens.style.setProperty('--lens-x',lensPosition.x+'%');
 searchLens.style.setProperty('--lens-y',lensPosition.y+'%');
 nearbyClue = searchTargets.findIndex(target =>
  Math.hypot((target.x-lensPosition.x)*6.4,(target.y-lensPosition.y)*3.4) < 48
 );
 const status = get('search-status');
 searchLens.dataset.found = String(nearbyClue >= 0);
 const message = nearbyClue < 0 ? 'Suche nach einer Spur.' :
  searchTargets[nearbyClue].name+(solved.has(clueId(nearbyClue)) ? ' · bereits gesichert' : ' · Spur entdeckt');
 if (status.textContent !== message) status.textContent = message;
}

function positionLensAtPointer(event) {
 const bounds = searchLens.getBoundingClientRect();
 positionLens(100*(event.clientX-bounds.left)/bounds.width,100*(event.clientY-bounds.top)/bounds.height);
}

searchLens.addEventListener('pointerdown', event => {
 if (event.button !== 0) return;
 searchLens.setPointerCapture(event.pointerId);
 positionLensAtPointer(event);
});
searchLens.addEventListener('pointermove', positionLensAtPointer);
searchLens.addEventListener('pointerup', event => {
 if (event.button !== 0) return;
 positionLensAtPointer(event);
 inspectNearbyClue();
});
searchLens.addEventListener('click', event => {
 if (event.detail===0) inspectNearbyClue();
});
searchLens.addEventListener('keydown',event => {
 const moves = {ArrowLeft:[-4,0],ArrowRight:[4,0],ArrowUp:[0,-6],ArrowDown:[0,6]};
 const move = moves[event.key];
 if (!move) return;
 event.preventDefault();
 positionLens(lensPosition.x+move[0],lensPosition.y+move[1]);
});

function inspectNearbyClue() {
 if (nearbyClue < 0) return;
 station = 2;
 index = nearbyClue;
 render();
 focusMission();
}

function render() {
 locked = false;
 spot = '';
 selected = mission().fields.map(() => null);
 nav();
 const m = mission();
 const scene = get('scene');
 scene.className = 'station-'+station;
 get('scene-label').textContent = stations[station].name.toUpperCase();
 get('counter').textContent = String(index+1).padStart(2,'0')+' / '+stations[station].missions.length;
 get('code').textContent = m.clue ? 'FUNDSTÜCK' : 'AUFGABE '+(index+1);
 get('mission-title').textContent = m.title;
 get('brief').textContent = m.brief;
 get('source').textContent = [m.sample,m.record].filter(Boolean).join('\n\n');
 get('source').hidden = !m.sample;
 get('replay').hidden = station!==0;
 get('replay').onclick = () => playRecording(false);
 get('machine').classList.remove('playing');
 get('machine').classList.remove('reconstruction');
 get('route-brief').textContent = m.spot ? m.sample+' '+m.brief : '';
 get('route-brief').hidden = !m.spot;
 get('brief').classList.toggle('route-in-window',Boolean(m.spot));
 get('feedback').textContent = '';
 get('feedback').className = '';
 get('check').hidden = get('hint').hidden = false;
 get('next').hidden = true;
 get('next').textContent = 'Weiter →';
 get('crime-scene').hidden = !m.clue;
 get('search-status').hidden = get('search-instructions').hidden = !m.clue;
 if (m.clue) positionLens(lensPosition.x,lensPosition.y);
 const scenery = get('scenery');
 scenery.replaceChildren();
 moveToken(50,50);
 if (station === 3) {
  moveToken(50,32);
  for (const [value,label,x,y] of places) {
   const marker = button(label, () => {
    if (locked) return;
    spot = value;
    moveToken(x,y);
    scenery.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed',String(item === marker)));
    caption();
   },'marker');
   marker.style.left = x+'%';
   marker.style.top = y+'%';
   marker.setAttribute('aria-pressed','false');
   scenery.append(marker);
  }
 } else if (station === 1 || station === 4) {
  const bubble = document.createElement('blockquote');
  bubble.className = 'speech';
  bubble.textContent = m.sample;
  scenery.append(bubble);
 } else if (station === 2 && !m.clue) {
  const tag = document.createElement('div');
  tag.className = 'evidence';
  tag.textContent = 'BEWEISSTÜCK '+String(index+1).padStart(2,'0');
  scenery.append(tag);
 }
 if (station===4) {
  const cards = m.fields.flatMap(([label,options],row) => options.map((label,column) => ({label,row,column})));
  const order = [3,6,1,4,7,0,2,5];
  buildSequence(get('controls'),order.map(i=>cards[i]),4,picks=>{
   selected = m.fields.map((_,i)=>picks[i]?.row===i ? picks[i].column : null);
   get('scene-caption').textContent = selected.includes(null)
    ? 'Beleg → Hauptsatz → Bindewort → Nebensatz'
    : picks[1].label+', '+picks[2].label+' '+picks[3].label;
   feedback('','');
  });
  get('scene-caption').textContent = 'Beleg → Hauptsatz → Bindewort → Nebensatz';
  return;
 }
 get('controls').replaceChildren(...m.fields.map(([label,options],i) => {
  const group = document.createElement('fieldset');
  const title = document.createElement('legend');
  title.textContent = label;
  group.append(title);
  options.forEach((option,j) => {
   const install = () => {
    if (locked) return;
    selected[i] = j;
    group.querySelectorAll('button').forEach((item,k) => item.setAttribute('aria-pressed',String(j===k)));
    caption();
   };
   const part = button(option, install);
   part.setAttribute('aria-pressed','false');
   if (station===2 && !m.clue && matchMedia('(pointer: fine)').matches) {
    part.draggable = true;
    part.addEventListener('dragstart',event => {
     if (locked) { event.preventDefault(); return; }
     event.dataTransfer.setData('application/x-satzsprung-part',i+'/'+j);
     event.dataTransfer.effectAllowed = 'copy';
    });
   }
   group.append(part);
  });
  return group;
 }));
 caption();
}

function caption() {
 const m = mission();
 const words = m.fields.map(([,options],i) => options[selected[i]]);
 const display = [
  () => locked ? forms[selected[0]][selected[1]] : 'Der umgeformte Satz erscheint nach der Prüfung.',
  () => words[0] || 'Wähle eine Antwort zum Ausgangssatz.',
  () => m.clue ? words[0] || 'Deine Wortgruppe erscheint hier.' : [words[1] === '—' ? '' : words[1],m.stem+(words[2] || '…'),words[3]].filter(Boolean).join(' '),
  () => (places.find(([value]) => value===spot)?.[1] || 'Wähle ein Feld auf der Karte.') + (words[0] && words[1] ? ' · '+words.join(' / ') : '')

 ][station]();
 get('scene-caption').textContent = display;
}

function feedback(message,type) {
 get('feedback').textContent = message;
 get('feedback').className = type;
}

function check() {
 if (locked) return;
 const m = mission();
 if (selected.includes(null) || (m.spot && !spot)) {
  const missing = m.fields.filter((_,i) => selected[i]===null).map(([label]) => label);
  if (m.spot && !spot) missing.unshift('Kartenfeld');
  feedback(station===4 ? 'Lege vier Karten in der Reihenfolge Beleg → Hauptsatz → Bindewort → Nebensatz.' : 'Noch offen: '+missing.join(', ')+'.','warn');
  return;
 }
 const wrong = m.fields.filter((_,i) => selected[i] !== m.answer[i]).map(([label]) => label);
 if (m.spot && m.spot !== spot) wrong.unshift('Kartenfeld');
 if (wrong.length) {
  feedback('Überprüfe '+wrong.join(' und ')+'.','warn');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) get('scene').animate([{translate:'0'},{translate:'-5px'},{translate:'5px'},{translate:'0'}],{duration:220});
  return;
 }
 locked = true;
 solved.add(id());
 try { localStorage.setItem(key,JSON.stringify([...solved])); } catch {}
 nav();
 if (station===0) caption();
 if (m.spot) get('scene-caption').textContent = m.result;
 feedback('Richtig. '+m.hint+(m.clue ? ' Spur gesichert: '+m.clue : ''),'good');
 get('check').hidden = get('hint').hidden = true;
 get('next').hidden = false;
 if (m.clue) {
  positionLens(lensPosition.x,lensPosition.y);
  get('next').textContent = 'Zurück zum Tatort';
 }
 if (m.clue && allClues()) get('next').textContent = canVote() ? 'Zur Rekonstruktion →' : 'Licht aus →';
 if (station===4 && canVote()) get('next').textContent = 'Zur Rekonstruktion →';
 get('controls').querySelectorAll('button').forEach(item => item.disabled = true);
 get('scenery').querySelectorAll('button').forEach(item => item.disabled = true);
 get('next').focus();
}

function advance() {
 if (get('next').textContent==='Zurück zum Tatort') {
  showCrimeScene();
  searchLens.focus();
  return;
 }
 if (get('next').textContent==='Zur Rekonstruktion →') {
  showCase();
  return;
 }
 if (get('next').textContent==='Licht aus →') {
  openStation(4);
  focusMission();
  return;
 }
 const pending = stations[station].missions.findIndex((_,j) => j > index && !solved.has(station+'/'+j));
 if (pending >= 0) {
  index = pending;
  render();
 } else {
  const remaining = stations.findIndex((s,i) => s.missions.some((_,j) => !solved.has(i+'/'+j)));
  openStation(remaining < 0 ? 0 : remaining);
 }
 focusMission();
}

function playRecording(reconstruct) {
 const machine = get('machine');
 machine.classList.remove('playing');
 machine.classList.toggle('reconstruction',reconstruct);
 // Restart the animation when the recording is replayed.
 void machine.getBoundingClientRect();
 machine.classList.add('playing');
}

function buildSequence(container,cards,limit,onChange) {
 const picked = [];
 const line = document.createElement('ol');
 line.className = 'sequence-line';
 line.setAttribute('aria-label','Deine Reihenfolge');
 const bank = document.createElement('div');
 bank.className = 'sequence-bank';
 bank.setAttribute('role','group');
 bank.setAttribute('aria-label','Verfügbare Karten');
 const buttons = cards.map(card => button(card.label,() => {
  picked.push(card);
  refresh();
  (buttons.find(item=>!item.disabled) || line.querySelector('.sequence-card'))?.focus();
 }));
 bank.append(...buttons);
 container.replaceChildren(line,bank);
 function refresh() {
  line.replaceChildren(...Array.from({length:limit},(_,i) => {
   const item = document.createElement('li');
   if (!picked[i]) item.textContent = 'Karte wählen';
   else {
    const card = picked[i];
    const remove = button(card.label+' ×', () => {
     picked.splice(i,1);
     refresh();
     buttons[cards.indexOf(card)].focus();
    }, 'sequence-card');
    remove.setAttribute('aria-label',card.label+' zurücklegen');
    item.append(remove);
    for (const [offset,arrow,label] of [[-1,'↑','nach oben'],[1,'↓','nach unten']]) {
     const target = i+offset;
     const move = button(arrow, () => {
      [picked[i],picked[target]] = [picked[target],picked[i]];
      refresh();
      line.children[target].querySelector('.sequence-card').focus();
     }, 'sequence-move');
     move.setAttribute('aria-label',card.label+' '+label+' verschieben');
     move.disabled = target < 0 || target >= picked.length;
     item.append(move);
    }
   }
   return item;
  }));
  buttons.forEach((item,i) => {item.disabled = picked.length===limit || picked.includes(cards[i]);});
  onChange(picked);
 }
 refresh();
}

function showCase() {
 if (!canVote()) return;
 const resolution = get('resolution');
 resolution.textContent = '';
 const events = [
  {id:'roll',label:'Der Wagen rollt mit dem Pokal hinter den Vorhang.'},
  {id:'carry',label:'Noah trägt den Pokal hinter den Vorhang.'},
  {id:'cup',label:'Der Becher kippt und setzt die Dominosteine in Bewegung.'},
  {id:'photo',label:'Das Foto zeigt den Pokal auf dem Wagen und die Kugel noch oben auf der Rampe.'},
  {id:'strike',label:'Die Dominosteine versetzen dem Wagen einen Stoss.'},
  {id:'hide',label:'Ada legt den Pokal unter den Tisch.'},
  {id:'ball',label:'Die rote Kugel rollt los und trifft den Becher.'}
 ];
 const expected = ['photo','ball','cup','strike','roll'];
 const deduction = get('deduction');
 const evidence = document.createElement('details');
 const summary = document.createElement('summary');
 summary.textContent = 'Fallakte und Nachtprotokoll nachlesen';
 evidence.append(summary);
 for (const record of [...clues.map(m=>m.clue),...links.map(m=>m.record)]) {
  const item = document.createElement('p');
  item.textContent = record;
  evidence.append(item);
 }
 const timeline = document.createElement('div');
 let picked = [];
 buildSequence(timeline,events,expected.length,cards=>{picked = cards; resolution.textContent = '';});
 deduction.replaceChildren(evidence,timeline,button('Rekonstruktion prüfen', () => {
  if (picked.length !== expected.length) {
   resolution.textContent = 'Die Zeitleiste braucht fünf Ereignisse.';
   return;
  }
  if (picked.some(card=>!expected.includes(card.id))) {
   resolution.textContent = 'Mindestens eine Karte behauptet etwas, das die Spuren nicht belegen. Prüfe die Aussagen in der Fallakte.';
   return;
  }
  if (picked.some((card,i)=>card.id!==expected[i])) {
   resolution.textContent = 'Die Ereignisse passen, aber ihre Reihenfolge noch nicht. Prüfe zuerst Foto und Tonspur, dann die Wirkung jedes Stosses.';
   return;
  }
  get('case-file').close();
  openStation(0);
  get('scene-caption').textContent = 'Fall gelöst. Die Kugel kippte den Becher um. Der Becher setzte die Dominosteine in Bewegung. Sie stiessen den Wagen an, der mit dem Pokal hinter den Vorhang rollte.';
  playRecording(true);
  get('replay').onclick = () => playRecording(true);
  get('replay').focus();
 }, 'primary'));
 get('case-file').showModal();
}

get('verdict').onclick = showCase;
get('night').onclick = () => { openStation(4); focusMission(); };
const dock = get('scene-caption');
dock.addEventListener('dragover',event => {
 if (station===2 && !locked && event.dataTransfer.types.includes('application/x-satzsprung-part')) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
 }
});
dock.addEventListener('drop',event => {
 if (station!==2 || locked) return;
 const payload = event.dataTransfer.getData('application/x-satzsprung-part');
 if (!/^\d+\/\d+$/.test(payload)) return;
 event.preventDefault();
 const [row,column] = payload.split('/').map(Number);
 get('controls').querySelectorAll('fieldset')[row]?.querySelectorAll('button')[column]?.click();
});
get('tatort').onclick = () => { showCrimeScene(); searchLens.focus(); };
get('manual').onclick = () => get('book').showModal();
get('hint').onclick = () => {
 const hints = [
  'Achte auf das Subjekt im Zielsatz. Für die Zeitform prüfe die Verbteile im Ausgangssatz.',
  'Vergleiche die Verbteile und achte darauf, auf welche Person oder Zeit sich der Auftrag bezieht.',
  'Bestimme zuerst die Rolle der Wortgruppe im Satz. Prüfe den Kasus bei Bedarf mit einer Ersatzprobe.',
  'Grenze die gefragte Angabe im Satz ein. Prüfe, ob sie einen Ort, ein Ziel oder einen anderen Zusammenhang bezeichnet.',
  'Lies die beiden Aussagen getrennt. Prüfe zuerst, welcher Beleg die gefragte Reihenfolge oder Ursache stützt.'
 ];
 feedback(hints[station],'warn');
};
get('check').onclick = check;
get('next').onclick = advance;
document.addEventListener('keydown',event => {
 if (event.key === 'Enter' && event.target === document.body && !get('book').open) {
  if (locked) advance(); else if (!get('check').hidden) check();
 }
});
showCrimeScene();

const tracks = [
 ['Die 4 Fälle Part III · Rap feat. Nikodem','audio/die-vier-faelle.mp3'],
 ['Grammatik für Kids · Rap feat. Nikodem','audio/grammatik-fuer-kids.mp3']
];
const music = get('music');
let trackIndex = 0;
let musicSession = 0;

async function playTrack(session) {
 const [title,source] = tracks[trackIndex];
 music.src = source;
 try {
  await music.play();
  if (session===musicSession) get('music-status').textContent = title;
 } catch {
  if (session!==musicSession) return;
  stopMusic();
  get('music-status').textContent = 'Musik konnte nicht starten.';
 }
}

function stopMusic() {
 musicSession++;
 music.pause();
 music.removeAttribute('src');
 music.load();
 get('music-start').disabled = false;
 get('music-stop').disabled = true;
 get('music-status').textContent = 'Musik aus';
}

get('music-start').onclick = () => {
 get('music-start').disabled = true;
 get('music-stop').disabled = false;
 trackIndex = 0;
 playTrack(++musicSession);
};
get('music-stop').onclick = stopMusic;
music.addEventListener('ended', () => {
 if (get('music-stop').disabled) return;
 trackIndex = (trackIndex+1)%tracks.length;
 playTrack(musicSession);
});
