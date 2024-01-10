import {
    playerInit,
    infoBlock,
    showGame,
    gameMessage,
    gameResult,
    resultText,
    nameField,
    gameInfoText,
    makeWord,
    hidden_word,
    canvas,
    table,
    gameList,
    listGamesDb,
    replayGameDb,
    gameTableTitle
} from './Model.js';

export let userName;

export function startGame() {
    playerInit.style.display = 'flex';
    infoBlock.style.display = 'none';
    showGame.style.display = 'none';
    gameMessage.style.display = 'none';
    gameResult.style.display = 'none';
}

export function hangman(count, text) {
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(175, 100);
    ctx.lineTo(175, 50);
    ctx.lineTo(325, 50);
    ctx.lineTo(325, 400);
    ctx.lineTo(175, 400);
    ctx.stroke();
    ctx.font = "20pt Arial";
    ctx.fillText(text, 200, 435);

    if (count < 6){
        ctx.strokeRect(155,100,40,40);
        };
        
        if (count < 5) {
            ctx.beginPath();
            ctx.moveTo(175, 140);
            ctx.lineTo(175, 250);
            ctx.stroke();
        }
    
        if (count < 4) {
            ctx.beginPath();
            ctx.moveTo(175, 180);
            ctx.lineTo(130, 160);
            ctx.stroke();
        }
    
        if (count < 3) {
            ctx.beginPath();
            ctx.moveTo(175, 180);
            ctx.lineTo(220, 160);
            ctx.stroke();
        }
    
        if (count < 2) {
            ctx.beginPath();
            ctx.moveTo(175, 250);
            ctx.lineTo(150, 310);
            ctx.stroke();
        }
    
        if (count < 1) {
            ctx.beginPath();
            ctx.moveTo(175, 250);
            ctx.lineTo(200, 310);
            ctx.stroke();
            messageOutput("loss");
        }
}

export function informationOutput() {
    if (nameField.value === "") {
        alert("Введите имя")
    } else {
        userName = nameField.value;

        playerInit.style.display = 'none';
        infoBlock.style.display = 'flex';
        showGame.style.display = 'none';

        gameInfoText.innerHTML = "Игра Виселица. Компьютер загадывает слово из шести букв и рисует на странице отдельные пустые клетки для каждой буквы. Игрок пытается угадать буквы, а затем и все слово целиком. Если игрок правильно угадывает букву, компьютер вписывает ее в клетку. Если ошибается, то рисует одну из частей тела повешенного человека. Чтобы победить, игрок должен угадать все буквы в слове до того, как повешенный человечек будет нарисован полностью.";
    }
}

export function showGameOutput() {
    table.style.display = 'none';
    infoBlock.style.display = 'none';
    playerInit.style.display = 'none';
    showGame.style.display = 'flex';
    gameMessage.style.display = 'none';
    gameResult.style.display = 'none';
    canvas.style.display = 'block';
    gameList.style.display = 'block';
    makeWord();
}


export async function replayGame() {
    gameTableTitle.style.display = 'flex';
    table.style.display = 'block';
    table.innerHTML = await replayGameDb();
    gameTableTitle.innerHTML = "Повтор игры"
}


export async function showGames() {
    gameTableTitle.style.display = 'flex';
    table.style.display = 'block';
    table.innerHTML = await listGamesDb();
    gameTableTitle.innerHTML = "Список игр"
}


export function messageOutput(type_message) {
    if (type_message === "win") {
        gameMessage.style.display = 'none';
        showGame.style.display = 'none';
        gameResult.style.display = 'flex';
        resultText.innerHTML = "Вы угадали слово!";
    }
    if (type_message === "loss") {
        gameMessage.style.display = 'none';
        showGame.style.display = 'none';
        gameResult.style.display = 'flex';
        resultText.innerHTML = "Вы проиграли! Верное слово: " + hidden_word;
    }
}