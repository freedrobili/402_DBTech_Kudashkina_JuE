<?php

namespace freedrobili\hangman\Model;

use freedrobili\hangman\View\View;
use RedBeanPHP\R;

class Model
{
    private $path;
    public function __construct($path)
    {
        $this->path = $path;
        R::setup('sqlite:' . $this->path);
        $this->createTables();
        $this->fillWords();
    }

    private function createTables()
    {
        if (!file_exists($this->path)) {
            if (!R::inspect('finishedgames')) {
                $finishedGamesTable = R::dispense('finishedgames');
                $finishedGamesTable->id = "INTEGER PRIMARY KEY";
                $finishedGamesTable->gameId = "INTEGER";
                $finishedGamesTable->player = "STRING";
                $finishedGamesTable->datetime = "DATETIME";
                $finishedGamesTable->word = "STRING";
                $finishedGamesTable->result = "STRING";
                R::store($finishedGamesTable);
            }

            if (!R::inspect('tries')) {
                $triesTable = R::dispense('tries');
                $triesTable->id = "INTEGER PRIMARY KEY";
                $triesTable->gameId = "INTEGER";
                $triesTable->step = "INTEGER";
                $triesTable->letter = "STRING";
                $triesTable->result = "STRING";
                R::store($triesTable);
            }

            if (!R::inspect('words')) {
                $wordsTable = R::dispense('words');
                $wordsTable->id = "INTEGER PRIMARY KEY";
                $wordsTable->word = "STRING";
                R::store($wordsTable);
            }
        }
    }

    private function fillWords()
    {
        $words_array = array('MONDAY', 'ORANGE', 'DANCER', 'PURPLE', 'BUTTER', 'CASTLE');
        R::begin();
        try {
            $this->insertWord('MONDAY');
            $this->insertWord('ORANGE');
            $this->insertWord('DANCER');
            $this->insertWord('PURPLE');
            $this->insertWord('BUTTER');
            $this->insertWord('CASTLE');
            R::commit();
        } catch (\Exception $e) {
            R::rollback();
        }
    }

    private function insertWord($word)
    {
        $existingWord = R::findOne('words', 'word = ?', [$word]);
        if (!$existingWord) {
            $newWord = R::dispense('words');
            $newWord->word = $word;
            R::store($newWord);
        }
    }

    public function genWord()
    {
        $wordBean = R::findOne('words', 'ORDER BY RANDOM() LIMIT 1');

        if ($wordBean) {
            return $wordBean->word;
        }

        return null;
    }

    public function storeGame($player, $word, $outcome)
    {
        $game = R::dispense('finishedgames');

        $game->gameId = 0;
        $game->datetime = date('Y-m-d H:i:s');
        $game->player = $player;
        $game->word = $word;
        $game->result = $outcome;


        $idBean = R::findOne('finishedgames', 'ORDER BY game_id DESC LIMIT 1');
        if ($idBean) {
            $game->gameId = $idBean->gameId + 1;
        }

        R::store($game);
    }

    private function storeTry($step, $letter, $outcome)
    {
        $try = R::dispense('tries');

        $try->gameId = 0;
        $try->step = $step;
        $try->letter = $letter;
        $try->result = $outcome;

        $idBean = R::findOne('finishedgames', 'ORDER BY game_id DESC LIMIT 1');
        if ($idBean) {
            $try->gameId = $idBean->gameId + 1;
        }

        R::store($try);
    }

    public function checkLetter($step, $letter, $hidden_word, &$temp_word, &$errors, &$found_letters)
    {
        $error_flag = true;
        for ($i = 0; $i < strlen($hidden_word); $i++) {
            if ($letter[0] == $hidden_word[$i]) {
                $error_flag = false;
                $temp_word[$i * 2] = $letter;
                $found_letters++;
            }
        }
        if ($error_flag) {
            View::wrongMessage();
            $this->storeTry($step, $letter, 'wrong');
            $errors++;
        } else {
            View::rightMessage();
            $this->storeTry($step, $letter, 'right');
        }
        View::drawWord($temp_word);
        View::drawHangman($errors);
    }

    public function showGames()
    {
        $result = R::findAll('finishedgames');
        View::showGames($result);
    }

    public function repeatGame($id)
    {
        $result = R::findAll('tries', 'game_id = ?', [$id - 1]);
        View::repeatGame($result);
    }
}
