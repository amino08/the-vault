# Stop stale Node processes, clear Next.js cache, restart dev server.
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

if (Test-Path .next) {
  Remove-Item -Recurse -Force .next
}

if (Test-Path node_modules\.cache) {
  Remove-Item -Recurse -Force node_modules\.cache
}

Write-Host "Cache cleared. Starting dev server on http://localhost:3000 ..."
npm run dev
