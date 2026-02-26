from __future__ import annotations

import os
import tempfile
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from audio_processor import transcribe_audio_to_tab
from ascii_tab_generator import generate_ascii_tab

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "30"))
ALLOWED_EXTENSIONS = {".wav", ".mp3", ".m4a", ".aac", ".ogg", ".flac"}
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_MB * 1024 * 1024


def _allowed_file(filename: str) -> bool:
    ext = Path(filename).suffix.lower()
    return ext in ALLOWED_EXTENSIONS


def _error(message: str, status: int = 400):
    return jsonify({"error": message}), status


@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "audio" not in request.files:
        return _error("No audio file provided.")

    audio_file = request.files["audio"]
    if not audio_file.filename:
        return _error("Empty filename.")

    if not _allowed_file(audio_file.filename):
        allowed = ", ".join(sorted(ALLOWED_EXTENSIONS))
        return _error(f"Unsupported file type. Allowed: {allowed}")

    suffix = Path(audio_file.filename).suffix.lower() or ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        audio_file.save(tmp.name)
        temp_path = tmp.name

    try:
        result = transcribe_audio_to_tab(temp_path)
        ascii_tab = generate_ascii_tab(result.notes)
        events = [
            {
                "time_sec": round(time_sec, 3),
                "note": note_name,
                "string": string_num,
                "fret": fret,
            }
            for time_sec, string_num, fret, note_name in result.notes
        ]

        return (
            jsonify(
                {
                    "ascii_tab": ascii_tab,
                    "events": events,
                    "metrics": {
                        "event_count": len(events),
                        "duration_sec": round(result.duration_sec, 3),
                        "sample_rate_hz": result.sample_rate,
                    },
                }
            ),
            200,
        )
    except Exception as exc:  # noqa: BLE001 - API should surface friendly errors
        return _error(f"Transcription failed: {exc}", status=500)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.errorhandler(413)
def file_too_large(_err):
    return _error(f"File too large. Limit is {MAX_UPLOAD_MB}MB.", status=413)


@app.route("/")
def health_check():
    return jsonify(
        {
            "status": "ok",
            "service": "tabit-backend",
            "max_upload_mb": MAX_UPLOAD_MB,
            "accepted_extensions": sorted(ALLOWED_EXTENSIONS),
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
