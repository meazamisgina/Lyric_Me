const CORS = "https://corsproxy.io/?";
const API = {
  lyrics: 'https://api.lyrics.ovh/v1',
  deezer_search: 'https://api.deezer.com/search',
  deezer_album: 'https://api.deezer.com/album',
  deezer_artist: 'https://api.deezer.com/artist',
  deezer_track: 'https://api.deezer.com/track'
};
const MOODS = [
  "Uplifting", "Sad", "Heartbreak", "Party", "Hopeful", "Fire",
  "Chill", "Motivation", "Romantic", "Nostalgic", "Dreamy",
  "Energetic", "Melancholy", "In Love", "Breakup", "Angry",
  "Happy", "Peaceful", "Dark", "Epic", "Dance"
];
let userProfile, favorites, moodTags, leaderboard, comments;
let currentSong = null;
let lastResults = [];
let lastAlbums = {};

document.addEventListener('DOMContentLoaded', () => {
  try {
    userProfile = JSON.parse(localStorage.getItem('lyricme_profile') || 'null');
  } catch (e) {
    userProfile = null;
  }
  try {
    favorites = JSON.parse(localStorage.getItem('lyricme_favorites') || '[]');
  } catch (e) {
    favorites = [];
  }
  try {
    moodTags = JSON.parse(localStorage.getItem('lyricme_moodtags') || '{}');
  } catch (e) {
    moodTags = {};
  }
  try {
    leaderboard = JSON.parse(localStorage.getItem('lyricme_leaderboard') || '{}');
  } catch (e) {
    leaderboard = {};
  }
  try {
    comments = JSON.parse(localStorage.getItem('lyricme_comments') || '{}');
  } catch (e) {
    comments = {};
  }

  if (localStorage.getItem('lyricme_theme') === 'dark') {
    document.body.classList.add('dark');
  }
  renderProfileBtn();
  renderFavorites();
  renderMoodCloud();
  showLyricOfDay();

  document.getElementById('toggleMode').onclick = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('lyricme_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  };
  document.getElementById('profileBtn').onclick = openProfileModal;
  document.getElementById('searchBtn').onclick = searchMusic;
  document.getElementById('searchInput').addEventListener('keypress', e => { if (e.key === 'Enter') searchMusic(); });
  document.getElementById('searchInput').addEventListener('input', showSuggestions);
  document.getElementById('suggestions').onclick = function (e) {
    if (e.target && e.target.nodeName === "DIV") {
      document.getElementById('searchInput').value = e.target.textContent;
      this.classList.remove('active');
      searchMusic();
    }
  };
  document.getElementById('modalBg').onclick = function (e) { if (e.target === this) closeModal(); }
});

function showLyricOfDay() {
  const artists = ["Adele", "Ed Sheeran", "Drake", "Beyonce", "Eminem", "Taylor Swift", "Billie Eilish"];
  const artist = artists[Math.floor(Math.random() * artists.length)];
  fetch(CORS + `${API.deezer_search}?q=artist:"${encodeURIComponent(artist)}"`)
    .then(r => r.json())
    .then(data => {
      if (!data.data.length) return;
      const track = data.data[Math.floor(Math.random() * data.data.length)];
      fetch(`${API.lyrics}/${encodeURIComponent(track.artist.name)}/${encodeURIComponent(track.title)}`)
        .then(r => r.json())
        .then(lyricData => {
          const lyric = lyricData.lyrics || "Lyrics not found.";
          document.getElementById('lyricOfDay').innerHTML = `<b>Lyric of the Day:</b> <i>${track.title}</i> by <b>${track.artist.name}</b><br>
        <span style="font-size:.98rem;">${lyric.slice(0, 110)}${lyric.length > 110 ? '...' : ''}</span>`;
        })
        .catch(err => showToast("Failed to load lyrics."));
    })
    .catch(err => showToast("Failed to load songs."));

}

function renderProfileBtn() {
  const el = document.getElementById('profileBtn');
  if (!userProfile) {
    el.innerHTML = `<span>👤 Profile</span>`;
  } else {
    el.innerHTML = `<img src="${userProfile.avatar}" alt="avatar"> <span>${userProfile.name}</span>`;
  }
}

function openProfileModal() {
  openModal(`
    <h2>${userProfile ? "Edit" : "Create"} Profile</h2>
    <form id="profileForm">
      <label>Name:<br><input type="text" id="profileName" value="${userProfile ? userProfile.name : ""}" required></label><br>
      <label>Avatar:<br><input type="file" id="profileAvatar" accept="image/*"></label><br>
      <img id="profileAvatarImg" src="${userProfile?.avatar || 'https://api.dicebear.com/7.x/identicon/svg?seed=user'}" alt="avatar">
      <button type="submit" class="btn">${userProfile ? "Update" : "Create"}</button>
      <button type="button" class="btn cancel" id="profileCancel">Cancel</button>
    </form>
  `);
     document.getElementById("profileForm").onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("profileName").value.trim();
    const file = document.getElementById("profileAvatar").files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { saveProfile({ name, avatar: reader.result }); };
      reader.readAsDataURL(file);
    } else {
      saveProfile({ name, avatar: userProfile?.avatar || 'https://api.dicebear.com/7.x/identicon/svg?seed=user' });
    }
 };
}