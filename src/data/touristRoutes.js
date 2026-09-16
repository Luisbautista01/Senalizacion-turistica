const touristRoutes = [
  {
    id: "ruta-centro-playa-viento",
    name: "Centro → Playa del Viento",
    description:
      "Recorrido desde la zona urbana de San Bernardo del Viento hacia el sector de Playa del Viento.",
    distanceKm: 10.5,
    duration: "25 min aprox.",
    type: "Costera",
    color: "#2aa7b0",

    coordinates: [
      [9.35292, -75.95224],
      [9.35099, -75.95318],
      [9.3475, -75.9700],
      [9.34508, -76.0487],
    ],

    stops: [
      "Parque Central",
      "Plaza San Bernardo",
      "Playa del Viento",
    ],
  },

  {
    id: "ruta-playa-punta-piedras",
    name: "Playa del Viento → Punta Piedras",
    description:
      "Recorrido por el sector costero entre Playa del Viento y Punta Piedras.",
    distanceKm: 4.5,
    duration: "12 min aprox.",
    type: "Costera",
    color: "#168795",

    coordinates: [
      [9.34508, -76.0487],
      [9.3415, -76.0600],
      [9.3375, -76.0720],
      [9.33439, -76.08499],
    ],

    stops: [
      "Playa del Viento",
      "Zona costera",
      "Punta Piedras",
    ],
  },

  {
    id: "ruta-paso-nuevo-punta-piedras",
    name: "Paso Nuevo → Punta Piedras",
    description:
      "Recorrido por el sector costero de Paso Nuevo hasta Punta Piedras.",
    distanceKm: 5.8,
    duration: "15 min aprox.",
    type: "Costera",
    color: "#2aa7b0",

    coordinates: [
      [9.32677, -76.08631],
      [9.3300, -76.0860],
      [9.33439, -76.08499],
    ],

    stops: [
      "Paso Nuevo",
      "Zona costera",
      "Punta Piedras",
    ],
  },

  {
    id: "ruta-playa-paso-nuevo",
    name: "Playa del Viento → Paso Nuevo",
    description:
      "Ruta costera que conecta Playa del Viento con el sector turístico de Paso Nuevo.",
    distanceKm: 8,
    duration: "20 min aprox.",
    type: "Costera",
    color: "#087f91",

    coordinates: [
      [9.34508, -76.0487],
      [9.3390, -76.0650],
      [9.33439, -76.08499],
      [9.32677, -76.08631],
    ],

    stops: [
      "Playa del Viento",
      "Punta Piedras",
      "Paso Nuevo",
    ],
  },

  {
    id: "ruta-paraiso-playa-venado",
    name: "El Paraíso → Playa Venado",
    description:
      "Recorrido por el sector de El Paraíso y Camino Real hasta Playa Venado.",
    distanceKm: 2.4,
    duration: "8 min aprox.",
    type: "Naturaleza",
    color: "#2d6b4f",

    coordinates: [
      [9.3605, -75.98946],
      [9.3595, -75.9970],
      [9.35775, -76.00848],
    ],

    stops: [
      "Camino Real",
      "Zona de El Paraíso",
      "Playa Venado",
    ],
  },

  {
    id: "ruta-centro-camino-real",
    name: "Centro → Camino Real",
    description:
      "Recorrido desde el centro del municipio hacia el sector de Camino Real.",
    distanceKm: 4.2,
    duration: "12 min aprox.",
    type: "Naturaleza",
    color: "#4f8f62",

    coordinates: [
      [9.35292, -75.95224],
      [9.3550, -75.9650],
      [9.3580, -75.9780],
      [9.3605, -75.98946],
    ],

    stops: [
      "Parque Central",
      "Zona rural",
      "Camino Real",
    ],
  },

  {
    id: "ruta-manglares",
    name: "Ruta de Manglares y Humedales",
    description:
      "Recorrido de naturaleza por sectores asociados a manglares, humedales y observación de fauna.",
    distanceKm: 7.5,
    duration: "25 min aprox.",
    type: "Naturaleza",
    color: "#2d6b4f",

    coordinates: [
      [9.35292, -75.95224],
      [9.3560, -75.9650],
      [9.3605, -75.98946],
      [9.3610, -76.0080],
    ],

    stops: [
      "Parque Central",
      "Camino Real",
      "Manglares de San Bernardo",
    ],
  },

  {
    id: "ruta-cano-sicara",
    name: "Ruta Caño Sicará",
    description:
      "Recorrido de naturaleza hacia el sector de Caño Sicará para conocer sus ecosistemas de humedal y manglar.",
    distanceKm: 7.5,
    duration: "25 min aprox.",
    type: "Naturaleza",
    color: "#23745a",

    coordinates: [
      [9.35292, -75.95224],
      [9.3510, -75.9380],
      [9.3490, -75.9200],
      [9.34852, -75.90442],
    ],

    stops: [
      "Parque Central",
      "Zona rural",
      "Caño Sicará",
    ],
  },

  {
    id: "ruta-cano-grande",
    name: "Ruta de Naturaleza Caño Grande",
    description:
      "Recorrido hacia Caño Grande para disfrutar del paisaje natural, humedales y observación de aves.",
    distanceKm: 8.5,
    duration: "30 min aprox.",
    type: "Naturaleza",
    color: "#367a55",

    coordinates: [
      [9.35292, -75.95224],
      [9.3550, -75.9700],
      [9.3605, -75.98946],
      [9.3750, -75.9500],
      [9.39322, -75.88736],
    ],

    stops: [
      "Parque Central",
      "Camino Real",
      "Caño Grande",
    ],
  },

  {
    id: "ruta-desembocadura-sinu",
    name: "Ruta hacia la Desembocadura del Río Sinú",
    description:
      "Recorrido hacia la zona de la desembocadura del Río Sinú para conocer el paisaje fluvial y costero.",
    distanceKm: 12,
    duration: "35 min aprox.",
    type: "Naturaleza",
    color: "#237b8a",

    coordinates: [
      [9.35292, -75.95224],
      [9.3600, -75.9650],
      [9.3650, -75.9800],
      [9.3710, -75.9990],
    ],

    stops: [
      "Parque Central",
      "Zona rural",
      "Desembocadura del Río Sinú",
    ],
  },

  {
    id: "ruta-circuito-playas",
    name: "Circuito de Playas",
    description:
      "Recorrido que conecta varios sectores costeros y puntos turísticos de San Bernardo del Viento.",
    distanceKm: 22,
    duration: "50 min aprox.",
    type: "Circuito",
    color: "#087f91",

    coordinates: [
      [9.34508, -76.0487],
      [9.33439, -76.08499],
      [9.32677, -76.08631],
      [9.3400, -76.0500],
      [9.35775, -76.00848],
    ],

    stops: [
      "Playa del Viento",
      "Punta Piedras",
      "Paso Nuevo",
      "Playa Venado",
    ],
  },

  {
    id: "ruta-centro-naturaleza",
    name: "Circuito Centro → Naturaleza",
    description:
      "Recorrido desde el centro municipal hacia diferentes sectores naturales y rurales.",
    distanceKm: 15,
    duration: "40 min aprox.",
    type: "Circuito",
    color: "#3d7b58",

    coordinates: [
      [9.35292, -75.95224],
      [9.3605, -75.98946],
      [9.39322, -75.88736],
      [9.34852, -75.90442],
    ],

    stops: [
      "Parque Central",
      "Camino Real",
      "Caño Grande",
      "Caño Sicará",
    ],
  },

  {
    id: "ruta-playas-del-viento",
    name: "Ruta completa Playas del Viento",
    description:
      "Circuito turístico por algunos de los principales puntos costeros de la zona.",
    distanceKm: 25,
    duration: "1 h aprox.",
    type: "Circuito",
    color: "#168795",

    coordinates: [
      [9.34508, -76.0487],
      [9.33439, -76.08499],
      [9.32677, -76.08631],
      [9.35775, -76.00848],
      [9.34508, -76.0487],
    ],

    stops: [
      "Playa del Viento",
      "Punta Piedras",
      "Paso Nuevo",
      "Playa Venado",
      "Playa del Viento",
    ],
  },

  {
    id: "ruta-punta-tortuguero",
    name: "Ruta Costera Punta Tortuguero",
    description:
      "Recorrido hacia Punta Tortuguero para conocer otro sector del litoral y disfrutar del paisaje costero.",
    distanceKm: 12,
    duration: "35 min aprox.",
    type: "Costera",
    color: "#0f7885",

    coordinates: [
      [9.35292, -75.95224],
      [9.3700, -75.9300],
      [9.39322, -75.88736],
      [9.4100, -75.8950],
      [9.42539, -75.90308],
    ],

    stops: [
      "Parque Central",
      "Caño Grande",
      "Zona costera",
      "Punta Tortuguero",
    ],
  },
];

export default touristRoutes;