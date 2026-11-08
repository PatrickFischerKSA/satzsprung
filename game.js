const get = id => document.getElementById(id);
const key = 'satzsprung-krimi-v2';
let solved = new Set();
try {
 const saved = JSON.parse(localStorage.getItem(key) || JSON.stringify(JSON.parse(localStorage.getItem('satzsprung-krimi-v1') || '[]').filter(id => !/^2\/[0-3]$/.test(id))));
 if (Array.isArray(saved)) solved = new Set(saved.filter(id => stations.some((s, i) => s.missions.some((_, j) => id === i + '/' + j))));
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
 get('clues').replaceChildren(...clues.map((clue,i) => {
  const item = document.createElement('li');
  item.textContent = cases[i]+' · '+(solved.has(clueId(i)) ? clue.clue : 'Spur fehlt');
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
  'Am Tisch. Sichere unter «Vier Fälle» die vier Spuren.',
  'Das Licht geht aus. Öffne das Nachtprotokoll und verbinde die Aussagen zu einem Ablauf.',
  'Das Licht geht wieder an. Legt eure Erklärung zur Abstimmung vor.'
 ][round];
 get('progress').textContent = solved.size+' / '+total+' AUFGABEN GELÖST';
}

function moveToken(x,y) {
 get('token').style.left = x+'%';
 get('token').style.top = y+'%';
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
 get('code').textContent = 'AUFGABE '+(station+1)+'.'+(index+1);
 get('mission-title').textContent = m.title;
 get('brief').textContent = m.brief;
 get('source').textContent = m.sample || m.title;
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
  bubble.textContent = station===1 && index===0 ? '«Der Pokal steht auf dem Wagen.» — Ada' : m.sample;
  scenery.append(bubble);
 } else if (station === 2) {
  const tag = document.createElement('div');
  tag.className = 'evidence';
  tag.textContent = 'BEWEISSTÜCK '+String(index+1).padStart(2,'0');
  scenery.append(tag);
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
   if (station===2 && matchMedia('(pointer: fine)').matches) {
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
  () => forms[selected[0]]?.[selected[1]] || 'Wähle Perspektive und Zeitstufe.',
  () => words[0] ? m.sample + '  →  ' + words[0] : m.sample,
  () => [words[1] === '—' ? '' : words[1],m.stem+(words[2] || '…'),words[3]].filter(Boolean).join(' '),
  () => (places.find(([value]) => value===spot)?.[1] || 'Wähle ein Feld auf der Karte.') + (words[0] && words[1] ? ' · '+words.join(' / ') : '')
 ,() => words.every(Boolean) ? m.sentence(words) : 'Wähle eine Verbform und ein Bindewort.'
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
  feedback(m.spot ? 'Wähle ein Kartenfeld, eine Präposition und einen Kasus.' : 'Wähle in jeder Zeile eine Antwort.','warn');
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
 if (m.spot) get('scene-caption').textContent = m.result;
 feedback('Richtig. '+m.hint+(m.clue ? ' Spur gesichert: '+m.clue : ''),'good');
 get('check').hidden = get('hint').hidden = true;
 get('next').hidden = false;
 if (m.clue && allClues()) get('next').textContent = canVote() ? 'Zur Abstimmung →' : 'Licht aus →';
 if (station===4 && canVote()) get('next').textContent = 'Zur Abstimmung →';
 get('controls').querySelectorAll('button').forEach(item => item.disabled = true);
 get('scenery').querySelectorAll('button').forEach(item => item.disabled = true);
 get('next').focus();
}

function advance() {
 if (get('next').textContent==='Zur Abstimmung →') {
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

function showCase() {
 if (!canVote()) return;
 const resolution = get('resolution');
 resolution.textContent = '';
 const steps = [
  ['Nominativ · Was löste die Kette aus?', ['Die Tür','Die rote Kugel','Der Vorhang'], 1],
  ['Akkusativ · Was traf der Auslöser?', ['Den leichten Becher','Den Pokal','Den Wagen'], 0],
  ['Dativ · Wem versetzten die Dominosteine einen Stoss?', ['Dem Tisch','Dem Becher','Dem kleinen Wagen'], 2],
  ['Genitiv · Wessen Ladung verschwand hinter dem Vorhang?', ['Die Ladung des Tisches','Die Ladung des kleinen Wagens','Die Ladung des Bechers'], 1],
  ['Abstimmung · Was geschah mit dem Pokal?', ['Noah trug ihn weg.','Ada versteckte ihn unter dem Tisch.','Die Kettenreaktion bewegte den Wagen mit dem Pokal.'], 2]
 ];
 get('deduction').replaceChildren();
 const selectors = steps.map(([question,options],i) => {
  const field = document.createElement('label');
  const select = document.createElement('select');
  field.textContent = question;
  for (const option of ['Bitte wählen',...options]) {
   const choice = document.createElement('option');
   choice.textContent = option;
   select.append(choice);
  }
  const note = document.createElement('small');
  note.textContent = clues[i]?.clue || 'Noah hörte das Klappern, nachdem er die Tür geöffnet hatte. Ada sah den Pokal auf dem Wagen, bevor der Becher fiel.';
  field.append(select,note);
  get('deduction').append(field);
  return select;
 });
 get('deduction').append(button('Stimme abgeben', () => {
  if (selectors.some((select,i) => select.selectedIndex !== steps[i][2]+1)) {
   resolution.textContent = 'Der Ablauf passt noch nicht zu allen vier Spuren. Vergleiche jede Auswahl mit der Spur darunter.';
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
get('manual').onclick = () => get('book').showModal();
get('hint').onclick = () => feedback(mission().hint,'warn');
get('check').onclick = check;
get('next').onclick = advance;
document.addEventListener('keydown',event => {
 if (event.key === 'Enter' && event.target === document.body && !get('book').open) {
  if (locked) advance(); else check();
 }
});
openStation(allClues() && !nightComplete() ? 4 : 2);
