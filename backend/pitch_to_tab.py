"""Map note names to practical guitar tab positions."""

from __future__ import annotations

import re
from typing import List, Optional, Sequence, Tuple

# Standard tuning: string number -> open note (lowest string = 6)
STANDARD_TUNING = {
    6: "E2",
    5: "A2",
    4: "D3",
    3: "G3",
    2: "B3",
    1: "E4",
}

NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
TAB_POSITION = Tuple[int, int]


def note_to_midi(note: str) -> Optional[int]:
    """Convert note name (for example `G#3`) to a MIDI note number."""
    match = re.match(r"^([A-G]#?)(-?\d+)$", note)
    if not match:
        return None

    pitch_class, octave = match.groups()
    pitch_index = NOTE_NAMES.index(pitch_class)
    return (int(octave) + 1) * 12 + pitch_index


def midi_to_note(midi: int) -> str:
    """Reverse conversion for debugging/tests."""
    pitch = NOTE_NAMES[midi % 12]
    octave = midi // 12 - 1
    return f"{pitch}{octave}"


def find_tab_positions(note: str, *, max_fret: int = 20) -> List[TAB_POSITION]:
    """Find all playable string/fret positions for a note."""
    target_midi = note_to_midi(note)
    if target_midi is None:
        return []

    positions: List[TAB_POSITION] = []
    for string_num, open_note in STANDARD_TUNING.items():
        open_midi = note_to_midi(open_note)
        if open_midi is None:
            continue
        fret = target_midi - open_midi
        if 0 <= fret <= max_fret:
            positions.append((string_num, fret))
    return positions


def choose_best_position(
    positions: Sequence[TAB_POSITION],
    previous_position: Optional[TAB_POSITION] = None,
) -> Optional[TAB_POSITION]:
    """Pick a position that balances low fret usage and playability."""
    if not positions:
        return None

    def score(position: TAB_POSITION) -> float:
        string_num, fret = position
        score_value = fret * 1.4

        # Slightly prefer middle strings for melodic passages.
        score_value += abs(string_num - 3.5) * 0.4

        if previous_position is not None:
            prev_string, prev_fret = previous_position
            score_value += abs(prev_string - string_num) * 0.8
            score_value += abs(prev_fret - fret) * 0.25

        return score_value

    return min(positions, key=score)


if __name__ == "__main__":
    demo_notes = ["E4", "G#3", "A3", "C#4", "F#4"]
    last = None
    for note_name in demo_notes:
        pos = choose_best_position(find_tab_positions(note_name), last)
        last = pos or last
        print(f"{note_name} -> {pos}")
