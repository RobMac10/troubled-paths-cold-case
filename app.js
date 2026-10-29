(function(){
'use strict';
const T=window.TP,MAPS=window.TPMAPS,KEY='troubled-paths-cold-case-v1';
let st={};try{st=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){st={}}
st.unlocked=st.unlocked||{};st.board=st.board||{};st.finding=st.finding||{};st.write=st.write||{};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const P=a=>a.map(x=>'<p>'+esc(x)+'</p>').join('');
const typed=lines=>'<div class="typed">'+lines.map((l,i)=>i==0?'<b>'+esc(l)+'</b>':esc(l)).join('\n')+'</div>';
const BADGE={real:['b-real','Real'],made:['b-made','Made up'],family:['b-family','Family tradition'],check:['b-check','Still being checked']};
const badge=k=>'<span class="badge '+BADGE[k][0]+'">'+BADGE[k][1]+'</span>';
const panel=(k,title,items)=>items&&items.length?'<section class="panel '+k+'" aria-label="'+esc(BADGE[k][1]+': '+title)+'"><h3>'+badge(k)+esc(title)+'</h3>'+(items.length>1?'<ul>'+items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'<p style="margin:0">'+esc(items[0])+'</p>')+'</section>':'';
const links=ls=>ls&&ls.length?'<p>'+ls.map(l=>'<a href="'+esc(l[1])+'" target="_blank" rel="noopener noreferrer">'+esc(l[0])+' (opens in a new tab)</a>').join('<br>')+'</p>':'';
const unlocked=n=>!!(st.classAll||st.unlocked[n]);
const topicDone=id=>!!(st.board[id]&&st.board[id].locked);
const gateOK=g=>st.classAll||(typeof g==='number'?unlocked(g):topicDone(g));
const gateName=g=>typeof g==='number'?'Witness File '+g:'the “How many went?” question on the Board';
const board=id=>st.board[id]||(st.board[id]={});
const W=n=>T.witnesses[n-1];

function figure(img,key){
 const shown=!img.hidden||st['img_'+key];
 let h='<figure>';
 if(img.warn&&!st['img_'+key]&&(img.hidden||img.src.indexOf('battle')>-1)){
  h+='<div class="panel"><p><strong>'+esc(img.warn)+'</strong></p><button class="btn" data-showimg="'+key+'">Show the image</button></div>';
  return h+'<figcaption>'+esc(img.cap)+'<span class="credit">'+esc(img.credit)+'</span></figcaption></figure>';
 }
 h+='<img src="'+esc(img.src)+'" alt="'+esc(img.alt)+'" loading="lazy">';
 return h+'<figcaption>'+esc(img.cap)+'<span class="credit">'+esc(img.credit)+'</span></figcaption></figure>';
}

/* ---------------- SCREENS ---------------- */
const screens={};

screens.home=()=>{
 const nW=[1,2,3].filter(unlocked).length,nT=T.topics.filter(t=>topicDone(t.id)).length;
 return '<h1>Case file</h1><p class="lead">A companion to the novel <em>Troubled Paths on Ancient Ground</em> by Robin McKean. Read the book. Use this app to look at the evidence.</p>'+
 typed(T.caseFile)+
 '<h2>The case</h2>'+P(T.summary)+
 '<section class="care" aria-labelledby="carehd"><h2 id="carehd">Before you start</h2><p>'+esc(T.content)+'</p>'+P(T.care)+'<p><a href="#/about">Read the acknowledgement and credits</a></p></section>'+
 '<h2>How to use this app</h2><p>The app keeps spoilers back. Each part opens when you say you have finished the chapter in the book. Nobody checks. It is your choice, and it works best if you read first.</p><ol class="steps">'+T.readingPath.map(s=>'<li>'+esc(s[0])+'<small>'+esc(s[1])+'</small></li>').join('')+'</ol>'+
 '<div class="status" aria-label="Your progress"><span class="'+(nW==3?'done':'')+'">Witness files unlocked: '+nW+' of 3</span><span class="'+(nT==T.topics.length?'done':'')+'">Board questions locked in: '+nT+' of '+T.topics.length+'</span></div>'+
 '<h2>Real and made up</h2><p>Every card in this app keeps these apart.</p><p>'+badge('real')+'A record, a law or a fact checked against a published source.</p><p>'+badge('made')+'Made up for the story, like most of the characters and the night of 30 December 1906. Michael Gahan was a real man, but his 1906 scenes are made up.</p><p>'+badge('family')+'A story the family tells, with no paper to prove it.</p><p>'+badge('check')+'Something the author is still checking.</p>'+
 '<div class="grid c2"><a class="btn dark" href="#/witnesses/1">Open the witness files</a><a class="btn" href="#/table">Look at the club table</a></div>';
};

function witnessTabs(cur){
 return '<div class="wtabs" role="navigation" aria-label="Witness files">'+T.witnesses.map(w=>'<a class="btn'+(w.n==cur?' dark':'')+'" href="#/witnesses/'+w.n+'"'+(w.n==cur?' aria-current="page"':'')+'>File '+w.n+': '+esc(w.name)+'<span class="lockmark">'+(unlocked(w.n)?'open':'locked')+'</span></a>').join('')+'</div>';
}
screens.witnesses=(arg)=>{
 const n=[1,2,3].includes(+arg)?+arg:1,w=W(n);
 let h='<h1>Witness files</h1>'+witnessTabs(n);
 if(!unlocked(n)){
  const prevOK=n==1||unlocked(n-1);
  h+='<h2>'+esc(w.fileLabel)+': '+esc(w.name)+'</h2>'+typed(['WITNESS FILE '+n,'Name: '+w.name,'Role: '+w.role,'Status: '+w.teaser,'Evidence: hidden until you finish the chapter.'])+
  '<div class="lockwall"><p><strong>This file is locked so it does not spoil the book.</strong></p>'+
  (prevOK?'<p>Unlock it when you have finished <em>'+esc(w.chapter)+'</em> in the book.</p><button class="btn dark" data-unlock="'+n+'">I have finished this chapter. Unlock the file.</button>':'<p>Unlock Witness File '+(n-1)+' first. The files open in the order of the book.</p><a class="btn" href="#/witnesses/'+(n-1)+'">Go to Witness File '+(n-1)+'</a>')+'</div>';
  return h;
 }
 h+='<h2>'+esc(w.fileLabel)+': '+esc(w.name)+'</h2>'+typed(w.box)+
 '<h2>Evidence held</h2>'+w.evidence.map(e=>'<div class="entry"><div class="tag">'+esc(e[0])+': '+esc(e[1])+'</div><p>'+esc(e[2])+'</p></div>').join('')+
 '<h2>Not asked</h2><p>These are the questions nobody put to the witness.</p>'+w.notAsked.map(e=>'<div class="entry"><div class="tag">'+esc(e[0])+': '+esc(e[1])+'</div><p>'+esc(e[2])+'</p></div>').join('')+
 '<h2>What is real, what is made up</h2>'+panel('real','Real',w.real)+panel('made','Made up',w.made)+
 '<div class="pager">'+(n>1?'<a class="btn" href="#/witnesses/'+(n-1)+'">&larr; File '+(n-1)+'</a>':'')+(n<3?'<a class="btn dark" href="#/witnesses/'+(n+1)+'">File '+(n+1)+' &rarr;</a>':'<a class="btn dark" href="#/board">Go to the Board &rarr;</a>')+'</div>'+
 (st.classAll?'':'<p style="margin-top:14px"><button class="btn small" data-relock="'+n+'">Hide this file again</button></p>');
 return h;
};

const ICON={
 pipe:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 40 H40 Q50 40 50 30 V16 H42 V30 Q42 34 38 34 H8Z" fill="#5a3a1c" stroke="#231a10" stroke-width="2"/><rect x="38" y="10" width="16" height="12" rx="2" fill="#3a2410" stroke="#231a10" stroke-width="2"/></svg>',
 pike:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4 L42 28 L32 40 L22 28Z" fill="#4a4a4a" stroke="#111" stroke-width="2"/><rect x="28" y="38" width="8" height="22" fill="#7a5a30" stroke="#111" stroke-width="2"/></svg>',
 stones:'<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="22" cy="40" rx="14" ry="10" fill="#8d8878" stroke="#231a10" stroke-width="2"/><ellipse cx="44" cy="34" rx="11" ry="8" fill="#a39e8c" stroke="#231a10" stroke-width="2"/></svg>',
 button:'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="22" fill="#9c8a2e" stroke="#231a10" stroke-width="2"/><circle cx="32" cy="32" r="16" fill="none" stroke="#6c5e1c" stroke-width="2"/><path d="M22 36 L24 26 L28 31 L32 24 L36 31 L40 26 L42 36Z" fill="#6c5e1c"/></svg>',
 letter:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="14" width="52" height="36" fill="#f6efdc" stroke="#231a10" stroke-width="2"/><path d="M6 14 L32 36 L58 14" fill="none" stroke="#231a10" stroke-width="2"/></svg>',
 cutting:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 6 H50 L54 12 V58 H12Z" fill="#e9dfc3" stroke="#231a10" stroke-width="2"/><rect x="18" y="14" width="26" height="22" fill="#9a9482" stroke="#231a10" stroke-width="2"/><path d="M18 44 H46 M18 50 H40" stroke="#231a10" stroke-width="2"/></svg>',
 tin:'<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="20" width="44" height="34" rx="3" fill="#b5b0a0" stroke="#231a10" stroke-width="2"/><rect x="8" y="14" width="48" height="10" rx="3" fill="#8d8a7c" stroke="#231a10" stroke-width="2"/><path d="M20 34 H44 M20 42 H38" stroke="#231a10" stroke-width="2"/></svg>'
};
const objById=id=>T.objects.find(o=>o.id==id);
screens.table=(arg)=>{
 const o=objById(arg);
 if(!o){
  const grp=(who)=>T.objects.filter(x=>x.by==who).map(x=>'<a class="obj" href="#/table/'+x.id+'">'+ICON[x.id]+'<div><b>'+esc(x.name)+'</b><span>Tap to open</span></div></a>').join('');
  return '<h1>The club table</h1><p class="lead">'+esc(T.tableIntro)+'</p><div class="cloth"><h2>Lawrence put these on the chair and the table</h2><div class="grid c2">'+grp('Lawrence')+'</div><h2>Jack put these on the cloth</h2><div class="grid c2">'+grp('Jack')+'</div></div><p class="note">Bundaberg, 25 April 1924. The Memorial Baths and Club Rooms, Quay Street, were real. The gathering at the table is made up.</p>';
 }
 const i=T.objects.indexOf(o),pv=T.objects[(i+T.objects.length-1)%T.objects.length],nx=T.objects[(i+1)%T.objects.length];
 let h='<p><a href="#/table">&larr; Back to the table</a></p><h1>'+esc(o.name)+'</h1><p class="lead">Put on the table by '+esc(o.by)+'.</p>'+
 '<h2>In the prologue</h2>'+P(o.prologue)+
 panel('real','Real history',o.real)+panel('family','Family tradition',o.family)+panel('made','Made up',o.made);
 if(o.image)h+=figure(o.image,o.id);
 h+=links(o.links);
 if(o.later){
  h+='<h2>Later in the book</h2>';
  h+=gateOK(o.later.gate)?'<section class="panel made">'+'<h3>'+badge('made')+'What happens to it'+'</h3>'+P(o.later.text)+'</section>':'<div class="lockwall"><p>Locked, to avoid spoilers. It opens when you unlock '+esc(gateName(o.later.gate))+'.</p><a class="btn" href="'+(typeof o.later.gate=='number'?'#/witnesses/'+o.later.gate:'#/board')+'">Go there</a></div>';
 }
 h+='<div class="pager"><a class="btn" href="#/table/'+pv.id+'">&larr; '+esc(pv.name)+'</a><a class="btn" href="#/table/'+nx.id+'">'+esc(nx.name)+' &rarr;</a></div>';
 return h;
};

/* ---------------- BOARD ---------------- */
function statement(c,b,locked){
 const sel=b.a==c[0]||b.b==c[0];
 return '<button class="sc" data-pick="'+c[0]+'" aria-pressed="'+sel+'"'+(locked?' disabled':'')+'><span class="who">'+esc(T.who[c[1]])+' · '+esc(c[2])+(sel?'<span class="mark">PAIRED</span>':'')+'</span><span class="t">'+esc(c[3])+'</span></button>';
}
screens.board=(arg)=>{
 if(!unlocked(3)){
  return '<h1>The board</h1><div class="lockwall"><p><strong>The board is locked so it does not spoil Chapter Three.</strong></p><p>Unlock Witness File 3 first. The board uses all three accounts.</p><a class="btn dark" href="#/witnesses/'+(unlocked(2)?3:unlocked(1)?2:1)+'">Go to the witness files</a></div>';
 }
 if(arg=='finding')return findingScreen();
 const t=T.topics.find(x=>x.id==arg);
 if(!t){
  const nT=T.topics.filter(x=>topicDone(x.id)).length;
  return '<h1>The board</h1><p class="lead">'+esc(T.boardIntro)+'</p><div class="status"><span class="'+(nT==T.topics.length?'done':'')+'">Locked in: '+nT+' of '+T.topics.length+'</span></div>'+
  '<ol class="q" style="list-style:none;padding:0">'+T.topics.map((x,i)=>{const b=st.board[x.id]||{};const s=b.locked?'Locked in':(b.a&&b.b?'Paired, not locked':'Not started');return '<li><a class="btn" style="display:flex;justify-content:space-between;text-align:left;width:100%" href="#/board/'+x.id+'"><span>'+(i+1)+'. '+esc(x.title)+'</span><span class="wc">'+s+'</span></a></li>'}).join('')+'</ol>'+
  '<h2>Then, your finding</h2><p>When you are ready, fill in the case file page from the book: <em>CASE FILE: FINDING</em>.</p><a class="btn dark" href="#/board/finding">My finding</a>'+
  '<p class="note">The book does not give one answer. Daisy weighs the accounts, then leaves the finding to the reader. This board follows the same plan.</p>';
 }
 const b=board(t.id),i=T.topics.indexOf(t),L=!!b.locked;
 let h='<p><a href="#/board">&larr; All questions</a></p><h1>'+(i+1)+'. '+esc(t.title)+'</h1><p class="lead">'+esc(t.ask)+'</p>'+
 '<h2>Step 1. Pair two statements that clash</h2><p>Tap two statements. Tap one again to take it off.</p><div id="stmts">'+t.cards.map(c=>statement(c,b,L)).join('')+'</div><p id="paircount" class="wc" aria-live="polite">'+(b.a&&b.b?'Pair chosen.':b.a?'One chosen. Pick one more.':'None chosen yet.')+'</p>'+
 '<h2>Step 2. Whom do you trust most on this question?</h2><fieldset><legend>I trust most:</legend><div class="opts">'+T.trustOptions.map(o=>'<label><input type="radio" name="trust_'+t.id+'" value="'+esc(o)+'" data-bk="trust"'+(b.trust==o?' checked':'')+(L?' disabled':'')+'> '+esc(o)+'</label>').join('')+'</div></fieldset>'+
 '<h2>Step 3. Write your finding</h2><label for="note">In one or two sentences: how do the two statements clash, and what do you think the clash means? Use only what is in the book.</label><textarea id="note" data-bk="note"'+(L?' disabled':'')+'>'+esc(b.note||'')+'</textarea>';
 if(!L){
  const ok=b.a&&b.b&&b.trust&&(b.note||'').trim().length>2;
  h+='<p><button class="btn dark" id="lockbtn" data-lock="'+t.id+'"'+(ok?'':' disabled')+' aria-describedby="lockhelp">Lock in my finding</button></p><p id="lockhelp" class="wc">'+(ok?'Once you lock it in, you can read how Daisy weighs this question.':'To lock in, pick a pair, choose whom you trust and write your finding.')+'</p>';
 }else{
  h+='<div class="locked-note">Locked in. Your finding is saved on this device.</div>'+
  '<section class="reveal" aria-labelledby="rv"><h2 id="rv">How Daisy weighs this, in the book</h2><p><em>This is from The Investigation. Compare it with your finding.</em></p>'+P(t.book)+(t.inferred?'<p>'+badge('check')+esc(t.inferred)+'</p>':'')+'</section>';
 }
 h+='<div class="pager">'+(i>0?'<a class="btn" href="#/board/'+T.topics[i-1].id+'">&larr; Previous</a>':'<a class="btn" href="#/board">&larr; All questions</a>')+(i<T.topics.length-1?'<a class="btn dark" href="#/board/'+T.topics[i+1].id+'">Next question &rarr;</a>':'<a class="btn dark" href="#/board/finding">My finding &rarr;</a>')+'</div>';
 return h;
};
function findingScreen(){
 const f=st.finding,L=!!f.locked,nT=T.topics.filter(x=>topicDone(x.id)).length;
 const dis=L?' disabled':'';
 let h='<p><a href="#/board">&larr; All questions</a></p><h1>Case file: Finding</h1><p class="lead">This is the page the book leaves blank. Write only what the evidence lets you say.</p><div class="status"><span class="'+(nT==T.topics.length?'done':'')+'">Board questions locked in: '+nT+' of '+T.topics.length+'</span></div>'+
 '<fieldset><legend>Case status</legend><div class="opts">'+['Open','Closed'].map(o=>'<label><input type="radio" name="status" value="'+o+'" data-fk="status"'+(f.status==o?' checked':'')+dis+'> '+o+'</label>').join('')+'</div></fieldset>'+
 '<label for="f_what">What I think happened at the creek, from the evidence</label><textarea id="f_what" data-fk="what"'+dis+'>'+esc(f.what||'')+'</textarea>'+
 '<label for="f_trust">The account I trust most, and why</label><textarea id="f_trust" data-fk="trust"'+dis+'>'+esc(f.trust||'')+'</textarea>'+
 '<label for="f_unch">The piece nobody checked</label><textarea id="f_unch" data-fk="unchecked"'+dis+'>'+esc(f.unchecked||'')+'</textarea>'+
 '<fieldset><legend>How sure am I?</legend><p style="font-size:15px">Green: proved. Amber: some gaps still guesswork. Red: I argued past the evidence.</p><div class="opts">'+['Green','Amber','Red'].map(o=>'<label><input type="radio" name="sure" value="'+o+'" data-fk="sure"'+(f.sure==o?' checked':'')+dis+'> '+o+'</label>').join('')+'</div></fieldset>';
 if(!L){
  const ok=f.status&&(f.what||'').trim().length>2&&f.sure;
  h+='<p><button class="btn dark" id="lockfind"'+(ok?'':' disabled')+' aria-describedby="fhelp">Lock in my finding</button></p><p id="fhelp" class="wc">'+(ok?'Locking it in shows how the book ends the weighing.':'To lock in, choose the case status and how sure you are, and write what you think happened.')+'</p>';
 }else{
  h+='<div class="locked-note">Locked in. Saved on this device.</div><p class="noprint"><button class="btn dark" id="printbtn">Print or save my case file</button></p>'+
  '<section class="reveal" aria-labelledby="rv1"><h2 id="rv1">Where Daisy says the three accounts agree</h2>'+P(T.agree)+'<h2>How much each account can hold</h2>'+P(T.weigh)+'<h2>What was never asked</h2>'+P(T.neverAsked)+'<h2>For the one reading</h2>'+P(T.closing)+'<p>'+badge('check')+'Daisy’s weighing is made up for the book. It uses only what is in the three chapters and her tin.</p></section>';
 }
 return h;
}

/* ---------------- RECORDS ---------------- */
function recTabs(cur){return '<div class="wtabs" role="navigation" aria-label="Records">'+T.recordTabs.map(r=>'<a class="btn'+(r[0]==cur?' dark':'')+'" href="#/records/'+r[0]+'"'+(r[0]==cur?' aria-current="page"':'')+'>'+esc(r[1])+'</a>').join('')+'</div>';}
function proj(m,lon,lat){return [(lon-m.lon0)*m.kx*m.sx,(m.lat1-lat)*m.sx];}
function arc(m,a,c,b){const A=proj(m,a[0],a[1]),C=proj(m,c[0],c[1]),B=proj(m,b[0],b[1]);return '<path class="arc" d="M'+A.map(v=>v.toFixed(1)).join(' ')+' Q'+C.map(v=>v.toFixed(1)).join(' ')+' '+B.map(v=>v.toFixed(1)).join(' ')+'"';}
function mapSvg(kind,sel,layers){
 const m=MAPS[kind],pl=id=>T.records.map.places.find(p=>p.id==id);
 let ids=kind=='world'?['oldross','dublin','plymouth','sydney','bundaberg','aden','polygon']:['suez','gaza','jerusalem'];
 let s='<svg viewBox="0 0 '+m.w+' '+m.h+'" role="group" aria-label="'+(kind=='world'?'World map with the places in the story. A list of the same places follows the map.':'Close-up map of Egypt and Palestine with Suez, Gaza and Jerusalem. A list of the same places follows the map.')+'"><rect width="'+m.w+'" height="'+m.h+'" fill="#cfe0e6"/><path class="land" d="'+m.land+'"/>';
 if(kind=='world'){
  if(layers.m)s+=arc(m,[-4.14,50.37],[60,-45],[151.21,-33.87])+' stroke="#1d3b5c"/>';
  if(layers.l)s+=arc(m,[151.21,-33.87],[100,-30],[45.03,12.78])+' stroke="#7a1f12"/>'+'<path class="arc" stroke="#7a1f12" d="M'+proj(m,45.03,12.78).map(v=>v.toFixed(1)).join(' ')+' L'+proj(m,32.55,29.97).map(v=>v.toFixed(1)).join(' ')+'"/>';
 }else{
  const a=proj(m,32.30,31.26),b=proj(m,32.55,29.97);
  s+='<path d="M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+' L'+b[0].toFixed(1)+' '+b[1].toFixed(1)+'" stroke="#1d3b5c" stroke-width="5" stroke-dasharray="2 0" opacity=".7" fill="none"/>';
  const q=proj(m,32.42,30.6);s+='<text x="'+(q[0]-14).toFixed(0)+'" y="'+q[1].toFixed(0)+'" text-anchor="end" font-size="20" font-style="italic">Suez Canal (approximate line)</text>';
  const sn=proj(m,33.55,29.95);s+='<text x="'+sn[0].toFixed(0)+'" y="'+sn[1].toFixed(0)+'" font-size="26" font-weight="bold" letter-spacing="3">SINAI</text>';
  const md=proj(m,33.2,31.9);s+='<text x="'+md[0].toFixed(0)+'" y="'+md[1].toFixed(0)+'" font-size="20" font-style="italic" fill="#1d3b5c">Mediterranean Sea</text>';
 }
 const LAB={dublin:{dx:14,dy:-14,a:'start',t:'Dublin, Old Ross'},oldross:{hide:1},plymouth:{dx:-14,dy:22,a:'end'},polygon:{dx:14,dy:28,a:'start',t:'Polygon Wood'},aden:{dx:14,dy:6,a:'start'},sydney:{dx:-14,dy:20,a:'end'},bundaberg:{dx:-14,dy:-6,a:'end',t:'Kalkie, Bundaberg'},suez:{dx:-16,dy:6,a:'end'},gaza:{dx:16,dy:20,a:'start'},jerusalem:{dx:16,dy:-6,a:'start'}};
 ids.forEach(id=>{const p=pl(id),xy=proj(m,p.lon,p.lat),on=sel==id,lb=LAB[id]||{dx:14,dy:5,a:'start'};
  const fs=kind=='world'?18:22,r=kind=='world'?9:10;
  s+='<a href="#/records/map/'+id+'" aria-label="'+esc(p.name)+(on?' (selected)':'')+'"><circle class="ring" cx="'+xy[0].toFixed(1)+'" cy="'+xy[1].toFixed(1)+'" r="'+(kind=='world'?22:24)+'" fill="'+(on?'#fff':'transparent')+'" fill-opacity="'+(on?.7:0)+'" stroke="'+(on?'#000':'none')+'" stroke-width="2"/><circle class="mk" cx="'+xy[0].toFixed(1)+'" cy="'+xy[1].toFixed(1)+'" r="'+r+'"/>'+(lb.hide?'':'<text x="'+(xy[0]+lb.dx).toFixed(1)+'" y="'+(xy[1]+lb.dy).toFixed(1)+'" font-size="'+fs+'" text-anchor="'+lb.a+'">'+esc(lb.t||p.name.replace(', County Wexford','').replace(', Belgium','').replace('Kalkie, near ','Kalkie, '))+'</text>')+'</a>';
 });
 if(kind=='world'){const e=proj(m,36,31);s+='<a href="#/records/map/gaza" aria-label="Close-up of Egypt and Palestine"><circle cx="'+e[0].toFixed(1)+'" cy="'+e[1].toFixed(1)+'" r="9" fill="#7a1f12" stroke="#fff" stroke-width="2"/><text x="'+(e[0]+12).toFixed(1)+'" y="'+(e[1]-6).toFixed(1)+'" font-size="17">Suez, Sinai, Gaza, Jerusalem</text></a>';}
 return s+'</svg>';
}
screens.records=(arg,arg2)=>{
 const tab=T.recordTabs.find(r=>r[0]==arg)?arg:'act',R=T.records[tab];
 let h='<h1>Real records</h1>'+recTabs(tab);
 if(tab=='act'){
  h+='<h2>'+esc(R.title)+'</h2><p>'+esc(R.intro)+'</p>'+panel('real','Real',R.real)+panel('made','Made up',R.made)+panel('check','Still being checked',R.check)+figure(R.image,'islanders')+links(R.links);
 }else if(tab=='vote'){
  h+='<h2>'+esc(R.title)+'</h2><p>'+esc(R.intro)+'</p><table class="tl"><caption class="wc" style="text-align:left;padding:4px 0">'+badge('real')+'Timeline</caption><thead><tr><th scope="col">When</th><th scope="col">What</th></tr></thead><tbody>'+R.timeline.map(r=>'<tr><th scope="row">'+esc(r[0])+'</th><td>'+esc(r[1])+'</td></tr>').join('')+'</tbody></table>'+panel('check','Still being checked',R.check)+links(R.links);
 }else if(tab=='joseph'){
  h+='<h2>'+esc(R.title)+'</h2><p>'+esc(R.intro)+'</p><section class="panel real" aria-label="Real: the record"><h3>'+badge('real')+'The record</h3><div class="factlist">'+R.facts.map(f=>'<div>'+esc(f[0])+'</div><div>'+esc(f[1])+'</div>').join('')+'</div></section>'+
  panel('real','Gaza, 26 March 1917',[R.gaza])+panel('made','Made up',[R.made])+panel('check','Still being checked',R.check)+figure(R.image,'lh2')+links(R.links);
 }else if(tab=='map'){
  const sel=arg2&&R.places.find(p=>p.id==arg2)?arg2:null;
  const east=['suez','gaza','jerusalem'].includes(sel);
  const lay=st._layers||(st._layers={m:true,l:true});
  h+='<h2>'+esc(R.title)+'</h2><p>'+esc(R.intro)+'</p>'+
  '<h3>'+(east?'Close-up: Egypt and Palestine':'The world')+'</h3>'+
  (east?'<p><a href="#/records/map">Back to the world map</a></p>':'<div class="chk"><label><input type="checkbox" data-layer="m"'+(lay.m?' checked':'')+'> Michael’s voyage, 1855 (blue line)</label><label><input type="checkbox" data-layer="l"'+(lay.l?' checked':'')+'> Joseph and Lawrence’s voyage, 1914 and 1915 (red line)</label></div>')+
  '<p class="wc">On a phone, slide the map sideways to see all of it.</p><div class="mapwrap" role="region" tabindex="0" aria-label="Map. It scrolls sideways on a small screen.">'+mapSvg(east?'east':'world',sel,lay)+'</div><p class="wc">'+esc(R.note)+'</p>';
  if(sel){const p=R.places.find(x=>x.id==sel);h+='<section class="panel '+p.k+'" aria-live="polite"><h3>'+badge(p.k)+esc(p.name)+'</h3><p style="margin:0">'+esc(p.text)+'</p></section>';
   if(!east&&['gaza','suez','jerusalem'].includes(sel)){}}
  h+=(!east?'<p><a class="btn" href="#/records/map/gaza">Close-up: Suez, Gaza and Jerusalem</a></p>':'<p><a class="btn" href="#/records/map">World map</a></p>')+
  '<h3>All the places</h3><ul class="placelist">'+R.places.map(p=>'<li>'+badge(p.k)+'<a href="#/records/map/'+p.id+'"><strong>'+esc(p.name)+'</strong></a><br>'+esc(p.text)+'</li>').join('')+'</ul>'+
  panel('made','Jack’s ride in the Sinai',[R.sinai]);
 }else{
  h+='<h2>'+esc(R.title)+'</h2><p>'+esc(R.intro)+'</p>'+R.cards.map(c=>'<details><summary>'+esc(c.h)+'</summary><div>'+(c.care?'<div class="care"><p style="margin:0"><strong>'+esc(c.care)+'</strong></p></div>':'')+panel('real','Real',c.real)+panel('family','Family tradition',c.family)+panel('made','Made up',c.made)+'</div></details>').join('')+
  '<p class="note">The hotel in Quay Street, Bundaberg, 1922, is below. It is a hotel, not the Memorial Club. No photo of the club was found.</p>'+figure({src:'images/hotel-bundaberg-1922.jpg',alt:'A black and white photo of a two-storey hotel with verandahs on a corner street in Bundaberg. A few people stand on the footpath.',cap:'Hotel Bundaberg, Quay Street, Bundaberg, 28 September 1922.',credit:'Unknown photographer, John Oxley Library, State Library of Queensland (IE219649). Via Wikimedia Commons. Public domain.'},'hotel')+
  figure({src:'images/mahadat-1916.jpg',alt:'A black and white photo of men and horses resting on sand at a well in the Sinai desert.',cap:'Men and horses of the 12th Light Horse Regiment, AIF, resting at Mahadat, Sinai, September 1916, where wells were improved after the Romani operations. A different regiment from the 5th, and later in 1916 than Jack’s ride. It shows what the Sinai looked like.',credit:'Australian War Memorial H16043. Copyright expired, public domain. Donor: Miss D. Traill.'},'mahadat');
 }
 return h;
};

/* ---------------- CLASS ---------------- */
screens.class=()=>{
 const wr=T.writing,w=st.write;
 const wcount=(['answer','limit','marks','question'].map(k=>(w[k]||'').trim().split(/\s+/).filter(Boolean).length).reduce((a,b)=>a+b,0));
 return '<h1>Class mode</h1>'+P(T.classIntro)+
 '<details><summary>Notes for teachers</summary><div><ul>'+T.teacherNotes.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p>Teacher tools:</p><p><button class="btn small" data-classall="1">'+(st.classAll?'All files are unlocked on this device. Tap to lock again':'Unlock everything on this device')+'</button></p></div></details>'+
 '<h2>Discussion questions</h2><p>Each group matches a part of the book. Use the group after you reach that part.</p>'+
 T.questions.map((g,i)=>'<details'+(i==0?' open':'')+'><summary>'+esc(g.h)+'</summary><div><ol class="q">'+g.q.map(q=>'<li>'+esc(q)+'</li>').join('')+'</ol></div></details>').join('')+
 '<h2>'+esc(wr.title)+'</h2><p class="wc">'+esc(wr.time)+'</p><ol class="q">'+wr.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol><p><strong>Sentence starters:</strong> '+wr.starters.map(esc).join(' &nbsp;·&nbsp; ')+'</p>'+
 wr.fields.map(f=>'<label for="w_'+f[0]+'">'+esc(f[1])+'</label>'+(f[2]?'<textarea id="w_'+f[0]+'" data-wk="'+f[0]+'">'+esc(w[f[0]]||'')+'</textarea>':'<input type="text" id="w_'+f[0]+'" data-wk="'+f[0]+'" value="'+esc(w[f[0]]||'')+'">')).join('')+
 '<p class="wc" id="wcount" aria-live="polite">Words so far: '+wcount+'</p><p><button class="btn dark" id="printbtn">Print or save my work</button></p>';
};

/* ---------------- ABOUT ---------------- */
screens.about=()=>
 '<h1>About</h1><p class="lead">A companion to <em>Troubled Paths on Ancient Ground</em> by Robin McKean, Perth, Western Australia. For readers 12 and older.</p>'+
 '<section class="care" aria-labelledby="c1"><h2 id="c1">Cultural care</h2>'+P(T.care)+'<p>'+esc(T.content)+'</p></section>'+
 '<h2>Thanks and acknowledgement</h2>'+P(T.ack)+
 '<h2>Real and made up</h2><p>This app follows the book’s <em>Behind the Story</em>. Anything not marked as real is made up. Nako and the Keeper, Daisy, Jack, Willie, Sam, the night of 30 December 1906, the day books, the police note, the shipping list, the tin and the gathering at the club in 1924 are all made up. Michael Gahan was a real man, but his 1906 scenes are made up. The 1901 Act, the voting laws, Joseph Gahan’s record and the history on the Records pages are real.</p>'+
 '<h2>Pictures</h2><p>All pictures are public domain and credited. None is made by artificial intelligence.</p><ul>'+T.credits.map(c=>'<li><strong>'+esc(c[0])+'.</strong> '+esc(c[1])+'</li>').join('')+'</ul>'+
 '<h2>Still being checked</h2>'+panel('check','Open questions',T.openChecks)+
 '<h2>Privacy</h2><p>This app has no accounts, no tracking, no cookies and no adverts. Your answers are saved only in this browser on this device. Nothing is sent anywhere. Printing the case file is how you share your work. Tap “Clear my answers” at the bottom of any page to delete everything.</p>'+
 '<p><a href="https://github.com/RobMac10/troubled-paths-cold-case" target="_blank" rel="noopener noreferrer">Source files on GitHub (opens in a new tab)</a></p>';

/* ---------------- PRINT ---------------- */
function buildPrint(){
 const g=v=>esc(v||'—').replace(/\n/g,'<br>');
 let h='<h1>CASE FILE: FINDING</h1><p>Kalkie, near Bundaberg · 30 December 1906 · Companion to Troubled Paths on Ancient Ground · Investigator: me</p>';
 h+='<h4>Case status</h4><p>'+g(st.finding.status)+'</p><h4>What I think happened at the creek, from the evidence</h4><p>'+g(st.finding.what)+'</p><h4>The account I trust most, and why</h4><p>'+g(st.finding.trust)+'</p><h4>The piece nobody checked</h4><p>'+g(st.finding.unchecked)+'</p><h4>How sure am I?</h4><p>'+g(st.finding.sure)+'</p>';
 h+='<h4>My Board findings</h4>'+T.topics.map(t=>{const b=st.board[t.id]||{};const c=x=>{const k=t.cards.find(y=>y[0]==x);return k?esc(T.who[k[1]])+' ('+esc(k[2])+')':'—'};return '<p><strong>'+esc(t.title)+'</strong><br>Pair: '+c(b.a)+' and '+c(b.b)+'<br>Trust most: '+g(b.trust)+'<br>My finding: '+g(b.note)+'</p>'}).join('');
 if(T.writing.fields.some(f=>st.write[f[0]]))h+='<h4>Writing task: the question nobody asked</h4>'+T.writing.fields.map(f=>'<p><strong>'+esc(f[1])+'</strong><br>'+g(st.write[f[0]])+'</p>').join('');
 document.getElementById('print').innerHTML=h;
}

/* ---------------- ROUTER ---------------- */
const NAV=[['home','Case file'],['witnesses','Witnesses'],['table','Club table'],['board','Board'],['records','Records'],['class','Class'],['about','About']];
const TITLES={home:'Case file',witnesses:'Witness files',table:'The club table',board:'The board',records:'Real records',class:'Class mode',about:'About'};
const main=document.getElementById('main'),nav=document.getElementById('nav');
let first=true;
function route(){
 const parts=(location.hash.replace(/^#\/?/,'')||'home').split('/');
 let name=parts[0];if(!screens[name]){name='home';}
 main.innerHTML=screens[name](parts[1],parts[2]);
 nav.innerHTML=NAV.map(([id,l])=>'<a href="#/'+(id=='home'?'':id)+'"'+(id==name?' aria-current="page"':'')+'>'+l+'</a>').join('');
 document.title=TITLES[name]+' · Cold Case · Troubled Paths on Ancient Ground';
 if(!first){const h=main.querySelector('h1');if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true});}window.scrollTo(0,0);}
 first=false;
}
function rerender(focusSel){const y=window.scrollY;const parts=(location.hash.replace(/^#\/?/,'')||'home').split('/');let name=screens[parts[0]]?parts[0]:'home';main.innerHTML=screens[name](parts[1],parts[2]);nav.innerHTML=NAV.map(([id,l])=>'<a href="#/'+(id=='home'?'':id)+'"'+(id==name?' aria-current="page"':'')+'>'+l+'</a>').join('');window.scrollTo(0,y);if(focusSel){const el=main.querySelector(focusSel);if(el){if(!el.matches('button,a,input,textarea,[tabindex]'))el.setAttribute('tabindex','-1');el.focus({preventScroll:true});}}}
window.addEventListener('hashchange',route);

document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.unlock){st.unlocked[b.dataset.unlock]=true;save();rerender('h2');}
 else if(b.dataset.relock){delete st.unlocked[b.dataset.relock];for(let k=+b.dataset.relock+1;k<=3;k++)delete st.unlocked[k];save();rerender('h1');}
 else if(b.dataset.pick){const t=T.topics.find(x=>x.id==location.hash.split('/')[2]);if(!t)return;const bd=board(t.id);const id=b.dataset.pick;
  if(bd.a==id)bd.a=bd.b,bd.b=undefined;else if(bd.b==id)bd.b=undefined;else if(!bd.a)bd.a=id;else if(!bd.b)bd.b=id;else{bd.b=id;}
  save();rerender('[data-pick="'+id+'"]');}
 else if(b.dataset.lock){const bd=board(b.dataset.lock);if(bd.a&&bd.b&&bd.trust&&(bd.note||'').trim().length>2){bd.locked=Date.now();save();rerender('#rv');const r=document.getElementById('rv');if(r){r.setAttribute('tabindex','-1');r.focus();}}}
 else if(b.id=='lockfind'){st.finding.locked=Date.now();save();rerender('#rv1');const r=document.getElementById('rv1');if(r){r.setAttribute('tabindex','-1');r.focus();}}
 else if(b.dataset.showimg){st['img_'+b.dataset.showimg]=true;save();rerender();}
 else if(b.dataset.classall){st.classAll=!st.classAll;save();rerender();}
 else if(b.id=='printbtn'){buildPrint();window.print();}
 else if(b.id=='clear'){if(confirm('Clear all your answers and unlocks from this browser?')){localStorage.removeItem(KEY);st={unlocked:{},board:{},finding:{},write:{}};route();}}
});
document.addEventListener('input',e=>{
 const d=e.target.dataset||{};
 if(d.bk){const t=location.hash.split('/')[2];const bd=board(t);bd[d.bk]=e.target.value;save();
  if(d.bk=='trust'||d.bk=='note'){const btn=document.getElementById('lockbtn');if(btn){const ok=bd.a&&bd.b&&bd.trust&&(bd.note||'').trim().length>2;btn.disabled=!ok;document.getElementById('lockhelp').textContent=ok?'Once you lock it in, you can read how Daisy weighs this question.':'To lock in, pick a pair, choose whom you trust and write your finding.';}}}
 else if(d.fk){st.finding[d.fk]=e.target.value;save();const btn=document.getElementById('lockfind');if(btn){const f=st.finding;const ok=f.status&&(f.what||'').trim().length>2&&f.sure;btn.disabled=!ok;document.getElementById('fhelp').textContent=ok?'Locking it in shows how the book ends the weighing.':'To lock in, choose the case status and how sure you are, and write what you think happened.';}}
 else if(d.wk){st.write[d.wk]=e.target.value;save();const n=['answer','limit','marks','question'].map(k=>(st.write[k]||'').trim().split(/\s+/).filter(Boolean).length).reduce((a,b)=>a+b,0);document.getElementById('wcount').textContent='Words so far: '+n;}
 else if(d.layer){(st._layers=st._layers||{m:true,l:true})[d.layer]=e.target.checked;save();rerender('[data-layer="'+d.layer+'"]');}
});
window.addEventListener('beforeprint',buildPrint);
document.getElementById('foot').innerHTML='<p><strong>No tracking. Your answers are saved only in this browser. Nothing is sent anywhere.</strong> <button class="btn small" id="clear">Clear my answers</button></p><p>Cultural care: this book describes violence against Aboriginal people and uses words of the period. <a href="#/about">Read the care note and acknowledgement.</a></p><p>Public-domain pictures, all credited. No AI images. A companion to the novel by Robin McKean.</p>';
route();
})();
