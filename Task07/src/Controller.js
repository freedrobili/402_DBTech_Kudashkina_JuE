import {
    startGame,
    informationOutput,
    showGameOutput,
    replayGame,
    showGames
} from './View.js';

import {
    btn_nextInfo,
    btn_nextShowGame,
    btn_checkLetter,
    btn_replayGame,
    checkLetter,
    replaybtn,
    listbtn
} from "./Model.js";


startGame();

btn_nextInfo.addEventListener("click", informationOutput);
btn_nextShowGame.addEventListener("click", showGameOutput);
btn_checkLetter.addEventListener("click", checkLetter);
btn_replayGame.addEventListener("click", showGameOutput);
replaybtn.addEventListener("click", replayGame);
listbtn.addEventListener("click", showGames);