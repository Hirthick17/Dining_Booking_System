# Quick Start Guide - Redis Setup

## ✅ Redis is Now Installed and Running!

### Installation Location
```
C:\Users\hirth\Redis\
```

### Files Installed
- `redis-server.exe` - Redis server
- `redis-cli.exe` - Redis command-line interface
- `redis-benchmark.exe` - Performance testing tool
- Configuration files

---

## Managing Redis

### Using the Management Script

We've created a PowerShell script to easily manage Redis:

```powershell
# Start Redis
.\redis-manager.ps1 start

# Stop Redis
.\redis-manager.ps1 stop

# Check status
.\redis-manager.ps1 status

# Restart Redis
.\redis-manager.ps1 restart
```

### Manual Commands

```powershell
# Start Redis manually
Start-Process "$env:USERPROFILE\Redis\redis-server.exe"

# Stop Redis manually
Stop-Process -Name redis-server

# Check if running
Get-Process redis-server
```

---

## Testing Redis Connection

### Test with Node.js
```bash
node test-redis.js
```

**Expected Output**:
```
✅ Redis connected successfully
✅ Redis is ready to accept commands
✅ All tests passed!
```

### Test with Redis CLI
```powershell
# Open Redis CLI
& "$env:USERPROFILE\Redis\redis-cli.exe"

# Test commands
127.0.0.1:6379> PING
PONG

127.0.0.1:6379> SET test "Hello"
OK

127.0.0.1:6379> GET test
"Hello"

127.0.0.1:6379> EXIT
```

---

## Integration with Your Project

### ✅ Already Configured!

Your project is already set up to use Redis:

1. **Environment Variables** (`.env`):
   ```env
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

2. **Redis Configuration** (`src/config/redis.js`):
   - Automatic connection on server start
   - Graceful fallback if Redis is unavailable

3. **Booking Service** (`src/services/bookingService.js`):
   - Uses Redis for distributed locking
   - Prevents concurrent booking conflicts

### Start Your Server

```bash
npm run dev
```

**You should see**:
```
✅ Redis connected successfully
✅ Redis is ready to accept commands
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

---

## Auto-Start Redis on System Boot (Optional)

### Option 1: Task Scheduler

1. Open Task Scheduler
2. Create Basic Task
3. Name: "Redis Server"
4. Trigger: "When the computer starts"
5. Action: "Start a program"
6. Program: `C:\Users\hirth\Redis\redis-server.exe`

### Option 2: Startup Folder

1. Press `Win + R`
2. Type: `shell:startup`
3. Create shortcut to `C:\Users\hirth\Redis\redis-server.exe`

---

## Monitoring Redis

### View Real-time Commands
```powershell
& "$env:USERPROFILE\Redis\redis-cli.exe" MONITOR
```

### Check Memory Usage
```powershell
& "$env:USERPROFILE\Redis\redis-cli.exe" INFO memory
```

### View All Keys
```powershell
& "$env:USERPROFILE\Redis\redis-cli.exe" KEYS *
```

---

## Troubleshooting

### Redis Won't Start

**Check if port 6379 is in use**:
```powershell
Get-NetTCPConnection -LocalPort 6379
```

**Kill process using port**:
```powershell
Stop-Process -Id <PID> -Force
```

### Connection Refused

1. Check if Redis is running: `Get-Process redis-server`
2. Restart Redis: `.\redis-manager.ps1 restart`
3. Check firewall settings

### High Memory Usage

Redis stores data in memory. To clear all data:
```powershell
& "$env:USERPROFILE\Redis\redis-cli.exe" FLUSHALL
```

---

## Next Steps

1. ✅ Redis is running
2. ✅ Project is configured
3. ✅ Test script passed
4. 🚀 **Start your server**: `npm run dev`
5. 🧪 **Test bookings**: Try creating concurrent bookings

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `.\redis-manager.ps1 start` | Start Redis |
| `.\redis-manager.ps1 stop` | Stop Redis |
| `.\redis-manager.ps1 status` | Check status |
| `node test-redis.js` | Test connection |
| `npm run dev` | Start your server |

---

**🎉 Redis is ready to use with your booking system!**
