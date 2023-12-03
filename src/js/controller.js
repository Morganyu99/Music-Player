import * as model from "./model.js";
import CardView from "./Views/CardView.js";

const controlPlayer = async function (ev) {};
const init = async function () {
  try {
    await model.getDuration(model.songs.at(0).song, model.songs.at(0));
    CardView.displaySong(model.songs.at(0));
  } catch (err) {
    console.log(err);
  }
};
init();
