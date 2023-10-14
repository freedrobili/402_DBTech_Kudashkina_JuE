<?php

namespace freedrobili\hangman\View;

use function cli\line;
use function cli\prompt;

class View
{
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

    static function drawHangman($errors)
    {
        line("|---");
        line("|  |");
        if ($errors >= 1)
        {
            line("|  o");
        }
        if ($errors == 2)
        {
            line("|  |");
        }
        elseif ($errors == 3)
        {
            line("| /|");
        }
        elseif ($errors >= 4)
        {
            line("| /|\\");
            if ($errors == 5)
            {
                line("| /");
            }
            elseif ($errors == 6)
            {
                line("| / \\");
            }
        }
        if ($errors == 1)
        {
            line("|\n|\n|");
        }
        elseif ($errors < 5)
        {
            line("|\n|");
        }
        else
        {
            line("|");
        }
    }
}
