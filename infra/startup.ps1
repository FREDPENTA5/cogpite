$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

Write-Host 'Starting DealScout stack with Docker Compose...'

try {
    docker info | Out-Null
} catch {
    Write-Error 'Docker does not appear to be available. Install Docker Desktop and start it before running this script.'
    exit 1
}

Write-Host 'Launching services from infra/docker-compose.yml'
docker compose -f docker-compose.yml up -d --build

Write-Host 'DealScout stack is starting.'
Write-Host '  - Backend: http://localhost:8000'
Write-Host '  - Frontend: http://localhost:3000'
Write-Host '  - Flower: http://localhost:5555'
Write-Host 'If the machine reboots, configure Docker Desktop to start on login and this compose stack will restart automatically.'
