# Family Food Planner — start both servers
Write-Host "`n🍽️  Starting Family Food Planner...`n" -ForegroundColor Green

# Start backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; uvicorn main:app --reload --port 8000" -WindowStyle Normal

# Wait a moment then start frontend
Start-Sleep -Seconds 2
Set-Location "$PSScriptRoot\frontend"
npm run dev
