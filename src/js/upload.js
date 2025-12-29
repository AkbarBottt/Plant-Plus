// src/js/upload.js

document.addEventListener('DOMContentLoaded', () => {
  const imageInput = document.getElementById('imageInput');
  const resultDiv = document.getElementById('result');

  if (!imageInput) {
    console.error('imageInput tidak ditemukan');
    return;
  }

  imageInput.addEventListener('change', async () => {
    const file = imageInput.files[0];
    if (!file) return;

    // TAMPILKAN STATUS
    resultDiv.innerHTML = `
      <p class="text-sm text-gray-500 text-center">⏳ Memproses gambar...</p>
    `;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === 'success') {
        resultDiv.innerHTML = `
          <div class="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
            <p class="text-lg font-bold text-green-700">
              🌿 ${data.disease}
            </p>
            <p class="text-sm text-gray-600">
              Confidence: ${(data.confidence * 100).toFixed(2)}%
            </p>
          </div>
        `;
      } else {
        resultDiv.innerHTML = `
          <p class="text-red-600 text-sm">${
            data.message || 'Gagal memproses gambar'
          }</p>
        `;
      }
    } catch (err) {
      console.error(err);
      resultDiv.innerHTML = `
        <p class="text-red-600 text-sm">❌ Tidak bisa terhubung ke server</p>
      `;
    }
  });
});
