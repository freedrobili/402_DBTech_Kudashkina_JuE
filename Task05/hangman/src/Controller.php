<?php

namespace freedrobili\hangman\Controller;

use freedrobili\hangman\View\View;
use freedrobili\hangman\Model\Model;

class Controller
{
    private $name;
    private $model;

    public function __construct()
    {
        $this->name = View::inputName();
        $this->model = new Model("bin\game.db");
    }

    public function menu()
    {
        $choise = View::makeChoice();
        switch ($choise) {
            case 1:
                $this->startGame();
                break;
            case 2:
                $this->model->showGames();
                break;
            case 3:
                $this->model->repeatGame(View::makeInput());
                break;
            case 4:
                // $this->model->closeConnection();
                exit;
            default:
                break;
        }
    }

    private function startGame()
    {
        $errors = 0;
        $hidden_word = $this->model->genWord();
        $temp_word = "_ _ _ _ _ _";
        $found_letters = 0;
        View::drawWord($temp_word);
        View::drawHangman($errors);
        $end = true;
        $step = 1;
        while ($end) {
            $letter = View::inputLetter();
            echo $letter;
            if (strlen($letter) == 1) {
                $this->model->checkLetter($step, strtoupper($letter), $hidden_word, $temp_word, $errors, $found_letters);
            }
            if ($errors == 6) {
                $end = false;
                View::loseMessage($hidden_word);
                $this->model->storeGame($this->name, $hidden_word, "lose");
            } elseif ($found_letters == 6) {
                $end = false;
                View::winMessage($hidden_word);
                $this->model->storeGame($this->name, $hidden_word, "win");
            }
            $step++;
        }
    }
}
