const get = id => document.getElementById(id);
const key = 'satzsprung-v1';
let solved = new Set();
try {
 const saved = JSON.parse(localStorage.getItem(key) || '[]');
 if (Array.isArray(saved)) solved = new Set(saved.filter(id => stations.some((s, i) => s.missions.some((_, j) => id === i + '/' + j))));
} catch {}
const total = stations.reduce((sum,s) => sum + s.missions.length,0);
const places = [
 ['oben','Über der Brücke',50,16],['dach','Hangardach',17,16],
 ['wand','Aussenwand',17,47],['innen','Hangar / Tunnel',50,47],
 ['seite','Seitenfähre',83,16],['lücke','Zwischen den Modulen',83,47],
 ['vor','Vorplatz',17,80],['unten','Unter der Brücke',50,80],['hinten','Hinter dem Hangar',83,80]
];
let station = 0, index = 0, selected = [], spot = '', locked = false, finale = false;
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
 const target = station === 3 && !finale && matchMedia('(max-width: 850px)').matches
  ? get('route-brief') : get('mission-title');
 target.focus();
}

function nav() {
 get('stations').replaceChildren(...stations.map((s,i) => {
  const count = s.missions.filter((_,j) => solved.has(i+'/'+j)).length;
  const tab = button(s.symbol+'  '+s.name+'  '+count+'/'+s.missions.length, () => { openStation(i); focusMission(); });
  tab.setAttribute('aria-pressed', String(i === station && !finale));
  return tab;
 }));
 get('progress').textContent = solved.size+' / '+total+' AUFGABEN GELÖST';
}

function moveShip(x,y) {
 get('ship').style.left = x+'%';
 get('ship').style.top = y+'%';
}

function render() {
 locked = false;
 finale = false;
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
 get('route-brief').textContent = m.spot ? m.brief : '';
 get('route-brief').hidden = !m.spot;
 get('brief').classList.toggle('route-in-window',Boolean(m.spot));
 get('feedback').textContent = '';
 get('feedback').className = '';
 get('check').hidden = get('hint').hidden = false;
 get('next').hidden = true;
 get('next').textContent = 'Weiter →';
 const scenery = get('scenery');
 scenery.replaceChildren();
 moveShip(50,50);
 if (station === 3) {
  moveShip(50,32);
  for (const [value,label,x,y] of places) {
   const marker = button(label, () => {
    if (locked) return;
    spot = value;
    moveShip(x,y);
    scenery.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed',String(item === marker)));
    caption();
   },'marker');
   marker.style.left = x+'%';
   marker.style.top = y+'%';
   marker.setAttribute('aria-pressed','false');
   scenery.append(marker);
  }
 } else {
  const emblem = document.createElement('div');
  emblem.className = 'emblem';
  emblem.textContent = stations[station].symbol;
  scenery.append(emblem);
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
    if (station===0 && i===1) moveShip(23+j*10,50);
    if (station===0 && i===0) scene.dataset.voice = j;
    caption();
   };
   const part = button(option, install);
   part.setAttribute('aria-pressed','false');
   if (station===2) {
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
 scene.removeAttribute('data-voice');
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
 ][station]();
 get('scene-caption').textContent = display;
}

function feedback(message,type) {
 get('feedback').textContent = message;
 get('feedback').className = type;
}

function check() {
 if (locked || finale) return;
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
 if (m.spot) get('scene-caption').textContent = m.sample;
 feedback('Richtig. '+m.hint,'good');
 get('check').hidden = get('hint').hidden = true;
 get('next').hidden = false;
 if (solved.size === total) get('next').textContent = 'Fluchtsequenz →';
 get('controls').querySelectorAll('button').forEach(item => item.disabled = true);
 get('scenery').querySelectorAll('button').forEach(item => item.disabled = true);
 get('next').focus();
}

function advance() {
 if (finale) {
  openStation(0);
 } else if (solved.size === total) {
  finale = true;
  nav();
  get('scene').className = 'escape';
  get('scene').removeAttribute('data-voice');
  get('scenery').replaceChildren();
  moveShip(94,15);
  get('scene-label').textContent = 'ORBIT VERLASSEN';
  get('counter').textContent = total+' / '+total;
  get('scene-caption').textContent = 'Die Crew flieht. Die Crew wurde gerettet. Die Crew ist gerettet.';
  get('code').textContent = 'FLUGPROTOKOLL / ENDE';
  get('mission-title').textContent = 'Die Station war das Schiff.';
  get('route-brief').hidden = true;
  get('brief').classList.remove('route-in-window');
  get('brief').textContent = 'Mit jedem Signal hast du einen Teil der Station wieder in Betrieb genommen. Jetzt löst sich die Kommandozentrale vom Trümmerfeld und nimmt Kurs auf die Erde.';
  get('controls').replaceChildren();
  feedback('Alle Systeme arbeiten.','good');
  get('next').textContent = 'Manöver wiederholen';
 } else {
  const pending = stations[station].missions.findIndex((_,j) => j > index && !solved.has(station+'/'+j));
  if (pending >= 0) {
   index = pending;
   render();
   focusMission();
   return;
  }
  const remaining = stations.findIndex((s,i) => s.missions.some((_,j) => !solved.has(i+'/'+j)));
  openStation(remaining);
 }
 focusMission();
}

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
const start = stations.findIndex((s,i) => s.missions.some((_,j) => !solved.has(i+'/'+j)));
openStation(Math.max(0,start));
