import express from "express";
import { addonBuilder } from "stremio-addon-sdk";

const manifest = {
  id: "org.aplat",
  version: "1.0.0",
  name: "apLAT",
  description: "Addon público con películas Real Debrid",
  resources: ["catalog", "stream"],
  types: ["movie"],
  catalogs: [
    {
      type: "movie",
      id: "aplat_catalog",
      name: "Películas RD Públicas"
    }
  ]
};

const builder = new addonBuilder(manifest);

// Catálogo de ejemplo (puedes agregar más)
builder.defineCatalogHandler(() => {
  return Promise.resolve({
    metas: [
      {
        id: "tt0110912",
        type: "movie",
        name: "Pulp Fiction",
        poster: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/dM2w364MScsjFf8pfMbaWUcWrR.jpg"
      },
      {
        id: "tt0133093",
        type: "movie",
        name: "The Matrix",
        poster: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
      }
    ]
  });
});

// Stream de ejemplo
builder.defineStreamHandler(({ id }) => {
  return Promise.resolve({
    streams: [
      {
        title: "Real Debrid Stream",
        url: "https://realdebrid-link-aqui.m3u8"
      }
    ]
  });
});

const app = express();

// Servir el manifest.json
app.get("/manifest.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(builder.getManifest());
});

// Manejar las rutas de catálogo y streams
app.get("/:type/:id.json", (req, res) => {
  builder.run(req, res);
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`🔥 apLAT corriendo en el puerto ${port}`);
});
