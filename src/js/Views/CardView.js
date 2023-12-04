import {
  MAX_CONSIDERED_TIME,
  PAUSE_PLAY,
  PLAY_NEXT,
  PLAY_PREVIOUS,
} from "../config.js";
import { classListContains } from "../helpers.js";

class CardView {
  _parentElement = document.querySelector(".card");
  _song;
  _musicElement = document.querySelector(".song");
  _isPlaying = false;
  _startPlayer = document.querySelector(".card__player--start");
  _pausePlayer = document.querySelector(".card__player--pause");

  async _changeinnerHTML(el, markup) {
    this._parentElement.querySelector(`.${el}`).innerHTML = markup;
  }

  _loadImageElement(el, markup) {
    this._changeinnerHTML(el, markup);
    const childEl = this._parentElement.querySelector(`.${el}`).firstChild;

    childEl.addEventListener("load", function () {
      childEl.classList.remove("hidden");
    });
  }

  addCardHandler(handler) {
    this._parentElement.addEventListener("click", function (e) {
      if (classListContains(e, "card__player--pause")) handler(PAUSE_PLAY);
      if (classListContains(e, "card__player--play-next")) handler(PLAY_NEXT);
      if (classListContains(e, "card__player--start")) handler(PAUSE_PLAY);
      if (classListContains(e, "card__player--play-back"))
        handler(PLAY_PREVIOUS);
    });
  }

  pausePlayPlayer() {
    this._isPlaying = !this._isPlaying;
    if (!this._isPlaying) {
      this._musicElement.pause();
      this._startPlayer.classList.remove("hidden");
      this._pausePlayer.classList.add("hidden");
      return;
    }
    this._musicElement.play();
    this._startPlayer.classList.add("hidden");
    this._pausePlayer.classList.remove("hidden");
  }

  resetSong() {
    this._musicElement.load();
    this._isPlaying = true;
    this._musicElement.play();
  }
  checkTime() {
    return this._musicElement.currentTime > MAX_CONSIDERED_TIME;
  }
  changeSongPlay() {
    this._isPlaying = true;
    this._startPlayer.classList.add("hidden");
    this._pausePlayer.classList.remove("hidden");
    this._musicElement.play();
  }
  _updatePlayer() {
    this._getDuration(this._musicElement.duration);

    this._changeinnerHTML(
      "card__player",
      `<div class="card__time-stamps">
          <span class="card--start-time">00:00</span>
          <span class="card--end-time">${this._song.duration}</span>
        </div>
    
        <div class="card__player--total-span">
          <div class="card__player--occ-span"></div>
        </div>`
    );
  }
  _getDuration(duration) {
    const durationMinutes = String(Math.trunc(duration / 60));
    const durationSeconds = String(
      Math.trunc((duration / 60 - durationMinutes) * 60)
    );
    this._song.duration = `${durationMinutes.padStart(
      2,
      0
    )}:${durationSeconds.padStart(2, 0)}`;
  }

  async _generateMarkup() {
    try {
      this._loadImageElement(
        "card__song-cover",
        `<img src="./src/images${this._song.image}" alt="" class="hidden"/>`
      );

      this._changeinnerHTML(
        "card__song-details",
        `<h1 class="card__song-name">${this._song.name
          .split(" ")
          .map((n) => n[0].toUpperCase() + n.slice(1))
          .join(" ")}</h1>
          <h2 class="card__song-artist">${this._song.artist}</h2>`
      );

      this._musicElement.src = `./src/songs${this._song.song}`;

      this._musicElement.addEventListener(
        "loadedmetadata",
        this._updatePlayer.bind(this)
      );
    } catch (err) {
      console.log(err);
    }
  }

  renderSong(song) {
    this._song = song;
    this._generateMarkup();
  }
}

export default new CardView();
