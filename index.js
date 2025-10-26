const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const manifest = {
  id: "org.aplat.movies",
  version: "1.0.0",
  name: "apLAT",
  description: "Add-on de películas LAT creado por John",
  types: ["movie"],
  resources: ["catalog", "stream"],
  idPrefixes: ["tt"],
  catalogs: [
    {
      type: "movie",
      id: "aplatCatalog",
      name: "Catálogo apLAT",
      extra: [{ name: "search" }]
    }
  ]
};

const builder = new addonBuilder(manifest);

const catalog = [
  {
    id: "tt0111161",
    type: "movie",
    name: "Sueños de libertad (The Shawshank Redemption)",
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    description: "Un hombre es encarcelado injustamente y lucha por su libertad con esperanza."
  },
  {
    id: "tt1375666",
    type: "movie",
    name: "El origen (Inception)",
    poster: "https://image.tmdb.org/t/p/w500/aej3LRUga5rhgkmRP6XmuWzK6vR.jpg",
    description: "Un ladrón que roba secretos del subconsciente debe cumplir la misión imposible de implantar una idea."
  },
  {
    id: "tt0816692",
    type: "movie",
    name: "Interestelar (Interstellar)",
    poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    description: "Un grupo de exploradores viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad."
  }
];

builder.defineCatalogHandler(({ type, id, extra }) => {
  if (type === "movie" && id === "aplatCatalog") {
    if (extra && extra.search) {
      const search = extra.search.toLowerCase();
      return Promise.resolve({
        metas: catalog.filter(m => m.name.toLowerCase().includes(search))
      });
    }
    return Promise.resolve({ metas: catalog });
  }
  return Promise.resolve({ metas: [] });
});

builder.defineStreamHandler(({ id }) => {
  const streams = {
    "tt0111161": [
      { title: "Servidor 1 - 1080p", url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4" }
    ],
    "tt1375666": [
      { title: "Servidor 1 - 720p", url: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4" }
    ],
    "tt0816692": [
      { title: "Servidor 1 - 1080p", url: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4" }
    ]
  };
  return Promise.resolve({ streams: streams[id] || [] });
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });

console.log("✅ apLAT Add-on corriendo... accede a /manifest.json");
