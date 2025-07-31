# ascii_tab_generator.py

# Example input format (normally you'd generate this from your audio processor)
notes_with_tabs = [
    (0.21, 3, 2),    # A3 → string 3, fret 2
    (0.42, 3, 2),
    (0.49, 1, 0),    # E4 → string 1, fret 0
    (0.72, 1, 4),    # G#4 → string 1, fret 4
    (0.88, 3, 1),
    (0.95, 1, 0),
    (1.09, 4, 1),
    (1.21, 2, 0),
    (2.93, 1, 5),    # A4 → string 1, fret 5
]

# Create 6 strings (string 1 = high e at the top)
tab_lines = {
    1: "e|",
    2: "B|",
    3: "G|",
    4: "D|",
    5: "A|",
    6: "E|"
}

# Build output as fixed-width segments (e.g., 3 spaces per note time slot)
slot_width = 3

# Sort notes chronologically
notes_with_tabs.sort(key=lambda x: x[0])

# Add fret numbers to each string line
for _, string_num, fret in notes_with_tabs:
    for s in range(1, 7):
        if s == string_num:
            tab_lines[s] += f"{fret}".ljust(slot_width, '-')
        else:
            tab_lines[s] += '-' * slot_width

# Print tab from string 1 (high e) to 6 (low E)
print("🎸 ASCII Tab Output:\n")
for s in range(1, 7):
    print(tab_lines[s])
