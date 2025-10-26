// apLAT/index.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// --- MANEJO SEGURO DEL TOKEN ---
const RD_TOKEN = process.env.RD_TOKEN; // <-- Lo guardas tú en Render > Environment

// --- MANIFIESTO STREMIO ---
const manifest = {
  id: "org.aplat",
  version: "1.0.0",
  name: "apLAT",
  description: "Catálogo de películas enlazadas con Real-Debrid",
  types: ["movie"],
  catalogs: [
    {
      type: "movie",
      id: "aplat_catalog",
      name: "apLAT Movies",
      extra: [{ name: "search" }],
    },
  ],
  resources: ["catalog", "stream"],
};

// --- MANIFEST ENDPOINT ---
app.get("/manifest.json", (req, res) => res.json(manifest));

// --- CATALOGO ---
app.get("/catalog/:type/:id.json", async (req, res) => {
  try {
    // Aquí podrías poner tus propias películas base o listarlas desde tu fuente
    const catalog = [
      {
        id: "movie1",
        name: "Ejemplo RD Movie",
        poster: "https://i.imgur.com/OdL0XPt.jpg",
        description: "Película conectada con Real-Debrid",
      },
    ];
    res.json({ metas: catalog });
  } catch (err) {
    console.error(err);
    res.json({ metas: [] });
  }
});

// --- STREAMS ---
app.get("/stream/:type/:id.json", async (req, res) => {
  try {
    // Este sería el punto donde tú usas la API de RD para obtener el enlace del archivo
    const rdResponse = await fetch("https://api.real-debrid.com/rest/1.0/user", {
      headers: { Authorization: `Bearer ${RD_TOKEN}` },
    });
    const data = await rdResponse.json();

    const streams = [
      {
        name: "Real-Debrid",
        description: `Enlace RD activo para ${data.username || "usuario"}`,
        url: "https://example.com/movie.mp4", // aquí tú colocarías el enlace que RD devuelva
      },
    ];

    res.json({ streams });
  } catch (err) {
    console.error(err);
    res.json({ streams: [] });
  }
});

// --- INICIO ---
app.listen(PORT, () => {
  console.log(`✅ apLAT corriendo en el puerto ${PORT}`);
});
