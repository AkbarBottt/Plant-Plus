import { loadHTML } from './js/main.js';

const routes = {
  '/': 'src/pages/home.html',
  '/upload': 'src/pages/upload.html',
};

export const loadPage = async (path) => {
  const page = routes[path] || routes['/'];

  try {
    const res = await fetch(page);
    const html = await res.text();
    document.getElementById('app').innerHTML = html;

    // ⬇️ HOME ONLY
    if (path === '/') {
      loadHTML('src/layout/panduan.html', 'panduan');
    }
  } catch (err) {
    console.error(`Gagal load page ${page}:`, err);
  }
};
