# ascii_tab_generator.py
# Generates ASCII tab from a list of (time, string, fret) tuples
def generate_ascii_tab(notes_with_tabs):
    tab_lines = {
        1: "e|",
        2: "B|",
        3: "G|",
        4: "D|",
        5: "A|",
        6: "E|"
    }

    slot_width = 3
    notes_with_tabs.sort(key=lambda x: x[0])

    for _, string_num, fret in notes_with_tabs:
        for s in range(1, 7):
            if s == string_num:
                tab_lines[s] += f"{fret}".ljust(slot_width, '-')
            else:
                tab_lines[s] += '-' * slot_width

    output = "🎸 ASCII Tab Output:\n\n"
    for s in range(1, 7):
        output += tab_lines[s] + "\n"
    
    return output

