const touristPlaces = [
  {
    id: "playas-del-viento",
    name: "Playas del Viento",
    category: "Playa",
    type: "Playa y actividades acuáticas",

    description:
      "Extensa zona de playa del Caribe colombiano reconocida como uno de los principales atractivos turísticos de San Bernardo del Viento, ideal para disfrutar del mar, caminar, practicar actividades acuáticas y contemplar los atardeceres.",

    lat: 9.353688128269651,
    lng: -76.02108134793268,

    images: [
      "/images/places/playa-viento.jpg",
    ],

    tags: [
      "playa",
      "mar",
      "caribe",
      "kitesurf",
      "surf",
      "naturaleza",
      "atardecer",
    ],

    activities: [
      "Paseo de playa",
      "Fotografía",
      "Observación del paisaje",
      "Actividades acuáticas",
      "Surf",
      "Disfrutar el atardecer",
    ],
    
  },

  {
    id: "playas-la-ye",
    name: "Playas de La Ye",
    category: "Playa",
    type: "Playa y turismo costero",

    description:
      "Sector costero de San Bernardo del Viento conocido por sus playas de arena clara, vegetación tropical y mar abierto. En la zona se encuentra el reconocido muelle turístico de La Ye.",

    lat: 9.353386646371542,
    lng: -76.02120692304821,

    images: [
      "/images/places/playas-la-ye.jpg",
    ],

    tags: [
      "playa",
      "la ye",
      "mar",
      "muelle",
      "atardecer",
      "turismo",
    ],

    activities: [
      "Paseo de playa",
      "Fotografía",
      "Baño en el mar",
      "Observación del paisaje",
      "Disfrutar el atardecer",
    ],

  },

  {
    id: "muelle-turistico-la-ye",
    name: "Muelle Turístico de La Ye",
    category: "Turismo",
    type: "Muelle y mirador costero",

    description:
      "Muelle turístico ubicado en el sector de La Ye. Funciona como punto de observación del paisaje marino y como uno de los lugares de referencia para visitantes en esta zona costera.",

    lat: 9.353326711366702,
    lng: -76.02093910571227,

    images: [
      "/images/places/muelle-la-ye.jpg",
    ],

    tags: [
      "muelle",
      "la ye",
      "mirador",
      "mar",
      "fotografía",
      "turismo",
    ],

    activities: [
      "Fotografía",
      "Observación del mar",
      "Contemplar el paisaje",
      "Disfrutar el atardecer",
      "Caminata",
    ],

  },

  {
    id: "paso-nuevo",
    name: "Paso Nuevo",
    category: "Playa",
    type: "Destino costero y comunidad pesquera",

    description:
      "Corregimiento costero de San Bernardo del Viento ubicado frente al mar Caribe, reconocido por sus playas, actividades pesqueras y paisajes naturales.",

    lat: 9.324687072450924,
    lng: -76.0821159929076,

    images: [
      "/images/places/paso-nuevo.jpg",
    ],

    tags: [
      "playa",
      "paso nuevo",
      "pesca",
      "naturaleza",
      "costa",
      "mar",
    ],

    activities: [
      "Recorrido por la playa",
      "Fotografía",
      "Observación del paisaje",
      "Pesca artesanal",
      "Turismo de naturaleza",
    ],

  },

  {
    id: "punta-piedra",
    name: "Punta Piedra",
    category: "Punta costera",
    type: "Paisaje marino, cuevas y naturaleza",

    description:
      "Punto costero cercano a Paso Nuevo conocido por sus paisajes, formaciones rocosas y cuevas naturales. Es un lugar de interés para la fotografía, caminatas y observación de aves.",

    lat: 9.339643576548847,
    lng: -76.07426954793293,

    images: [
      "/images/places/punta-piedra.jpg",
    ],

    tags: [
      "punta piedra",
      "costa",
      "mar",
      "cuevas",
      "aves",
      "naturaleza",
      "fotografía",
    ],

    activities: [
      "Fotografía",
      "Caminata",
      "Observación del paisaje",
      "Avistamiento de aves",
      "Exploración de cuevas",
    ],

  },

  {
    id: "isla-ancon",
    name: "Isla Ancón",
    category: "Isla",
    type: "Isla, playa y turismo de naturaleza",

    description:
      "Isla ubicada frente a la costa de San Bernardo del Viento, cerca de Paso Nuevo y Punta Piedra. Es reconocida como destino para recorridos en lancha, descanso, fotografía y contacto con la naturaleza.",

    lat: 9.339294331302808,
    lng: -76.08211229797342,

    images: [
      "/images/places/isla-ancon.jpg",
    ],

    tags: [
      "isla",
      "ancón",
      "playa",
      "mar",
      "lancha",
      "naturaleza",
      "buceo",
    ],

    activities: [
      "Paseo en lancha",
      "Paseo de playa",
      "Fotografía",
      "Natación",
      "Observación de fauna marina",
      "Turismo de naturaleza",
    ],

  },

  {
    id: "playas-boca-negra",
    name: "Playas de Boca Negra",
    category: "Playa",
    type: "Playa y turismo de naturaleza",

    description:
      "Zona de playa de San Bernardo del Viento caracterizada por su arena, vegetación costera y oleaje moderado. Es un sector tranquilo para descansar y disfrutar del paisaje del Caribe.",

    lat: 9.385031368635993,
    lng: -75.97143296638903,

    images: [
      "/images/places/boca-negra.jpg",
    ],

    tags: [
      "boca negra",
      "playa",
      "mar",
      "caribe",
      "naturaleza",
      "descanso",
    ],

    activities: [
      "Paseo de playa",
      "Baño en el mar",
      "Fotografía",
      "Descanso",
      "Observación del paisaje",
    ],

  },

  {
    id: "playa-venado",
    name: "Playa de Los Venados",
    category: "Playa",
    type: "Playa y turismo de naturaleza",

    description:
      "Sector costero ubicado hacia el oriente de las Playas del Viento, conocido por sus amplias playas, paisaje natural y ambiente tranquilo.",

    lat: 9.372487745319736,
    lng: -75.98498175541069,

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
      "Baño en el mar",
    ],

  },

  {
    id: "boca-de-tinajones",
    name: "Boca de Tinajones",
    category: "Naturaleza",
    type: "Desembocadura del río Sinú",

    description:
      "Una de las bocas de la desembocadura del río Sinú en el mar Caribe, ubicada en el territorio de San Bernardo del Viento. Es un área de gran importancia paisajística y ecológica.",

    lat: 9.44014559570176,
    lng: -75.9481050786196,

    images: [
      "/images/places/boca-tinajones.jpg",
    ],

    tags: [
      "boca de tinajones",
      "río sinú",
      "mar",
      "desembocadura",
      "naturaleza",
      "aves",
    ],

    activities: [
      "Fotografía",
      "Observación de aves",
      "Recorrido en embarcación",
      "Observación del paisaje",
      "Turismo de naturaleza",
    ],

  },

  {
    id: "rio-sinu",
    name: "Río Sinú",
    category: "Naturaleza",
    type: "Río y ecosistema ribereño",

    description:
      "El río Sinú atraviesa el territorio de San Bernardo del Viento y llega al mar Caribe formando un sistema de bocas, caños, humedales y manglares de gran importancia ecológica.",

    lat: 8.768345349275599,
    lng: -75.96676545221705,

    images: [
      "/images/places/rio-sinu.jpg",
    ],

    tags: [
      "río sinú",
      "río",
      "naturaleza",
      "aves",
      "pesca",
      "manglar",
    ],

    activities: [
      "Recorridos en lancha",
      "Fotografía",
      "Pesca",
      "Observación de aves",
      "Turismo de naturaleza",
    ],

  },

  {
    id: "cano-grande",
    name: "Caño Grande",
    category: "Manglar",
    type: "Ecosistema de manglar y humedales",

    description:
      "Importante sistema natural de caños, humedales y manglares conectado con la cuenca baja del río Sinú. Es un espacio de interés para el ecoturismo y la observación de biodiversidad.",

    lat: 9.39414,
    lng: -75.90856,

    images: [
      "/images/places/cano-grande.jpg",
    ],

    tags: [
      "caño grande",
      "manglar",
      "humedal",
      "aves",
      "río",
      "naturaleza",
      "ecoturismo",
    ],

    activities: [
      "Avistamiento de aves",
      "Fotografía de naturaleza",
      "Recorridos en embarcación",
      "Observación de manglares",
      "Ecoturismo",
    ],

  },

  {
    id: "cano-la-balsa",
    name: "Caño La Balsa",
    category: "Naturaleza",
    type: "Caño, humedales y manglares",

    description:
      "Sistema natural de caños y humedales asociado a la dinámica hídrica de San Bernardo del Viento. La Balsa hace parte de los ecosistemas naturales de la zona y conecta sectores de humedal con el sistema del río Sinú.",

    lat: 9.358510383606422,
    lng: -75.9769719270317,

    images: [
      "/images/places/cano-de-la-balsa.png",
    ],

    tags: [
      "caño la balsa",
      "la balsa",
      "manglar",
      "humedal",
      "río sinú",
      "naturaleza",
    ],

    activities: [
      "Recorrido en lancha",
      "Fotografía",
      "Observación de aves",
      "Observación de manglares",
      "Turismo de naturaleza",
    ],

  },

  {
    id: "paso-nuevo-playa",
    name: "Playa de Paso Nuevo",
    category: "Playa",
    type: "Playa y comunidad costera",

    description:
      "Franja costera ubicada frente al corregimiento de Paso Nuevo, con paisajes del mar Caribe y actividades tradicionales relacionadas con la pesca y la vida costera.",

    lat: 9.32504,
    lng: -76.08744,

    images: [
      "/images/places/playa-paso-nuevo.jpg",
    ],

    tags: [
      "paso nuevo",
      "playa",
      "mar",
      "pesca",
      "costa",
    ],

    activities: [
      "Paseo de playa",
      "Fotografía",
      "Pesca artesanal",
      "Baño en el mar",
      "Observación del paisaje",
    ],

    recommendedMinutes: 90,
  },

  {
    id: "isla-fuerte",
    name: "Isla Fuerte",
    category: "Isla",
    type: "Destino insular y turismo de naturaleza",

    description:
      "Isla ubicada frente a las costas de Córdoba, reconocida por sus playas, arrecifes coralinos, biodiversidad marina y actividades como buceo, snorkel y recorridos en lancha.",

    lat: 9.387748522998837,
    lng: -76.18008122138392,

    images: [
      "/images/places/isla-fuerte.jpg",
    ],

    tags: [
      "isla fuerte",
      "isla",
      "playa",
      "buceo",
      "snorkel",
      "corales",
      "mar",
      "naturaleza",
    ],

    activities: [
      "Paseo en lancha",
      "Buceo",
      "Snorkel",
      "Fotografía",
      "Paseo de playa",
      "Observación de fauna marina",
    ],

  },

  {
    id: "parque-central",
    name: "Parque Central de San Bernardo del Viento",
    category: "Cultura",
    type: "Espacio público y encuentro local",

    description:
      "Espacio público ubicado en la cabecera municipal, ideal como punto de inicio para conocer el centro de San Bernardo del Viento y continuar hacia sus atractivos naturales y culturales.",

    lat: 9.353110156190231,
    lng: -75.95197090004797,

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

  },

  {
    id: "volcan-lodo-el-salvador",
    name: "Volcán de Lodo El Salvador",
    category: "Naturaleza",
    type: "Formación natural y geoturismo",

    description:
      "Formación natural de interés para el turismo de naturaleza y geoturismo en el territorio de San Bernardo del Viento.",

    lat: 9.312590809621943,
    lng: -76.09906084202919,

    images: [
      "/images/places/volcan-lodo-salvador.jpg",
    ],

    tags: [
      "volcán de lodo",
      "el salvador",
      "naturaleza",
      "geoturismo",
      "lodo",
    ],

    activities: [
      "Observación de la formación natural",
      "Fotografía",
      "Turismo de naturaleza",
      "Geoturismo",
    ],

  },

  /*
   * DESTINO EXTERNO / REGIONAL
   *
   * No pertenece al municipio de San Bernardo del Viento,
   * pero puede ofrecerse como destino conectado desde la zona.
   */

  {
    id: "archipielago-san-bernardo",
    name: "Archipiélago de San Bernardo",
    category: "Isla",
    type: "Archipiélago y turismo marino",

    description:
      "Conjunto de islas y cayos del Caribe colombiano reconocido por sus playas, aguas cálidas y ecosistemas marinos. Es un destino regional diferente al municipio de San Bernardo del Viento.",

    lat: 9.721327391714938,
    lng: -75.77874581887426,

    images: [
      "/images/places/archipielago-san-bernardo.jpg",
    ],

    tags: [
      "archipiélago",
      "islas",
      "mar",
      "caribe",
      "playa",
      "buceo",
      "snorkel",
    ],

    activities: [
      "Paseo en lancha",
      "Buceo",
      "Snorkel",
      "Paseo de playa",
      "Fotografía",
      "Observación de fauna marina",
    ],

  },
];

export default touristPlaces;