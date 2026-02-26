# Tabit

Convert short-form guitar clips into playable ASCII tablature.

## What Works Today

- Upload audio clips (`.wav`, `.mp3`, `.m4a`, `.aac`, `.ogg`, `.flac`) in the web app
- Backend transcribes likely melodic notes with `librosa`
- Notes are mapped to practical string/fret positions for standard tuning
- UI returns copyable/downloadable ASCII tabs with basic metrics

## Architecture

```text
React (Vite) frontend
  -> POST /transcribe
Flask API
  -> audio_processor.py (onsets + pitch estimation)
  -> pitch_to_tab.py (string/fret selection)
  -> ascii_tab_generator.py (timing-aware ASCII rendering)
```

## Local Setup

### 1) Backend

From repo root:

```bash
source venv/bin/activate
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs at `http://127.0.0.1:5000`.

### 2) Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and proxies `/transcribe` to Flask.

## API Response

`POST /transcribe` returns JSON:

```json
{
  "ascii_tab": "e|---0-...\nB|------...\n...",
  "events": [
    { "time_sec": 0.252, "note": "G3", "string": 3, "fret": 0 }
  ],
  "metrics": {
    "event_count": 22,
    "duration_sec": 8.31,
    "sample_rate_hz": 22050
  }
}
```

## Current Limits

- Best on monophonic or lightly layered guitar clips
- Assumes standard EADGBE tuning
- Rhythm notation and advanced techniques (slides/bends/chords) are not yet inferred

## Monetization-Oriented MVP Roadmap

1. Source ingestion: paste TikTok/YouTube/IG URL, extract audio segment server-side
2. Better transcription: chord detection + confidence scoring + bar-aligned output
3. Accounts/paywall: free tier (limited transcriptions), paid monthly unlimited
4. Queue + background jobs: async processing for longer clips
5. Export + library: save tabs, PDF export, shareable public links

## License

MIT
