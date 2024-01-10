import {
    messageOutput,
    hangman
} from "./View.js";

export let
    block_greeting = document.getElementById("greeting"),
    block_information = document.getElementById("information"),
    block_showGame = document.getElementById("show-game"),
    block_message = document.getElementById("message"),
    block_result = document.getElementById("result"),
    canvas = document.getElementById("canvas"),
    block_resultText = document.getElementById("resultText"),
    btn_nextInfo = document.getElementById("nextInfo"),
    btn_nextShowGame = document.getElementById("nextShowGame"),
    btn_checkLetter = document.getElementById("checkLetter"),
    btn_replayGame = document.getElementById("replayGame"),
    field_name = document.getElementById("name"),
    field_getLetter = document.getElementById("getLetter"),
    text_info = document.getElementById("info"),
    progress,
    remainingLetters,
    attmepss,
    hidden_word,
    openLetters,
    words = ["Monday","Orange","Dancer","Purple","Castle"];

let getLetter;

String.prototype.replaceAt=function(index, replacement) {
  return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}


export function checkLetter() {
    if (field_getLetter.value === "" || field_getLetter.value.length > 1) {
        alert("Введите одну букву!");
    } else{
        let tempCount = 0;
        getLetter = field_getLetter.value;
        for (let i = 0; i < remainingLetters.length; i++) {
            if (remainingLetters[i] === getLetter.toUpperCase()) {
                progress = progress.replaceAt(i + 1, getLetter.toUpperCase())
                remainingLetters = remainingLetters.replaceAt(i, " ");
                tempCount = tempCount + 1;
                openLetters = openLetters + 1;
            }
            
        }

        if(tempCount === 0){
            attmepss = attmepss - 1;
        }
        hangman(attmepss, progress);
        field_getLetter.value = "";
        if(openLetters === remainingLetters.length){
            messageOutput("win");
        }
    }
}

export function makeWord() {
    hidden_word = words[Math.floor(Math.random() * words.length)].toUpperCase();
    progress = hidden_word[0] + "____" + hidden_word[5];
    remainingLetters = hidden_word[1] + hidden_word[2] + hidden_word[3] + hidden_word[4];
    attmepss = 6;
    openLetters = 0;
    hangman(6, progress);
}