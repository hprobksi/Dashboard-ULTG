import sys
import os

pdf_path = r'C:\Users\rhard\Documents\DASHBOARD_AI\Jadwal Pekerjaan R NR Juli.pdf'
print("File exists:", os.path.exists(pdf_path))
print("File size:", os.path.getsize(pdf_path))

# Try importing common pdf libraries
for mod in ['pypdf', 'PyPDF2', 'fitz', 'pdfplumber', 'pdfminer']:
    try:
        __import__(mod)
        print(f"Library available: {mod}")
    except ImportError:
        pass
