from flask import Flask, jsonify
from flask_cors import CORS
import os
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
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
