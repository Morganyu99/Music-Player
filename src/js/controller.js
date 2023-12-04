import {
  PAUSE_PLAY,
  PLAY_NEXT,
  PLAY_PREVIOUS,
  PROGRESS_BAR_CLICKED,
} from "./config.js";
import * as model from "./model.js";
import CardView from "./Views/CardView.js";

const controlPlayer = async function (ev, clickEvent = "") {
  if ((ev === PLAY_PREVIOUS) & CardView.checkTime()) {
    CardView.resetSong();
    controlCardView();
    return;
  }

  if (ev === PLAY_NEXT || ev === PLAY_PREVIOUS) {
    //IF song index is negative
    const updatedIndex = model.songIndex + ev;
    if (updatedIndex < 0) model.assignIndex(model.songs.length - 1);

    // IF song index is greater than the length of model.songs arr
    if (updatedIndex > model.songs.length - 1) model.assignIndex(0);
    //IF the song index is with in range

    if (updatedIndex < model.songs.length && updatedIndex >= 0)
      model.assignIndex(updatedIndex);

    controlCardView();
    CardView.changeSongPlay();
  }
  if (ev === PAUSE_PLAY) {
    CardView.pausePlayPlayer();
  }
  if (ev === PROGRESS_BAR_CLICKED) {
    CardView.progressBarChange(clickEvent);
  }
};

const controlCardView = function () {
  CardView.renderSong(model.songs.at(model.songIndex));
};

const init = async function () {
  try {
    await controlCardView();
    CardView.addCardHandler(controlPlayer);
  } catch (err) {
    console.log(err);
  }
};
init();
