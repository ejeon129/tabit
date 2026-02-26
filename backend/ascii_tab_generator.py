"""Generate readable ASCII tab from transcribed note events."""

from __future__ import annotations

from typing import Iterable, Sequence, Tuple


def _normalize_event(event: Sequence) -> Tuple[float, int, int]:
    if len(event) < 3:
        raise ValueError("Tab event must include at least (time, string, fret)")
    return float(event[0]), int(event[1]), int(event[2])


def generate_ascii_tab(
    notes_with_tabs: Iterable[Sequence],
    *,
    units_per_second: int = 8,
    min_gap_units: int = 2,
    max_gap_units: int = 14,
) -> str:
    tab_lines = {1: "e|", 2: "B|", 3: "G|", 4: "D|", 5: "A|", 6: "E|"}
    events = sorted((_normalize_event(event) for event in notes_with_tabs), key=lambda x: x[0])

    if not events:
        return "\n".join(tab_lines[s] for s in range(1, 7))

    last_time = events[0][0]
    for time_sec, string_num, fret in events:
        delta_sec = max(0.0, time_sec - last_time)
        gap_units = int(round(delta_sec * units_per_second))
        gap_units = max(min_gap_units, min(max_gap_units, gap_units))

        for s in range(1, 7):
            tab_lines[s] += "-" * gap_units

        fret_text = str(fret)
        note_width = max(1, len(fret_text))
        for s in range(1, 7):
            if s == string_num:
                tab_lines[s] += fret_text
            else:
                tab_lines[s] += "-" * note_width

        # Separator after each note to keep columns readable.
        for s in range(1, 7):
            tab_lines[s] += "-"

        last_time = time_sec

    return "\n".join(tab_lines[s] for s in range(1, 7))
