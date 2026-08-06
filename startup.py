#!/usr/bin/env python3
"""
DealScout Application Startup and Demo Script
Sets up and runs the full application stack with test tender import
"""

import asyncio
import subprocess
import time
import os
import signal
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent
API_DIR = REPO_ROOT / "api"
WEB_DIR = REPO_ROOT / "web"

def print_header(text):
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70 + "\n")

def print_step(text):
    print(f"\n>>> {text}")

def check_dependencies():
    """Check if required tools are installed"""
    print_header("CHECKING DEPENDENCIES")
    
    tools = {
        "python": "python --version",
        "node": "node --version",
        "npm": "npm --version",
        "redis": "redis-cli --version",
        "postgresql": "psql --version",
    }
    
    missing = []
    for tool, cmd in tools.items():
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                version = result.stdout.strip().split('\n')[0]
                print(f"[OK] {tool}: {version}")
            else:
                missing.append(tool)
                print(f"[WARN] {tool}: Not found or error")
        except:
            missing.append(tool)
            print(f"[WARN] {tool}: Not found")
    
    if missing:
        print(f"\nMissing tools: {', '.join(missing)}")
        print("Note: These should be running separately or available in environment")
    
    return len(missing) == 0

def setup_backend():
    """Install Python dependencies"""
    print_header("SETTING UP BACKEND")
    
    print_step("Installing Python dependencies...")
    os.chdir(API_DIR)
    
    result = subprocess.run(
        ["pip", "install", "-r", "requirements.txt", "-q"],
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        print("[OK] Python dependencies installed")
    else:
        print(f"[WARN] Pip install had issues:\n{result.stderr}")

def setup_frontend():
    """Install Node dependencies"""
    print_header("SETTING UP FRONTEND")
    
    print_step("Installing Node dependencies...")
    os.chdir(WEB_DIR)
    
    # Check if node_modules exists and is recent
    node_modules = WEB_DIR / "node_modules"
    if node_modules.exists():
        print("[OK] Dependencies already installed")
        return
    
    result = subprocess.run(
        ["npm", "install"],
        capture_output=True,
        text=True,
        timeout=120
    )
    
    if result.returncode == 0:
        print("[OK] Node dependencies installed")
    else:
        print(f"[WARN] npm install had issues:\n{result.stderr[:500]}")

def verify_env():
    """Verify .env file has required configuration"""
    print_header("VERIFYING CONFIGURATION")
    
    env_file = REPO_ROOT / ".env"
    if not env_file.exists():
        print("[ERROR] .env file not found!")
        return False
    
    required_vars = [
        "DATABASE_URL",
        "REDIS_URL",
        "SUPABASE_API_KEY",
        "SUPABASE_AUTH_TOKEN",
    ]
    
    with open(env_file) as f:
        env_content = f.read()
    
    missing = []
    for var in required_vars:
        if var not in env_content or f"{var}=" not in env_content:
            missing.append(var)
            print(f"[WARN] Missing: {var}")
        else:
            print(f"[OK] {var} configured")
    
    return len(missing) == 0

def start_backend():
    """Start FastAPI backend"""
    print_header("STARTING BACKEND")
    
    print_step("Starting FastAPI server (port 8000)...")
    os.chdir(API_DIR)
    
    proc = subprocess.Popen(
        ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    time.sleep(3)
    
    if proc.poll() is None:
        print("[OK] FastAPI running on http://localhost:8000")
        return proc
    else:
        stderr = proc.stderr.read()
        print(f"[ERROR] Failed to start FastAPI:\n{stderr[:500]}")
        return None

def start_frontend():
    """Start Next.js frontend"""
    print_header("STARTING FRONTEND")
    
    print_step("Starting Next.js dev server (port 3000)...")
    os.chdir(WEB_DIR)
    
    proc = subprocess.Popen(
        ["npm", "run", "dev"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    time.sleep(5)
    
    if proc.poll() is None:
        print("[OK] Next.js running on http://localhost:3000")
        return proc
    else:
        stderr = proc.stderr.read()
        print(f"[ERROR] Failed to start Next.js:\n{stderr[:500]}")
        return None

async def test_api_connection():
    """Test if API is responding"""
    print_header("TESTING API CONNECTION")
    
    import httpx
    
    max_retries = 5
    for i in range(max_retries):
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                resp = await client.get("http://localhost:8000/health")
                if resp.status_code == 200:
                    print("[OK] API is responding")
                    return True
        except:
            if i < max_retries - 1:
                print(f"[...] Waiting for API ({i+1}/{max_retries})...")
                await asyncio.sleep(2)
            else:
                print("[ERROR] API not responding")
                return False
    
    return False

def run_tender_sync():
    """Execute a test tender sync"""
    print_header("RUNNING TEST TENDER SYNC")
    
    print_step("Importing tenders from Supabase...")
    os.chdir(API_DIR)
    
    # This will run the sync task synchronously for demo
    try:
        from api.workers.tender_sync import sync_supabase_tenders
        sync_supabase_tenders.delay("Uganda")
        print("[OK] Sync task queued - check Celery worker logs for progress")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to queue sync: {e}")
        return False

def print_dashboard_info():
    """Print dashboard access info"""
    print_header("DASHBOARD READY")
    
    print("""
    Your DealScout application is now POWERED UP and running!

    ACCESS POINTS:
    ===============
    
    Web Dashboard:    http://localhost:3000
    API:              http://localhost:8000
    Tender Dashboard: http://localhost:3000/dashboard/tenders
    API Docs:         http://localhost:8000/docs
    
    KEY FEATURES:
    =============
    
    Tender Sync:
      - Manual: POST /api/tenders/sync
      - Scheduled: Daily at 2 AM UTC (Celery Beat)
      - Stats: GET /api/tenders/stats
    
    Tor Network:
      - To enable: Set USE_TOR=true in .env
      - Configure: TOR_PROXY_URL=socks5://127.0.0.1:9050
      - Requires: Tor service running locally
    
    Import Status:
      - Check the Tender Dashboard for real-time stats
      - View recent imports and processing status
      - Monitor sync operations
    
    NEXT STEPS:
    ===========
    
    1. Open http://localhost:3000 in your browser
    2. Navigate to /dashboard/tenders to view imports
    3. Click "Sync Now" to import Uganda tech tenders
    4. Watch the dashboard update in real-time
    5. Check API logs for detailed sync information
    
    USEFUL COMMANDS:
    ================
    
    View Celery worker (in new terminal):
      celery -A api.workers.tender_sync worker --loglevel=info
    
    View Celery Beat scheduler (in new terminal):
      celery -A api.workers.schedule beat --loglevel=info
    
    Test Supabase API:
      python -c "from api.workers.tender_sync import sync_supabase_tenders"
    
    Monitor database:
      psql -U postgres -d dealscout
    
    TROUBLESHOOTING:
    ================
    
    API not responding?
      - Check Redis is running: redis-cli ping
      - Check PostgreSQL is running: psql -U postgres -l
      - View FastAPI logs above
    
    No tenders imported?
      - Verify SUPABASE_API_KEY and SUPABASE_AUTH_TOKEN in .env
      - Check Celery worker is running
      - Run: python test_tender_api.py
    
    Dashboard not loading?
      - Check Next.js build: npm run build
      - View browser console for errors
      - Verify API is accessible
    
    """)

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    print("\n\nShutting down...")
    sys.exit(0)

def main():
    """Main startup orchestration"""
    signal.signal(signal.SIGINT, signal_handler)
    
    print("""
    
    ╔════════════════════════════════════════════════════════════════════╗
    ║                                                                    ║
    ║           🚀 DEALSCOUT APPLICATION STARTUP & DEMO 🚀              ║
    ║                                                                    ║
    ║        Tender Intelligence Platform with Supabase Integration     ║
    ║                                                                    ║
    ╚════════════════════════════════════════════════════════════════════╝
    
    """)
    
    # Verify environment
    if not verify_env():
        print("\n[WARN] Configuration incomplete - some features may not work")
    
    # Setup
    setup_backend()
    setup_frontend()
    
    # Verify environment has required services
    if not check_dependencies():
        print("\n[WARN] Some dependencies missing - start services manually:")
        print("  Redis:      redis-server")
        print("  PostgreSQL: psql service")
    
    # Start services
    print_header("STARTING SERVICES")
    
    backend_proc = start_backend()
    frontend_proc = start_frontend()
    
    # Test API
    try:
        if asyncio.run(test_api_connection()):
            # Queue a test sync
            run_tender_sync()
        else:
            print("[WARN] Skipping test sync - API not available")
    except Exception as e:
        print(f"[WARN] Error during test: {e}")
    
    # Show dashboard info
    print_dashboard_info()
    
    # Keep running
    print("\nApplication is running. Press Ctrl+C to stop.\n")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\nShutting down processes...")
        if backend_proc and backend_proc.poll() is None:
            backend_proc.terminate()
        if frontend_proc and frontend_proc.poll() is None:
            frontend_proc.terminate()
        
        print("Services stopped.")
        sys.exit(0)

if __name__ == "__main__":
    main()
