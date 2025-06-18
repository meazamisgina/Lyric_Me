function showSongDetails(songId, albumId) {
  let d = lastResults.find(x => x.id == songId);
  if (!d && albumId && lastAlbums[albumId]) {
    d = lastAlbums[albumId].tracks.data.find(x => x.id == songId);
    if (d && lastAlbums[albumId]) {
      d.album = lastAlbums[albumId];
      d.artist = lastAlbums[albumId].artist;
    }
  }

if (!d) {
    fetch(CORS + `${API.deezer_track}/${songId}`).then(r => r.json()).then(d2 => renderDetails(d2));
  } else {
    renderDetails(d);
  }
  function renderDetails(d) {
    currentSong = d;
    const details = document.getElementById('detailsSection');
    details.innerHTML = `<div style="margin:1.2rem 0;">Loading details...</div>`;
    Promise.all([
      fetch(`${API.lyrics}/${encodeURIComponent(d.artist.name)}/${encodeURIComponent(d.title)}`).then(r => r.json()),
      fetch(CORS + `${API.deezer_artist}/${d.artist.id}`).then(r => r.json())
    ]).then(([lyricsData, artistData]) => {
      let lyric = lyricsData.lyrics || "Lyrics not found.";
      let favKey = makeFavKey(d);
      let isFav = favorites.some(f => f.key === favKey);
      let tagKey = makeTagKey(d, lyric);
      let moods = moodTags[tagKey] || [];
      let lyricComments = comments[tagKey] || [];
      let bio = artistData?.name ? `${artistData.name} — ${artistData.nb_album} albums, ${artistData.nb_fan} fans` : "";
      details.innerHTML = `
        <div class="details-header">
          <img class="details-thumb" src="${d.album.cover_medium}" alt="album">
          <div class="details-info">
            <div class="details-title">${d.title}</div>
            <div class="details-artist">${d.artist.name}</div>
            <div class="details-album">${d.album.title}</div>
            <div class="details-year">${d.release_date?.slice(0, 4) || ''}</div>
            ${bio ? `<div class="details-bio"><b>About Artist:</b> ${bio}</div>` : ""}
          </div>
        </div>
        <div class="audio-player">
          <audio controls src="${d.preview}" preload="none"></audio>
          <div class="audio-waveform"></div>
        </div>
        <div class="lyrics-block" id="lyricsBlock">${lyric.replace(/\n/g, '<br>')}</div>
        <div class="lyrics-actions">
          <button class="copy" onclick="copyLyrics()">Copy</button>
          <button class="favorite" onclick="toggleFavorite()">${isFav ? "Remove Favorite" : "Add to Favorites"}</button>
          <button class="tag-mood" onclick="openMoodTagModal()">Tag Mood</button>
          <button class="comment" onclick="openCommentModal()"> Comment</button>
        </div>
        <div class="moods-list" id="moodsList">${moods.map(m => `<span class="mood-tag">${m}</span>`).join("")}</div>
        <div class="comments-list" id="commentsList">
          ${lyricComments.map(c => `<div><b>@${c.user}</b>: ${c.text}</div>`).join("")}
        </div>
      `;
      details.classList.remove('hidden');
    });
  }



function renderFavorites() {
  let el = document.getElementById('favorites');
  document.getElementById('favCount').textContent = favorites.length ? `(${favorites.length})` : "";
  if (!favorites.length) { el.innerHTML = `<div style="color:#888;">No favorites yet.</div>`; return; }
  el.innerHTML = favorites.map(f => `
    <div class="fav-item">
      <img class="fav-thumb" src="${f.cover}" alt="album">
      <div class="fav-title" style="cursor:pointer;color:var(--primary);" onclick="showFavoriteDetails('${f.key}')">${f.title}</div>
      <button class="fav-remove" onclick="removeFavorite('${f.key}')"></button>
    </div>
  `).join('');
}
window.showFavoriteDetails = function (key) {
  const f = favorites.find(x => x.key === key);
  if (!f) return;

  let d = {
    title: f.title,
    artist: { name: f.artist, id: "" },
    album: { title: f.album, cover_medium: f.cover },
    release_date: f.year,
    preview: f.preview || ""
  };
  currentSong = d;
  const details = document.getElementById('detailsSection');
  let lyric = f.lyric || "Lyrics not found.";
  let favKey = f.key;
  let isFav = true;
  let tagKey = makeTagKey(d, lyric);
  let moods = moodTags[tagKey] || [];
  let lyricComments = comments[tagKey] || [];
  details.innerHTML = `
    <div class="details-header">
      <img class="details-thumb" src="${f.cover}" alt="album">
      <div class="details-info">
        <div class="details-title">${f.title}</div>
        <div class="details-artist">${f.artist}</div>
        <div class="details-album">${f.album}</div>
        <div class="details-year">${f.year || ''}</div>
      </div>
    </div>
    <div class="audio-player">
      <audio controls src="${f.preview || ""}" preload="none"></audio>
      <div class="audio-waveform"></div>
    </div>
    <div class="lyrics-block" id="lyricsBlock">${lyric.replace(/\n/g, '<br>')}</div>
    <div class="lyrics-actions">
      <button class="copy" onclick="copyLyrics()">Copy</button>
      <button class="favorite" onclick="toggleFavorite()">Remove Favorite</button>
      <button class="tag-mood" onclick="openMoodTagModal()">Tag Mood</button>
      <button class="comment" onclick="openCommentModal()"> Comment</button>
    </div>
    <div class="moods-list" id="moodsList">${moods.map(m => `<span class="mood-tag">${m}</span>`).join("")}</div>
    <div class="comments-list" id="commentsList">
      ${lyricComments.map(c => `<div><b>@${c.user}</b>: ${c.text}</div>`).join("")}
    </div>
  `;
  details.classList.remove('hidden');
};
}
