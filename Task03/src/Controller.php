<?php

namespace freedrobili\hangman\Controller;

use freedrobili\hangman\View\View;
use freedrobili\hangman\Model\Model;


class Controller
{
    static function startGame()
    {
        $errors = 0;
        $hidden_word = Model::genWord();
        $temp_word = "_ _ _ _ _ _";
        $found_letters = 0;
        View::drawWord($temp_word);
        View::drawHangman($errors);
        $end = true;
        while ($end)
        {
            $letter = View::inputLetter();
            echo $letter;
            if (strlen($letter) == 1)
            {
                Model::checkLetter(strtoupper($letter), $hidden_word, $temp_word, $errors, $found_letters);
            }
            if ($errors == 6)
            {
                $end = false;
                View::loseMessage($hidden_word);
            }
            elseif ($found_letters == 6)
            {
                $end = false;
                View::winMessage($hidden_word);
            }
        }
    }
}
