const express = require('express');
const { addonBuilder } = require('stremio-addon-sdk');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const manifest = {
    id: 'org.aplat',
    version: '1.0.0',
    name: 'apLAT',
    description: 'Addon público con soporte Real-Debrid',
    types: ['movie'],
    catalogs: [
        {
            type: 'movie',
            id: 'aplat_catalog',
            name: 'apLAT Películas',
            extra: [{ name: 'search', isRequired: false }]
        }
    ],
    resources: ['catalog', 'stream']
};

const builder = new addonBuilder(manifest);

// Catálogo de ejemplo
builder.defineCatalogHandler(async () => ({
    metas: [
        {
            id: 'tt4154796',
            type: 'movie',
            name: 'Avengers: Endgame',
            poster: 'https://m.media-amazon.com/images/M/MV5BMjMxNjY2NzY4NF5BMl5BanBnXkFtZTgwMzYzMDA5NzM@._V1_.jpg'
        }
    ]
}));

// Integración básica Real-Debrid
builder.defineStreamHandler(async ({ id }) => {
    const apiKey = 'BMN5XVDCC3R2XSHG6IBWZ5O64BPCOUI44VZGSRAW2E7QSWXLCD7Q';
    try {
        const res = await fetch('https://api.real-debrid.com/rest/1.0/torrents', {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        const data = await res.json();

        // Verifica si la respuesta es válida
        if (!Array.isArray(data)) {
            console.log('⚠️ Respuesta inesperada de RD:', data);
            return { streams: [] };
        }

        const streams = data.slice(0, 3).map(item => ({
            title: item.filename || 'Archivo RD',
            url: 'https://example.com'
        }));

        return { streams };
    } catch (err) {
        console.error('❌ Error en RD:', err);
        return { streams: [] };
    }
});

const app = express();
const addonInterface = builder.getInterface();

// CORRECCIÓN CLAVE 🔧
app.use('/', addonInterface.getRouter());

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ apLAT con RD corriendo en puerto ${PORT}`));
