@echo off
title Amigos Fashionstop Server
cd /d "%~dp0"
echo Starting Amigos Fashionstop on http://localhost:3000 ...
start "" "http://localhost:3000"
"C:\Users\MJ\AppData\Local\OpenAI\Codex\runtimes\cua_node\7f75cff94511d5f8\bin\node.exe" node_modules\next\dist\bin\next start -p 3000
pause
