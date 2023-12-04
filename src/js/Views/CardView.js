import { PAUSE_PLAY, PLAY_NEXT, PLAY_PREVIOUS } from "../config.js";
import { classListContains } from "../helpers.js";

class CardView {
  _parentElement = document.querySelector(".card");
  _song;

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
  //   _spinner() {

  //       `<svg class="spinner" viewBox="0 0 50 50">
  //       <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
  //     </svg>
  //     `
  //     ;
  //   }
  addCardHandler(handler) {
    this._parentElement.addEventListener("click", function (e) {
      if (classListContains(e, "card__player--pause")) handler(PAUSE_PLAY);
      if (classListContains(e, "card__player--play-next")) handler(PLAY_NEXT);
      if (classListContains(e, "card__player--start")) handler(PAUSE_PLAY);
      if (classListContains(e, "card__player--play-back"))
        handler(PLAY_PREVIOUS);
    });
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

  renderSong(song) {
    this._song = song;
    this._generateMarkup();
  }
}

export default new CardView();
