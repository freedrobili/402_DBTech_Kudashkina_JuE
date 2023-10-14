<?php

namespace freedrobili\hangman\Model;

use freedrobili\hangman\View\View;

class Model
{
    static function genWord()
    {
        return "MONKEY";
    }

    static function checkLetter($letter, $hidden_word, &$temp_word, &$errors, &$found_letters)
    {
        $error_flag = true;
        for ($i = 0; $i < strlen($hidden_word); $i++)
        {
            if ($letter[0] == $hidden_word[$i])
            {
                $error_flag = false;
                $temp_word[$i * 2] = $letter;
                $found_letters++;
            }
        }
        if ($error_flag)
        {
            View::wrongMessage();
            $errors++;
        }
        else
        {
            View::rightMessage();
        }
        View::drawWord($temp_word);
        View::drawHangman($errors);
    }
}
