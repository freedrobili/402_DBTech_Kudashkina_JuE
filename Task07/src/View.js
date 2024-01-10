import {
    block_greeting,
    block_information,
    block_showGame,
    block_message,
    block_result,
    block_resultText,
    field_name,
    text_info,
    makeWord,
    hidden_word,
    canvas,
    table,
    gamelist,
    listGamesDB,
    replayGameDB,
    textGameList
} from './Model.js';

export let userName;

export function startGame() {
    block_greeting.style.display = 'flex';
    block_information.style.display = 'none';
    block_showGame.style.display = 'none';
    block_message.style.display = 'none';
    block_result.style.display = 'none';
}

export function hangman(count, text){
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(50,100);
    ctx.lineTo(50,50);
    ctx.lineTo(200,50);
    ctx.lineTo(200,450);
    ctx.lineTo(50,450);
    ctx.lineTo(50,400);
    ctx.lineTo(200,400);
    ctx.stroke();
    ctx.font = "20pt Arial";
    ctx.fillText(text, 55, 435);
      
    if (count < 6){
    ctx.strokeRect(30,100,40,40);
    };
    
    if (count < 5){
    ctx.beginPath();
    ctx.moveTo(50,140);
    ctx.lineTo(50,250);
    ctx.stroke();
    };
    
    if(count < 4){
    ctx.beginPath();
    ctx.moveTo(50,180);
    ctx.lineTo(5,160);
    ctx.stroke();
    };

    if(count < 3){
    ctx.beginPath();
    ctx.moveTo(50,180);
    ctx.lineTo(95,160);
    ctx.stroke();
    };

    if(count < 2){
    ctx.beginPath();
    ctx.moveTo(50,250);
    ctx.lineTo(25,310);
    ctx.stroke();
    };

    if(count < 1){
    ctx.beginPath();
    ctx.moveTo(50,250);
    ctx.lineTo(75,310);
    ctx.stroke();
    messageOutput("loss");
    }; 
     };

export function informationOutput() {
    if (field_name.value === "") {
        alert("Введите имя")
    } else {
        userName = field_name.value;

        block_greeting.style.display = 'none';
        block_information.style.display = 'flex';
        block_showGame.style.display = 'none';

        text_info.innerHTML = "Игра 'Виселица' (hangman). Компьютер загадывает слово из шести букв "+ 
        "(список возможных слов заранее сгенерирован и сохранен в базе данных) и рисует на странице "+ 
       "отдельные пустые клетки для каждой буквы. Игрок пытается угадать буквы, а затем и все слово "+ 
        "целиком. Если игрок правильно угадывает букву, компьютер вписывает ее в клетку. Если ошибается, "+  
        "то рисует одну из частей тела повешенного человека (используется псевдографика). Чтобы победить, "+  
        "игрок должен угадать все буквы в слове до того, как повешенный человечек будет полностью нарисован.";
    }
}

export function showGameOutput() {
    block_greeting.style.display = 'none';
    block_information.style.display = 'none';
    block_showGame.style.display = 'flex';
    block_message.style.display = 'none';
    block_result.style.display = 'none';
    canvas.hidden = false;
    gamelist.hidden = false;
    makeWord();
}


export async function replayGame(){
    let html = await replayGameDB();
    table.innerHTML = html;
    textGameList.innerHTML = "Повтор игры"
}


export async function showGames(){
    let html = await listGamesDB();
    table.innerHTML = html;
    textGameList.innerHTML = "Список игр"
}


export function messageOutput(type_message) {
    if (type_message === "win") {
        block_message.style.display = 'none';
        block_showGame.style.display = 'none';
        block_result.style.display = 'flex';
        block_resultText.innerHTML = "Вы угадали слово " + hidden_word;
    }
    if (type_message === "loss") {
        block_message.style.display = 'none';
        block_showGame.style.display = 'none';
        block_result.style.display = 'flex';
        block_resultText.innerHTML = "Вы проиграли! Слово было " + hidden_word;
    }
}