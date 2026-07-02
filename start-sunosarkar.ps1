# ============================================================
#  SunoSarkar Auto-Start Script
#  Double-click this file every time you want to run the app.
#  Fill in your credentials below before running.
# ============================================================

# -- FILL THESE IN --
$VERCEL_TOKEN     = "YOUR_VERCEL_TOKEN_HERE"
$VERCEL_PROJECT   = "YOUR_VERCEL_PROJECT_ID_HERE"
# -------------------

$BACKEND_DIR      = "C:\Users\WIN\Downloads\sunosarkar\sunosarkar"
$CFTUNNEL_EXE     = "C:\Users\WIN\Downloads\cftunnel.exe"
$BACKEND_PORT     = 8080

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   SunoSarkar Auto-Start" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill anything on port 8080
Write-Host "[1/5] Freeing port $BACKEND_PORT..." -ForegroundColor Yellow
$proc = Get-NetTCPConnection -LocalPort $BACKEND_PORT -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
if ($proc) { Stop-Process -Id $proc -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2
Write-Host "      Done" -ForegroundColor Gray

# Step 2: Start Spring Boot backend
Write-Host "[2/5] Starting Spring Boot backend..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd `"$BACKEND_DIR`" && mvnw.cmd spring-boot:run" -WindowStyle Minimized
Write-Host "      Waiting 35 seconds for Spring Boot..." -ForegroundColor Gray
Start-Sleep -Seconds 35
Write-Host "      Backend should be up" -ForegroundColor Green

# Step 3: Start Cloudflare tunnel and capture URL
Write-Host "[3/5] Starting Cloudflare tunnel..." -ForegroundColor Yellow
$logFile = "$env:TEMP\cftunnel_log.txt"
if (Test-Path $logFile) { Remove-Item $logFile -Force }
Start-Process -FilePath $CFTUNNEL_EXE -ArgumentList "tunnel --url http://localhost:$BACKEND_PORT" -RedirectStandardOutput $logFile -RedirectStandardError $logFile -WindowStyle Minimized

$tunnelUrl = $null
$attempts = 0
while (-not $tunnelUrl -and $attempts -lt 30) {
    Start-Sleep -Seconds 2
    $attempts++
    if (Test-Path $logFile) {
        $content = Get-Content $logFile -Raw -ErrorAction SilentlyContinue
        if ($content -match 'https://[a-z0-9\-]+\.trycloudflare\.com') {
            $tunnelUrl = $Matches[0]
        }
    }
}

if (-not $tunnelUrl) {
    Write-Host "      Could not detect tunnel URL. Check $logFile" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "      Tunnel URL: $tunnelUrl" -ForegroundColor Green

# Step 4: Update Vercel environment variable
Write-Host "[4/5] Updating Vercel..." -ForegroundColor Yellow
$apiUrl = "$tunnelUrl/api"
$headers = @{ Authorization = "Bearer $VERCEL_TOKEN"; "Content-Type" = "application/json" }

$envList = Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/$VERCEL_PROJECT/env" -Headers $headers -Method GET
$existing = $envList.envs | Where-Object { $_.key -eq "VITE_API_URL" } | Select-Object -First 1

if ($existing) {
    $body = @{ value = $apiUrl } | ConvertTo-Json
    Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/$VERCEL_PROJECT/env/$($existing.id)" -Headers $headers -Method PATCH -Body $body | Out-Null
    Write-Host "      Updated VITE_API_URL = $apiUrl" -ForegroundColor Green
} else {
    $body = @{ key = "VITE_API_URL"; value = $apiUrl; type = "plain"; target = @("production","preview","development") } | ConvertTo-Json
    Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/$VERCEL_PROJECT/env" -Headers $headers -Method POST -Body $body | Out-Null
    Write-Host "      Created VITE_API_URL = $apiUrl" -ForegroundColor Green
}

# Step 5: Trigger redeploy via Vercel API
Write-Host "[5/5] Triggering Vercel redeploy..." -ForegroundColor Yellow
try {
    $deps = Invoke-RestMethod -Uri "https://api.vercel.com/v6/deployments?projectId=$VERCEL_PROJECT&limit=1&target=production" -Headers $headers
    $latest = $deps.deployments | Select-Object -First 1
    $body = @{ deploymentId = $latest.uid } | ConvertTo-Json
    Invoke-RestMethod -Uri "https://api.vercel.com/v13/deployments" -Headers $headers -Method POST -Body $body | Out-Null
    Write-Host "      Redeploy triggered!" -ForegroundColor Green
} catch {
    Write-Host "      Auto-redeploy failed — go to vercel.com and click Redeploy manually" -ForegroundColor DarkYellow
}

# Done
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "   ALL DONE — App is live!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "   Local    : http://localhost:$BACKEND_PORT" -ForegroundColor White
Write-Host "   Tunnel   : $tunnelUrl" -ForegroundColor White
Write-Host "   Frontend : https://suno-sarkar.vercel.app" -ForegroundColor White
Write-Host ""
Write-Host "   Keep this window open. Ctrl+C to stop." -ForegroundColor Yellow
Write-Host ""

# Keep alive
while ($true) { Start-Sleep -Seconds 60 }
