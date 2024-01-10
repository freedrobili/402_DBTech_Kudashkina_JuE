import {
    messageOutput,
    hangman,
    userName
} from "./View.js";

export let
    block_greeting = document.getElementById("greeting"),
    gamelist = document.getElementById("gamelist"),
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
    table = document.getElementById("table"),
    replaybtn = document.getElementById("replayId"),
    listbtn = document.getElementById("listGames"),
    textGameList = document.getElementById("textGameList"),
    progress,
    remainingLetters,
    attmepss,
    hidden_word,
    openLetters,
    words = ["Monday","Orange","Dancer","Purple","Castle"];

let getLetter;
let attempt = 0;
let db = startDB();

String.prototype.replaceAt=function(index, replacement) {
  return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}


export function checkLetter() {
    if (field_getLetter.value === "" || field_getLetter.value.length > 1) {
        alert("Введите одну букву!");
    } else{
        attempt++;
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
            addStepDB(attempt, getLetter, false)
        }else
        {
            addStepDB(attempt, getLetter, true)
        }
        
        hangman(attmepss, progress);
        
        if(attmepss == 0){
            updateStatusdDB("Поражение")
        }

        field_getLetter.value = "";
        if(openLetters === remainingLetters.length){
            updateStatusdDB("Победа")
            messageOutput("win");
        }
    }
}

export function makeWord() {
    attempt = 0;
    hidden_word = words[Math.floor(Math.random() * words.length)].toUpperCase();
    progress = hidden_word[0] + "____" + hidden_word[5];
    remainingLetters = hidden_word[1] + hidden_word[2] + hidden_word[3] + hidden_word[4];
    attmepss = 6;
    openLetters = 0;
    startGameDB();
    hangman(6, progress);
}

export async function startDB(){
    db =  await idb.openDB('gamesdb', 1, { upgrade(db) {
        db.createObjectStore('games', {keyPath: 'id', autoIncrement: true});
        db.createObjectStore('attempts', {keyPath: 'id', autoIncrement: true});
        },
        });
}


export async function startGameDB(){

    db =  await idb.openDB('gamesdb', 1, { upgrade(db) {
        db.createObjectStore('games', {keyPath: 'id', autoIncrement: true});
        db.createObjectStore('attempts', {keyPath: 'id', autoIncrement: true});
        },
        });

    await db.add('games', {
        date: new Date(),
        name: userName,
        playWord: hidden_word,
        result: "Игра не заврешена"
        });
}

export async function addStepDB(attempt, letter, result){
    let idGame = await db.getAll('games');
    await db.add('attempts', {
        idGame: idGame.length,
        attempt,
        letter,
        result
        });
}

export async function updateStatusdDB(result){

    let idGame = await db.getAll('games');
    let cursor = await db.transaction('games', 'readwrite').store.openCursor();

    while (cursor) {
        if (cursor.value.id === idGame.length) {
            let updateData = cursor.value;
            updateData.result = result;
            cursor.update(updateData);
        }

        cursor = await cursor.continue();
    }
}


export async function listGamesDB(){
    let games = await db.getAll('games');
    let html = "<tr>";
    html += "<th>ID</th>";
    html += "<th>Дата</th>";
    html += "<th>Имя</th>";
    html += "<th>Слово</th>";
    html += "<th>Результат</th>";
    html += "</tr>";

    if(games.length > 0){
        for(let i = 0; i < games.length; i++){
            html += "<tr>";
            html += "<th>" + games[i]['id'] + "</th>";
            html += "<th>" + games[i]['date'] + "</th>";
            html += "<th>" + games[i]['name'] + "</th>";
            html += "<th>" + games[i]['playWord'] + "</th>";
            html += "<th>" + games[i]['result'] + "</th>";
            html += "</tr>";
        }

        return html;
    }
    else{
        return "<tr><th>Пока что нет записанных игр</th></tr>";
    }
}


export async function replayGameDB(){
    let idGame = prompt("Введите id игры:")
    let cursor = await db.transaction('attempts', 'readwrite').store.openCursor();

    let html = "<tr>";
    html += "<th>Попытка</th>";
    html += "<th>Буква</th>";
    html += "<th>Результат</th>";
    html += "</tr>";

    let countAttemps = 0;

    while (cursor) {
        if (cursor.value.idGame == idGame) {
            let data = cursor.value;
            html += "<tr>";
            html += "<th>" + data.attempt + "</th>";
            html += "<th>" + data.letter + "</th>";
            html += "<th>" + data.result + "</th>";
            html += "</tr>";
            countAttemps++;
        }

        cursor = await cursor.continue();
    }

    if(countAttemps == 0){
        return "Не было сделано шагов";
    }
    else{
        return html;
    }
}