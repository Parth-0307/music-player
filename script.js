const audio = document.getElementById("audio");
const fileInput = document.getElementById("fileInput");
const playlistEl = document.getElementById("playlist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const currentTimeEl = document.getElementById("current");
const durationEl = document.getElementById("duration");

let playlist = [];
let currentSongIndex = 0;
let isPlaying = false;

// Load songs from user's system
fileInput.addEventListener("change", () => {
  playlist = Array.from(fileInput.files);
  currentSongIndex = 0;
  updatePlaylist();
  if (playlist.length > 0) {
    loadSong(currentSongIndex);
  }
});

function loadSong(index) {
  const file = playlist[index];
  if (!file) return;
  const url = URL.createObjectURL(file);
  audio.src = url;
  audio.load();
  highlightActiveSong();
}

function updatePlaylist() {
  playlistEl.innerHTML = "";
  playlist.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.name;
    li.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong(currentSongIndex);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

function highlightActiveSong() {
  const items = playlistEl.querySelectorAll("li");
  items.forEach((li, idx) => {
    li.classList.toggle("active", idx === currentSongIndex);
  });
}

// Play & Pause
function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸️";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶️";
}

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

prevBtn.addEventListener("click", () => {
  if (playlist.length === 0) return;
  currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentSongIndex);
  playSong();
});

nextBtn.addEventListener("click", () => {
  if (playlist.length === 0) return;
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  loadSong(currentSongIndex);
  playSong();
});

// Progress & Timer
function formatTime(seconds) {
  const min = Math.floor(seconds / 60) || 0;
  const sec = Math.floor(seconds % 60) || 0;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// Volume
volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

// Auto play next when song ends
audio.addEventListener("ended", () => {
  nextBtn.click();
});
