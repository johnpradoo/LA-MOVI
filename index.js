import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;
const RD_TOKEN = process.env.RD_TOKEN;

// Manifesto del addon
const manifest = {
  id: "org.aplat.rd",
  version: "1.0.0",
  name: "apLAT - RD Movies",
  description: "Películas conectadas directamente desde tu cuenta Real-Debrid",
  resources: ["catalog", "stream"],
  types: ["movie"],
  idPrefixes: ["aplatrd_"],
  catalogs: [
    {
      type: "movie",
      id: "aplat_rd_movies",
      name: "Tus películas de RD",
    },
  ],
};

// Endpoint del manifest
app.get("/manifest.json", (req, res) => {
  res.send(manifest);
});

// Endpoint del catálogo
app.get("/catalog/movie/aplat_rd_movies.json", async (req, res) => {
  try {
    const response = await fetch("https://api.real-debrid.com/rest/1.0/downloads", {
      headers: { Authorization: `Bearer ${RD_TOKEN}` },
    });
    const data = await response.json();

    // Filtrar solo películas (extensiones de video)
    const movies = data
      .filter((item) =>
        item.filename.match(/\.(mp4|mkv|avi|mov)$/i)
      )
      .map((item) => ({
        id: "aplatrd_" + item.id,
        name: item.filename,
        type: "movie",
        poster: "https://i.imgur.com/Jn8zKpT.png",
        description: "Película disponible desde tu Real-Debrid",
      }));

    res.send({ metas: movies });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error al conectar con Real-Debrid" });
  }
});

// Endpoint para obtener el stream
app.get("/stream/movie/:id.json", async (req, res) => {
  const movieId = req.params.id.replace("aplatrd_", "");
  try {
    const response = await fetch(`https://api.real-debrid.com/rest/1.0/downloads/${movieId}`, {
      headers: { Authorization: `Bearer ${RD_TOKEN}` },
    });
    const info = await response.json();

    res.send({
      streams: [
        {
          title: "Ver desde Real-Debrid",
          url: info.download,
        },
      ],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error al obtener el stream" });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 apLAT corriendo en el puerto ${PORT}`);
});
