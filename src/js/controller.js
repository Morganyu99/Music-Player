import { PLAY_NEXT, PLAY_PREVIOUS } from "./config.js";
import * as model from "./model.js";
import CardView from "./Views/CardView.js";

const controlPlayer = async function (ev) {
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
  }
};

const controlCardView = async function () {
  try {
    await model.getDuration(
      model.songs.at(model.songIndex).song,
      model.songs.at(model.songIndex)
    );
    CardView.renderSong(model.songs.at(model.songIndex));
  } catch (err) {
    console.log(err);
  }
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
