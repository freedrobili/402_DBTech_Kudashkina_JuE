<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->addErrorMiddleware(true, false, false);

function getGameId()
{
    $gameDatabase = new \SQLite3('./../db/gamedb.db');
    $query = "SELECT gameId 
    FROM gamesInfo 
    ORDER BY gameId DESC LIMIT 1";
    $result = $gameDatabase->querySingle($query);
    if (is_null($result)) {
        return 1;
    }
    return $result + 1;
}

function createDb()
{
    $action = new \SQLite3(('./../db/gamedb.db'));

    $gamesTable = "CREATE TABLE gamesInfo(
        gameId INTEGER PRIMARY KEY,
        gameDate DATE,
        gameTime TIME,
        playerName TEXT,
        word TEXT,
        result TEXT)";
    $action->exec($gamesTable);

    $attemptsInfo = "CREATE TABLE attemptsInfo(
        gameId INTEGER,
        attempts INTEGER,
        letter TEXT,
        result TEXT)";

    $action->exec($attemptsInfo);
    return $action;
}

function openDb()
{
    if (!file_exists("./../db/gamedb.db")) {
        createDb();
        $action = createDb();
    } else {
        createDb();
        $action = new \SQLite3('./../db/gamedb.db');
    }
    return $action;
}

function startRecordGameDb($gameInfo)
{
    $action = openDb();

    $playerName = $gameInfo[0];
    $word = $gameInfo[1];
    $result = $gameInfo[2];

    date_default_timezone_set("Europe/Moscow");
    $gameDate = date("d") . "." . date("m") . "." . date("Y");
    $gameTime = date("H") . ":" . date("i") . ":" . date("s");

    $action->exec(
        "INSERT INTO gamesInfo (
                gameDate,
                gameTime,
                playerName,
                word, 
                result) VALUES (
                        '$gameDate',
                        '$gameTime',
                        '$playerName',
                        '$word',
                        '$result')"
    );
}

function addAttempts($array, $gameId)
{
    $action = openDb();

    for ($i = 0, $iMax = count($array) - 1; $i < $iMax; $i += 3) {
        $i1 = $i + 1;
        $i2 = $i + 2;

        $action->exec(
            "INSERT INTO attemptsInfo (
            gameId,
            attempts,
            letter,
            result) VALUES (
                '$gameId',
                '$array[$i]',
                '$array[$i1]',
                '$array[$i2]')"
        );
    }
}

function getAttempts($gameId)
{
    $action = openDb();
    $result = $action->query("SELECT attempts, letter, result FROM attemptsInfo where gameId = '$gameId'");
    $attemptsInfo = "";

    while ($row = $result->fetchArray()) {
        for ($i = 0; $i < 3; $i++) {
            $attemptsInfo .= $row[$i] . "|";
        }
    }
    return $attemptsInfo;
}

function listGames()
{
    $action = openDb();
    $result = $action->query("SELECT * FROM gamesInfo");
    $gamesInfo = "";
    while ($row = $result->fetchArray()) {
        for ($i = 0; $i < 6; $i++) {
            $gamesInfo .= $row[$i] . "|";
        }
    }
    return $gamesInfo;
}

$app->get(
    '/',
    function (Request $request, Response $response, array $args) {
        return $response->withRedirect('./index.html', 301);
    }
);

$app->post(
    '/games',
    function ($request, $response) {
        $string = json_decode($request->getBody());
        $gameId = getGameId();
        $array = explode("|", $string);
        $gameInfo = [$array[0], $array[1], $array[2]];
        unset($array[0], $array[1], $array[2]);
        $array = array_values($array);
        $response->write('done');
        startRecordGameDb($gameInfo);
        addAttempts($array, $gameId);

        return $response;
    }
);

$app->get(
    '/games',
    function ($request, $response) {
        $gamesInfo = json_encode(listGames());
        $response->getBody()->write($gamesInfo);
        return $response;
    }
);

$app->get(
    '/games/{id}',
    function ($request, $response, array $args) {
        $gameId = $args['id'];
        $attemptsInfo = getAttempts($gameId);
        $responseBody = json_encode($attemptsInfo);
        $response->getBody()->write($responseBody);
        return $response;
    }
);

$app->run();