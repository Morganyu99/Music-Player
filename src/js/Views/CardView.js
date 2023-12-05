import {
  CALLED_BY_PROGRESSBAR,
  LOADED,
  LOADING,
  MAX_CONSIDERED_TIME,
  PAUSE_PLAY,
  PLAY_NEXT,
  PLAY_PREVIOUS,
  PROGRESS_BAR_CLICKED,
} from "../config.js";
import { classListContains } from "../helpers.js";

class CardView {
  _parentElement = document.querySelector(".card");
  _song;
  _musicElement = document.querySelector(".song");
  _isPlaying = false;
  _startPlayer = document.querySelector(".card__player--start");
  _pausePlayer = document.querySelector(".card__player--pause");
  _loaaded = false;

  //InnerHTML and image load
  _loadImageElement(el, markup) {
    this._changeinnerHTML(el, markup);
    const childEl = this._parentElement.querySelector(`.${el}`).firstChild;

    childEl.addEventListener("load", function () {
      childEl.classList.remove("hidden");
    });
  }
  _changeinnerHTML(el, markup) {
    this._parentElement.querySelector(`.${el}`).innerHTML = markup;
  }
  //Card Handler Method

  addCardHandler(handler) {
    //for progressBar
    const moveBar = (e) => {
      handler(PROGRESS_BAR_CLICKED, e);
    };
    this._parentElement.addEventListener("mousedown", function (e) {
      if (classListContains(e, "card__player--pause")) handler(PAUSE_PLAY);
      if (classListContains(e, "card__player--play-next")) handler(PLAY_NEXT);
      if (classListContains(e, "card__player--start")) handler(PAUSE_PLAY);
      if (classListContains(e, "card__player--play-back"))
        handler(PLAY_PREVIOUS);
      if (classListContains(e, "card__player--total-span")) {
        moveBar(e);
        e.target.addEventListener("mousemove", moveBar);
      }
    });
    this._parentElement.addEventListener("mouseup", function (e) {
      if (classListContains(e, "card__player--total-span")) {
        e.target.removeEventListener("mousemove", moveBar);
      }
    });
  }
  //Rendering
  renderSong(song) {
    this._song = song;
    this._generateMarkup();
    this._loaaded = false;
  }

  _generateMarkup() {
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

    if (!this._loaaded) {
      this._loaaded = LOADING;
      this._musicElement.addEventListener(
        "loadedmetadata",
        this._playerProgress.bind(this)
      );
    }

    this._musicElement.addEventListener(
      "timeupdate",
      this._playerProgress.bind(this)
    );
  }
  _playerProgress(ev = "", calledByProgressBar = "") {
    const currentTime = this._getDuration(this._musicElement.currentTime);
    const endTime = this._getDuration(
      this._musicElement.duration - this._musicElement.currentTime
    );
    if (calledByProgressBar === CALLED_BY_PROGRESSBAR) {
      this._refreshPlayer(currentTime, endTime);
      this.progressBarChange("", this._musicElement.currentTime);
      return;
    }
    if (ev.type === "timeupdate") {
      return;
    }
    this._updatePlayer(currentTime, endTime);
    if (this._loaaded === LOADING) {
      this._loaaded = LOADED;
      this._musicElement.removeEventListener(
        "loadedmetadata",
        this._playerProgress
      );
    }
  }
  _getDuration(duration) {
    const durationMinutes = String(Math.trunc(duration / 60));
    const durationSeconds = String(
      Math.trunc((duration / 60 - durationMinutes) * 60)
    );
    return `${durationMinutes.padStart(2, 0)}:${durationSeconds.padStart(
      2,
      0
    )}`;
  }
  _updatePlayer(startTime, endTime) {
    this._changeinnerHTML(
      "card__player",
      `<div class="card__time-stamps">
          <span class="card--start-time">${startTime}</span>
          <span class="card--end-time">${endTime}</span>
        </div>
    
        <div class="card__player--total-span">
          <div class="card__player--occ-span"></div>
        </div>`
    );
  }

  checkTime() {
    return this._musicElement.currentTime > MAX_CONSIDERED_TIME;
  }

  progressBarChange(ev = "", currentTime) {
    const mainBar = this._parentElement.querySelector(
      ".card__player--total-span"
    );
    const progressBar = this._parentElement.querySelector(
      ".card__player--occ-span"
    );
    const mainBarSpec = mainBar.getBoundingClientRect();
    const duration = this._musicElement.duration;
    if (ev) {
      const progress = ev.clientX - mainBarSpec.left;
      progressBar.style.width = `${progress}px`;
      this._changeCurrentTime((progress * duration) / mainBarSpec.width);
      return;
    }
    const fillspan = (mainBarSpec.width / duration) * currentTime;
    progressBar.style.width = `${fillspan}px`;
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

  changeSongPlay() {
    this._isPlaying = true;
    this._startPlayer.classList.add("hidden");
    this._pausePlayer.classList.remove("hidden");
    this._musicElement.play();
  }

  _refreshPlayer(startTime, endTime) {
    this._changeinnerHTML(
      "card__time-stamps",
      `<span class="card--start-time">${startTime}</span>
    <span class="card--end-time">${endTime}</span>`
    );
  }

  _changeCurrentTime(time) {
    this._musicElement.currentTime = time;
    this._playerProgress("", CALLED_BY_PROGRESSBAR);
  }
}

export default new CardView();
