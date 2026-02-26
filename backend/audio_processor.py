"""Audio transcription utilities for mapping clips to guitar tab notes."""

from __future__ import annotations

from dataclasses import dataclass
from typing import List, Optional, Tuple

import librosa
import numpy as np

from pitch_to_tab import choose_best_position, find_tab_positions


NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
TAB_EVENT = Tuple[float, int, int, str]


@dataclass
class TranscriptionResult:
    """Structured output used by the API layer."""

    duration_sec: float
    sample_rate: int
    notes: List[TAB_EVENT]


def freq_to_note(freq: float) -> Optional[str]:
    if freq <= 0:
        return None
    note_num = int(round(12 * np.log2(freq / 440.0))) + 69
    note = NOTE_NAMES[note_num % 12]
    octave = note_num // 12 - 1
    return f"{note}{octave}"


def _extract_candidate_notes(y: np.ndarray, sr: int) -> List[Tuple[float, float]]:
    """Estimate one pitch per onset using robust segment medians."""
    hop_length = 256
    frame_length = 2048

    onsets = librosa.onset.onset_detect(
        y=y,
        sr=sr,
        hop_length=hop_length,
        backtrack=True,
        pre_max=10,
        post_max=10,
        pre_avg=20,
        post_avg=20,
        delta=0.2,
        wait=3,
    )

    if len(onsets) == 0:
        return []

    f0 = librosa.yin(
        y,
        fmin=librosa.note_to_hz("E2"),
        fmax=librosa.note_to_hz("E6"),
        sr=sr,
        frame_length=frame_length,
        hop_length=hop_length,
    )

    candidates: List[Tuple[float, float]] = []
    for idx, onset_frame in enumerate(onsets):
        next_frame = onsets[idx + 1] if idx + 1 < len(onsets) else len(f0)
        segment = f0[onset_frame:next_frame]
        valid_segment = segment[np.isfinite(segment)]
        if valid_segment.size == 0:
            continue

        freq = float(np.median(valid_segment))
        if not (82.0 <= freq <= 1320.0):
            continue

        onset_time = float(librosa.frames_to_time(onset_frame, sr=sr, hop_length=hop_length))
        candidates.append((onset_time, freq))

    return candidates


def _remove_duplicate_notes(events: List[TAB_EVENT], min_spacing_sec: float = 0.08) -> List[TAB_EVENT]:
    if not events:
        return []

    deduped: List[TAB_EVENT] = [events[0]]
    for event in events[1:]:
        last_event = deduped[-1]
        same_pitch = event[3] == last_event[3]
        too_close = (event[0] - last_event[0]) < min_spacing_sec
        if same_pitch and too_close:
            continue
        deduped.append(event)
    return deduped


def transcribe_audio_to_tab(filename: str) -> TranscriptionResult:
    y, sr = librosa.load(filename, sr=22050, mono=True)
    duration_sec = float(librosa.get_duration(y=y, sr=sr))

    detected = _extract_candidate_notes(y, sr)

    notes: List[TAB_EVENT] = []
    previous_position = None
    for time_sec, freq in detected:
        note_name = freq_to_note(freq)
        if note_name is None:
            continue

        positions = find_tab_positions(note_name)
        best_position = choose_best_position(positions, previous_position)
        if best_position is None:
            continue

        string_num, fret = best_position
        notes.append((time_sec, string_num, fret, note_name))
        previous_position = best_position

    notes = _remove_duplicate_notes(notes)
    return TranscriptionResult(duration_sec=duration_sec, sample_rate=sr, notes=notes)


def generate_tab_notes(filename: str) -> List[TAB_EVENT]:
    """Backward-compatible helper retained for older call sites."""
    return transcribe_audio_to_tab(filename).notes

