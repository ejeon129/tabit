# ascii_tab_generator.py
# Formats those strings/fret values into visual tab

from audio_processor import generate_tab_notes

# Get real notes from audio analysis
notes_with_tabs = generate_tab_notes()

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
