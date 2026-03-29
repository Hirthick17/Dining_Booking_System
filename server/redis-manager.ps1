# Redis Server Management Script
# This script helps you start/stop/check Redis server

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("start", "stop", "status", "restart")]
    [string]$Action = "start"
)

$redisPath = "$env:USERPROFILE\Redis\redis-server.exe"
$redisCliPath = "$env:USERPROFILE\Redis\redis-cli.exe"

function Start-RedisServer {
    Write-Host "🚀 Starting Redis Server..." -ForegroundColor Cyan
    
    # Check if already running
    $process = Get-Process redis-server -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "✅ Redis is already running (PID: $($process.Id))" -ForegroundColor Green
        return
    }
    
    # Start Redis
    Start-Process -FilePath $redisPath -WindowStyle Normal
    Start-Sleep -Seconds 2
    
    # Verify
    $process = Get-Process redis-server -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "✅ Redis server started successfully (PID: $($process.Id))" -ForegroundColor Green
        Write-Host "📍 Running on localhost:6379" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Failed to start Redis server" -ForegroundColor Red
    }
}

function Stop-RedisServer {
    Write-Host "🛑 Stopping Redis Server..." -ForegroundColor Cyan
    
    $process = Get-Process redis-server -ErrorAction SilentlyContinue
    if ($process) {
        # Graceful shutdown using redis-cli
        if (Test-Path $redisCliPath) {
            & $redisCliPath shutdown
            Start-Sleep -Seconds 1
        }
        
        # Force kill if still running
        $process = Get-Process redis-server -ErrorAction SilentlyContinue
        if ($process) {
            Stop-Process -Name redis-server -Force
        }
        
        Write-Host "✅ Redis server stopped" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Redis is not running" -ForegroundColor Yellow
    }
}

function Get-RedisStatus {
    Write-Host "📊 Redis Server Status" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    $process = Get-Process redis-server -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Status:        " -NoNewline
        Write-Host "RUNNING ✅" -ForegroundColor Green
        Write-Host "PID:           $($process.Id)"
        Write-Host "Memory:        $([math]::Round($process.WorkingSet64 / 1MB, 2)) MB"
        Write-Host "Start Time:    $($process.StartTime)"
        Write-Host "Port:          6379"
        
        # Test connection
        Write-Host "`nTesting connection..." -ForegroundColor Cyan
        try {
            $result = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue
            if ($result.TcpTestSucceeded) {
                Write-Host "Connection:    " -NoNewline
                Write-Host "OK ✅" -ForegroundColor Green
            } else {
                Write-Host "Connection:    " -NoNewline
                Write-Host "FAILED ❌" -ForegroundColor Red
            }
        } catch {
            Write-Host "Connection:    " -NoNewline
            Write-Host "UNKNOWN ⚠️" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Status:        " -NoNewline
        Write-Host "NOT RUNNING ❌" -ForegroundColor Red
        Write-Host "`nTo start Redis, run:" -ForegroundColor Yellow
        Write-Host "  .\redis-manager.ps1 start" -ForegroundColor Cyan
    }
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
}

function Restart-RedisServer {
    Write-Host "🔄 Restarting Redis Server..." -ForegroundColor Cyan
    Stop-RedisServer
    Start-Sleep -Seconds 2
    Start-RedisServer
}

# Execute action
switch ($Action) {
    "start" { Start-RedisServer }
    "stop" { Stop-RedisServer }
    "status" { Get-RedisStatus }
    "restart" { Restart-RedisServer }
}

Write-Host ""
