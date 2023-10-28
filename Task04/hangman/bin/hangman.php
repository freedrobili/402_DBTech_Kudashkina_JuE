#!/usr/bin/env php
<?php

$autoloadPath = __DIR__ . '/../vendor/autoload.php';

if (file_exists($autoloadPath)) {
    include_once $autoloadPath;
}

use freedrobili\hangman\Controller\Controller;

$session = new Controller();
while (true) {
    $session->menu();
}
