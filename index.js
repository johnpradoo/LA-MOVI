// ------------------------------
// LA.MOVI - Addon público Stremio (Películas + Series)
// ------------------------------

const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

// ------------------------------
// 🔧 MANIFESTO
// ------------------------------
const manifest = {
  id: "org.lamovi",
  version: "1.0.0",
  name: "LA.MOVI",
  description: "Catálogo latino de películas y series creado por John",
  resources: ["catalog", "stream"],
  types: ["movie", "series"],
  catalogs: [
    {
      type: "movie",
      id: "lamovi-movies",
      name: "🎬 Películas LA.MOVI",
      extra: [{ name: "search" }],
    },
    {
      type: "series",
      id: "lamovi-series",
      name: "📺 Series LA.MOVI",
      extra: [{ name: "search" }],
    },
  ],
};

// ------------------------------
// 🧱 Builder
// ------------------------------
const builder = new addonBuilder(manifest);

// ------------------------------
// 🎬 CATÁLOGO DE PELÍCULAS
// ------------------------------
const peliculas = [
  {
    id: "pelicula_001",
    type: "movie",
    name: "El Recluta (2024)",
    poster: "https://i.imgur.com/6M7GZ4r.png",
    description: "Acción, drama y traición en la frontera. Producción original LATAM.",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: "pelicula_002",
    type: "movie",
    name: "El Silencio de la Tormenta",
    poster: "https://i.imgur.com/m8dLqec.png",
    description: "Thriller psicológico con giros inesperados.",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  }
];

// ------------------------------
// 📺 CATÁLOGO DE SERIES
// ------------------------------
const series = [
  {
    id: "tt27987047",
    type: "series",
    name: "Boots",
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/A3TuuCkaVV3VWrBPk8kYF5mqPQf.jpg",
    description: "Ambientada en el duro e impredecible mundo del Cuerpo de Marines de Estados Unidos de 1990, cuando el ejército todavía no admitía a personas gay, sigue a Cameron Cope (Miles Heizer), un joven sin rumbo que aún no ha salido del armario, y a su mejor amigo Ray McAffey (Liam Oh), heterosexual e hijo de un marine condecorado. Juntos, tendrán que lidiar con las minas —tanto literales como metafóricas— del campo de entrenamiento, donde forjarán lazos inesperados y descubrirán su verdadero yo en un lugar que les exige más de lo que creían poder dar.",
    url: "https://bgt1-4.download.real-debrid.com/d/DG7BAS5YDKTWO85/Boots.S01E01.2025.2160p.NF.WEB-DL.DDP5.1.Atmos.DV.H.265-HHWEB.mkv"
  },
  {
    id: "serie_002",
    type: "series",
    name: "Sombras del Valle",
    poster: "https://i.imgur.com/3rJZVRr.png",
    description: "Suspenso rural y secretos familiares.",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  }
];

// ------------------------------
// 🎯 HANDLER: Catálogo dinámico
// ------------------------------
builder.defineCatalogHandler(({ type, id, extra }) => {
  let catalogo = [];

  if (id === "lamovi-movies") catalogo = peliculas;
  if (id === "lamovi-series") catalogo = series;

  if (extra && extra.search) {
    const search = extra.search.toLowerCase();
    catalogo = catalogo.filter(item =>
      item.name.toLowerCase().includes(search)
    );
  }

  return Promise.resolve({ metas: catalogo });
});

// ------------------------------
// 🎥 HANDLER: Streams
// ------------------------------
builder.defineStreamHandler(({ id }) => {
  const all = [...peliculas, ...series];
  const match = all.find(item => item.id === id);
  if (match) {
    return Promise.resolve({
      streams: [
        {
          title: `Ver ${match.name}`,
          url: match.url
        }
      ]
    });
  }
  return Promise.resolve({ streams: [] });
});

// ------------------------------
// 🚀 SERVIDOR
// ------------------------------
serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });

console.log("🔥 LA.MOVI corriendo perfectamente");
