// ------------------------------
// apLAT - Addon público Stremio con Real-Debrid
// ------------------------------

const express = require("express");
const { addonBuilder } = require("stremio-addon-sdk");
const fetch = require("node-fetch");

const app = express();

// 🔑 API KEY Real-Debrid
const RD_API_KEY = "BMN5XVDCC3R2XSHG6IBWZ5O64BPCOUI44VZGSRAW2E7QSWXLCD7Q";

// ------------------------------
// 🔧 MANIFESTO
// ------------------------------
const manifest = {
  id: "org.aplat",
  version: "1.0.1",
  name: "apLAT RD",
  description: "Add-on público con tus archivos Real-Debrid",
  resources: ["catalog", "stream"],
  types: ["movie"],
  catalogs: [
    {
      type: "movie",
      id: "aplat-catalog",
      name: "Catálogo Real-Debrid",
      extra: [{ name: "search" }],
    },
  ],
};

const builder = new addonBuilder(manifest);

// ------------------------------
// 🎬 HANDLER: Catálogo
// ------------------------------
builder.defineCatalogHandler(async () => {
  try {
    const response = await fetch("https://api.real-debrid.com/rest/1.0/downloads", {
      headers: { Authorization: `Bearer ${RD_API_KEY}` },
    });

    if (!response.ok) throw new Error("No se pudo conectar con la API de Real-Debrid");

    const downloads = await response.json();

    const metas = downloads.map((item, index) => ({
      id: `rd_${index}`,
      type: "movie",
      name: item.filename || "Película sin título",
      poster: "https://i.imgur.com/6M7GZ4r.png",
      description: item.download || "Archivo disponible desde Real-Debrid",
    }));

    console.log(`✅ Catálogo cargado con ${metas.length} archivos`);
    return { metas };
  } catch (err) {
    console.error("❌ Error cargando catálogo:", err);
    return { metas: [] };
  }
});

// ------------------------------
// 📺 HANDLER: Streams
// ------------------------------
builder.defineStreamHandler(async ({ id }) => {
  try {
    const response = await fetch("https://api.real-debrid.com/rest/1.0/downloads", {
      headers: { Authorization: `Bearer ${RD_API_KEY}` },
    });

    if (!response.ok) throw new Error("Error accediendo a Real-Debrid");

    const downloads = await response.json();
    const index = parseInt(id.replace("rd_", ""));
    const movie = downloads[index];

    if (!movie) return { streams: [] };

    return {
      streams: [
        {
          title: movie.filename || "Reproducir desde Real-Debrid",
          url: movie.download,
        },
      ],
    };
  } catch (err) {
    console.error("❌ Error obteniendo stream:", err);
    return { streams: [] };
  }
});

// ------------------------------
// 🚀 EXPRESS SERVER PARA RENDER
// ------------------------------
app.get("/", (_, res) => res.redirect("/manifest.json"));
app.get("/manifest.json", (_, res) => res.json(manifest));
app.use("/", builder.getInterface());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 apLAT RD corriendo en el puerto ${PORT}`);
});
