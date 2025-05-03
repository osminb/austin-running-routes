#!/bin/bash

# Get the absolute path to the project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "Project root: $PROJECT_ROOT"

# Clear ports if they're in use
echo "Checking for processes using our ports..."
BACKEND_PORT=5005
FRONTEND_PORT=4001

# Kill any processes using our ports
kill_port() {
  local port=$1
  local pid=$(lsof -t -i:$port)
  if [ ! -z "$pid" ]; then
    echo "Killing process $pid using port $port"
    kill -9 $pid
  else
    echo "Port $port is free"
  fi
}

kill_port $BACKEND_PORT
kill_port $FRONTEND_PORT

# Wait a moment for ports to clear
sleep 1

# Start backend server
echo "Starting backend server on port $BACKEND_PORT..."
cd "$PROJECT_ROOT/backend"
python3 app.py --port $BACKEND_PORT > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend server started with PID $BACKEND_PID"

# Wait for backend to initialize
sleep 2

# Start frontend server
echo "Starting frontend server on port $FRONTEND_PORT..."
cd "$PROJECT_ROOT/frontend"
if [ ! -d "$PROJECT_ROOT/frontend" ]; then
  echo "Error: Frontend directory not found at $PROJECT_ROOT/frontend"
  echo "Stopping backend server..."
  kill -9 $BACKEND_PID
  exit 1
fi
PORT=$FRONTEND_PORT npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend server started with PID $FRONTEND_PID"

echo ""
echo "Austin Trail Runner Demo is starting up!"
echo "----------------------------------------"
echo "Backend running on: http://localhost:$BACKEND_PORT"
echo "Frontend running on: http://localhost:$FRONTEND_PORT"
echo ""
echo "Open your browser to: http://localhost:$FRONTEND_PORT"
echo ""
echo "To stop the servers, run: ./stop-demo.sh"
echo "Or press Ctrl+C to exit (servers will continue running in background)"

# Create stop script
cat > "$PROJECT_ROOT/stop-demo.sh" << EOL
#!/bin/bash
echo "Stopping Austin Trail Runner Demo..."
kill -9 $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo "Demo stopped"
EOL

chmod +x "$PROJECT_ROOT/stop-demo.sh"

# Keep script running to allow easy termination
wait
