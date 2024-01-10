import {
    startGame,
    informationOutput,
    showGameOutput,
    replayGame,
    showGames
} from './View.js';

import {
    nextInfo,
    nextShowGame,
    checkLetterBtn,
    playAgainBtn,
    checkLetter,
    replayBtn,
    listGames
} from "./Model.js";

startGame();

nextInfo.addEventListener("click", informationOutput);
nextShowGame.addEventListener("click", showGameOutput);
checkLetterBtn.addEventListener("click", checkLetter);
playAgainBtn.addEventListener("click", showGameOutput);
replayBtn.addEventListener("click", replayGame);
listGames.addEventListener("click", showGames);
