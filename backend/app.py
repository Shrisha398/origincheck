from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import datetime
from importlib import import_module

# Load fpdf dynamically so environments without installed type/source metadata
# do not report a static import-resolution error.
FPDF = import_module("fpdf").FPDF

app = Flask(__name__)
CORS(app)

# Load the trained model
#model = tf.keras.models.load_model("model.h5")
#print("Model loaded successfully!")


# ====================================================================
# FPDF2 Class: Customized PDF layout styled after OriginCheck
# ====================================================================
class VerificationReportPDF(FPDF):

    def header(self):
        # Dark Background (#030a16)
        self.set_fill_color(3, 10, 22)
        self.rect(0, 0, 210, 297, "F")

        # Top Accent Cyan Line (#00bcd4)
        self.set_fill_color(0, 188, 212)
        self.rect(0, 0, 210, 4, "F")

        # Title
        self.set_font("Helvetica", "B", 18)
        self.set_text_color(255, 255, 255)
        self.cell(0, 12, "ORIGINCHECK VERIFICATION REPORT", ln=True)

        self.set_font("Helvetica", "", 10)
        self.set_text_color(127, 151, 180)  # #7f97b4
        self.cell(0, 5, "Automated AI Model Inference & Deepfake Detection", ln=True)
        self.ln(8)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(127, 151, 180)
        self.cell(
            0,
            10,
            f"Page {self.page_no()} | Confidential Forensic Analysis",
            align="C",
        )


def build_pdf_bytes(report_data):
    filename = report_data.get("filename", "Unknown File")
    file_type = report_data.get("type", "N/A")
    result = report_data.get("result", {})

    label = result.get("label", "N/A")
    status = result.get("status", "N/A")
    confidence = result.get("confidence", 0.0)
    raw_score = result.get("raw_score", 0.0)
    frames_analyzed = result.get("frames_analyzed", 1)
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")

    pdf = VerificationReportPDF()
    pdf.alias_nb_pages()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # ---------------------------------------------------------
    # Card 1: File Information Header
    # ---------------------------------------------------------
    pdf.set_fill_color(6, 18, 36)  # #061224
    pdf.rect(10, 35, 190, 25, "F")

    pdf.set_xy(15, 39)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(0, 188, 212)  # #00bcd4
    pdf.cell(0, 5, f"File Name: {filename}", ln=True)

    pdf.set_xy(15, 47)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(127, 151, 180)
    pdf.cell(0, 5, f"Content Type: {file_type}   |   Analyzed At: {timestamp}", ln=True)

    # ---------------------------------------------------------
    # Card 2: Main Result & Verdict Banner
    # ---------------------------------------------------------
    pdf.set_fill_color(6, 18, 36)
    pdf.rect(10, 65, 190, 35, "F")

    pdf.set_xy(15, 70)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(127, 151, 180)
    pdf.cell(0, 5, "VERIFICATION VERDICT", ln=True)

    pdf.set_xy(15, 78)
    pdf.set_font("Helvetica", "B", 16)
    if status == "PASS":
        pdf.set_text_color(74, 222, 128)  # Green text
        pdf.cell(100, 8, f"STATUS: PASS ({label})")
    else:
        pdf.set_text_color(248, 113, 113)  # Red text
        pdf.cell(100, 8, f"STATUS: FAIL ({label})")

    # Status Badge
    pdf.set_xy(155, 78)
    if status == "PASS":
        pdf.set_fill_color(34, 197, 94)
        pdf.set_text_color(255, 255, 255)
    else:
        pdf.set_fill_color(239, 68, 68)
        pdf.set_text_color(255, 255, 255)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(40, 7, f" {status} ", fill=True, align="C")

    # ---------------------------------------------------------
    # Card 3: Model Technical Metrics
    # ---------------------------------------------------------
    pdf.set_y(110)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(0, 188, 212)
    pdf.cell(0, 8, "Model Technical Performance Details", ln=True)

    # Table Header
    pdf.set_fill_color(10, 29, 54)  # #0a1d36
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_text_color(127, 151, 180)
    pdf.cell(90, 8, " Metric", border=0, fill=True)
    pdf.cell(100, 8, " Output Value", border=0, fill=True, ln=True)

    # Rows
    metrics = [
        ("AI Model Confidence", f"{confidence}%"),
        ("Raw Classification Output", f"{raw_score}"),
        ("Classification Label", f"{label}"),
        ("Frames Analyzed", f"{frames_analyzed} frame(s)"),
    ]

    pdf.set_font("Helvetica", "", 9)
    for metric, value in metrics:
        pdf.set_fill_color(6, 18, 36)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(90, 7, f" {metric}", fill=True)
        pdf.set_text_color(0, 188, 212)
        pdf.cell(100, 7, f" {value}", fill=True, ln=True)

    return bytes(pdf.output())


# ====================================================================
# PREDICT ENDPOINT
# ====================================================================
"""@app.route("/predict", methods=["POST"])
def predict():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        image = Image.open(io.BytesIO(file.read()))
        image = image.convert("RGB")
        image = image.resize((224, 224))
        image = np.array(image)
        image = image / 255.0
        image = np.expand_dims(image, axis=0)

        prediction = float(model.predict(image, verbose=0)[0][0])

        if prediction >= 0.5:
            label = "REAL IMAGE"
            confidence = prediction * 100
            status = "PASS"
        else:
            label = "FAKE IMAGE"
            confidence = (1 - prediction) * 100
            status = "FAIL"

        return jsonify(
            {
                "filename": file.filename,
                "type": file.content_type,
                "result": {
                    "label": label,
                    "status": status,
                    "confidence": round(confidence, 2),
                    "raw_score": round(prediction, 4),
                    "frames_analyzed": 1,
                },
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500"""

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    # Mock data returned immediately without using TensorFlow model
    return jsonify({
        "filename": file.filename,
        "type": file.content_type,
        "result": {
            "label": "FAKE IMAGE",
            "status": "FAIL",
            "confidence": 94.52,
            "raw_score": 0.0548,
            "frames_analyzed": 1
        }
    })

# ====================================================================
# NEW PDF GENERATION ENDPOINT
# ====================================================================
@app.route("/generate-pdf", methods=["POST"])
def generate_pdf():
    try:
        report_data = request.get_json()

        if not report_data:
            return jsonify({"error": "No report payload provided"}), 400

        pdf_bytes = build_pdf_bytes(report_data)

        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype="application/pdf",
            as_attachment=True,
            download_name=f"Report_{report_data.get('filename', 'Verification')}.pdf",
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)