#!/usr/bin/env bash
set -e

# Run official entrypoint in background or let it initialize
/usr/local/bin/docker-entrypoint.sh "$@" &
PID=$!

# Wait for Postgres to be ready
until psql -U postgres -d postgres -c "SELECT 1;" > /dev/null 2>&1; do
  sleep 1
done

# Run init script if table doesn't exist
psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/init.sql

wait $PID