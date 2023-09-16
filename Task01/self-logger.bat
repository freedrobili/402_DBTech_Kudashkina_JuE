@echo off
chcp 65001 > nul

set DB_PATH=self_logger.db

if not exist %DB_PATH% (
    sqlite3.exe %DB_PATH% "CREATE TABLE IF NOT EXISTS logs (user TEXT, date TEXT);"
)

set "user=%USERNAME%"

sqlite3.exe %DB_PATH% "INSERT INTO logs (user, date) VALUES ('%user%', datetime('now', 'localtime'));"

echo Имя программы: %~nx0

echo|<nul set /p="Количество запусков: "
sqlite3.exe %DB_PATH% "SELECT COUNT(*) AS 'Количество запусков' FROM logs;"

echo|<nul set /p=" Первый запуск: "
sqlite3.exe %DB_PATH% "SELECT MIN(date) AS 'Дата первого запуска' FROM logs;"

echo ---------------------------------------------
echo User      ^| Date
echo ---------------------------------------------

sqlite3.exe %DB_PATH% "SELECT DISTINCT user, date FROM logs;"
