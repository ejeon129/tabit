# audio_processor.py
# Loads the audio, detects pitch, and uses pitch_to_tab to generate tab

import librosa
import numpy as np
from pitch_to_tab import find_tab_positions  # 👈 Connect tab logic here

# audio_processor.py

import librosa
import numpy as np
from pitch_to_tab import find_tab_positions

def freq_to_note(freq):
    note_names = ['C', 'C#', 'D', 'D#', 'E', 'F',
                  'F#', 'G', 'G#', 'A', 'A#', 'B']
    if freq <= 0:
        return None
    note_num = int(round(12 * np.log2(freq / 440.0))) + 69
    note = note_names[note_num % 12]
    octave = note_num // 12 - 1
    return f"{note}{octave}"

def generate_tab_notes(filename):
    y, sr = librosa.load(filename)

    onset_frames = librosa.onset.onset_detect(y=y, sr=sr)
    onset_times = librosa.frames_to_time(onset_frames, sr=sr)
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)

    detected_notes = []
    for t in onset_frames:
        index = magnitudes[:, t].argmax()
        freq = pitches[index, t]
        if freq > 0:
            time = librosa.frames_to_time(t, sr=sr)
            detected_notes.append((time, freq))

    tab_notes = []
    for time, freq in detected_notes:
        note = freq_to_note(freq)
        if note is None:
            continue

        tab_positions = find_tab_positions(note)
        if not tab_positions:
            continue

        best_position = min(tab_positions, key=lambda x: x[1])
        string, fret = best_position
        tab_notes.append((time, string, fret))

    return tab_notes


'''
# Only run when script is called directly
if __name__ == "__main__":
    tab_notes = generate_tab_notes()
    for t, s, f in tab_notes:
        print(f"Time: {t:.2f}s - String {s} - Fret {f}")
'''


