// ------------------------------
// apLAT - Addon público Stremio con Real-Debrid
// ------------------------------

const { addonBuilder } = require('stremio-addon-sdk');
const fetch = require('node-fetch');

// 🔑 API KEY Real-Debrid (no la compartas públicamente)
const RD_API_KEY = 'BMN5XVDCC3R2XSHG6IBWZ5O64BPCOUI44VZGSRAW2E7QSWXLCD7Q';

// ------------------------------
// 🔧 MANIFESTO
// ------------------------------
const manifest = {
  id: "org.john.realdebrid",
  version: "1.0.0",
  name: "Real Debrid Streams",
  description: "Add-on RD con enlaces premium",
  resources: ["stream"],
  types: ["movie", "series"],
  catalogs: [],
};

const builder = new addonBuilder(manifest);

// ------------------------------
// 🎬 HANDLER: Catálogo
// ------------------------------
builder.defineCatalogHandler(async () => {
  try {
    const response = await fetch('https://api.real-debrid.com/rest/1.0/downloads', {
      headers: { Authorization: `Bearer ${RD_API_KEY}` }
    });

    if (!response.ok) throw new Error('No se pudo conectar con la API de Real-Debrid');

    const downloads = await response.json();

    // Convertimos cada archivo RD a formato de película para Stremio
    const metas = downloads.map((item, index) => ({
      id: `rd_${index}`,
      type: 'movie',
      name: item.filename || 'Película sin título',
      poster: 'https://i.imgur.com/6M7GZ4r.png', // poster genérico
      description: item.download || 'Archivo disponible desde Real-Debrid'
    }));

    return { metas };
  } catch (err) {
    console.error('❌ Error cargando catálogo:', err);
    return { metas: [] };
  }
});

// ------------------------------
// 📺 HANDLER: Streams (enlaces de reproducción)
// ------------------------------
builder.defineStreamHandler(async ({ id }) => {
  try {
    const response = await fetch('https://api.real-debrid.com/rest/1.0/downloads', {
      headers: { Authorization: `Bearer ${RD_API_KEY}` }
    });

    if (!response.ok) throw new Error('Error accediendo a Real-Debrid');

    const downloads = await response.json();
    const index = parseInt(id.replace('rd_', ''));
    const movie = downloads[index];

    if (!movie) return { streams: [] };

    return {
      streams: [
        {
          title: movie.filename || 'Reproducir desde RD',
          url: movie.download
        }
      ]
    };
  } catch (err) {
    console.error('❌ Error obteniendo stream:', err);
    return { streams: [] };
  }
});

// ------------------------------
// 🚀 Exportar interfaz
// ------------------------------
module.exports = builder.getInterface();
