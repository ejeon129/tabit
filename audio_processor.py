# audio_processor.py

import librosa
import numpy as np
from pitch_to_tab import find_tab_positions  # 👈 Connect tab logic here

# Load audio file
filename = 'media/sample_guitar_clip.wav'  # Update if your file is named differently
y, sr = librosa.load(filename)

# Detect note onsets (time points where notes start)
onset_frames = librosa.onset.onset_detect(y=y, sr=sr)
onset_times = librosa.frames_to_time(onset_frames, sr=sr)

# Estimate pitch using piptrack
pitches, magnitudes = librosa.piptrack(y=y, sr=sr)

# Extract the dominant pitch at each onset
detected_notes = []
for t in onset_frames:
    index = magnitudes[:, t].argmax()
    freq = pitches[index, t]
    if freq > 0:
        time = librosa.frames_to_time(t, sr=sr)
        detected_notes.append((time, freq))

# Convert frequency to note name
def freq_to_note(freq):
    note_names = ['C', 'C#', 'D', 'D#', 'E', 'F',
                  'F#', 'G', 'G#', 'A', 'A#', 'B']
    if freq <= 0:
        return None
    note_num = int(round(12 * np.log2(freq / 440.0))) + 69
    note = note_names[note_num % 12]
    octave = note_num // 12 - 1
    return f"{note}{octave}"

# Display results
print("🎸 Cleaned Transcription:\n")

for time, freq in detected_notes:
    note = freq_to_note(freq)
    if note is None:
        continue

    tab_positions = find_tab_positions(note)
    if not tab_positions:
        continue

    best_position = min(tab_positions, key=lambda x: x[1])
    string, fret = best_position

    print(f"Time: {time:.2f}s - Note: {note:<3} - Play on String {string}, Fret {fret}")

