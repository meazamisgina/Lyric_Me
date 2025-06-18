 document.getElementById("profileCancel").onclick = closeModal;
  document.getElementById("profileAvatar").onchange = function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { document.getElementById("profileAvatarImg").src = reader.result; };
      reader.readAsDataURL(file);
    }
  };

function saveProfile(data) {
  userProfile = data;
  localStorage.setItem('lyricme_profile', JSON.stringify(userProfile));
  renderProfileBtn();
  closeModal();
}


function showSuggestions() {
  const query = document.getElementById('searchInput').value.trim();
  const mode = document.querySelector('input[name="searchMode"]:checked').value;
  const sugDiv = document.getElementById('suggestions');
  if (!query) { sugDiv.classList.remove('active'); sugDiv.innerHTML = ""; return; }
  let q = mode === "artist" ? `artist:"${query}"` : mode === "album" ? `album:"${query}"` : `track:"${query}"`;
  fetch(CORS + `${API.deezer_search}?q=${encodeURIComponent(q)}`)
    .then(r => r.json())
    .then(data => {
      if (!data.data.length) { sugDiv.classList.remove('active'); return; }
      const arr = [];
      if (mode === "artist") {
        let seen = {};
        data.data.forEach(d => { if (!seen[d.artist.name]) { arr.push(d.artist.name); seen[d.artist.name] = 1; } });
      } else if (mode === "album") {
        let seen = {};
        data.data.forEach(d => { if (!seen[d.album.title]) { arr.push(d.album.title); seen[d.album.title] = 1; } });
      } else {
        data.data.forEach(d => { arr.push(`${d.title} - ${d.artist.name}`); });
      }
      sugDiv.innerHTML = arr.slice(0, 8).map(s => `<div>${s}</div>`).join('');
      sugDiv.classList.add('active');
    })
    .catch(err => showToast("Failed to load suggestions."));

}



