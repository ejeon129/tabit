from flask import Flask, request, jsonify
from flask_cors import CORS
from audio_processor import generate_tab_notes
from ascii_tab_generator import generate_ascii_tab
import tempfile
import os

app = Flask(__name__)
CORS(app)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']

    # Save uploaded audio file to a temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp:
        audio_file.save(tmp.name)
        temp_path = tmp.name

    try:
        # Run your backend logic
        notes_with_tabs = generate_tab_notes(temp_path)
        ascii_tab = generate_ascii_tab(notes_with_tabs)
        return ascii_tab, 200
    finally:
        os.remove(temp_path)

@app.route('/')
def health_check():
    return "✅ Flask server is running"

if __name__ == '__main__':
    app.run(debug=True)
