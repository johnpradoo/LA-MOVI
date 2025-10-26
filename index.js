const express = require("express");
const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
  id: "org.aplat",
  version: "1.0.0",
  name: "apLAT",
  description: "Addon público de películas apLAT",
  resources: ["catalog", "stream"],
  types: ["movie"],
  catalogs: [
    {
      type: "movie",
      id: "aplat_catalog",
      name: "Películas apLAT"
    }
  ]
};

const builder = new addonBuilder(manifest);

// Catálogo público de prueba
builder.defineCatalogHandler(() => {
  return Promise.resolve({
    metas: [
      {
        id: "tt0111161",
        type: "movie",
        name: "The Shawshank Redemption",
        poster: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
      },
      {
        id: "tt0068646",
        type: "movie",
        name: "The Godfather",
        poster: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"
      },
      {
        id: "tt0468569",
        type: "movie",
        name: "The Dark Knight",
        poster: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
      }
    ]
  });
});

// Streams de prueba
builder.defineStreamHandler(({ id }) => {
  return Promise.resolve({
    streams: [
      {
        title: "Stream público de prueba",
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      }
    ]
  });
});

const app = express();

// manifest.json
app.get("/manifest.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(builder.getManifest());
});

// rutas de catálogo y streams
app.get("/:resource/:type/:id.json", (req, res) => {
  builder.run(req, res);
});

// puerto dinámico (Render usa process.env.PORT)
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`✅ apLAT corriendo en el puerto ${port}`);
});
