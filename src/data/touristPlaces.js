const touristPlaces = [
  {
    id: "playa-del-viento",
    name: "Playas del Viento",
    category: "Playa",
    type: "Playa y actividades acuáticas",

    description:
      "Uno de los principales atractivos costeros de San Bernardo del Viento, con extensas playas del Caribe ideales para disfrutar del paisaje, caminar y realizar actividades recreativas.",

    lat: 9.34508,
    lng: -76.0487,

    images: [
      "/images/places/playa-viento.jpg",
    ],

    tags: [
      "playa",
      "mar",
      "kitesurf",
      "naturaleza",
      "fotografía",
    ],

    activities: [
      "Paseo de playa",
      "Fotografía",
      "Observación del paisaje",
      "Actividades acuáticas",
    ],

    recommendedMinutes: 120,

    audio:
      "/audio/playa-del-viento.mp3",
  },

  {
    id: "paso-nuevo",
    name: "Paso Nuevo",
    category: "Playa",
    type: "Destino costero y comunidad pesquera",

    description:
      "Corregimiento costero de San Bernardo del Viento reconocido como uno de los sectores de playa del municipio y como punto de referencia para actividades de naturaleza y recorridos por la zona.",

    lat: 9.32677,
    lng: -76.08631,

    images: [
      "/images/places/paso-nuevo.jpg",
    ],

    tags: [
      "playa",
      "paso nuevo",
      "pesca",
      "naturaleza",
      "costa",
    ],

    activities: [
      "Recorrido por la playa",
      "Fotografía",
      "Observación del paisaje",
      "Turismo de naturaleza",
    ],

    recommendedMinutes: 90,
  },

  {
    id: "punta-piedras",
    name: "Punta Piedras",
    category: "Punta costera",
    type: "Paisaje marino y observación",

    description:
      "Punto costero ubicado en el sector de Paso Nuevo, con paisajes del litoral Caribe y espacios de interés para disfrutar del entorno natural y realizar fotografía.",

    lat: 9.33439,
    lng: -76.08499,

    images: [
      "/images/places/punta-piedras.jpg",
    ],

    tags: [
      "costa",
      "mar",
      "paisaje",
      "fotografía",
      "naturaleza",
    ],

    activities: [
      "Fotografía",
      "Caminata",
      "Observación del paisaje",
      "Turismo de naturaleza",
    ],

    recommendedMinutes: 60,
  },

  {
    id: "playa-venado",
    name: "Playa Venado",
    category: "Playa",
    type: "Playa y turismo de naturaleza",

    description:
      "Sector costero de San Bernardo del Viento, conocido también como Playa de Los Venados, ubicado al oriente de la zona de Playas del Viento.",

    lat: 9.37145,
    lng: -75.98467,

    images: [
      "/images/places/playa-venado.jpg",
    ],

    tags: [
      "playa",
      "venado",
      "venados",
      "naturaleza",
      "mar",
      "fotografía",
    ],

    activities: [
      "Paseo de playa",
      "Fotografía",
      "Observación del paisaje",
      "Descanso",
    ],

    recommendedMinutes: 90,
  },

  {
    id: "camino-real",
    name: "Camino Real - El Paraíso",
    category: "Destino rural",
    type: "Naturaleza y turismo costero",

    description:
      "Sector de El Paraíso - Camino Real, ubicado en la zona costera de San Bernardo del Viento y conectado con playas y comunidades rurales del municipio.",

    lat: 9.35662,
    lng: -75.99119,

    images: [
      "/images/places/camino-real.jpg",
    ],

    tags: [
      "camino real",
      "paraíso",
      "rural",
      "naturaleza",
      "playa",
    ],

    activities: [
      "Recorridos",
      "Fotografía",
      "Turismo de naturaleza",
      "Visita a playas cercanas",
    ],

    recommendedMinutes: 90,
  },

  {
    id: "cano-grande",
    name: "Caño Grande",
    category: "Manglar",
    type: "Ecosistema de manglar y humedales",

    description:
      "Zona natural de gran importancia ecológica en San Bernardo del Viento, formada por caños, humedales y manglares asociados a la dinámica del bajo río Sinú.",

    lat: 9.39423,
    lng: -75.90972,

    images: [
      "/images/places/cano-grande.jpg",
    ],

    tags: [
      "manglar",
      "humedal",
      "aves",
      "río",
      "naturaleza",
    ],

    activities: [
      "Avistamiento de aves",
      "Fotografía de naturaleza",
      "Recorridos en embarcación",
      "Observación de manglares",
    ],

    recommendedMinutes: 150,
  },

  {
    id: "cano-sicara",
    name: "Caño Sicará",
    category: "Manglar",
    type: "Manglares y humedales",

    description:
      "Sector natural de San Bernardo del Viento asociado a manglares y humedales fluviales, con importancia para el turismo de naturaleza y la observación de biodiversidad.",

    lat: 9.39353,
    lng: -75.89109,

    images: [
      "/images/places/cano-sicara.jpg",
    ],

    tags: [
      "manglar",
      "sicarà",
      "humedal",
      "aves",
      "naturaleza",
    ],

    activities: [
      "Avistamiento de aves",
      "Fotografía",
      "Recorridos ecológicos",
      "Observación de manglares",
    ],

    recommendedMinutes: 120,
  },

  {
    id: "punta-tortuguero",
    name: "Punta Tortuguero",
    category: "Playa",
    type: "Paisaje costero",

    description:
      "Punto de playa ubicado en la zona costera de San Bernardo del Viento, asociado también con los nombres Punta del Viento, Punta Los Venados y Punta Venados.",

    lat: 9.42539,
    lng: -75.90308,

    images: [
      "/images/places/punta-tortuguero.jpg",
    ],

    tags: [
      "playa",
      "punta",
      "mar",
      "paisaje",
      "naturaleza",
    ],

    activities: [
      "Fotografía",
      "Observación del paisaje",
      "Caminata",
      "Turismo de naturaleza",
    ],

    recommendedMinutes: 90,
  },

  {
    id: "parque-central",
    name: "Parque Central de San Bernardo del Viento",
    category: "Cultura",
    type: "Espacio público y encuentro local",

    description:
      "Espacio público ubicado en la cabecera municipal de San Bernardo del Viento, ideal como punto de inicio para conocer el municipio y continuar hacia sus atractivos naturales.",

    lat: 9.35292,
    lng: -75.95224,

    images: [
      "/images/places/parque-central.jpg",
    ],

    tags: [
      "parque",
      "cultura",
      "pueblo",
      "centro",
      "local",
    ],

    activities: [
      "Caminata",
      "Fotografía",
      "Descanso",
      "Recorrido urbano",
    ],

    recommendedMinutes: 45,
  },

  {
    id: "plaza-san-bernardo",
    name: "Plaza de San Bernardo",
    category: "Cultura",
    type: "Espacio público",

    description:
      "Zona de recreación localizada en la cabecera municipal, cercana al Parque Central y a otros puntos de interés del centro de San Bernardo del Viento.",

    lat: 9.35099,
    lng: -75.95318,

    images: [
      "/images/places/plaza-san-bernardo.jpg",
    ],

    tags: [
      "plaza",
      "cultura",
      "centro",
      "pueblo",
    ],

    activities: [
      "Caminata",
      "Fotografía",
      "Descanso",
      "Recorrido urbano",
    ],

    recommendedMinutes: 30,
  },
];

export default touristPlaces;