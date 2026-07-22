import re

with open('dashboard-ui/src/App.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "ar-device-grid" in line and "pqm-device-grid" in line:
        pass

# Wait, let's just find the syntax error.
# Around line 3791 it is }) but it should be })} </div> </div> )) because we have nested maps!

with open('dashboard-ui/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('''                            </article>
                        );
                      })
                    ) : (''', '''                            </article>
                            );
                            })}
                          </div>
                        </div>
                      ))
                    ) : (''')

with open('dashboard-ui/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Attempted fix")
