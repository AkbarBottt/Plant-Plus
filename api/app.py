# api/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from predict_image import predict_and_return

# ===============================
# Inisialisasi Flask
# ===============================
app = Flask(__name__)
CORS(app)

# ===============================
# Konfigurasi Upload
# ===============================
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# ===============================
# Route API
# ===============================
@app.route("/api/app", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "Tidak ada file yang dikirim"}), 400

    file = request.files["image"]
    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"error": "File tidak valid"}), 400

    try:
        # Buat nama file unik
        ext = file.filename.rsplit(".", 1)[1].lower()
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        # Prediksi gambar
        result = predict_and_return(filepath)

        # Hapus file setelah diproses
        os.remove(filepath)

        return jsonify({
            "status": "success",
            "disease": result["disease"],
            "confidence": result["confidence"]
        })

    except Exception as e:
        return jsonify({"status":"error","message":str(e)}), 500
