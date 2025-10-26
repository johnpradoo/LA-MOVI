// ------------------------------
// apLAT - Base funcional para Stremio
// ------------------------------

const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

// ------------------------------
// 🔧 MANIFESTO
// ------------------------------
const manifest = {
  id: "org.aplat",
  version: "1.0.0",
  name: "apLAT Base",
  description: "Versión base funcional del addon apLAT para Stremio",
  resources: ["catalog", "stream"],
  types: ["movie"],
  catalogs: [
    {
      type: "movie",
      id: "aplat-catalog",
      name: "Catálogo de Prueba apLAT",
    },
  ],
};

// ------------------------------
// 🧱 Builder
// ------------------------------
const builder = new addonBuilder(manifest);

// ------------------------------
// 🎬 HANDLER: Catálogo de prueba
// ------------------------------
builder.defineCatalogHandler(() => {
  const metas = [
    {
      id: "aplat_001",
      type: "movie",
      name: "Película de prueba apLAT",
      poster: "https://i.imgur.com/6M7GZ4r.png",
      description: "Si ves esta película aquí, el addon está funcionando correctamente.",
    },
  ];
  return Promise.resolve({ metas });
});

// ------------------------------
// 📺 HANDLER: Stream de prueba
// ------------------------------
builder.defineStreamHandler(({ id }) => {
  if (id === "aplat_001") {
    return Promise.resolve({
      streams: [
        {
          title: "Stream de prueba apLAT",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        },
      ],
    });
  }
  return Promise.resolve({ streams: [] });
});

// ------------------------------
// 🚀 SERVIDOR HTTP
// ------------------------------
serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });

console.log("✅ apLAT Base corriendo correctamente");
