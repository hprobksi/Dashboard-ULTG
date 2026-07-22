with open('dashboard-ui/src/App.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "</article>" in line and lines[i+1].strip() == ");" and lines[i+2].strip() == "})" and lines[i+3].strip() == ") : (":
        lines[i+2] = "                        })}\n                          </div>\n                        </div>\n                      ))\n"
        break

with open('dashboard-ui/src/App.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
