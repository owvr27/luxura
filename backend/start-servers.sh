#!/bin/bash

echo "========================================"
echo "Luxora Environmental - Starting Servers"
echo "========================================"
echo ""

# Start Node.js backend in background
echo "Starting Node.js Backend (Port 4000)..."
cd "$(dirname "$0")"
npm run dev &
NODE_PID=$!

# Wait a bit for Node.js to start
sleep 3

# Start Python server in background
echo "Starting Python Image Server (Port 5000)..."
python3 server.py &
PYTHON_PID=$!

echo ""
echo "========================================"
echo "Both servers are running!"
echo "========================================"
echo "Node.js Backend: http://localhost:4000"
echo "Python Server: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
trap "kill $NODE_PID $PYTHON_PID; exit" INT TERM
wait

