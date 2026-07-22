import re

def extract_block(file_path, start_pattern, end_char='}'):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(start_pattern, content)
    if not match:
        return "Not found"
    
    start_idx = match.start()
    
    # Simple bracket matcher
    open_brackets = 0
    in_block = False
    
    for i in range(start_idx, len(content)):
        if content[i] == '{' or content[i] == '(':
            open_brackets += 1
            in_block = True
        elif content[i] == '}' or content[i] == ')':
            open_brackets -= 1
        
        if in_block and open_brackets == 0:
            return content[start_idx:i+1]
            
    return "Failed to match brackets"

# Extract DC UI
dc_ui = extract_block(r"C:\Users\rhard\Documents\DC_Monitoring\dashboard-ui\src\App.jsx", r"\{activeMenu === 'dc' && \(")
with open(r"C:\Users\rhard\Documents\DASHBOARD_AI\scratch\dc_ui.jsx", 'w', encoding='utf-8') as f:
    f.write(dc_ui)

# Extract fetch functions
with open(r"C:\Users\rhard\Documents\DC_Monitoring\dashboard-ui\src\App.jsx", 'r', encoding='utf-8') as f:
    content = f.read()
    
fetch_funcs = re.findall(r"const fetch[a-zA-Z0-9_]* = async.*?}", content, flags=re.DOTALL)
with open(r"C:\Users\rhard\Documents\DASHBOARD_AI\scratch\fetch_funcs.js", 'w', encoding='utf-8') as f:
    f.write("\n\n".join(fetch_funcs[:10]))  # Just get the first 10 for now
