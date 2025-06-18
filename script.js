
window.openMoodTagModal = function() {
  if(!currentSong)return;
  let lyrics = document.getElementById('lyricsBlock').textContent;
  let tagKey = makeTagKey(currentSong,lyrics);
  let moods = moodTags[tagKey]||[];
  openModal(`
    <h3>Tag Mood</h3>
    <div>Select all that apply:</div>
    <div style="display:flex;flex-wrap:wrap;gap:.5rem;">
      ${MOODS.map(m=>`<span class="mood-tag${moods.includes(m)?' selected':''}" onclick="toggleMoodTag(this,'${m}')">${m}</span>`).join("")}
    </div>
    <button class="btn" onclick="saveMoodTags('${tagKey}')">Save</button>
    <button class="btn cancel" onclick="closeModal()">Cancel</button>
  `);
};
window.toggleMoodTag = function(el, mood) {
  el.classList.toggle('selected');
};
window.saveMoodTags = function(tagKey) {
  let selected = Array.from(document.querySelectorAll('.mood-tag.selected')).map(el=>el.textContent);
  moodTags[tagKey] = selected;
  localStorage.setItem('lyricme_moodtags', JSON.stringify(moodTags));
  selected.forEach(mood=>{leaderboard[mood]=(leaderboard[mood]||0)+1;});
  localStorage.setItem('lyricme_leaderboard',JSON.stringify(leaderboard));
  closeModal();
  renderMoodCloud();
  if(document.getElementById('moodsList')) {
    document.getElementById('moodsList').innerHTML = selected.map(m=>`<span class="mood-tag">${m}</span>`).join("");
  }
};
function renderMoodCloud(){
  let el = document.getElementById('moodCloud');
  let cloud={};
  Object.values(moodTags).forEach(arr=>arr.forEach(m=>cloud[m]=(cloud[m]||0)+1));
  let sorted = Object.entries(cloud).sort((a,b)=>b[1]-a[1]);
  el.innerHTML = sorted.length ? sorted.map(([mood,cnt])=>`<span class="mood-tag" style="font-size:${0.99+cnt*0.09}rem">${mood} (${cnt})</span>`).join("") : "<div>No tags yet.</div>";
}


window.openCommentModal = function() {
  if(!userProfile){ openProfileModal(); return;}
  let lyrics = document.getElementById('lyricsBlock').textContent;
  let tagKey = makeTagKey(currentSong,lyrics);
  let lyricComments = comments[tagKey]||[];
  openModal(`
    <h3>Comments</h3>
    <div id="commentList">${lyricComments.map(c=>`<div><b>@${c.user}</b>: ${c.text}</div>`).join("")}</div>
    <form id="commentForm">
      <input type="text" id="commentInput" placeholder="Type a comment, tag with @username..." maxlength="120">
      <button type="submit" class="btn">Send</button>
    </form>
    <button class="btn cancel" onclick="closeModal()">Close</button>
  `);
  document.getElementById("commentForm").onsubmit = function(e){
    e.preventDefault();
    let text = document.getElementById("commentInput").value.trim();
    if(!text)return;
    let c = { user: userProfile.name, text };
    lyricComments.push(c);
    comments[tagKey] = lyricComments;
    localStorage.setItem('lyricme_comments', JSON.stringify(comments));
    document.getElementById("commentInput").value = "";
    document.getElementById("commentList").innerHTML = lyricComments.map(c=>`<div><b>@${c.user}</b>: ${c.text}</div>`).join("");
  };
};


window.copyLyrics = function(){
  let lyrics = document.getElementById('lyricsBlock').textContent;
  navigator.clipboard.writeText(lyrics);
  showToast("Lyrics copied!");
};


function openModal(html){
  document.getElementById('modal').innerHTML = html;
  document.getElementById('modalBg').classList.remove('hidden');
}
function closeModal(){
  document.getElementById('modalBg').classList.add('hidden');
}

function showToast(msg){
  let el = document.createElement('div');
  el.style.position = 'fixed';
  el.style.bottom = '34px';
  el.style.left = '50%';
  el.style.transform = 'translateX(-50%)';
  el.style.background = 'var(--primary)';
  el.style.color = '#fff';
  el.style.padding = '0.7rem 1.4rem';
  el.style.borderRadius = '10px';
  el.style.fontWeight = '500';
  el.style.fontSize = '1.08rem';
  el.style.zIndex = 2222;
  el.style.boxShadow = '0 4px 16px rgba(80,61,255,0.10)';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1700);
}
window.openMoodTagModal = function() {
  if(!currentSong)return;
  let lyrics = document.getElementById('lyricsBlock').textContent;
  let tagKey = makeTagKey(currentSong,lyrics);
  let moods = moodTags[tagKey]||[];
  openModal(`
    <h3>Tag Mood</h3>
    <div>Select all that apply:</div>
    <div style="display:flex;flex-wrap:wrap;gap:.5rem;">
      ${MOODS.map(m=>`<span class="mood-tag${moods.includes(m)?' selected':''}" onclick="toggleMoodTag(this,'${m}')">${m}</span>`).join("")}
    </div>
    <button class="btn" onclick="saveMoodTags('${tagKey}')">Save</button>
    <button class="btn cancel" onclick="closeModal()">Cancel</button>
  `);
};
window.toggleMoodTag = function(el, mood) {
  el.classList.toggle('selected');
};
window.saveMoodTags = function(tagKey) {
  let selected = Array.from(document.querySelectorAll('.mood-tag.selected')).map(el=>el.textContent);
  moodTags[tagKey] = selected;
  localStorage.setItem('lyricme_moodtags', JSON.stringify(moodTags));
  selected.forEach(mood=>{leaderboard[mood]=(leaderboard[mood]||0)+1;});
  localStorage.setItem('lyricme_leaderboard',JSON.stringify(leaderboard));
  closeModal();
  renderMoodCloud();
  if(document.getElementById('moodsList')) {
    document.getElementById('moodsList').innerHTML = selected.map(m=>`<span class="mood-tag">${m}</span>`).join("");
  }
};
function renderMoodCloud(){
  let el = document.getElementById('moodCloud');
  let cloud={};
  Object.values(moodTags).forEach(arr=>arr.forEach(m=>cloud[m]=(cloud[m]||0)+1));
  let sorted = Object.entries(cloud).sort((a,b)=>b[1]-a[1]);
  el.innerHTML = sorted.length ? sorted.map(([mood,cnt])=>`<span class="mood-tag" style="font-size:${0.99+cnt*0.09}rem">${mood} (${cnt})</span>`).join("") : "<div>No tags yet.</div>";
}


window.openCommentModal = function() {
  if(!userProfile){ openProfileModal(); return;}
  let lyrics = document.getElementById('lyricsBlock').textContent;
  let tagKey = makeTagKey(currentSong,lyrics);
  let lyricComments = comments[tagKey]||[];
  openModal(`
    <h3>Comments</h3>
    <div id="commentList">${lyricComments.map(c=>`<div><b>@${c.user}</b>: ${c.text}</div>`).join("")}</div>
    <form id="commentForm">
      <input type="text" id="commentInput" placeholder="Type a comment, tag with @username..." maxlength="120">
      <button type="submit" class="btn">Send</button>
    </form>
    <button class="btn cancel" onclick="closeModal()">Close</button>
  `);
  document.getElementById("commentForm").onsubmit = function(e){
    e.preventDefault();
    let text = document.getElementById("commentInput").value.trim();
    if(!text)return;
    let c = { user: userProfile.name, text };
    lyricComments.push(c);
    comments[tagKey] = lyricComments;
    localStorage.setItem('lyricme_comments', JSON.stringify(comments));
    document.getElementById("commentInput").value = "";
    document.getElementById("commentList").innerHTML = lyricComments.map(c=>`<div><b>@${c.user}</b>: ${c.text}</div>`).join("");
  };
};


window.copyLyrics = function(){
  let lyrics = document.getElementById('lyricsBlock').textContent;
  navigator.clipboard.writeText(lyrics);
  showToast("Lyrics copied!");
};


function openModal(html){
  document.getElementById('modal').innerHTML = html;
  document.getElementById('modalBg').classList.remove('hidden');
}
function closeModal(){
  document.getElementById('modalBg').classList.add('hidden');
}

function showToast(msg){
  let el = document.createElement('div');
  el.style.position = 'fixed';
  el.style.bottom = '34px';
  el.style.left = '50%';
  el.style.transform = 'translateX(-50%)';
  el.style.background = 'var(--primary)';
  el.style.color = '#fff';
  el.style.padding = '0.7rem 1.4rem';
  el.style.borderRadius = '10px';
  el.style.fontWeight = '500';
  el.style.fontSize = '1.08rem';
  el.style.zIndex = 2222;
  el.style.boxShadow = '0 4px 16px rgba(80,61,255,0.10)';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1700);
}