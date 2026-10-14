@echo off
title CivicPulse AI — Launching
echo ========================================================
echo        CivicPulse AI — The City That Listens and Acts
echo ========================================================
echo.
echo Launching CivicPulse AI in your default web browser...
echo Location: %~dp0index.html
echo.

start "" "%~dp0index.html"

echo Application launched!
echo Press any key to exit this launcher window...
pause >nul
