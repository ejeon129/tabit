# pitch_to_tab.py

import re

# Standard tuning: string number → open note (lowest string = 6)
STANDARD_TUNING = {
    6: 'E2',
    5: 'A2',
    4: 'D3',
    3: 'G3',
    2: 'B3',
    1: 'E4'
}

NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F',
              'F#', 'G', 'G#', 'A', 'A#', 'B']

# Convert note name (like G#3) to MIDI number
def note_to_midi(note):
    match = re.match(r'^([A-G]#?)(-?\d+)$', note)
    if not match:
        return None
    pitch_class, octave = match.groups()
    pitch_index = NOTE_NAMES.index(pitch_class)
    midi_number = (int(octave) + 1) * 12 + pitch_index
    return midi_number

# Reverse: MIDI number → note name (for testing)
def midi_to_note(midi):
    pitch = NOTE_NAMES[midi % 12]
    octave = midi // 12 - 1
    return f"{pitch}{octave}"

# Find all string/fret positions that can play the given note
def find_tab_positions(note):
    target_midi = note_to_midi(note)
    if target_midi is None:
        return []

    positions = []
    for string, open_note in STANDARD_TUNING.items():
        open_midi = note_to_midi(open_note)
        fret = target_midi - open_midi
        if 0 <= fret <= 20:  # Only return playable frets
            positions.append((string, fret))
    return positions

# 🧪 Example test
if __name__ == "__main__":
    test_notes = ['E4', 'G#3', 'A3', 'C#4', 'F#4']
    for note in test_notes:
        print(f"{note} →", find_tab_positions(note))
