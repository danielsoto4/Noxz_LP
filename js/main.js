const songs = [
    { name: "Into U Baby [mashup]", src: "media/song2.mp3", albumArt: "media/album1.png" },
    { name: "From Time x Bank On It [noxz mix]", src: "media/song3.mp3", albumArt: "media/album4.png" },
    { name: "Another day by U [mashup]", src: "media/song1.mp3", albumArt: "media/album2.png" },
    { name: "All Night Long [MASHUP]", src: "media/song3.mp3", albumArt: "media/album3.png" },
];

let currentIndex = 0;
let isPlaying = false;

const audioPlayer = document.getElementById("audio-player");
const playPauseBtn = document.getElementById("play-pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const trackName = document.getElementById("track-name");
const albumImage = document.getElementById("album-image");
const progressBar = document.getElementById("progress-bar");
const currentTime = document.getElementById("current-time");
const totalDuration = document.getElementById("total-duration");
const canvas = document.getElementById("audio-visualizer");
const ctx = canvas.getContext("2d");


function loadSong(index) {
    const song = songs[index];
    audioPlayer.src = song.src;
    trackName.textContent = song.name;
    albumImage.src = song.albumArt;
}


function playPause() {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.textContent = "▶️";
    } else {
        audioPlayer.play();
        playPauseBtn.textContent = "⏸️";
    }
    isPlaying = !isPlaying;
}


audioPlayer.addEventListener("timeupdate", () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progress || 0;
    currentTime.textContent = formatTime(audioPlayer.currentTime);
    totalDuration.textContent = formatTime(audioPlayer.duration);
});

progressBar.addEventListener("input", () => {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});


function prevSong() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) audioPlayer.play();
}


function nextSong() {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) audioPlayer.play();
}


function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
}


function initializeVisualizer() {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioPlayer);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 64;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);

        const barWidth = (canvas.width / bufferLength) * 1.5;
        let x = 0;

        dataArray.forEach((value) => {
            const barHeight = (value / 256) * canvas.height;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        });

        requestAnimationFrame(draw);
    }

    draw();
}

audioPlayer.addEventListener("play", initializeVisualizer);


playPauseBtn.addEventListener("click", playPause);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);


loadSong(currentIndex);