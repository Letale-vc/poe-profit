@echo off
setlocal

:: Define the path to the startup folder
set "startupFolder=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

:: Create the startup batch file
(
    echo @echo off
    echo cd /d "%~dp0"
    echo docker-compose down
    echo docker-compose up -d
) > "%startupFolder%\start-docker.bat"

endlocal
