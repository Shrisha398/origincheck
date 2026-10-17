import io
from fpdf import FPDF  # type: ignore[reportMissingModuleSource]

class DynamicDetectionReportPDF(FPDF):

    def header(self):
        # Dark Background
        self.set_fill_color(3, 10, 22)  # #030a16
        self.rect(0, 0, 210, 297, "F")

        # Top Accent Cyan Line
        self.set_fill_color(0, 210, 211)  # #00d2d3
        self.rect(0, 0, 210, 4, "F")

        # Header Title
        self.set_font("Helvetica", "B", 18)
        self.set_text_color(255, 255, 255)
        self.cell(0, 15, "AI MEDIA DETECTION & ANALYSIS REPORT", ln=True)

        self.set_font("Helvetica", "", 10)
        self.set_text_color(143, 160, 181)
        self.cell(0, 5, "Generated automatically by Deepfake Detection Engine", ln=True)
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(143, 160, 181)
        self.cell(0, 10, f"Page {self.page_no()} | Automated Forensic Verification Report", align="C")


def create_detection_pdf_bytes(detection_results: dict) -> bytes:
    """
    Takes detection output from model and returns PDF bytes.
    """
    pdf = DynamicDetectionReportPDF()
    pdf.alias_nb_pages()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Extract info from detection results
    file_name = detection_results.get("file_name", "Unknown_Image.jpg")
    verdict = detection_results.get("verdict", "AI-Generated") # 'Authentic' or 'AI-Generated'
    confidence = detection_results.get("confidence", 0.0)      # e.g., 96.5
    analysis_details = detection_results.get("analysis", "No extra breakdown provided.")
    timestamp = detection_results.get("timestamp", "N/A")

    # --- Section 1: Summary Banner ---
    pdf.set_fill_color(13, 25, 41)
    pdf.rect(10, 38, 190, 30, "F")

    pdf.set_xy(15, 43)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(143, 160, 181)
    pdf.cell(0, 5, f"File Name: {file_name}  |  Processed At: {timestamp}", ln=True)

    # Verdict & Confidence Badges
    pdf.set_xy(15, 52)
    pdf.set_font("Helvetica", "B", 14)
    if verdict.lower() == "authentic":
        pdf.set_text_color(46, 204, 113) # Green
        pdf.cell(0, 8, f"VERDICT: REAL / AUTHENTIC ({confidence:.1f}% Confidence)", ln=True)
    else:
        pdf.set_text_color(231, 76, 60)  # Red
        pdf.cell(0, 8, f"VERDICT: AI-GENERATED DETECTED ({confidence:.1f}% Confidence)", ln=True)

    # --- Section 2: Detailed Technical Findings ---
    pdf.set_y(78)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(0, 210, 211) # Cyan
    pdf.cell(0, 8, "Forensic Model Analysis Findings", ln=True)

    # Analysis Text Box
    pdf.set_fill_color(13, 25, 41)
    pdf.rect(10, 88, 190, 60, "F")

    pdf.set_xy(15, 93)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(255, 255, 255)
    pdf.multi_cell(180, 6, analysis_details)

    # --- Section 3: Model Metrics / Scores Table ---
    pdf.set_y(158)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(0, 210, 211)
    pdf.cell(0, 8, "Layered Score Metrics", ln=True)

    # Table Headers
    pdf.set_fill_color(20, 35, 55)
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_text_color(143, 160, 181)
    pdf.cell(80, 8, " Detection Indicator", border=0, fill=True)
    pdf.cell(50, 8, " Score / Probability", border=0, fill=True)
    pdf.cell(60, 8, " Status Flag", border=0, fill=True, ln=True)

    # Rows (Extracted from model outputs)
    scores = detection_results.get("sub_scores", [
        {"name": "Spatial Noise Consistency", "score": f"{detection_results.get('spatial_score', 0)}%", "flag": "Normal" if verdict.lower() == "authentic" else "Anomaly"},
        {"name": "Frequency Spectrum Artefacts", "score": f"{detection_results.get('freq_score', 0)}%", "flag": "Normal" if verdict.lower() == "authentic" else "High Risk"},
        {"name": "Facial Alignment Mesh", "score": f"{detection_results.get('mesh_score', 0)}%", "flag": "Passed"},
    ])

    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(255, 255, 255)
    for row in scores:
        pdf.set_fill_color(13, 25, 41)
        pdf.cell(80, 7, f" {row['name']}", fill=True)
        pdf.cell(50, 7, f" {row['score']}", fill=True)
        
        if "Anomaly" in row['flag'] or "High Risk" in row['flag']:
            pdf.set_text_color(231, 76, 60)
        else:
            pdf.set_text_color(46, 204, 113)
        pdf.cell(60, 7, f" {row['flag']}", fill=True, ln=True)
        pdf.set_text_color(255, 255, 255)

    # Output PDF as byte stream
    return bytes(pdf.output())