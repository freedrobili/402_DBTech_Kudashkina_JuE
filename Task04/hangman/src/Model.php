<?php

namespace freedrobili\hangman\Model;

use freedrobili\hangman\View\View;
use SQLite3;

class Model
{
    private $db;

    public function __construct($path)
    {
        $this->db = new SQLite3($path);

        $query = "CREATE TABLE IF NOT EXISTS finished_games (
            game_id INTEGER PRIMARY KEY,
            player STRING, 
            date_time DATETIME,
            word STRING,
            result STRING
            )";
        $this->db->exec($query);

        $query = "CREATE TABLE IF NOT EXISTS tries (
            game_id INTEGER,
            step INTEGER,
            letter STRING,
            result STRING
            )";
        $this->db->exec($query);

        $query = "CREATE TABLE IF NOT EXISTS words (
            word STRING PRIMARY KEY
            )";
        $this->db->exec($query);

        $query = "INSERT OR IGNORE INTO words (word)
            VALUES
                ('BUTTER'),
                ('ORANGE'),
                ('CIRCLE'),
                ('FOREST'),
                ('GUITAR'),
                ('HAMMER')";
        $this->db->exec($query);
    }

    public function genWord()
    {
        $query = "SELECT (word) FROM words
            ORDER BY RANDOM()
            LIMIT 1";
        $result = $this->db->query($query);
        $row = $result->fetchArray();
        return $row[0];
    }

    public function storeGame($player, $word, $outcome)
    {
        $game_id = 0;
        $query = "SELECT (game_id) FROM finished_games
            ORDER BY rowid DESC LIMIT 1";
        $result = $this->db->query($query);
        if ($row = $result->fetchArray()) {
            $game_id = $row[0] + 1;
        }

        $date = date('Y-m-d H:i:s');

        $query = "INSERT INTO finished_games
            (game_id, player, date_time, word, result)
            VALUES ('$game_id', '$player', '$date', '$word', '$outcome')";
        $this->db->exec($query);
    }

    private function storeTry($step, $letter, $outcome)
    {
        $game_id = 0;
        $query = "SELECT (game_id) FROM finished_games
            ORDER BY rowid DESC LIMIT 1";
        $result = $this->db->query($query);
        if ($row = $result->fetchArray()) {
            $game_id = $row[0] + 1;
        }


        $query = "INSERT INTO tries
                (game_id, step, letter, result)
                VALUES ('$game_id', '$step', '$letter', '$outcome')";
        $this->db->exec($query);
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
        $query = "SELECT * FROM finished_games";
        $result = $this->db->query($query);
        View::showGames($result);
    }

    public function repeatGame($id)
    {
        $query = "SELECT * FROM tries
            WHERE game_id = $id";
        $result = $this->db->query($query);
        View::repeatGame($result);
    }

    public function closeConnection()
    {
        $this->db->close();
    }
}
