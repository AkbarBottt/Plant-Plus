// ===============================
// main.js → bootstrap aplikasi
// ===============================

export const loadHTML = async (url, containerId) => {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = html;
  } catch (err) {
    console.error(`Gagal load ${url}:`, err);
  }
};

// Load layout GLOBAL
loadHTML('src/layout/navbar.html', 'navbar');
loadHTML('src/layout/footer.html', 'footer');

// ===============================
// Routing
// ===============================
import { loadPage } from '../app.js';
loadPage(window.location.pathname);

// Navigation SPA
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-link]');
  if (link) {
    e.preventDefault();
    history.pushState(null, null, link.getAttribute('href'));
    loadPage(window.location.pathname);
  }
});

window.addEventListener('popstate', () => {
  loadPage(window.location.pathname);
});

// ===============================
// UPLOAD + FETCH KE FLASK
// ===============================

document.addEventListener('click', async (e) => {
  if (e.target.id !== 'uploadBtn') return;

  const input = document.getElementById('imageInput');
  const resultDiv = document.getElementById('result');

  if (!input || !input.files.length) {
    alert('Pilih gambar dulu');
    return;
  }

  const file = input.files[0];

  const formData = new FormData();
  formData.append('image', file);

  resultDiv.innerHTML = '⏳ Mengirim ke server...';

  try {
    const res = await fetch('/api/predict', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    resultDiv.innerHTML = `
      <div class="p-4 bg-green-50 rounded-xl">
        <p><b>Penyakit:</b> ${data.disease}</p>
        <p><b>Confidence:</b> ${(data.confidence * 100).toFixed(2)}%</p>
      </div>
    `;
  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = '❌ Gagal koneksi ke server';
  }
});

// buka file dialog
document.addEventListener('click', (e) => {
  if (e.target.id === 'uploadBtn') {
    document.getElementById('imageInput').click();
  }
});
