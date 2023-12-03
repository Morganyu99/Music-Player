export const songs = [
  {
    name: "Lost in the city Lights",
    artist: "Cosmo Sheldrake",
    image: "/cover-1.png",
    song: "/lost-in-city-lights-145038.mp3",
  },
  {
    name: "Forest Lullaby",
    artist: "Lesfm",
    image: "/cover-2.png",
    song: "/forest-lullaby-110624.mp3",
  },
];

export const getDuration = async function (songSource, song) {
  try {
    console.log(songSource, song);
    const audioContext = new AudioContext();
    const songURL = `./src/songs${songSource}`;
    await fetch(songURL)
      .then((res) => res.arrayBuffer())
      .then((buffer) => audioContext.decodeAudioData(buffer))
      .then((audioBuffer) => {
        const duration = audioBuffer.duration;
        const durationMinutes = String(Math.trunc(duration / 60));
        const durationSeconds = String(
          Math.trunc((duration / 60 - durationMinutes) * 60)
        );
        song.duration = `${durationMinutes.padStart(
          2,
          0
        )}:${durationSeconds.padStart(2, 0)}`;
        console.log(song.duration);
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};
