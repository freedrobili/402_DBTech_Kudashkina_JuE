import {hangman, messageOutput, userName} from "./View.js";

export let
    playerInit = document.getElementById("playerInit"),
    gameList = document.getElementById("gameList"),
    gameInfoText = document.getElementById("gameInfoText"),
    showGame = document.getElementById("showGame"),
    gameMessage = document.getElementById("gameMessage"),
    gameResult = document.getElementById("gameResult"),
    canvas = document.getElementById("canvas"),
    resultText = document.getElementById("resultText"),
    nextInfo = document.getElementById("nextInfo"),
    nextShowGame = document.getElementById("nextShowGame"),
    checkLetterBtn = document.getElementById("checkLetterBtn"),
    playAgainBtn = document.getElementById("playAgainBtn"),
    nameField = document.getElementById("nameField"),
    letterField = document.getElementById("letterField"),
    infoBlock = document.getElementById("infoBlock"),
    table = document.getElementById("table"),
    replayBtn = document.getElementById("replayBtn"),
    listGames = document.getElementById("listGames"),
    gameTableTitle = document.getElementById("gameTableTitle"),
    progress,
    remainingLetters,
    attempts,
    hidden_word,
    openLetters,
    words = ["Monday","Orange","Dancer","Purple","Castle"];

let attemptsInfo = "";
let gameInfo = "";
let getLetter;
let attempt = 0;

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

export function checkLetter() {
    if (letterField.value === "" || letterField.value.length > 1) {
        alert("Введите одну букву!");
    } else {
        attempt++;
        let tempCount = 0;
        getLetter = letterField.value;
        for (let i = 0; i < remainingLetters.length; i++) {
            if (remainingLetters[i] === getLetter.toUpperCase()) {
                progress = progress.replaceAt(i + 1, getLetter.toUpperCase())
                remainingLetters = remainingLetters.replaceAt(i, " ");
                tempCount = tempCount + 1;
                openLetters = openLetters + 1;
            }
        }

        if (tempCount === 0) {
            attempts -= 1;
            addStepDb(attempt, getLetter, "Неверно")
        } else {
            addStepDb(attempt, getLetter, "Верно")
        }

        hangman(attempts, progress);

        if (attempts === 0) {
            let result = "Поражение";
            saveGameInfo(result);
            fetch('/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(gameInfo)
            });
            gameInfo = "";
            attemptsInfo = "";
        }

        letterField.value = "";
        if (openLetters === remainingLetters.length) {
            let result = "Победа";
            messageOutput("win");
            saveGameInfo(result)
            fetch('/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(gameInfo)
            });
            gameInfo = "";
            attemptsInfo = "";
        }
    }
}

export async function addStepDb(attempt, letter, status) {
    attemptsInfo += attempt + "|" + letter + "|" + status + "|";
}

export function makeWord() {
    attempt = 0;
    hidden_word = words[Math.floor(Math.random() * words.length)].toUpperCase();
    progress = hidden_word[0] + "____" + hidden_word[5];
    remainingLetters = hidden_word[1] + hidden_word[2] + hidden_word[3] + hidden_word[4];
    attempts = 6;
    openLetters = 0;
    hangman(6, progress);
}

async function saveGameInfo(result) {
    gameInfo += userName + "|" + hidden_word + "|" + result + "|" + attemptsInfo;
}

export async function listGamesDb() {
    let response = await fetch('/games', {
        method: 'GET'
    });
    const json = await response.json();

    let data = json.split("|");
    data.pop();
    console.log(data);

    let render = '<tr>' +
        '<th>id</th>' +
        '<th>Дата</th>' +
        '<th>Время</th>' +
        '<th>Имя</th>' +
        '<th>Слово</th>' +
        '<th>Результат</th>' +
        '</tr>';

    for (let i = 0; i < data.length; i += 6) {
        render += '<tr>' +
            '<th>' + data[i] + '</th>' +
            '<th>' + data[i + 1] + '</th>' +
            '<th>' + data[i + 2] + '</th>' +
            '<th>' + data[i + 3] + '</th>' +
            '<th>' + data[i + 4] + '</th>' +
            '<th>' + data[i + 5] + '</th>' +
            '</tr>';
    }

    return render;
}

export async function replayGameDb() {
    let gameId = prompt("Введите id игры:");
    let response = await fetch('/games/' + gameId, {
        method: 'GET'
    });

    let json = await response.json();
    let data = json.split("|");

    let render = '<tr>' +
        '<th>Попытка</th>' +
        '<th>Буква</th>' +
        '<th>Результат</th>' +
        '</tr>';

    let countAttempts = 0;

    for (let i = 0; i < data.length - 1; i += 3) {
        render += '<tr>' +
            '<th>' + data[i] + '</th>' +
            '<th>' + data[i + 1] + '</th>' +
            '<th>' + data[i + 2] + '</th>' +
            '</tr>';
        countAttempts++;
    }

    return render;
}