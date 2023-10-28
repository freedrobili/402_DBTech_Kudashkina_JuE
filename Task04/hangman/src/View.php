<?php

namespace freedrobili\hangman\View;

use function cli\line;
use function cli\prompt;

class View
{
    static function inputName()
    {
        $name = prompt("Input name ");
        return $name;
    }

    static function makeChoice()
    {
        line("Make a choice: ");
        line("1. start game");
        line("2. show games");
        line("3. repeat game");
        line("4. exit with save");
        $number = prompt("");
        return $number;
    }

    static function makeInput()
    {
        $number = prompt("Input number of game ");
        return $number;
    }

    static function inputLetter()
    {
        $letter = prompt("Input letter");
        return $letter;
    }

    static function rightMessage()
    {
        line("You right!");
    }

    static function wrongMessage()
    {
        line("You wrong(");
    }

    static function winMessage($word)
    {
        line("You win! Hidding word is: " . $word);
    }

    static function loseMessage($word)
    {
        line("You lose( Hidding word is: " . $word);
    }

    static function drawWord($word)
    {
        line("Word: " . $word);
    }

    static function showGames($games)
    {
        line("ID | PLAYER | DATE | WORD | RESULT");
        while ($row = $games->fetchArray()) {
            $id = $row["game_id"];
            $player = $row["player"];
            $date = $row["date_time"];
            $word = $row["word"];
            $result = $row["result"];
            line($id . " | " . $player . " | " . $date . " | " . $word . " | " . $result);
        }
    }

    static function repeatGame($game)
    {
        line("STEP | LETTER | RESULT");
        while ($row = $game->fetchArray()) {
            $step = $row["step"];
            $letter = $row["letter"];
            $result = $row["result"];
            line($step . " | " . $letter . " | " . $result);
        }
    }

    static function drawHangman($errors)
    {
        line("|---");
        line("|  |");
        if ($errors >= 1) {
            line("|  o");
        }
        if ($errors == 2) {
            line("|  |");
        } elseif ($errors == 3) {
            line("| /|");
        } elseif ($errors >= 4) {
            line("| /|\\");
            if ($errors == 5) {
                line("| /");
            } elseif ($errors == 6) {
                line("| / \\");
            }
        }
        if ($errors == 1) {
            line("|\n|\n|");
        } elseif ($errors < 5) {
            line("|\n|");
        } else {
            line("|");
        }
    }
}
