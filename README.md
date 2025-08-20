# 🎸 Tabit

**Convert short-form guitar clips into playable ASCII tablature.**  
Built with React + Flask, Tabit is an MVP that helps guitar learners transcribe melodies from audio with minimal effort.

---

## ✨ Features

- 🎧 Upload an audio file of a guitar performance
- 🧠 Detects notes and converts them to standard pitch notation (e.g., A3, E4)
- 🎯 Maps notes to the optimal string/fret combo on a standard-tuned 6-string guitar
- 📜 Renders a playable, properly aligned ASCII guitar tab in the browser

---

## 🧱 Tech Stack

| Layer      | Tech           |
|------------|----------------|
| Frontend   | React (Vite)   |
| Backend    | Flask + Python |
| Audio      | Librosa, NumPy |
| Dev Tools  | Git, GitHub, Vite, virtualenv |

---

## 🔄 How It Works

```
[Upload .wav/mp3 file] → [Flask API] → [librosa analyzes audio] 
→ [Pitch detection] → [Tab position mapping] → [ASCII tab returned to frontend]
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/ejeon129/tabit.git
cd tabit
```

### 2. Set up the backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

This will start the Flask server at: `http://127.0.0.1:5000`

### 3. Start the frontend

In a new terminal tab:

```bash
cd frontend
npm install
npm run dev
```

This will start the React app at: `http://localhost:5173`

---

## 📸 Sample Output

```
e|------0--4-----0--------5--
B|---------------------0-----
G|2--2--------1--------------
D|------------------1--------
A|---------------------------
E|---------------------------
```

---

## ⚠️ Known Limitations

- Works best with clean, monophonic guitar clips (single-note playing)
- Tuning is assumed to be standard EADGBE
- Timing/duration not captured in tab yet (no note lengths)

---

## 🛣 Roadmap

- [ ] Improve tab formatting and spacing
- [ ] Add file size/type validation
- [ ] Display waveform or playback
- [ ] Deploy to Render / Vercel
- [ ] Add user accounts for saving tabs

---

## 🙋‍♂️ Author

Eric Jeon  
Built as a full-stack portfolio project to demonstrate audio processing, React/Flask integration, and practical music tooling.

---

## 📄 License

MIT — free to use, modify, and share.
