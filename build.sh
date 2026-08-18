#!/usr/bin/env bash
set -e

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Generating Prisma client..."
prisma generate

echo "Running database migrations..."
prisma migrate deploy

echo "Build complete!"
