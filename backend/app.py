from flask import Flask, jsonify
from flask_cors import CORS
import os
import argparse
from routes import register_routes

app = Flask(__name__)
CORS(app)

# Register API routes
register_routes(app)

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy", "message": "Austin Trail Runner API is running"})

if __name__ == '__main__':
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Run the Austin Trail Runner backend server')
    parser.add_argument('--port', type=int, default=5005, help='Port to run the server on')
    args = parser.parse_args()
    
    # Use the port from command line arguments or environment variable, with fallback to default
    port = int(os.environ.get('PORT', args.port))
    app.run(host='0.0.0.0', port=port, debug=True)
