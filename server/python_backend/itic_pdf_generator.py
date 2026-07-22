import os
import io
import time
import datetime
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle

def generate_itic_plot(incident, duration_seconds):
    # ITIC High curve points
    high_x = [0.0001, 0.001, 0.003, 0.5, 0.5, 100]
    high_y = [500, 200, 120, 120, 110, 110]

    # ITIC Low curve points
    low_x = [0.0001, 0.008, 0.008, 0.1, 0.1, 0.5, 0.5, 10, 10, 100]
    low_y = [0, 0, 50, 50, 70, 70, 80, 80, 90, 90]

    plt.figure(figsize=(7, 4))
    plt.xscale('log')
    plt.xlim(0.0001, 100)
    plt.ylim(0, 500)

    # Plot curves
    plt.plot(high_x, high_y, color='chocolate', linewidth=1.5, label='ITIC High')
    plt.plot(low_x, low_y, color='peru', linewidth=1.5, label='ITIC Low')

    # Plot the incident
    event_type = incident["event_type"]
    mag = incident["extreme_magnitude"]
    # Ensure duration is > 0.0001 for log scale
    dur = max(duration_seconds, 0.0001)

    if event_type == "Swell":
        color = 'red'
    elif event_type == "Sag":
        color = 'blue'
    else: # Interruption
        color = 'purple'

    plt.scatter([dur], [mag], color=color, s=20, label='Incidents')
    
    # Formatting
    plt.xlabel('Duration (s)')
    plt.ylabel('Magnitude (% Nominal)')
    
    ax = plt.gca()
    ax.spines['top'].set_color('#cccccc')
    ax.spines['right'].set_color('#cccccc')
    ax.spines['bottom'].set_color('#cccccc')
    ax.spines['left'].set_color('#cccccc')

    # Format x ticks
    ax.xaxis.set_major_formatter(ticker.FuncFormatter(lambda x, pos: f"{x:g}"))
    
    plt.legend(loc='upper center', bbox_to_anchor=(0.5, -0.15), ncol=3, frameon=False)
    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=150, bbox_inches='tight')
    plt.close()
    buf.seek(0)
    return buf

def generate_pqm_pdf_report(device, incident, duration_seconds, phase_name, waktu_selesai_ts):
    waktu_selesai_dt = datetime.datetime.fromtimestamp(waktu_selesai_ts)
    waktu_mulai_dt = datetime.datetime.fromtimestamp(incident["start_time"])
    
    waktu_selesai_str = waktu_selesai_dt.strftime("%m/%d/%Y %I:%M:%S %p")
    waktu_mulai_str = waktu_mulai_dt.strftime("%m/%d/%Y %I:%M:%S %p")
    
    # Generate filename
    timestamp_str = waktu_selesai_dt.strftime("%Y%m%d_%H%M%S")
    filename = f"PQM_Report_{device['nama_gi']}_{device['nama_bay']}_{timestamp_str}.pdf"
    filename = filename.replace(" ", "_").replace("/", "-")
    
    filepath = os.path.join(os.getcwd(), filename)
    
    # Create PDF Canvas
    c = canvas.Canvas(filepath, pagesize=A4)
    width, height = A4

    # Header
    c.setFont("Helvetica-Bold", 24)
    c.setFillColorRGB(0.1, 0.5, 0.2) # Green color similar to Schneider
    c.drawString(40, height - 50, "VoltKraft")
    
    c.setFont("Helvetica", 12)
    c.drawString(40, height - 65, "Power Quality Monitoring")
    
    c.setFont("Helvetica", 10)
    c.setFillColorRGB(0, 0, 0)
    c.drawRightString(width - 40, height - 60, "Power Quality")
    
    c.setLineWidth(1)
    c.line(40, height - 75, width - 40, height - 75)
    
    # Date Range
    c.setFont("Helvetica", 8)
    c.drawRightString(width - 40, height - 85, f"{waktu_mulai_dt.strftime('%m/%d/%Y %I:%M:%S %p')} - {waktu_selesai_str} (Server Local)")
    
    # Sources section
    c.setFillColorRGB(0.85, 0.9, 0.8) # Light green bg
    c.rect(40, height - 120, width - 80, 15, fill=1, stroke=0)
    c.setFillColorRGB(0, 0, 0)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(45, height - 116, "Sources")
    
    c.setFont("Helvetica", 9)
    c.rect(40, height - 135, width - 80, 15, fill=0, stroke=1)
    c.drawString(45, height - 131, f"{device['nama_gi']} - {device['nama_bay']}")

    # Plot
    plot_buf = generate_itic_plot(incident, duration_seconds)
    # y = height - 135 - 300 = height - 435
    import tempfile
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_img:
        tmp_img.write(plot_buf.read())
        tmp_img_name = tmp_img.name
        
    c.drawImage(tmp_img_name, 40, height - 450, width=(width-80), preserveAspectRatio=True)
    os.remove(tmp_img_name)
    
    # Worst Disturbance Table
    table_y = height - 500
    c.setFillColorRGB(0.4, 0.7, 0.4) # Darker green bg
    c.rect(40, table_y, width - 80, 15, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(45, table_y + 4, "Worst Disturbance per Incident")
    
    data = [
        ["ID", "Incident Time", "Meter", "Type", "Phase", "Duration (s)", "Magnitude (%)"],
        ["1", waktu_mulai_str, device["nama_bay"], incident["event_type"], phase_name, f"{duration_seconds:.3f}", f"{incident['extreme_magnitude']:.2f}"]
    ]
    
    t = Table(data, colWidths=[30, 110, 110, 70, 50, 70, 70])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.Color(0.85, 0.9, 0.8)),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 5),
        ('BACKGROUND', (0, 1), (-1, 1), colors.white),
        ('TEXTCOLOR', (0, 1), (-1, 1), colors.red if incident["event_type"] in ["Sag", "Interruption"] else colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
    ]))
    
    t.wrapOn(c, width, height)
    t.drawOn(c, 40, table_y - 40)
    
    # Footer
    c.setFont("Helvetica", 8)
    c.setFillColorRGB(0, 0, 0)
    c.line(40, 40, width - 40, 40)
    c.drawString(40, 30, f"Generated on: {waktu_selesai_str}")
    c.drawRightString(width - 40, 30, "Page 1 of 1")
    
    c.save()
    return filepath
