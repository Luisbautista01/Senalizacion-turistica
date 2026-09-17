import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Circle,
    Popup,
    Polyline,
    useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {
    FaCompass,
    FaMapMarkerAlt,
    FaQrcode,
    FaHeadphones,
    FaSearch,
    FaTimes,
    FaChevronRight,
    FaRoute,
    FaLocationArrow,
    FaInfoCircle,
    FaWater,
    FaHeart,
    FaRegHeart,
    FaCheckCircle,
    FaClock,
    FaWalking,
    FaMap,
    FaList,
    FaPlay,
    FaPause,
    FaLeaf,
    FaUmbrellaBeach,
    FaTree,
    FaShip,
    FaPlus,
    FaMinus,
    FaExternalLinkAlt,
    FaStar,
    FaGlobeAmericas,
} from "react-icons/fa";

import { QRCodeSVG } from "qrcode.react";

import touristPlacesData from "../data/touristPlaces";
import touristRoutesData from "../data/touristRoutes";

/* =========================================================
   CONFIGURACIÓN
========================================================= */

const MAP_CENTER = [9.3533, -75.95244];

const STORAGE_KEYS = {
    favorites: "playa-viento-favorites",
    visited: "playa-viento-visited",
    savedRoutes: "playa-viento-saved-routes",
    location: "playa-viento-location",
};

/* =========================================================
   LOCAL STORAGE
========================================================= */

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() =>
        readStorage(key, initialValue)
    );

    useEffect(() => {
        try {
            localStorage.setItem(
                key,
                JSON.stringify(value)
            );
        } catch {
            // No hacer nada si localStorage no está disponible.
        }
    }, [key, value]);

    return [value, setValue];
}

/* =========================================================
   HELPERS
========================================================= */

function getPlaceId(place) {
    if (!place) return null;

    return String(
        place.id ??
        place._id ??
        place.slug ??
        place.name
    );
}

function getPlaceName(place) {
    return (
        place?.name ??
        place?.title ??
        place?.nombre ??
        "Lugar turístico"
    );
}

function getPlaceCategory(place) {
    return (
        place?.category ??
        place?.type ??
        place?.tipo ??
        "Destino turístico"
    );
}

function getPlaceDescription(place) {
    return (
        place?.description ??
        place?.shortDescription ??
        place?.descripcion ??
        "Descubre este lugar turístico de San Bernardo del Viento."
    );
}

function getPlaceImage(place) {
    if (!place) {
        return "/images/tourism/playa-viento.jpg";
    }

    const image =
        place.image ??
        place.imageUrl ??
        place.photo ??
        place.cover ??
        place.images?.[0];

    if (typeof image === "string" && image.trim()) {
        return image;
    }

    if (
        image &&
        typeof image === "object" &&
        image.url
    ) {
        return image.url;
    }

    return "/images/tourism/playa-viento.jpg";
}

function getPlaceCoordinates(place) {
    if (!place) {
        return null;
    }

    const isValidCoordinate = (lat, lng) => {
        const latitude = Number(lat);
        const longitude = Number(lng);

        return (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180
        );
    };

    /* =========================================
       lat / lng
    ========================================= */

    if (
        isValidCoordinate(
            place.lat,
            place.lng
        )
    ) {
        return [
            Number(place.lat),
            Number(place.lng),
        ];
    }

    /* =========================================
       latitude / longitude
    ========================================= */

    if (
        isValidCoordinate(
            place.latitude,
            place.longitude
        )
    ) {
        return [
            Number(place.latitude),
            Number(place.longitude),
        ];
    }

    /* =========================================
       coordinates: [lat, lng]
    ========================================= */

    if (
        Array.isArray(place.coordinates) &&
        place.coordinates.length >= 2 &&
        isValidCoordinate(
            place.coordinates[0],
            place.coordinates[1]
        )
    ) {
        return [
            Number(place.coordinates[0]),
            Number(place.coordinates[1]),
        ];
    }

    /* =========================================
       location: { lat, lng }
    ========================================= */

    if (
        place.location &&
        isValidCoordinate(
            place.location.lat,
            place.location.lng
        )
    ) {
        return [
            Number(place.location.lat),
            Number(place.location.lng),
        ];
    }

    /* =========================================
       GeoJSON:
       location.coordinates = [lng, lat]
    ========================================= */

    if (
        place.location &&
        Array.isArray(
            place.location.coordinates
        ) &&
        place.location.coordinates.length >= 2 &&
        isValidCoordinate(
            place.location.coordinates[1],
            place.location.coordinates[0]
        )
    ) {
        return [
            Number(
                place.location.coordinates[1]
            ),
            Number(
                place.location.coordinates[0]
            ),
        ];
    }

    return null;
}

function getRouteId(route) {
    return String(
        route?.id ??
        route?._id ??
        route?.slug ??
        route?.name
    );
}

function getRouteCoordinates(
    route,
    places
) {
    const isValidCoordinate = (
        latitude,
        longitude
    ) => {
        const lat = Number(latitude);
        const lng = Number(longitude);

        return (
            Number.isFinite(lat) &&
            Number.isFinite(lng) &&
            lat >= -90 &&
            lat <= 90 &&
            lng >= -180 &&
            lng <= 180
        );
    };

    /* =========================================
       COORDENADAS DIRECTAS DE LA RUTA
    ========================================= */

    if (
        Array.isArray(route?.coordinates) &&
        route.coordinates.length > 1
    ) {
        return route.coordinates
            .map((coordinate) => {
                if (
                    !Array.isArray(coordinate) ||
                    coordinate.length < 2
                ) {
                    return null;
                }

                if (
                    !isValidCoordinate(
                        coordinate[0],
                        coordinate[1]
                    )
                ) {
                    return null;
                }

                return [
                    Number(coordinate[0]),
                    Number(coordinate[1]),
                ];
            })
            .filter(Boolean);
    }

    /* =========================================
       PARADAS
    ========================================= */

    const stops =
        route?.stops ??
        route?.places ??
        route?.placeIds ??
        [];

    if (!Array.isArray(stops)) {
        return [];
    }

    return stops
        .map((stop) => {
            const id =
                typeof stop === "object"
                    ? getPlaceId(stop)
                    : String(stop);

            const place = places.find(
                (item) =>
                    getPlaceId(item) === id
            );

            return getPlaceCoordinates(
                place
            );
        })
        .filter(
            (coordinates) =>
                Array.isArray(coordinates) &&
                coordinates.length >= 2 &&
                Number.isFinite(
                    coordinates[0]
                ) &&
                Number.isFinite(
                    coordinates[1]
                )
        );
}

function calculateDistance(
    lat1,
    lng1,
    lat2,
    lng2
) {
    const earthRadius = 6371;

    const dLat =
        ((lat2 - lat1) * Math.PI) / 180;

    const dLng =
        ((lng2 - lng1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
        Math.cos(
            (lat1 * Math.PI) / 180
        ) *
        Math.cos(
            (lat2 * Math.PI) / 180
        ) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadius * c;
}

function formatDistance(distance) {
    if (distance == null) {
        return null;
    }

    if (distance < 1) {
        return `${Math.round(
            distance * 1000
        )} m`;
    }

    return `${distance.toFixed(1)} km`;
}

/* =========================================================
   ICONO SEGÚN CATEGORÍA
========================================================= */

function CategoryIcon({ category }) {
    const value = String(
        category || ""
    ).toLowerCase();

    if (
        value.includes("playa") ||
        value.includes("mar")
    ) {
        return <FaUmbrellaBeach />;
    }

    if (
        value.includes("manglar") ||
        value.includes("bosque") ||
        value.includes("natur")
    ) {
        return <FaTree />;
    }

    if (
        value.includes("río") ||
        value.includes("rio") ||
        value.includes("agua")
    ) {
        return <FaWater />;
    }

    if (
        value.includes("isla") ||
        value.includes("lancha") ||
        value.includes("barco")
    ) {
        return <FaShip />;
    }

    return <FaLeaf />;
}

/* =========================================================
   CONTROL DEL MAPA
========================================================= */

function MapController({
    selectedPlace,
}) {
    const map = useMap();

    useEffect(() => {
        const coordinates =
            getPlaceCoordinates(selectedPlace);

        if (!coordinates) {
            return;
        }

        const moveMap = () => {
            map.invalidateSize();

            map.flyTo(
                coordinates,
                15,
                {
                    duration: 0.7,
                }
            );
        };

        requestAnimationFrame(() => {
            setTimeout(moveMap, 100);
        });
    }, [map, selectedPlace]);

    return null;
}

function MapSizeController({
    viewMode,
}) {
    const map = useMap();

    useEffect(() => {
        if (!map || viewMode !== "map") {
            return;
        }

        const invalidate = () => {
            const container =
                map.getContainer();

            if (!container) {
                return;
            }

            const width =
                container.clientWidth;

            const height =
                container.clientHeight;

            if (
                width <= 0 ||
                height <= 0
            ) {
                return;
            }

            map.invalidateSize({
                animate: false,
                pan: false,
            });
        };

        const frame =
            requestAnimationFrame(invalidate);

        const timeout1 = setTimeout(
            invalidate,
            50
        );

        const timeout2 = setTimeout(
            invalidate,
            150
        );

        const timeout3 = setTimeout(
            invalidate,
            300
        );

        const timeout4 = setTimeout(
            invalidate,
            600
        );

        window.addEventListener(
            "resize",
            invalidate
        );

        return () => {
            cancelAnimationFrame(frame);

            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
            clearTimeout(timeout4);

            window.removeEventListener(
                "resize",
                invalidate
            );
        };
    }, [
        map,
        viewMode,
    ]);

    return null;
}

function RouteController({
    coordinates,
}) {
    const map = useMap();

    useEffect(() => {
        if (!map) {
            return;
        }

        if (
            !Array.isArray(coordinates) ||
            coordinates.length < 2
        ) {
            return;
        }

        const validCoordinates =
            coordinates.every(
                (coordinate) =>
                    Array.isArray(coordinate) &&
                    coordinate.length >= 2 &&
                    Number.isFinite(
                        Number(coordinate[0])
                    ) &&
                    Number.isFinite(
                        Number(coordinate[1])
                    )
            );

        if (!validCoordinates) {
            return;
        }

        const fitRoute = () => {
            const size = map.getSize();

            if (
                !size ||
                size.x <= 0 ||
                size.y <= 0
            ) {
                return;
            }

            map.invalidateSize({
                animate: false,
                pan: false,
            });

            map.fitBounds(
                coordinates,
                {
                    padding: [40, 40],
                    maxZoom: 14,
                    animate: true,
                }
            );
        };

        const frame =
            requestAnimationFrame(fitRoute);

        const timeout1 = setTimeout(
            fitRoute,
            100
        );

        const timeout2 = setTimeout(
            fitRoute,
            300
        );

        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(timeout1);
            clearTimeout(timeout2);
        };
    }, [
        map,
        coordinates,
    ]);

    return null;
}

/* =========================================================
   HOME
========================================================= */

export default function Home() {
    /* =======================================================
        DATOS
    ======================================================= */

    const touristPlaces = useMemo(() => {
        const source = Array.isArray(
            touristPlacesData
        )
            ? touristPlacesData
            : touristPlacesData?.places;

        if (!Array.isArray(source)) {
            return [];
        }

        return source.map(
            (place, index) => ({
                ...place,
                id:
                    place.id ??
                    place._id ??
                    place.slug ??
                    `place-${index + 1}`,
            })
        );
    }, []);

    /* =======================================================
        ESTADOS
    ======================================================= */

    const [search, setSearch] =
        useState("");

    const [
        selectedCategory,
        setSelectedCategory,
    ] = useState("Todos");

    const [
        selectedPlace,
        setSelectedPlace,
    ] = useState(null);

    const [
        showDetail,
        setShowDetail,
    ] = useState(false);

    const [
        showQR,
        setShowQR,
    ] = useState(false);

    const [showMobileMenu, setShowMobileMenu,] = useState(false);

    const [
        showRoutes,
        setShowRoutes,
    ] = useState(false);

    const [viewMode, setViewMode] = useState("list");

    const [
        activeRoute,
        setActiveRoute,
    ] = useState(null);

    const [
        locationStatus,
        setLocationStatus,
    ] = useState("idle");

    const [
        locationError,
        setLocationError,
    ] = useState(
        "Geolocalización inactiva"
    );

    const [
        userLocation,
        setUserLocation,
    ] = useState(null);

    const [
        audioPlace,
        setAudioPlace,
    ] = useState(null);

    const [
        isAudioPlaying,
        setIsAudioPlaying,
    ] = useState(false);

    const [modalPosition, setModalPosition] = useState({
        x: 0,
        y: 0,
    });

    const modalDragRef = useRef({
        dragging: false,
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0,
    });

    const searchRef = useRef(null);

    const audioRef = useRef(null);

    const speechRef = useRef(null);

    const watchIdRef = useRef(null);

    /* =======================================================
        LOCAL STORAGE
    ======================================================= */

    const [
        favorites,
        setFavorites,
    ] = useLocalStorage(
        STORAGE_KEYS.favorites,
        []
    );

    const [
        visited,
        setVisited,
    ] = useLocalStorage(
        STORAGE_KEYS.visited,
        []
    );

    const [
        savedRoutes,
        setSavedRoutes,
    ] = useLocalStorage(
        STORAGE_KEYS.savedRoutes,
        []
    );

    /* =======================================================
        CATEGORÍAS
    ======================================================= */

    const categories = useMemo(() => {
        const values = touristPlaces
            .map((place) =>
                getPlaceCategory(place)
            )
            .filter(Boolean);

        return [
            "Todos",
            ...Array.from(
                new Set(values)
            ),
        ];
    }, [touristPlaces]);

    /* =======================================================
        LUGARES CON DISTANCIA
    ======================================================= */

    const placesWithDistance =
        useMemo(() => {
            const result =
                touristPlaces.map(
                    (place) => {
                        const coordinates =
                            getPlaceCoordinates(
                                place
                            );

                        let calculatedDistance =
                            null;

                        if (
                            userLocation &&
                            coordinates
                        ) {
                            calculatedDistance =
                                calculateDistance(
                                    userLocation.lat,
                                    userLocation.lng,
                                    coordinates[0],
                                    coordinates[1]
                                );
                        }

                        return {
                            ...place,
                            calculatedDistance,
                        };
                    }
                );

            result.sort((a, b) => {
                if (
                    a.calculatedDistance !=
                    null &&
                    b.calculatedDistance !=
                    null
                ) {
                    return (
                        a.calculatedDistance -
                        b.calculatedDistance
                    );
                }

                return 0;
            });

            return result;
        }, [
            touristPlaces,
            userLocation,
        ]);

    /* =======================================================
        FILTROS
    ======================================================= */

    const filteredPlaces =
        useMemo(() => {
            const term =
                search
                    .trim()
                    .toLowerCase();

            return placesWithDistance.filter(
                (place) => {
                    const matchesSearch =
                        !term ||
                        getPlaceName(
                            place
                        )
                            .toLowerCase()
                            .includes(term) ||
                        getPlaceDescription(
                            place
                        )
                            .toLowerCase()
                            .includes(term) ||
                        getPlaceCategory(
                            place
                        )
                            .toLowerCase()
                            .includes(term);

                    const matchesCategory =
                        selectedCategory ===
                        "Todos" ||
                        getPlaceCategory(
                            place
                        ) === selectedCategory;

                    return (
                        matchesSearch &&
                        matchesCategory
                    );
                }
            );
        }, [
            placesWithDistance,
            search,
            selectedCategory,
        ]);

    /* =======================================================
        RUTA ACTIVA
    ======================================================= */

    const activeRouteCoordinates =
        useMemo(() => {
            if (!activeRoute) {
                return [];
            }

            return getRouteCoordinates(
                activeRoute,
                touristPlaces
            );
        }, [
            activeRoute,
            touristPlaces,
        ]);

    /* =======================================================
    GEOLOCALIZACIÓN
    ======================================================= */

    const activateGeolocation =
        useCallback(() => {
            if (
                locationStatus === "active" ||
                locationStatus === "loading"
            ) {
                return;
            }

            if (!navigator.geolocation) {
                setLocationStatus("error");

                setLocationError(
                    "Este navegador no permite geolocalización."
                );

                return;
            }

            setLocationStatus("loading");

            setLocationError(
                "Obteniendo ubicación..."
            );

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        updatedAt: Date.now(),
                    };

                    setUserLocation(location);

                    setLocationStatus("active");

                    setLocationError(
                        "Ubicación activa"
                    );

                    try {
                        localStorage.setItem(
                            STORAGE_KEYS.location,
                            JSON.stringify(location)
                        );
                    } catch {
                        // Sin acción.
                    }
                },

                (error) => {
                    setLocationStatus("error");

                    if (
                        error.code ===
                        error.PERMISSION_DENIED
                    ) {
                        setLocationError(
                            "Permiso de ubicación denegado."
                        );
                    } else if (
                        error.code ===
                        error.POSITION_UNAVAILABLE
                    ) {
                        setLocationError(
                            "No se pudo determinar tu ubicación."
                        );
                    } else if (
                        error.code ===
                        error.TIMEOUT
                    ) {
                        setLocationError(
                            "La solicitud de ubicación tardó demasiado."
                        );
                    } else {
                        setLocationError(
                            "No fue posible obtener tu ubicación."
                        );
                    }
                },

                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 30000,
                }
            );
        }, [locationStatus]);

    const deactivateGeolocation =
        useCallback(() => {
            if (
                watchIdRef.current !== null &&
                navigator.geolocation
            ) {
                navigator.geolocation.clearWatch(
                    watchIdRef.current
                );

                watchIdRef.current = null;
            }

            setUserLocation(null);

            setLocationStatus("idle");

            setLocationError(
                "Geolocalización inactiva"
            );

            try {
                localStorage.removeItem(
                    STORAGE_KEYS.location
                );
            } catch {
                // Sin acción.
            }
        }, []);

    const toggleGeolocation =
        useCallback(() => {
            if (locationStatus === "active") {
                deactivateGeolocation();
                return;
            }

            activateGeolocation();
        }, [
            locationStatus,
            activateGeolocation,
            deactivateGeolocation,
        ]);

    const startDraggingModal = useCallback((event) => {
        // ---------------------------------------------------------
        // Detectar mouse o touch
        // ---------------------------------------------------------
        const isTouch =
            event.type === "touchstart";

        const point = isTouch
            ? event.touches[0]
            : event;

        if (!point) {
            return;
        }

        // ---------------------------------------------------------
        // Evitar selección de texto / scroll del navegador
        // ---------------------------------------------------------
        event.preventDefault();

        modalDragRef.current = {
            dragging: true,

            startX: point.clientX,
            startY: point.clientY,

            initialX: modalPosition.x,
            initialY: modalPosition.y,
        };

        // ---------------------------------------------------------
        // Eventos globales
        // ---------------------------------------------------------
        const handleMove = (moveEvent) => {
            if (!modalDragRef.current.dragging) {
                return;
            }

            const isMoveTouch =
                moveEvent.type === "touchmove";

            const movePoint = isMoveTouch
                ? moveEvent.touches[0]
                : moveEvent;

            if (!movePoint) {
                return;
            }

            if (isMoveTouch) {
                moveEvent.preventDefault();
            }

            const deltaX =
                movePoint.clientX -
                modalDragRef.current.startX;

            const deltaY =
                movePoint.clientY -
                modalDragRef.current.startY;

            setModalPosition({
                x:
                    modalDragRef.current.initialX +
                    deltaX,

                y:
                    modalDragRef.current.initialY +
                    deltaY,
            });
        };

        const stopDragging = () => {
            modalDragRef.current.dragging = false;

            document.removeEventListener(
                "mousemove",
                handleMove
            );

            document.removeEventListener(
                "mouseup",
                stopDragging
            );

            document.removeEventListener(
                "touchmove",
                handleMove
            );

            document.removeEventListener(
                "touchend",
                stopDragging
            );

            document.removeEventListener(
                "touchcancel",
                stopDragging
            );
        };

        document.addEventListener(
            "mousemove",
            handleMove
        );

        document.addEventListener(
            "mouseup",
            stopDragging
        );

        document.addEventListener(
            "touchmove",
            handleMove,
            {
                passive: false,
            }
        );

        document.addEventListener(
            "touchend",
            stopDragging
        );

        document.addEventListener(
            "touchcancel",
            stopDragging
        );
    }, [modalPosition.x, modalPosition.y]);

    const resetModalPosition = () => {
        setModalPosition({
            x: 0,
            y: 0,
        });
    };

    /* =======================================================
        ABRIR LUGAR
    ======================================================= */

    const openPlace =
        useCallback((place) => {
            setSelectedPlace(
                place
            );

            setShowDetail(true);
        }, []);

    /* =======================================================
        CERRAR DETALLE
    ======================================================= */

    const closeDetail =
        useCallback(() => {
            setShowDetail(false);
        }, []);

    /* =======================================================
        FAVORITOS
    ======================================================= */

    const isFavorite =
        useCallback(
            (place) =>
                favorites.includes(
                    getPlaceId(place)
                ),
            [favorites]
        );

    const toggleFavorite =
        useCallback(
            (event, place) => {
                event?.stopPropagation?.();

                const id =
                    getPlaceId(place);

                setFavorites(
                    (current) =>
                        current.includes(id)
                            ? current.filter(
                                (item) =>
                                    item !== id
                            )
                            : [
                                ...current,
                                id,
                            ]
                );
            },
            [setFavorites]
        );

    /* =======================================================
        VISITADOS
    ======================================================= */

    const isVisited =
        useCallback(
            (place) =>
                visited.includes(
                    getPlaceId(place)
                ),
            [visited]
        );

    const markVisited =
        useCallback(
            (place) => {
                const id =
                    getPlaceId(place);

                setVisited(
                    (current) =>
                        current.includes(id)
                            ? current
                            : [
                                ...current,
                                id,
                            ]
                );
            },
            [setVisited]
        );

    /* =======================================================
        INICIAR RUTA
    ======================================================= */

    const startRoute =
        useCallback(
            (place) => {
                if (!place) {
                    return;
                }

                const coordinates =
                    getPlaceCoordinates(
                        place
                    );

                if (!coordinates) {
                    return;
                }

                setSelectedPlace(
                    place
                );

                markVisited(place);

                if (
                    userLocation
                ) {
                    const url =
                        `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=` +
                        `${userLocation.lat},${userLocation.lng};` +
                        `${coordinates[0]},${coordinates[1]}`;

                    window.open(
                        url,
                        "_blank",
                        "noopener,noreferrer"
                    );

                    return;
                }

                setShowDetail(true);
            },
            [
                userLocation,
                markVisited,
            ]
        );

    /* =======================================================
        ABRIR RUTA TURÍSTICA
    ======================================================= */

    const openRoute =
        useCallback(
            (route) => {
                setActiveRoute(
                    route
                );
            },
            []
        );

    /* =======================================================
        GUARDAR RUTA
    ======================================================= */

    const toggleSavedRoute =
        useCallback(
            (route) => {
                const id =
                    getRouteId(route);

                setSavedRoutes(
                    (current) =>
                        current.includes(id)
                            ? current.filter(
                                (item) =>
                                    item !== id
                            )
                            : [
                                ...current,
                                id,
                            ]
                );
            },
            [setSavedRoutes]
        );

    /* =======================================================
        DIRECCIONES
    ======================================================= */

    const openDirections =
        useCallback(
            (place) => {
                const coordinates =
                    getPlaceCoordinates(
                        place
                    );

                if (!coordinates) {
                    return;
                }

                const destination =
                    `${coordinates[0]},${coordinates[1]}`;

                let url;

                if (
                    userLocation
                ) {
                    url =
                        `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=` +
                        `${userLocation.lat},${userLocation.lng};${destination}`;
                } else {
                    url =
                        `https://www.openstreetmap.org/?mlat=${coordinates[0]}&mlon=${coordinates[1]}#map=15/${coordinates[0]}/${coordinates[1]}`;
                }

                window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer"
                );
            },
            [userLocation]
        );

    /* =======================================================
    AUDIO / GUÍA TURÍSTICA
    ======================================================= */

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        if (
            audioPlace &&
            isAudioPlaying
        ) {
            audio
                .play()
                .catch(() => {
                    setIsAudioPlaying(false);
                });

            return;
        }

        audio.pause();
    }, [
        isAudioPlaying,
        audioPlace,
    ]);

    const stopAudioGuide =
        useCallback(() => {
            const audio =
                audioRef.current;

            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }

            if (
                typeof window !== "undefined" &&
                window.speechSynthesis
            ) {
                window.speechSynthesis.cancel();
            }

            setIsAudioPlaying(false);
        }, []);

    const toggleAudio =
        useCallback(() => {
            const place =
                selectedPlace ||
                placesWithDistance[0];

            if (!place) {
                return;
            }

            /* ==========================================
            SI YA ESTÁ REPRODUCIENDO
            ========================================== */

            if (isAudioPlaying) {
                stopAudioGuide();
                return;
            }

            /* ==========================================
            NUEVO LUGAR
            ========================================== */

            setAudioPlace(place);

            const audioUrl =
                place.audioUrl ??
                place.audio ??
                place.audioGuide;

            /* ==========================================
            AUDIO REAL
            ========================================== */

            if (
                typeof audioUrl === "string" &&
                audioUrl.trim()
            ) {
                setIsAudioPlaying(true);
                return;
            }

            /* ==========================================
            GUÍA POR VOZ DEL NAVEGADOR
            ========================================== */

            if (
                typeof window !== "undefined" &&
                "speechSynthesis" in window
            ) {
                window.speechSynthesis.cancel();

                const title =
                    getPlaceName(place);

                const description =
                    getPlaceDescription(place);

                const category =
                    getPlaceCategory(place);

                const text =
                    `Guía turística de ${title}. ` +
                    `Este lugar pertenece a la categoría ${category}. ` +
                    `${description}`;

                const utterance =
                    new SpeechSynthesisUtterance(
                        text
                    );

                utterance.lang = "es-CO";

                utterance.rate = 0.9;

                utterance.pitch = 1;

                utterance.volume = 1;

                utterance.onstart = () => {
                    setIsAudioPlaying(true);
                };

                utterance.onend = () => {
                    setIsAudioPlaying(false);
                };

                utterance.onerror = () => {
                    setIsAudioPlaying(false);
                };

                speechRef.current =
                    utterance;

                window.speechSynthesis.speak(
                    utterance
                );

                return;
            }

            setIsAudioPlaying(false);
        }, [
            selectedPlace,
            placesWithDistance,
            isAudioPlaying,
            stopAudioGuide,
        ]);

    /* =======================================================
        QR
    ======================================================= */

    const qrValue =
        selectedPlace
            ? `${window.location.origin}${window.location.pathname}?place=${encodeURIComponent(
                getPlaceId(
                    selectedPlace
                )
            )}`
            : window.location.href;

    /* =======================================================
        URL ?place=
    ======================================================= */

    useEffect(() => {
        const params =
            new URLSearchParams(
                window.location.search
            );

        const placeId =
            params.get("place");

        if (!placeId) {
            return;
        }

        const place =
            touristPlaces.find(
                (item) =>
                    getPlaceId(item) ===
                    placeId
            );

        if (place) {
            setSelectedPlace(
                place
            );

            setShowDetail(true);
        }
    }, [touristPlaces]);

    /* =======================================================
        LIMPIAR BÚSQUEDA
    ======================================================= */

    const clearSearch =
        () => {
            setSearch("");

            searchRef.current?.focus();
        };

    useEffect(() => {
        if (showDetail) {
            resetModalPosition();
        }
    }, [selectedPlace]);

    useEffect(() => {
        if (!showDetail) {
            setModalPosition({
                x: 0,
                y: 0,
            });

            modalDragRef.current.dragging = false;
        }
    }, [showDetail]);

    /* =======================================================
       RENDER
    ======================================================= */

    return (
        <main
            className="
                !min-h-screen
                !w-full
                !overflow-x-hidden

                !border-b
                !border-[#b7ddd2]

                !bg-gradient-to-r
                !from-[#e8f5f1]
                !via-[#edf9f7]
                !to-[#e3f5f7]

                !pt-[26px]
                sm:!pt-[22px]
                xl:!pt-[10px]

                !text-slate-900
            "
        >

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header
                className="
                    !fixed
                    !inset-x-0
                    !top-0
                    !z-[9999]
                    !w-full
                    !border-b
                    !border-white/10
                    !bg-gradient-to-r
                    !from-[#045f58]
                    !via-[#08776f]
                    !to-[#087d8c]
                    !shadow-[0_2px_14px_rgba(0,60,55,0.24)]
                "
            >
                <div
                    className="
                        !mx-auto
                        !flex
                        !h-[58px]
                        !w-full
                        !max-w-[1600px]
                        !items-center
                        !justify-between
                        !gap-2
                        !px-3
                        sm:!h-[62px]
                        sm:!px-5
                        lg:!px-7
                    "
                >
                    {/* =========================================================
                        MARCA
                    ========================================================= */}
                    <div
                        className="
                            !flex
                            !min-w-0
                            !items-center
                            !gap-2
                            sm:!gap-2.5
                        "
                    >
                        {/* LOGO */}
                        <div
                            className="
                                !relative
                                !flex
                                !h-9
                                !w-9
                                !shrink-0
                                !items-center
                                !justify-center
                                !overflow-hidden
                                !rounded-lg
                                !border
                                !border-white/40
                                !bg-white
                                !shadow-[0_2px_7px_rgba(0,0,0,0.14)]
                                sm:!h-10
                                sm:!w-10
                            "
                        >
                            <img
                                src="/logo.png"
                                alt="Playas del Viento"
                                className="
                                    !h-full
                                    !w-full
                                    !object-contain
                                    !p-1
                                "
                            />
                        </div>

                        {/* TEXTO */}
                        <div className="!min-w-0">
                            <div
                                className="
                                    !flex
                                    !items-center
                                    !gap-1.5
                                "
                            >
                                <h1
                                    className="
                                        !m-0
                                        !truncate
                                        !text-[14px]
                                        !font-bold
                                        !leading-[1.5]
                                        !tracking-[-0.025em]
                                        !text-white
                                        sm:!text-[18px]
                                    "
                                >
                                    Playas del Viento
                                </h1>

                                <span
                                    className="
                                        !hidden
                                        !rounded-full
                                        !bg-white/15
                                        !px-1.5
                                        !py-0.5
                                        !text-[8px]
                                        !font-extrabold
                                        !uppercase
                                        !tracking-[0.08em]
                                        !text-white/90
                                        sm:!inline-flex
                                    "
                                >
                                    Turismo
                                </span>
                            </div>

                            <p
                                className="
                                    !m-0
                                    !mt-1
                                    !truncate
                                    !text-[8px]
                                    !font-medium
                                    !leading-none
                                    !text-white/75
                                    sm:!text-[9px]
                                "
                            >
                                San Bernardo del Viento · Córdoba
                            </p>
                        </div>
                    </div>

                    {/* =========================================================
                        ACCIONES DESKTOP
                    ========================================================= */}
                    <div
                        className="
                            !hidden
                            !items-center
                            !gap-1.5
                            md:!flex
                        "
                    >
                        {/* UBICACIÓN */}
                        <button
                            type="button"
                            onClick={toggleGeolocation}
                            disabled={locationStatus === "loading"}
                            className={`
                                !flex
                                !h-9
                                !items-center
                                !gap-2
                                !rounded-md
                                !border
                                !px-2.5
                                !text-[10px]
                                !font-bold
                                !transition-colors
                                !duration-150

                                ${locationStatus === "active"
                                    ? "!border-[#9de0c5] !bg-[#e5f6ee] !text-[#145c4a]"
                                    : "!border-white/25 !bg-white/10 !text-white hover:!border-white/45 hover:!bg-white/15"
                                }

                                disabled:!cursor-wait
                                disabled:!opacity-60
                            `}
                        >
                            <span
                                className={`
                                    !flex
                                    !h-6
                                    !w-6
                                    !shrink-0
                                    !items-center
                                    !justify-center
                                    !rounded
                                    ${locationStatus === "active"
                                        ? "!bg-[#cdebdc] !text-[#14735c]"
                                        : "!bg-white/15 !text-white"
                                    }
                                `}
                            >
                                <FaMapMarkerAlt className="!text-[12px]" />
                            </span>

                            <span className="!whitespace-nowrap !text-[11px] !text-semibold">
                                {locationStatus === "loading"
                                    ? "Localizando..."
                                    : locationStatus === "active"
                                        ? "Ubicación activa"
                                        : "Mi ubicación"}
                            </span>
                        </button>

                        {/* QR */}
                        <button
                            type="button"
                            onClick={() => setShowQR(true)}
                            className="
                                !flex
                                !h-9
                                !items-center
                                !gap-2
                                !rounded-md
                                !border
                                !border-white/25
                                !bg-white/10
                                !px-2.5
                                !text-[11px]
                                !font-bold
                                !text-white
                                !transition-colors
                                !duration-150
                                hover:!border-white/45
                                hover:!bg-white/15
                            "
                        >
                            <span
                                className="
                                    !flex
                                    !h-6
                                    !w-6
                                    !items-center
                                    !justify-center
                                    !rounded
                                    !bg-white/15
                                    !text-white
                                "
                            >
                                <FaQrcode className="!text-[13px]" />
                            </span>

                            <span className="!whitespace-nowrap">
                                Código QR
                            </span>
                        </button>

                        {/* AUDIO */}
                        <button
                            type="button"
                            onClick={toggleAudio}
                            className={`
                                !flex
                                !h-9
                                !items-center
                                !gap-2
                                !rounded-md
                                !border
                                !px-2.5
                                !text-[11px]
                                !font-bold
                                !transition-colors
                                !duration-150

                                ${isAudioPlaying
                                    ? "!border-[#9de0c5] !bg-[#e5f6ee] !text-[#145c4a]"
                                    : "!border-white/25 !bg-white/10 !text-white hover:!border-white/45 hover:!bg-white/15"
                                }
                            `}
                        >
                            <span
                                className={`
                                    !flex
                                    !h-6
                                    !w-6
                                    !items-center
                                    !justify-center
                                    !rounded
                                    ${isAudioPlaying
                                        ? "!bg-[#cdebdc] !text-[#14735c]"
                                        : "!bg-white/15 !text-white"
                                    }
                                `}
                            >
                                {isAudioPlaying ? (
                                    <FaPause className="!text-[11px]" />
                                ) : (
                                    <FaHeadphones className="!text-[12px]" />
                                )}
                            </span>

                            <span className="!whitespace-nowrap">
                                {isAudioPlaying
                                    ? "Detener guía"
                                    : "Audio guía"}
                            </span>
                        </button>
                    </div>

                    {/* =========================================================
                        MENÚ MÓVIL
                    ========================================================= */}
                    <button
                        type="button"
                        onClick={() =>
                            setShowMobileMenu((current) => !current)
                        }
                        aria-label={
                            showMobileMenu
                                ? "Cerrar menú"
                                : "Abrir menú"
                        }
                        aria-expanded={showMobileMenu}
                        className="
                            !flex
                            !h-8
                            !w-8
                            !shrink-0
                            !items-center
                            !justify-center
                            !rounded-md
                            !border
                            !border-white/30
                            !bg-white/10
                            !text-white
                            !transition-colors
                            !duration-150
                            hover:!bg-white/20
                            md:!hidden
                        "
                    >
                        {showMobileMenu ? (
                            <FaTimes className="!text-[13px]" />
                        ) : (
                            <FaList className="!text-[13px]" />
                        )}
                    </button>
                </div>

                {/* =============================================================
                    MENÚ MÓVIL
                ============================================================= */}
                {showMobileMenu && (
                    <div
                        className="
                            !border-t
                            !border-white/10
                            !bg-[#f1f8f6]
                            !px-3
                            !py-2.5
                            !shadow-[0_6px_16px_rgba(0,50,45,0.14)]
                            md:!hidden
                        "
                    >
                        <div
                            className="
                                !grid
                                !grid-cols-3
                                !gap-1.5
                            "
                        >
                            {/* UBICACIÓN */}
                            <button
                                type="button"
                                onClick={() => {
                                    toggleGeolocation();
                                    setShowMobileMenu(false);
                                }}
                                disabled={locationStatus === "loading"}
                                className="
                                    !flex
                                    !min-h-[58px]
                                    !flex-col
                                    !items-center
                                    !justify-center
                                    !gap-1
                                    !rounded-md
                                    !border
                                    !border-[#d4e6e2]
                                    !bg-white
                                    !px-1
                                    !py-1.5
                                    !text-[9px]
                                    !font-bold
                                    !text-[#145c4a]
                                    !shadow-sm
                                    active:!bg-[#eef8f4]
                                    disabled:!opacity-60
                                "
                            >
                                <span
                                    className="
                                        !flex
                                        !h-6
                                        !w-6
                                        !items-center
                                        !justify-center
                                        !rounded
                                        !bg-[#dff2e9]
                                        !text-[#16805f]
                                    "
                                >
                                    <FaMapMarkerAlt className="!text-[11px]" />
                                </span>

                                <span>
                                    {locationStatus === "loading"
                                        ? "Localizando"
                                        : locationStatus === "active"
                                            ? "Desactivar"
                                            : "Ubicación"}
                                </span>
                            </button>

                            {/* QR */}
                            <button
                                type="button"
                                onClick={() => {
                                    setShowQR(true);
                                    setShowMobileMenu(false);
                                }}
                                className="
                                    !flex
                                    !min-h-[58px]
                                    !flex-col
                                    !items-center
                                    !justify-center
                                    !gap-1
                                    !rounded-md
                                    !border
                                    !border-[#d4e6e2]
                                    !bg-white
                                    !px-1
                                    !py-1.5
                                    !text-[9px]
                                    !font-bold
                                    !text-[#168795]
                                    !shadow-sm
                                    active:!bg-[#eef8f8]
                                "
                            >
                                <span
                                    className="
                                        !flex
                                        !h-6
                                        !w-6
                                        !items-center
                                        !justify-center
                                        !rounded
                                        !bg-[#e0f5f5]
                                        !text-[#168795]
                                    "
                                >
                                    <FaQrcode className="!text-[12px]" />
                                </span>

                                Código QR
                            </button>

                            {/* AUDIO */}
                            <button
                                type="button"
                                onClick={() => {
                                    toggleAudio();
                                    setShowMobileMenu(false);
                                }}
                                className="
                                    !flex
                                    !min-h-[58px]
                                    !flex-col
                                    !items-center
                                    !justify-center
                                    !gap-1
                                    !rounded-md
                                    !border
                                    !border-[#d4e6e2]
                                    !bg-white
                                    !px-1
                                    !py-1.5
                                    !text-[9px]
                                    !font-bold
                                    !text-[#145c4a]
                                    !shadow-sm
                                    active:!bg-[#eef8f4]
                                "
                            >
                                <span
                                    className="
                                        !flex
                                        !h-6
                                        !w-6
                                        !items-center
                                        !justify-center
                                        !rounded
                                        !bg-[#dff2e9]
                                        !text-[#16805f]
                                    "
                                >
                                    {isAudioPlaying ? (
                                        <FaPause className="!text-[10px]" />
                                    ) : (
                                        <FaHeadphones className="!text-[11px]" />
                                    )}
                                </span>

                                {isAudioPlaying
                                    ? "Detener audio"
                                    : "Audio guía"}
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* =====================================================
                CONTENIDO PRINCIPAL — GEO / TURISMO
            ===================================================== */}

            <section
                className="
                    !mx-auto
                    !w-full
                    !max-w-[1920px]
                    !px-2
                    !pt-[68px]
                    !pb-3

                    sm:!px-3
                    sm:!pt-[74px]

                    lg:!px-4
                    lg:!pt-[78px]

                    xl:!px-5
                    2xl:!px-6
                "
            >
                {/* =====================================================
                    TOOLBAR PRINCIPAL
                ===================================================== */}

                <div
                    className="
                        !relative
                        !z-[30]
                        !mb-2
                        !flex
                        !min-w-0
                        !flex-col
                        !gap-1.5

                        lg:!flex-row
                        lg:!items-center
                    "
                >
                    {/* =================================================
                        BUSCADOR
                    ================================================= */}

                    <div
                        className="
                            !flex
                            !w-full
                            !min-w-0
                            !items-center
                            !gap-1

                            lg:!flex-1
                        "
                    >
                        {/* =================================================
                            BUSCADOR
                        ================================================= */}
                        <div
                            className="
                                !relative
                                !min-w-0
                                !flex-1
                            "
                        >
                            <FaSearch
                                className="
                                    !pointer-events-none
                                    !absolute
                                    !left-3
                                    !top-1/2
                                    !z-10
                                    !-translate-y-1/2
                                    !text-[10px]
                                    !text-slate-400

                                    sm:!text-[11px]
                                "
                            />

                            <input
                                ref={searchRef}
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Buscar lugares, playas, restaurantes, atractivos..."
                                className="
                                    !h-10
                                    !w-full
                                    !rounded-sm
                                    !border
                                    !border-slate-200
                                    !bg-white
                                    !pl-8
                                    !pr-9
                                    !text-[10px]
                                    !font-medium
                                    !text-slate-700
                                    !outline-none
                                    !transition-all

                                    placeholder:!text-slate-400

                                    focus:!border-[#2aa7b0]
                                    focus:!ring-2
                                    focus:!ring-[#2aa7b0]/10

                                    sm:!h-11
                                    sm:!text-[11px]

                                    lg:!text-[12px]
                                "
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="
                                        !absolute
                                        !right-1.5
                                        !top-1/2
                                        !flex
                                        !h-7
                                        !w-7
                                        !-translate-y-1/2
                                        !items-center
                                        !justify-center
                                        !rounded-sm
                                        !text-slate-400
                                        !transition-all

                                        hover:!bg-slate-100
                                        hover:!text-slate-700
                                    "
                                    aria-label="Limpiar búsqueda"
                                >
                                    <FaTimes className="!text-[10px]" />
                                </button>
                            )}
                        </div>

                        {/* =================================================
                            VER MAPA
                        ================================================= */}
                        <button
                            type="button"
                            onClick={() =>
                                setViewMode((current) =>
                                    current === "map"
                                        ? "list"
                                        : "map"
                                )
                            }
                            className={`
                                !flex
                                !h-10
                                !w-10
                                !shrink-0
                                !items-center
                                !justify-center
                                !gap-1.5
                                !rounded-sm
                                !border
                                !px-0
                                !text-[9px]
                                !font-bold
                                !transition-all
                                !duration-200

                                sm:!h-11
                                sm:!w-auto
                                sm:!px-3
                                sm:!text-[9px]

                                lg:!text-[11px]

                                ${
                                    viewMode === "map"
                                        ? "!border-[#168795] !bg-[#edf8f6] !text-[#168795]"
                                        : "!border-[#2d6b4f] !bg-[#2d6b4f] !text-white hover:!bg-[#24563f]"
                                }
                            `}
                            title={
                                viewMode === "map"
                                    ? "Ocultar mapa"
                                    : "Ver mapa"
                            }
                        >
                            {viewMode === "map" ? (
                                <>
                                    <FaTimes className="!text-[10px]" />

                                    <span className="!hidden sm:!inline">
                                        Ocultar mapa
                                    </span>
                                </>
                            ) : (
                                <>
                                    <FaMap className="!text-[10px]" />

                                    <span className="!hidden sm:!inline">
                                        Ver mapa
                                    </span>
                                </>
                            )}
                        </button>
                    </div>

                </div>

                {/* =====================================================
                    CATEGORÍAS
                ===================================================== */}

                <div
                    className="
                        !mb-2
                        !flex
                        !items-center
                        !gap-1
                        !overflow-x-auto
                        !pb-1
                        [scrollbar-width:none]
                        [-ms-overflow-style:none]
                    "
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() =>
                                setSelectedCategory(category)
                            }
                            className={`
                                !flex
                                !h-7
                                !shrink-0
                                !items-center
                                !gap-1
                                !rounded-sm
                                !border
                                !px-2.5
                                !text-[7px]
                                !font-semibold
                                !leading-none
                                !transition-all

                                sm:!h-8
                                sm:!px-3
                                sm:!text-[8px]

                                lg:!text-[11px]

                                ${selectedCategory === category
                                    ? "!border-[#168795] !bg-[#168795] !text-white"
                                    : "!border-slate-200 !bg-white !text-slate-600 hover:!border-[#2aa7b0] hover:!text-[#168795]"
                                }
                            `}
                        >
                            <CategoryIcon category={category} />

                            <span className="!whitespace-nowrap">
                                {category}
                            </span>
                        </button>
                    ))}
                </div>

                {/* =====================================================
                    CONTENIDO — CATÁLOGO / MAPA
                ===================================================== */}

                <div
                    className={`
                        !relative
                        !grid
                        !w-full
                        !min-w-0
                        !gap-2
                        !transition-[grid-template-columns]
                        !duration-150
                        !ease-out

                        ${
                            viewMode === "map"
                                ? `
                                    !grid-cols-[minmax(0,3fr)_minmax(0,7fr)]

                                    lg:!grid-cols-[minmax(0,440px)_minmax(0,1fr)]
                                    xl:!grid-cols-[minmax(0,470px)_minmax(0,1fr)]
                                    2xl:!grid-cols-[minmax(0,500px)_minmax(0,1fr)]
                                `
                                : `
                                    !grid-cols-1

                                    lg:!grid-cols-[minmax(0,1fr)_0fr]
                                `
                        }
                    `}
                >
                    {/* =================================================
                        COLUMNA IZQUIERDA — LUGARES
                    ================================================= */}

                    <aside
                        className={`
                            !min-w-0
                            !min-h-0
                            !w-full
                            !self-start
                            !transition-opacity
                            !duration-150
                            !ease-out

                            ${
                                viewMode === "map"
                                    ? `
                                        !h-[330px]
                                        !min-h-[330px]
                                        !max-h-[330px]

                                        sm:!h-[360px]
                                        sm:!min-h-[360px]
                                        sm:!max-h-[360px]

                                        md:!h-[420px]
                                        md:!min-h-[420px]
                                        md:!max-h-[420px]

                                        lg:!h-[calc(100vh-175px)]
                                        lg:!min-h-[560px]
                                        lg:!max-h-[850px]
                                    `
                                    : `
                                        !h-auto
                                        !min-h-0
                                        !max-h-none
                                    `
                            }
                        `}
                    >
                        <div
                            className={`
                                !flex
                                !h-full
                                !w-full
                                !min-w-0
                                !flex-col
                                !overflow-hidden
                                !rounded-md
                                !border
                                !border-slate-200
                                !bg-white

                                ${
                                    viewMode === "map"
                                        ? ""
                                        : "lg:!h-auto lg:!overflow-visible"
                                }
                            `}
                        >
                            {/* =================================================
                                CABECERA DEL CATÁLOGO
                            ================================================= */}

                            <div
                                className={`
                                    !flex
                                    !shrink-0
                                    !items-center
                                    !justify-between
                                    !gap-1
                                    !border-b
                                    !border-slate-100

                                    ${
                                        viewMode === "map"
                                            ? `
                                                !px-1.5
                                                !py-1.5

                                                sm:!px-2
                                                sm:!py-2

                                                lg:!px-2.5
                                                lg:!py-2.5
                                            `
                                            : `
                                                !px-2.5
                                                !py-2.5

                                                sm:!px-3
                                            `
                                    }
                                `}
                            >
                                <div className="!min-w-0">
                                    <div
                                        className="
                                            !flex
                                            !items-center
                                            !gap-1
                                        "
                                    >
                                        {/* ICONO */}

                                        <div
                                            className={`
                                                !flex
                                                !shrink-0
                                                !items-center
                                                !justify-center
                                                !rounded-sm
                                                !bg-[#edf8f6]
                                                !text-[#168795]

                                                ${
                                                    viewMode === "map"
                                                        ? `
                                                            !h-5
                                                            !w-5

                                                            sm:!h-6
                                                            sm:!w-6

                                                            lg:!h-7
                                                            lg:!w-7
                                                        `
                                                        : `
                                                            !h-7
                                                            !w-7
                                                        `
                                                }
                                            `}
                                        >
                                            <FaMapMarkerAlt
                                                className={`
                                                    ${
                                                        viewMode === "map"
                                                            ? `
                                                                !text-[7px]

                                                                sm:!text-[8px]

                                                                lg:!text-[10px]
                                                            `
                                                            : "!text-[10px]"
                                                    }
                                                `}
                                            />
                                        </div>

                                        <div className="!min-w-0">
                                            <h2
                                                className={`
                                                    !m-0
                                                    !truncate
                                                    !font-bold
                                                    !leading-tight
                                                    !text-slate-800

                                                    ${
                                                        viewMode === "map"
                                                            ? `
                                                                !text-[8px]

                                                                sm:!text-[10px]

                                                                lg:!text-[11px]
                                                            `
                                                            : `
                                                                !text-[11px]

                                                                sm:!text-[12px]
                                                            `
                                                    }
                                                `}
                                            >
                                                Lugares turísticos
                                            </h2>

                                            <p
                                                className={`
                                                    !m-0
                                                    !mt-0.5
                                                    !truncate
                                                    !leading-tight
                                                    !text-slate-400

                                                    ${
                                                        viewMode === "map"
                                                            ? `
                                                                !hidden

                                                                sm:!block
                                                                sm:!text-[7px]

                                                                lg:!text-[9px]
                                                            `
                                                            : `
                                                                !text-[7px]

                                                                sm:!text-[9px]
                                                            `
                                                    }
                                                `}
                                            >
                                                Explora destinos y atractivos
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* CONTADOR */}

                                <span
                                    className={`
                                        !flex
                                        !shrink-0
                                        !items-center
                                        !justify-center
                                        !rounded-sm
                                        !bg-[#edf8f6]
                                        !font-bold
                                        !text-[#168795]

                                        ${
                                            viewMode === "map"
                                                ? `
                                                    !h-5
                                                    !min-w-5
                                                    !px-1
                                                    !text-[7px]

                                                    sm:!h-6
                                                    sm:!min-w-6
                                                    sm:!text-[8px]

                                                    lg:!h-7
                                                    lg:!min-w-7
                                                    lg:!px-2
                                                    lg:!text-[9px]
                                                `
                                                : `
                                                    !h-7
                                                    !min-w-7
                                                    !px-2
                                                    !text-[9px]
                                                `
                                        }
                                    `}
                                >
                                    {filteredPlaces.length}
                                </span>
                            </div>

                            {/* =================================================
                                LISTADO
                            ================================================= */}

                            <div
                                className={`
                                    !min-h-0
                                    !min-w-0
                                    !flex-1
                                    !overflow-y-auto
                                    !overscroll-contain

                                    ${
                                        viewMode === "map"
                                            ? `
                                                !p-0.5

                                                sm:!p-1

                                                lg:!p-1.5
                                            `
                                            : `
                                                !p-1

                                                sm:!p-1.5

                                                lg:!overflow-visible
                                            `
                                    }
                                `}
                            >
                                {filteredPlaces.length === 0 ? (
                                    <div
                                        className="
                                            !flex
                                            !min-h-[150px]
                                            !items-center
                                            !justify-center
                                            !rounded-md
                                            !border
                                            !border-dashed
                                            !border-slate-200
                                            !bg-slate-50
                                            !px-2
                                            !text-center
                                            !text-[8px]
                                            !font-medium
                                            !text-slate-500

                                            sm:!text-[9px]

                                            lg:!min-h-[190px]
                                            lg:!px-4
                                            lg:!text-[10px]
                                        "
                                    >
                                        No encontramos lugares con esa búsqueda.
                                    </div>
                                ) : (
                                    <div
                                        className={`
                                            !w-full
                                            !min-w-0
                                            !self-start

                                            ${
                                                viewMode === "map"
                                                    ? `
                                                        !h-[300px]
                                                        !max-h-[300px]
                                                        !overflow-y-auto
                                                        !overflow-x-hidden
                                                        !overscroll-contain

                                                        sm:!h-[360px]
                                                        sm:!max-h-[360px]

                                                        md:!h-[420px]
                                                        md:!max-h-[420px]

                                                        lg:!h-auto
                                                        lg:!max-h-none
                                                        lg:!overflow-visible
                                                    `
                                                    : `
                                                        !h-auto
                                                        !max-h-none
                                                        !overflow-visible
                                                    `
                                            }
                                        `}
                                    >
                                        <div
                                            className={`
                                                !grid
                                                !w-full
                                                !min-w-0
                                                !content-start
                                                !items-start

                                                ${
                                                    viewMode === "map"
                                                        ? `
                                                            !grid-cols-1
                                                            !gap-0.5

                                                            sm:!gap-1

                                                            lg:!grid-cols-1
                                                            lg:!gap-1
                                                        `
                                                        : `
                                                            !grid-cols-3
                                                            !gap-1

                                                            sm:!grid-cols-3
                                                            sm:!gap-1.5

                                                            md:!grid-cols-3
                                                            md:!gap-2

                                                            lg:!grid-cols-3
                                                            lg:!gap-2

                                                            xl:!grid-cols-5
                                                            xl:!gap-2
                                                        `
                                                }
                                            `}
                                        >
                                            {filteredPlaces.map((place) => {
                                                const id = getPlaceId(place);

                                                const selected =
                                                    getPlaceId(selectedPlace) === id;

                                                const distance =
                                                    place.calculatedDistance;

                                                const image =
                                                    getPlaceImage(place);

                                                const favorite =
                                                    isFavorite(place);

                                                const visited =
                                                    isVisited(place);

                                                return (
                                                    <article
                                                        key={id}
                                                        onClick={() => openPlace(place)}
                                                        className={`
                                                            !group
                                                            !relative
                                                            !min-w-0
                                                            !cursor-pointer
                                                            !overflow-hidden
                                                            !rounded-md
                                                            !border
                                                            !bg-white
                                                            !text-left
                                                            !transition-all
                                                            !duration-150

                                                            ${
                                                                selected
                                                                    ? "!border-[#2aa7b0] !bg-[#f5fbfa] !ring-1 !ring-[#2aa7b0]/10"
                                                                    : "!border-slate-200"
                                                            }

                                                            ${
                                                                viewMode === "map"
                                                                    ? `
                                                                        !flex
                                                                        !min-h-[38px]
                                                                        !items-center
                                                                        !gap-0.5
                                                                        !px-0.5
                                                                        !py-0.5

                                                                        sm:!min-h-[42px]
                                                                        sm:!gap-1
                                                                        sm:!px-1
                                                                        sm:!py-0.5

                                                                        lg:!grid
                                                                        lg:!min-h-0
                                                                        lg:!grid-cols-[115px_minmax(0,1fr)]
                                                                        lg:!gap-0
                                                                        lg:!p-0
                                                                    `
                                                                    : `
                                                                        !flex
                                                                        !flex-col
                                                                    `
                                                            }
                                                        `}
                                                    >
                                                        {/* =================================================
                                                            IMAGEN
                                                            MAPA EN MÓVIL = OCULTA
                                                            CATÁLOGO = RESPONSIVE
                                                        ================================================= */}

                                                        <div
                                                            className={`
                                                                !relative
                                                                !w-full
                                                                !overflow-hidden
                                                                !bg-[#edf7f5]

                                                                ${
                                                                    viewMode === "map"
                                                                        ? `
                                                                            !hidden

                                                                            lg:!block
                                                                            lg:!h-[92px]
                                                                        `
                                                                        : `
                                                                            !aspect-[1.25/1]

                                                                            sm:!aspect-[1.4/1]

                                                                            lg:!aspect-[1.5/1]
                                                                        `
                                                                }
                                                            `}
                                                        >
                                                            {image ? (
                                                                <img
                                                                    src={image}
                                                                    alt={getPlaceName(place)}
                                                                    loading="lazy"
                                                                    className="
                                                                        !block
                                                                        !h-full
                                                                        !w-full
                                                                        !object-cover
                                                                    "
                                                                    onError={(event) => {
                                                                        event.currentTarget.onerror = null;

                                                                        event.currentTarget.src =
                                                                            "/logo.png";

                                                                        event.currentTarget.className =
                                                                            `
                                                                                !block
                                                                                !h-full
                                                                                !w-full
                                                                                !object-contain
                                                                                !bg-[#edf7f5]
                                                                                !p-4
                                                                            `;
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="
                                                                        !flex
                                                                        !h-full
                                                                        !w-full
                                                                        !items-center
                                                                        !justify-center
                                                                        !bg-[#edf7f5]
                                                                    "
                                                                >
                                                                    <img
                                                                        src="/logo.png"
                                                                        alt="Lugar turístico"
                                                                        className="
                                                                            !h-8
                                                                            !w-8
                                                                            !object-contain
                                                                        "
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* GRADIENTE */}

                                                            <div
                                                                className="
                                                                    !pointer-events-none
                                                                    !absolute
                                                                    !inset-x-0
                                                                    !bottom-0
                                                                    !h-12
                                                                    !bg-gradient-to-t
                                                                    !from-black/50
                                                                    !via-black/10
                                                                    !to-transparent
                                                                "
                                                            />

                                                            {/* CATEGORÍA */}

                                                            <div
                                                                className="
                                                                    !absolute
                                                                    !left-1
                                                                    !top-1
                                                                    !flex
                                                                    !max-w-[72%]
                                                                    !items-center
                                                                    !gap-0.5
                                                                    !overflow-hidden
                                                                    !rounded-sm
                                                                    !bg-white/95
                                                                    !px-1
                                                                    !py-0.5
                                                                    !text-[5px]
                                                                    !font-bold
                                                                    !uppercase
                                                                    !tracking-wide
                                                                    !text-[#285c3f]
                                                                    !shadow-sm

                                                                    sm:!left-1.5
                                                                    sm:!top-1.5
                                                                    sm:!gap-1
                                                                    sm:!px-1.5
                                                                    sm:!py-1
                                                                    sm:!text-[6.5px]
                                                                "
                                                            >
                                                                <CategoryIcon
                                                                    category={getPlaceCategory(place)}
                                                                />

                                                                <span className="!truncate">
                                                                    {getPlaceCategory(place)}
                                                                </span>
                                                            </div>

                                                            {/* FAVORITO */}

                                                            <button
                                                                type="button"
                                                                onClick={(event) =>
                                                                    toggleFavorite(
                                                                        event,
                                                                        place
                                                                    )
                                                                }
                                                                className="
                                                                    !absolute
                                                                    !right-1
                                                                    !top-1
                                                                    !flex
                                                                    !h-5
                                                                    !w-5
                                                                    !items-center
                                                                    !justify-center
                                                                    !rounded-full
                                                                    !bg-white/95
                                                                    !text-slate-500
                                                                    !shadow-sm

                                                                    sm:!right-1.5
                                                                    sm:!top-1.5
                                                                    sm:!h-6
                                                                    sm:!w-6
                                                                "
                                                                aria-label={
                                                                    favorite
                                                                        ? "Quitar de favoritos"
                                                                        : "Agregar a favoritos"
                                                                }
                                                            >
                                                                {favorite ? (
                                                                    <FaHeart
                                                                        className="
                                                                            !text-[9px]
                                                                            !text-red-500

                                                                            sm:!text-[11px]
                                                                        "
                                                                    />
                                                                ) : (
                                                                    <FaRegHeart
                                                                        className="
                                                                            !text-[9px]

                                                                            sm:!text-[11px]
                                                                        "
                                                                    />
                                                                )}
                                                            </button>

                                                            {/* DISTANCIA */}

                                                            {distance != null && (
                                                                <div
                                                                    className="
                                                                        !absolute
                                                                        !bottom-1
                                                                        !left-1
                                                                        !hidden
                                                                        !items-center
                                                                        !gap-0.5
                                                                        !rounded-sm
                                                                        !bg-black/55
                                                                        !px-1
                                                                        !py-0.5
                                                                        !text-[6px]
                                                                        !font-bold
                                                                        !text-white
                                                                        !backdrop-blur-[2px]

                                                                        sm:!flex
                                                                        sm:!text-[7px]
                                                                    "
                                                                >
                                                                    <FaLocationArrow />

                                                                    {formatDistance(distance)}
                                                                </div>
                                                            )}

                                                            {/* VISITADO */}

                                                            {visited && (
                                                                <div
                                                                    className="
                                                                        !absolute
                                                                        !bottom-1
                                                                        !right-1
                                                                        !flex
                                                                        !h-4
                                                                        !w-4
                                                                        !items-center
                                                                        !justify-center
                                                                        !rounded-full
                                                                        !bg-[#2d6b4f]
                                                                        !text-white
                                                                        !shadow-sm

                                                                        sm:!h-5
                                                                        sm:!w-5
                                                                    "
                                                                    title="Lugar visitado"
                                                                >
                                                                    <FaCheckCircle
                                                                        className="
                                                                            !text-[8px]

                                                                            sm:!text-[9px]
                                                                        "
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* =================================================
                                                            CONTENIDO
                                                        ================================================= */}

                                                        <div
                                                            className={`
                                                                !flex
                                                                !min-w-0
                                                                !flex-1
                                                                !flex-col

                                                                ${
                                                                    viewMode === "map"
                                                                        ? `
                                                                            !justify-center
                                                                            !p-0

                                                                            lg:!justify-start
                                                                            lg:!p-1.5
                                                                        `
                                                                        : `
                                                                            !p-1

                                                                            sm:!p-1.5

                                                                            lg:!p-1.5
                                                                        `
                                                                }
                                                            `}
                                                        >
                                                            {/* NOMBRE */}

                                                            <div
                                                                className="
                                                                    !flex
                                                                    !min-w-0
                                                                    !items-center
                                                                    !gap-0.5
                                                                "
                                                            >
                                                                <h3
                                                                    className={`
                                                                        !m-0
                                                                        !min-w-0
                                                                        !flex-1
                                                                        !font-bold
                                                                        !leading-[1.15]
                                                                        !text-slate-800

                                                                        ${
                                                                            viewMode === "map"
                                                                                ? `
                                                                                    !line-clamp-2
                                                                                    !text-[8px]

                                                                                    sm:!text-[9px]

                                                                                    lg:!text-[10px]
                                                                                `
                                                                                : `
                                                                                    !line-clamp-2
                                                                                    !text-[8px]

                                                                                    sm:!text-[10px]

                                                                                    md:!text-[11px]
                                                                                `
                                                                        }
                                                                    `}
                                                                >
                                                                    {getPlaceName(place)}
                                                                </h3>

                                                                {/* FAVORITO MÓVIL + MAPA */}

                                                                {viewMode === "map" && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(event) => {
                                                                            event.stopPropagation();

                                                                            toggleFavorite(
                                                                                event,
                                                                                place
                                                                            );
                                                                        }}
                                                                        className="
                                                                            !flex
                                                                            !h-5
                                                                            !w-5
                                                                            !shrink-0
                                                                            !items-center
                                                                            !justify-center
                                                                            !rounded-full
                                                                            !bg-slate-50
                                                                            !text-slate-400

                                                                            sm:!h-5
                                                                            sm:!w-5

                                                                            lg:!hidden
                                                                        "
                                                                        aria-label={
                                                                            favorite
                                                                                ? "Quitar de favoritos"
                                                                                : "Agregar a favoritos"
                                                                        }
                                                                    >
                                                                        {favorite ? (
                                                                            <FaHeart
                                                                                className="
                                                                                    !text-[7px]
                                                                                    !text-red-500
                                                                                "
                                                                            />
                                                                        ) : (
                                                                            <FaRegHeart
                                                                                className="
                                                                                    !text-[7px]
                                                                                "
                                                                            />
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {/* DESCRIPCIÓN */}

                                                            <p
                                                                className={`
                                                                    !m-0
                                                                    !mt-0.5
                                                                    !line-clamp-1
                                                                    !text-[8.5px]
                                                                    !leading-[1.3]
                                                                    !text-slate-500

                                                                    sm:!mt-1
                                                                    sm:!text-[10px]
                                                                    sm:!line-clamp-2

                                                                    ${
                                                                        viewMode === "map"
                                                                            ? `
                                                                                !hidden

                                                                                lg:!block
                                                                                lg:!text-[9px]
                                                                            `
                                                                            : ""
                                                                    }
                                                                `}
                                                            >
                                                                {place.shortDescription ||
                                                                    getPlaceDescription(place)}
                                                            </p>

                                                            {/* =================================================
                                                                ACCIONES
                                                            ================================================= */}

                                                            <div
                                                                className={`
                                                                    !flex
                                                                    !w-full
                                                                    !items-center
                                                                    !justify-center

                                                                    ${
                                                                        viewMode === "map"
                                                                            ? `
                                                                                !mt-0.5

                                                                                lg:!mt-1
                                                                            `
                                                                            : `
                                                                                !mt-1
                                                                            `
                                                                    }
                                                                `}
                                                            >
                                                                {/* CONTENEDOR DEL BOTÓN RUTA */}

                                                                <div
                                                                    className="
                                                                        !flex
                                                                        !w-full
                                                                        !items-center
                                                                        !justify-center
                                                                    "
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={(event) => {
                                                                            event.stopPropagation();

                                                                            startRoute(place);
                                                                        }}
                                                                        className={`
                                                                            !flex
                                                                            !w-auto
                                                                            !shrink-0
                                                                            !items-center
                                                                            !justify-center
                                                                            !gap-0.5
                                                                            !rounded-sm
                                                                            !bg-[#2aa7b0]
                                                                            !px-2
                                                                            !font-bold
                                                                            !text-white
                                                                            !transition-colors

                                                                            hover:!bg-[#168795]
                                                                            active:!bg-[#168795]

                                                                            ${
                                                                                viewMode === "map"
                                                                                    ? `
                                                                                        !min-h-[18px]
                                                                                        !text-[7.5px]

                                                                                        sm:!min-h-[20px]
                                                                                        sm:!px-2
                                                                                        sm:!text-[8.5px]

                                                                                        lg:!min-h-[25px]
                                                                                        lg:!px-2.5
                                                                                        lg:!text-[11px]
                                                                                    `
                                                                                    : `
                                                                                        !min-h-[22px]
                                                                                        !text-[7.5px]

                                                                                        sm:!min-h-[25px]
                                                                                        sm:!px-2
                                                                                        sm:!text-[8.5px]

                                                                                        lg:!min-h-[26px]
                                                                                        lg:!px-2.5
                                                                                        lg:!text-[11px]
                                                                                    `
                                                                            }
                                                                        `}
                                                                    >
                                                                        <FaRoute />

                                                                        <span>
                                                                            Ruta
                                                                        </span>
                                                                    </button>

                                                                    {/* DETALLE */}

                                                                    <button
                                                                        type="button"
                                                                        onClick={(event) => {
                                                                            event.stopPropagation();

                                                                            openPlace(place);
                                                                        }}
                                                                        className={`
                                                                            !ml-1
                                                                            !flex
                                                                            !shrink-0
                                                                            !items-center
                                                                            !justify-center
                                                                            !rounded-sm
                                                                            !border
                                                                            !border-slate-200
                                                                            !bg-white
                                                                            !text-slate-500
                                                                            !transition-colors

                                                                            hover:!border-[#2aa7b0]
                                                                            hover:!text-[#168795]

                                                                            ${
                                                                                viewMode === "map"
                                                                                    ? `
                                                                                        !h-[18px]
                                                                                        !w-[18px]

                                                                                        sm:!h-5
                                                                                        sm:!w-5

                                                                                        lg:!h-[25px]
                                                                                        lg:!w-[25px]
                                                                                    `
                                                                                    : `
                                                                                        !h-[22px]
                                                                                        !w-[22px]

                                                                                        sm:!h-[25px]
                                                                                        sm:!w-[25px]
                                                                                    `
                                                                            }
                                                                        `}
                                                                        title="Ver detalle"
                                                                        aria-label="Ver detalle"
                                                                    >
                                                                        <FaChevronRight
                                                                            className={`
                                                                                ${
                                                                                    viewMode === "map"
                                                                                        ? `
                                                                                            !text-[8.5px]

                                                                                            sm:!text-[11px]

                                                                                            lg:!text-[11px]
                                                                                        `
                                                                                        : `
                                                                                            !text-[8.5px]

                                                                                            sm:!text-[11px]
                                                                                        `
                                                                                }
                                                                            `}
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </article>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* =====================================================
                        COLUMNA DERECHA — MAPA
                    ===================================================== */}

                    <section
                        className={`
                            !relative
                            !min-w-0
                            !overflow-hidden

                            ${
                                viewMode === "map"
                                    ? "!block !opacity-100"
                                    : "!hidden lg:!hidden"
                            }
                        `}
                    >
                        <div
                            className="
                                !relative
                                !h-[330px]
                                !min-h-[330px]
                                !max-h-[330px]
                                !w-full
                                !overflow-hidden
                                !rounded-md
                                !border
                                !border-slate-200
                                !bg-[#dbeef1]

                                sm:!h-[390px]
                                sm:!min-h-[390px]
                                sm:!max-h-[390px]

                                md:!h-[450px]
                                md:!min-h-[450px]
                                md:!max-h-[450px]

                                lg:!h-[calc(100vh-175px)]
                                lg:!min-h-[560px]
                                lg:!max-h-[850px]
                            "
                        >
                            <MapContainer
                                center={MAP_CENTER}
                                zoom={13}
                                scrollWheelZoom={true}
                                zoomControl={true}
                                className="
                                    !z-0
                                    !h-full
                                    !w-full
                                "
                            >
                                <MapSizeController
                                    viewMode={viewMode}
                                />

                                <TileLayer
                                    attribution="&copy; OpenStreetMap contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    keepBuffer={2}
                                    updateWhenZooming={false}
                                    updateWhenIdle={true}
                                />

                                <MapController
                                    selectedPlace={selectedPlace}
                                />

                                {activeRouteCoordinates.length > 1 && (
                                    <RouteController
                                        coordinates={
                                            activeRouteCoordinates
                                        }
                                    />
                                )}

                                {/* =================================================
                                    POLYLINE
                                ================================================= */}

                                {activeRouteCoordinates.length > 1 && (
                                    <Polyline
                                        positions={
                                            activeRouteCoordinates
                                        }
                                        pathOptions={{
                                            color:
                                                activeRoute?.color ??
                                                "#2aa7b0",
                                            weight: 5,
                                            opacity: 0.85,
                                        }}
                                    />
                                )}

                                {/* =================================================
                                    MARCADORES TURÍSTICOS
                                ================================================= */}

                                {touristPlaces.map((place) => {
                                    const coordinates =
                                        getPlaceCoordinates(place);

                                    if (!coordinates) {
                                        return null;
                                    }

                                    const selected =
                                        getPlaceId(selectedPlace) ===
                                        getPlaceId(place);

                                    return (
                                        <CircleMarker
                                            key={getPlaceId(place)}
                                            center={coordinates}
                                            radius={
                                                selected ? 11 : 7
                                            }
                                            pathOptions={{
                                                color: "#ffffff",
                                                fillColor:
                                                    selected
                                                        ? "#168795"
                                                        : "#2d6b4f",
                                                fillOpacity: 0.95,
                                                weight:
                                                    selected ? 3 : 2,
                                            }}
                                            eventHandlers={{
                                                mouseover: (event) => {
                                                    event.target.openPopup();
                                                },

                                                click: () => {
                                                    setSelectedPlace(
                                                        place
                                                    );
                                                },
                                            }}
                                        >
                                            <Popup>
                                                <div
                                                    className="
                                                        !w-[195px]
                                                        !p-0.5
                                                    "
                                                >
                                                    <img
                                                        src={getPlaceImage(
                                                            place
                                                        )}
                                                        alt=""
                                                        className="
                                                            !mb-1.5
                                                            !h-[70px]
                                                            !w-full
                                                            !rounded-sm
                                                            !object-cover
                                                        "
                                                        onError={(
                                                            event
                                                        ) => {
                                                            event.currentTarget.onerror =
                                                                null;

                                                            event.currentTarget.src =
                                                                "/images/tourism/playa-viento.jpg";
                                                        }}
                                                    />

                                                    <div
                                                        className="
                                                            !flex
                                                            !items-center
                                                            !gap-1
                                                            !text-[7px]
                                                            !font-bold
                                                            !uppercase
                                                            !text-[#168795]
                                                        "
                                                    >
                                                        <CategoryIcon
                                                            category={getPlaceCategory(
                                                                place
                                                            )}
                                                        />

                                                        {getPlaceCategory(
                                                            place
                                                        )}
                                                    </div>

                                                    <strong
                                                        className="
                                                            !mt-0.5
                                                            !block
                                                            !text-[12px]
                                                            !leading-tight
                                                            !text-slate-800
                                                        "
                                                    >
                                                        {getPlaceName(place)}
                                                    </strong>

                                                    <p
                                                        className="
                                                            !m-0
                                                            !mt-1
                                                            !line-clamp-2
                                                            !text-[9px]
                                                            !leading-relaxed
                                                            !text-slate-500
                                                        "
                                                    >
                                                        {getPlaceDescription(
                                                            place
                                                        )}
                                                    </p>

                                                    <div
                                                        className="
                                                            !mt-1.5
                                                            !flex
                                                            !items-center
                                                            !gap-1
                                                            !text-[8px]
                                                            !font-semibold
                                                            !text-[#168795]
                                                        "
                                                    >
                                                        <FaLocationArrow />

                                                        {userLocation
                                                            ? formatDistance(
                                                                calculateDistance(
                                                                    userLocation.lat,
                                                                    userLocation.lng,
                                                                    coordinates[0],
                                                                    coordinates[1]
                                                                )
                                                            )
                                                            : "Punto turístico"}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            startRoute(
                                                                place
                                                            )
                                                        }
                                                        className="
                                                            !mt-1.5
                                                            !flex
                                                            !w-full
                                                            !items-center
                                                            !justify-center
                                                            !gap-1
                                                            !rounded-sm
                                                            !bg-[#2aa7b0]
                                                            !px-2
                                                            !py-1.5
                                                            !text-[9px]
                                                            !font-bold
                                                            !text-white

                                                            hover:!bg-[#168795]

                                                            lg:!text-[11px]
                                                        "
                                                    >
                                                        <FaRoute />

                                                        Iniciar ruta
                                                    </button>
                                                </div>
                                            </Popup>
                                        </CircleMarker>
                                    );
                                })}

                                {/* =================================================
                                    UBICACIÓN DEL USUARIO
                                ================================================= */}

                                {userLocation && (
                                    <>
                                        <Circle
                                            center={[
                                                userLocation.lat,
                                                userLocation.lng,
                                            ]}
                                            radius={
                                                userLocation.accuracy ?? 30
                                            }
                                            pathOptions={{
                                                color: "#168795",
                                                fillColor: "#2aa7b0",
                                                fillOpacity: 0.1,
                                                weight: 1,
                                            }}
                                        />

                                        <CircleMarker
                                            center={[
                                                userLocation.lat,
                                                userLocation.lng,
                                            ]}
                                            radius={8}
                                            pathOptions={{
                                                color: "#ffffff",
                                                fillColor: "#168795",
                                                fillOpacity: 1,
                                                weight: 3,
                                            }}
                                        >
                                            <Popup>
                                                Tu ubicación actual
                                            </Popup>
                                        </CircleMarker>
                                    </>
                                )}
                            </MapContainer>

                            {/* =================================================
                                ESTADO DEL MAPA
                            ================================================= */}

                            <div
                                className="
                                    !pointer-events-none
                                    !absolute
                                    !left-1
                                    !top-1
                                    !z-[500]
                                    !flex
                                    !items-center
                                    !gap-1
                                    !rounded-sm
                                    !border
                                    !border-white/80
                                    !bg-white/95
                                    !px-1.5
                                    !py-1
                                    !text-[7px]
                                    !font-bold
                                    !text-slate-600
                                    !shadow-sm

                                    sm:!left-2
                                    sm:!top-2
                                    sm:!text-[9px]

                                    lg:!text-[10px]
                                "
                            >
                                <span
                                    className={`
                                        !h-1.5
                                        !w-1.5
                                        !rounded-sm

                                        ${
                                            locationStatus === "active"
                                                ? "!bg-emerald-500"
                                                : "!bg-slate-400"
                                        }
                                    `}
                                />

                                {locationStatus === "active"
                                    ? "Ubicación activa"
                                    : "Explorando mapa"}
                            </div>

                            {/* =================================================
                                GEOLOCALIZACIÓN
                            ================================================= */}

                            <button
                                type="button"
                                onClick={activateGeolocation}
                                className="
                                    !absolute
                                    !right-1
                                    !top-1
                                    !z-[500]
                                    !flex
                                    !h-7
                                    !w-7
                                    !items-center
                                    !justify-center
                                    !rounded-sm
                                    !border
                                    !border-slate-200
                                    !bg-white
                                    !text-[#168795]
                                    !shadow-sm
                                    !transition-all

                                    hover:!scale-105
                                    hover:!bg-[#edf8f6]

                                    sm:!right-2
                                    sm:!top-2
                                    sm:!h-8
                                    sm:!w-8

                                    lg:!h-9
                                    lg:!w-9
                                "
                                title="Mi ubicación"
                                aria-label="Mi ubicación"
                            >
                                <FaLocationArrow className="!text-[9px] sm:!text-[10px]" />
                            </button>

                            {/* =================================================
                                CONTADOR
                            ================================================= */}

                            <div
                                className="
                                    !absolute
                                    !bottom-1
                                    !left-1
                                    !z-[500]
                                    !rounded-sm
                                    !border
                                    !border-white
                                    !bg-white/95
                                    !px-1.5
                                    !py-1
                                    !text-[6px]
                                    !font-semibold
                                    !text-slate-500
                                    !shadow-sm

                                    sm:!bottom-2
                                    sm:!left-2
                                    sm:!px-2
                                    sm:!text-[8px]

                                    lg:!text-[11px]
                                "
                            >
                                {touristPlaces.length} lugares
                            </div>

                            {/* =================================================
                                RUTA ACTIVA
                            ================================================= */}

                            {activeRouteCoordinates.length > 1 && (
                                <div
                                    className="
                                        !absolute
                                        !bottom-1
                                        !right-1
                                        !z-[500]
                                        !flex
                                        !items-center
                                        !gap-1
                                        !rounded-sm
                                        !bg-[#168795]
                                        !px-1.5
                                        !py-1
                                        !text-[6px]
                                        !font-bold
                                        !text-white
                                        !shadow-sm

                                        sm:!bottom-2
                                        sm:!right-2
                                        sm:!px-2
                                        sm:!text-[8px]

                                        lg:!text-[11px]
                                    "
                                >
                                    <FaRoute />

                                    Ruta activa
                                </div>
                            )}
                        </div>
                    </section>
                </div>

            </section>

            {/* =========================================================
                SECCIÓN INFORMATIVA
            ========================================================= */}
            <section
                className="
                    !w-full
                    !mt-5
                    !border-t
                    !border-slate-200
                    !bg-white
                    !px-2
                    !py-5

                    sm:!mt-6
                    sm:!px-4
                    sm:!py-6

                    md:!px-6
                    md:!py-7

                    lg:!px-8
                "
            >
                <div
                    className="
                        !mx-auto
                        !w-full
                        !max-w-[1400px]
                    "
                >
                    {/* Encabezado */}
                    <div
                        className="
                            !mb-4
                            !text-center

                            sm:!mb-5
                        "
                    >
                        <span
                            className="
                                !inline-flex
                                !items-center
                                !rounded-sm
                                !border
                                !border-[#d8eeeb]
                                !bg-[#eef8f7]
                                !px-2
                                !py-0.5
                                !text-[8px]
                                !font-bold
                                !uppercase
                                !tracking-wide
                                !text-[#16877d]
                            "
                        >
                            Turismo local
                        </span>

                        <h2
                            className="
                                !mt-1.5
                                !text-base
                                !font-bold
                                !leading-tight
                                !tracking-tight
                                !text-slate-900

                                sm:!text-lg

                                md:!text-xl
                            "
                        >
                            Descubre San Bernardo del Viento
                        </h2>

                        <p
                            className="
                                !mx-auto
                                !mt-1
                                !max-w-2xl
                                !text-[9px]
                                !leading-relaxed
                                !text-slate-500

                                sm:!text-[10px]

                                md:!text-[11px]
                            "
                        >
                            Explora playas, ríos, manglares, islas y lugares naturales
                            del Caribe colombiano.
                        </p>
                    </div>

                    {/* =====================================================
                        INFORMACIÓN
                        En móvil: una sola fila horizontal con scroll
                    ===================================================== */}
                    <div
                        className="
                            !flex
                            !w-full
                            !gap-1.5
                            !overflow-x-auto
                            !overflow-y-hidden
                            !overscroll-x-contain
                            !pb-1

                            sm:!grid
                            sm:!grid-cols-4
                            sm:!gap-2
                            sm:!overflow-visible

                            md:!gap-2.5
                        "
                    >
                        {/* Playas */}
                        <div
                            className="
                                !min-w-[210px]
                                !shrink-0
                                !border
                                !border-slate-100
                                !bg-[#f8fbfb]
                                !p-2.5

                                sm:!min-w-0
                                sm:!shrink
                                sm:!p-3

                                md:!p-3.5
                            "
                        >
                            <div
                                className="
                                    !mb-2
                                    !flex
                                    !h-7
                                    !w-7
                                    !items-center
                                    !justify-center
                                    !rounded-sm
                                    !bg-[#e5f5f3]
                                    !text-[#16877d]
                                "
                            >
                                <FaLocationArrow className="!text-[11px]" />
                            </div>

                            <h3
                                className="
                                    !text-[11px]
                                    !font-bold
                                    !leading-tight
                                    !text-slate-800

                                    sm:!text-xs
                                "
                            >
                                Playas y naturaleza
                            </h3>

                            <p
                                className="
                                    !mt-1
                                    !text-[9px]
                                    !leading-snug
                                    !text-slate-500
                                "
                            >
                                Conoce playas y espacios naturales para caminar,
                                descansar y disfrutar del paisaje.
                            </p>
                        </div>

                        {/* Experiencias */}
                        <div
                            className="
                                !min-w-[210px]
                                !shrink-0
                                !border
                                !border-slate-100
                                !bg-[#f8fbfb]
                                !p-2.5

                                sm:!min-w-0
                                sm:!shrink
                                sm:!p-3

                                md:!p-3.5
                            "
                        >
                            <div
                                className="
                                    !mb-2
                                    !flex
                                    !h-7
                                    !w-7
                                    !items-center
                                    !justify-center
                                    !rounded-sm
                                    !bg-[#e5f5f3]
                                    !text-[#16877d]
                                "
                            >
                                <FaCheckCircle className="!text-[11px]" />
                            </div>

                            <h3
                                className="
                                    !text-[11px]
                                    !font-bold
                                    !leading-tight
                                    !text-slate-800

                                    sm:!text-xs
                                "
                            >
                                Experiencias locales
                            </h3>

                            <p
                                className="
                                    !mt-1
                                    !text-[9px]
                                    !leading-snug
                                    !text-slate-500
                                "
                            >
                                Descubre lugares y actividades para conocer mejor
                                la cultura y el entorno del municipio.
                            </p>
                        </div>

                        {/* Rutas */}
                        <div
                            className="
                                !min-w-[210px]
                                !shrink-0
                                !border
                                !border-slate-100
                                !bg-[#f8fbfb]
                                !p-2.5

                                sm:!min-w-0
                                sm:!shrink
                                sm:!p-3

                                md:!p-3.5
                            "
                        >
                            <div
                                className="
                                    !mb-2
                                    !flex
                                    !h-7
                                    !w-7
                                    !items-center
                                    !justify-center
                                    !rounded-sm
                                    !bg-[#e5f5f3]
                                    !text-[#16877d]
                                "
                            >
                                <FaRoute className="!text-[11px]" />
                            </div>

                            <h3
                                className="
                                    !text-[11px]
                                    !font-bold
                                    !leading-tight
                                    !text-slate-800

                                    sm:!text-xs
                                "
                            >
                                Rutas y recorridos
                            </h3>

                            <p
                                className="
                                    !mt-1
                                    !text-[9px]
                                    !leading-snug
                                    !text-slate-500
                                "
                            >
                                Utiliza el mapa para ubicar sitios de interés y
                                planificar tus recorridos.
                            </p>
                        </div>

                        {/* Favoritos */}
                        <div
                            className="
                                !min-w-[210px]
                                !shrink-0
                                !border
                                !border-slate-100
                                !bg-[#f8fbfb]
                                !p-2.5

                                sm:!min-w-0
                                sm:!shrink
                                sm:!p-3

                                md:!p-3.5
                            "
                        >
                            <div
                                className="
                                    !mb-2
                                    !flex
                                    !h-7
                                    !w-7
                                    !items-center
                                    !justify-center
                                    !rounded-sm
                                    !bg-[#e5f5f3]
                                    !text-[#16877d]
                                "
                            >
                                <FaHeart className="!text-[11px]" />
                            </div>

                            <h3
                                className="
                                    !text-[11px]
                                    !font-bold
                                    !leading-tight
                                    !text-slate-800

                                    sm:!text-xs
                                "
                            >
                                Lugares para recordar
                            </h3>

                            <p
                                className="
                                    !mt-1
                                    !text-[9px]
                                    !leading-snug
                                    !text-slate-500
                                "
                            >
                                Guarda tus lugares favoritos y crea tu propia lista
                                de sitios por visitar.
                            </p>
                        </div>
                    </div>

                    {/* Frase inferior */}
                    <div
                        className="
                            !mt-4
                            !rounded-sm
                            !bg-[#16877d]
                            !px-3
                            !py-3
                            !text-center

                            sm:!mt-5
                            sm:!px-4
                            sm:!py-3.5
                        "
                    >
                        <h3
                            className="
                                !text-[11px]
                                !font-bold
                                !leading-tight
                                !text-white

                                sm:!text-[12px]
                                md:!text-[12px]
                            "
                        >
                            Tu próxima experiencia comienza aquí.
                        </h3>

                        <p
                            className="
                                !mx-auto
                                !mt-0.5
                                !max-w-xl
                                !text-[9px]
                                !leading-relaxed
                                !text-white/80

                                sm:!text-[10px]
                            "
                        >
                            Explora el mapa, descubre nuevos lugares y encuentra
                            tu próximo destino.
                        </p>
                    </div>
                </div>
            </section>

            {/* =====================================================
                MODAL DETALLE
            ===================================================== */}

            {showDetail && selectedPlace && (
                <div
                    className="
                        !fixed
                        !inset-0
                        !z-[9999]
                        !flex
                        !items-center
                        !justify-center
                        !overflow-hidden
                        !bg-slate-950/60
                        !p-2
                        sm:!p-3
                    "
                    onClick={closeDetail}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        onClick={(event) => event.stopPropagation()}
                        style={{
                            transform: `translate3d(${modalPosition.x}px, ${modalPosition.y}px, 0)`,
                        }}

                        className="
                            !relative
                            !flex
                            !w-full
                            !max-w-[680px]
                            !max-h-[calc(100dvh-16px)]
                            !flex-col
                            !overflow-hidden
                            !rounded-lg
                            !border
                            !border-[#d7cbb4]
                            !bg-[#fbf8f0]
                            !shadow-[0_18px_55px_rgba(0,0,0,0.25)]
                            !will-change-transform

                            sm:!max-h-[520px]
                            sm:!grid
                            sm:!grid-cols-[38%_62%]
                        "
                    >
                        {/* =====================================================
                            BARRA PARA ARRASTRAR
                        ===================================================== */}
                        <div
                            onMouseDown={startDraggingModal}
                            onTouchStart={startDraggingModal}
                            className="
                                !absolute
                                !left-1/2
                                !top-0
                                !z-40
                                !flex
                                !h-1
                                !w-20
                                !-translate-x-1/2
                                !cursor-move
                                !touch-none
                                !select-none
                                !items-center
                                !justify-center
                                !rounded-b-md
                                !bg-white/90
                                !shadow-sm
                                sm:!h-2
                                sm:!w-24
                            "
                            title="Arrastrar ventana"
                        >
                            <span
                                className="
                                    !h-1
                                    !w-7
                                    !rounded-full
                                    !bg-[#79a9a3]
                                    sm:!w-9
                                "
                            />
                        </div>

                        {/* =====================================================
                            CERRAR
                        ===================================================== */}
                        <button
                            type="button"
                            onClick={closeDetail}
                            aria-label="Cerrar"
                            className="
                                !absolute
                                !right-2
                                !top-2
                                !z-50
                                !flex
                                !h-7
                                !w-7
                                !items-center
                                !justify-center
                                !rounded-md
                                !border
                                !border-slate-200
                                !bg-white/95
                                !text-slate-500
                                !shadow-sm
                                !transition-colors
                                !duration-150
                                hover:!bg-white
                                hover:!text-slate-800
                                hover:!border-slate-600
                            "
                        >
                            <FaTimes className="!text-[12px]" />
                        </button>

                        {/* =====================================================
                            IMAGEN
                        ===================================================== */}
                        <div
                            className="
                                !relative
                                !h-[145px]
                                !shrink-0
                                !overflow-hidden
                                !bg-[#e2f3f0]

                                sm:!h-full
                            "
                        >
                            <img
                                src={getPlaceImage(selectedPlace)}
                                alt={getPlaceName(selectedPlace)}
                                className="
                                    !h-full
                                    !w-full
                                    !object-cover
                                "
                                onError={(event) => {
                                    event.currentTarget.onerror = null;
                                    event.currentTarget.src = "/logo.png";
                                    event.currentTarget.className = `
                                        !h-full
                                        !w-full
                                        !object-contain
                                        !bg-[#e2f3f0]
                                        !p-10
                                    `;
                                }}
                            />

                            {/* DEGRADADO */}
                            <div
                                className="
                                    !pointer-events-none
                                    !absolute
                                    !inset-x-0
                                    !bottom-0
                                    !h-16
                                    !bg-gradient-to-t
                                    !from-black/65
                                    !to-transparent
                                "
                            />

                            {/* CATEGORÍA */}
                            <div
                                className="
                                    !absolute
                                    !bottom-2
                                    !left-2
                                "
                            >
                                <span
                                    className="
                                        !inline-flex
                                        !items-center
                                        !gap-1
                                        !rounded-full
                                        !bg-[#15949d]
                                        !px-2
                                        !py-1
                                        !text-[8px]
                                        !font-extrabold
                                        !text-white
                                        !shadow-sm
                                    "
                                >
                                    <CategoryIcon
                                        category={getPlaceCategory(selectedPlace)}
                                    />

                                    <span className="!max-w-[130px] !truncate">
                                        {getPlaceCategory(selectedPlace)}
                                    </span>
                                </span>
                            </div>
                        </div>

                        {/* =====================================================
                            CONTENIDO
                        ===================================================== */}
                        <div
                            className="
                                !min-h-0
                                !overflow-y-auto
                                !overscroll-contain
                                !p-3
                                !pb-3

                                sm:!p-3.5
                            "
                        >
                            {/* =================================================
                                TÍTULO
                            ================================================= */}
                            <div
                                className="
                                    !flex
                                    !items-start
                                    !justify-between
                                    !gap-2
                                "
                            >
                                <div className="!min-w-0">
                                    <h2
                                        className="
                                            !m-0
                                            !line-clamp-2
                                            !text-[15px]
                                            !font-bold
                                            !leading-[1.15]
                                            !tracking-[-0.015em]
                                            !text-[#173c39]

                                            sm:!text-[18px]
                                        "
                                    >
                                        {getPlaceName(selectedPlace)}
                                    </h2>

                                    <p
                                        className="
                                            !m-0
                                            !mt-1
                                            !truncate
                                            !text-[9px]
                                            !font-medium
                                            !text-slate-500

                                            sm:!text-[10px]
                                        "
                                    >
                                        {getPlaceCategory(selectedPlace)}
                                        {" · "}
                                        {selectedPlace.type ||
                                            "Lugar turístico"}
                                    </p>
                                </div>

                                {/* FAVORITO */}
                                <button
                                    type="button"
                                    onClick={(event) =>
                                        toggleFavorite(
                                            event,
                                            selectedPlace
                                        )
                                    }
                                    aria-label={
                                        isFavorite(selectedPlace)
                                            ? "Quitar de favoritos"
                                            : "Agregar a favoritos"
                                    }
                                    className="
                                        !flex
                                        !h-7
                                        !w-7
                                        !shrink-0
                                        !items-center
                                        !justify-center
                                        !rounded-md
                                        !border
                                        !border-slate-200
                                        !bg-white
                                    "
                                >
                                    {isFavorite(selectedPlace) ? (
                                        <FaHeart
                                            className="
                                                !text-[13px]
                                                !text-red-500
                                            "
                                        />
                                    ) : (
                                        <FaRegHeart
                                            className="
                                                !text-[13px]
                                                !text-slate-500
                                            "
                                        />
                                    )}
                                </button>
                            </div>

                            {/* =================================================
                                DESCRIPCIÓN
                            ================================================= */}
                            <div
                                className="
                                    !mt-2.5
                                    !border-t
                                    !border-[#ddd3c1]
                                    !pt-2
                                "
                            >
                                <h3
                                    className="
                                        !m-0
                                        !text-[11px]
                                        !font-bold
                                        !text-[#285c3f]
                                    "
                                >
                                    Sobre este lugar
                                </h3>

                                <p
                                    className="
                                        !m-0
                                        !mt-1
                                        !line-clamp-3
                                        !text-[9px]
                                        !leading-[1.4]
                                        !text-slate-600

                                        sm:!text-[10px]
                                    "
                                >
                                    {getPlaceDescription(selectedPlace)}
                                </p>
                            </div>

                            {/* =================================================
                                INFORMACIÓN
                            ================================================= */}
                            <div
                                className="
                                    !mt-2
                                    !grid
                                    !grid-cols-2
                                    !gap-1.5
                                "
                            >
                                {/* UBICACIÓN */}
                                <div
                                    className="
                                        !min-w-0
                                        !rounded-md
                                        !border
                                        !border-slate-200
                                        !bg-white
                                        !px-2
                                        !py-1.5
                                    "
                                >
                                    <span
                                        className="
                                            !block
                                            !text-[8px]
                                            !font-extrabold
                                            !uppercase
                                            !tracking-wide
                                            !text-slate-600
                                        "
                                    >
                                        Ubicación
                                    </span>

                                    <span
                                        className="
                                            !mt-0.5
                                            !block
                                            !truncate
                                            !text-[10px]
                                            !font-bold
                                            !text-[#294b47]
                                        "
                                    >
                                        San Bernardo del Viento
                                    </span>
                                </div>

                                {/* COORDENADAS */}
                                <div
                                    className="
                                        !min-w-0
                                        !rounded-md
                                        !border
                                        !border-slate-200
                                        !bg-white
                                        !px-2
                                        !py-1.5
                                    "
                                >
                                    <span
                                        className="
                                            !block
                                            !text-[8px]
                                            !font-extrabold
                                            !uppercase
                                            !tracking-wide
                                            !text-slate-600
                                        "
                                    >
                                        Coordenadas
                                    </span>

                                    <span
                                        className="
                                            !mt-0.5
                                            !block
                                            !truncate
                                            !text-[10px]
                                            !font-bold
                                            !text-[#294b47]
                                        "
                                    >
                                        {(() => {
                                            const coordinates =
                                                getPlaceCoordinates(
                                                    selectedPlace
                                                );

                                            if (!coordinates) {
                                                return "No disponibles";
                                            }

                                            return `${coordinates[0].toFixed(
                                                5
                                            )}, ${coordinates[1].toFixed(
                                                5
                                            )}`;
                                        })()}
                                    </span>
                                </div>
                            </div>

                            {/* =================================================
                                TAGS
                            ================================================= */}
                            {Array.isArray(selectedPlace.tags) &&
                                selectedPlace.tags.length > 0 && (
                                    <div
                                        className="
                                            !mt-2
                                            !flex
                                            !flex-wrap
                                            !gap-1
                                        "
                                    >
                                        {selectedPlace.tags
                                            .slice(0, 4)
                                            .map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="
                                                        !rounded-full
                                                        !bg-[#edf7f5]
                                                        !px-1.5
                                                        !py-0.5
                                                        !text-[9px]
                                                        !font-bold
                                                        !text-[#168795]
                                                    "
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                    </div>
                                )}

                            {/* =================================================
                                ACCIONES PRINCIPALES
                            ================================================= */}
                            <div
                                className="
                                    !mt-2.5
                                    !grid
                                    !grid-cols-2
                                    !gap-1.5
                                "
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        startRoute(selectedPlace)
                                    }
                                    className="
                                        !flex
                                        !min-h-[31px]
                                        !items-center
                                        !justify-center
                                        !gap-1.5
                                        !rounded-md
                                        !bg-[#15949d]
                                        !px-2
                                        !text-[11px]
                                        !font-bold
                                        !text-white
                                        !transition-colors
                                        !duration-150
                                        hover:!bg-[#087d85]
                                    "
                                >
                                    <FaRoute className="!text-[10px]" />
                                    Iniciar ruta
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        openDirections(selectedPlace)
                                    }
                                    className="
                                        !flex
                                        !min-h-[31px]
                                        !items-center
                                        !justify-center
                                        !gap-1.5
                                        !rounded-md
                                        !border
                                        !border-[#15949d]
                                        !bg-white
                                        !px-2
                                        !text-[11px]
                                        !font-bold
                                        !text-[#168795]
                                        !transition-colors
                                        !duration-150
                                        hover:!bg-[#eef8f7]
                                    "
                                >
                                    <FaExternalLinkAlt className="!text-[12px]" />
                                    Cómo llegar
                                </button>
                            </div>

                            {/* =================================================
                                QR
                            ================================================= */}
                            <button
                                type="button"
                                onClick={() => setShowQR(true)}
                                className="
                                    !mt-1.5
                                    !flex
                                    !min-h-[30px]
                                    !w-full
                                    !items-center
                                    !justify-center
                                    !gap-1.5
                                    !rounded-md
                                    !border
                                    !border-slate-200
                                    !bg-white
                                    !px-2
                                    !text-[11px]
                                    !font-bold
                                    !text-slate-600
                                    !transition-colors
                                    !duration-150
                                    hover:!border-[#b8dcd6]
                                    hover:!bg-[#f8fcfb]
                                "
                            >
                                <FaQrcode className="!text-[12px]" />
                                Ver código QR
                            </button>

                            {/* =================================================
                                AUDIO
                            ================================================= */}
                            {(selectedPlace.audioUrl ??
                                selectedPlace.audio ??
                                selectedPlace.audioGuide) ? (
                                <div className="!mt-1.5">
                                    <audio
                                        ref={audioRef}
                                        controls
                                        src={
                                            selectedPlace.audioUrl ??
                                            selectedPlace.audio ??
                                            selectedPlace.audioGuide
                                        }
                                        className="
                                            !h-7
                                            !w-full
                                        "
                                    />
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={toggleAudio}
                                    className="
                                        !mt-1.5
                                        !flex
                                        !min-h-[30px]
                                        !w-full
                                        !items-center
                                        !justify-center
                                        !gap-1.5
                                        !rounded-md
                                        !border
                                        !border-[#9bbd8f]
                                        !bg-[#f0f7eb]
                                        !px-2
                                        !text-[11px]
                                        !font-bold
                                        !text-[#285c3f]
                                    "
                                >
                                    <FaHeadphones className="!text-[12px]" />

                                    {isAudioPlaying
                                        ? "Detener audio"
                                        : "Audio guía"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {audioPlace &&
                (audioPlace.audioUrl ||
                    audioPlace.audio ||
                    audioPlace.audioGuide) && (
                    <audio
                        ref={audioRef}
                        src={
                            audioPlace.audioUrl ??
                            audioPlace.audio ??
                            audioPlace.audioGuide
                        }
                        preload="metadata"
                        onEnded={() =>
                            setIsAudioPlaying(false)
                        }
                        onError={() =>
                            setIsAudioPlaying(false)
                        }
                    />
                )}

            {/* =====================================================
                MODAL QR
            ===================================================== */}

            {showQR && (
                <div
                    className="
                        !fixed
                        !inset-0
                        !z-[10000]
                        !flex
                        !items-center
                        !justify-center
                        !bg-slate-950/65
                        !p-3
                        !backdrop-blur-[3px]
                    "
                    onClick={() => setShowQR(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="qr-modal-title"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                        className="
                            !relative
                            !w-full
                            !max-w-[310px]
                            !overflow-hidden
                            !rounded-lg
                            !border
                            !border-slate-200
                            !bg-white
                            !shadow-[0_20px_60px_rgba(0,0,0,0.28)]
                        "
                    >
                        {/* =====================================================
                            CABECERA
                        ===================================================== */}
                        <div
                            className="
                                !border-b
                                !border-slate-100
                                !bg-gradient-to-r
                                !from-[#eef9f6]
                                !to-[#edf9fa]
                                !px-4
                                !py-2
                            "
                        >
                            <div
                                className="
                                    !flex
                                    !items-center
                                    !gap-2.5
                                "
                            >
                                <span
                                    className="
                                        !flex
                                        !h-9
                                        !w-9
                                        !shrink-0
                                        !items-center
                                        !justify-center
                                        !rounded-md
                                        !bg-[#d9f2ec]
                                        !text-[#087d76]
                                    "
                                >
                                    <FaQrcode className="!text-[20px]" />
                                </span>

                                <div className="!min-w-0 !text-left">
                                    <h2
                                        id="qr-modal-title"
                                        className="
                                            !m-0
                                            !truncate
                                            !text-[16px]
                                            !font-bold
                                            !leading-tight
                                            !text-slate-800
                                        "
                                    >
                                        Código QR turístico
                                    </h2>

                                    <p
                                        className="
                                            !m-0
                                            !mt-0.5
                                            !text-[9px]
                                            !font-medium
                                            !text-slate-500
                                        "
                                    >
                                        Accede rápidamente a la información
                                    </p>
                                </div>
                            </div>

                            {/* CERRAR */}
                            <button
                                type="button"
                                onClick={() => setShowQR(false)}
                                aria-label="Cerrar código QR"
                                className="
                                    !absolute
                                    !right-3
                                    !top-3
                                    !flex
                                    !h-7
                                    !w-7
                                    !items-center
                                    !justify-center
                                    !rounded-md
                                    !border
                                    !border-slate-200
                                    !bg-white
                                    !text-slate-500
                                    !transition-colors
                                    !duration-150
                                    hover:!border-slate-600
                                    hover:!bg-slate-50
                                    hover:!text-slate-700
                                "
                            >
                                <FaTimes className="!text-[12px]" />
                            </button>
                        </div>

                        {/* =====================================================
                            CONTENIDO
                        ===================================================== */}
                        <div
                            className="
                                !px-4
                                !pb-4
                                !pt-4
                                !text-center
                            "
                        >
                            <p
                                className="
                                    !m-0
                                    !text-[10px]
                                    !leading-relaxed
                                    !text-slate-500
                                "
                            >
                                Escanea este código para consultar
                                información turística del destino.
                            </p>

                            {/* QR */}
                            <div
                                className="
                                    !mx-auto
                                    !mt-3
                                    !w-fit
                                    !rounded-lg
                                    !border
                                    !border-slate-200
                                    !bg-white
                                    !p-2
                                    !shadow-[0_4px_16px_rgba(15,23,42,0.06)]
                                "
                            >
                                <QRCodeSVG
                                    value={qrValue}
                                    size={184}
                                    level="H"
                                    marginSize={1}
                                />
                            </div>

                            {/* DESTINO SELECCIONADO */}
                            {selectedPlace && (
                                <div
                                    className="
                                        !mt-3
                                        !rounded-md
                                        !border
                                        !border-[#d7ebe7]
                                        !bg-[#f2f9f7]
                                        !px-3
                                        !py-2
                                    "
                                >
                                    <p
                                        className="
                                            !m-0
                                            !text-[8px]
                                            !font-black
                                            !uppercase
                                            !tracking-[0.08em]
                                            !text-[#168795]
                                        "
                                    >
                                        Destino
                                    </p>

                                    <p
                                        className="
                                            !m-0
                                            !mt-0.5
                                            !truncate
                                            !text-[11px]
                                            !font-bold
                                            !text-[#145c4a]
                                        "
                                    >
                                        {getPlaceName(
                                            selectedPlace
                                        )}
                                    </p>
                                </div>
                            )}

                            {/* BOTÓN CERRAR */}
                            <button
                                type="button"
                                onClick={() => setShowQR(false)}
                                className="
                                    !mt-3
                                    !flex
                                    !h-8
                                    !w-full
                                    !items-center
                                    !justify-center
                                    !rounded-md
                                    !bg-[#087d76]
                                    !text-[11px]
                                    !font-bold
                                    !text-white
                                    !transition-colors
                                    !duration-150
                                    hover:!bg-[#066c66]
                                "
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================================
                PANEL RUTA ACTIVA
            ===================================================== */}

            {activeRoute && (
                <div
                    className="
                        !fixed

                        !bottom-3
                        !left-1/2

                        !z-[2000]

                        !w-[calc(100%-24px)]

                        !max-w-[520px]

                        !-translate-x-1/2

                        !rounded-lg

                        !border
                        !border-[#d7cbb4]

                        !bg-[#fbf7ee]

                        !p-2.5

                        !shadow-xl
                    "
                >
                    <div
                        className="
                            !flex
                            !items-center

                            !gap-2
                        "
                    >
                        <div
                            className="
                                !flex
                                !h-8
                                !w-8
                                !shrink-0

                                !items-center
                                !justify-center

                                !rounded-full

                                !bg-[#edf7f5]

                                !text-[#168795]
                            "
                        >
                            <FaRoute />
                        </div>

                        <div
                            className="
                                !min-w-0
                                !flex-1
                            "
                        >
                            <p
                                className="
                                    !m-0
                                    !truncate

                                    !text-[9px]
                                    !font-bold
                                "
                            >
                                {activeRoute.name}
                            </p>

                            <p
                                className="
                                    !m-0
                                    !mt-0.5

                                    !text-[7px]

                                    !text-slate-500
                                "
                            >
                                {activeRoute.distanceKm ??
                                    activeRoute.distance ??
                                    "-"}{" "}
                                km ·{" "}
                                {activeRoute.duration ??
                                    "Ruta turística"}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                toggleSavedRoute(
                                    activeRoute
                                )
                            }
                            className="
                                !rounded-md

                                !border
                                !border-[#2aa7b0]

                                !bg-white

                                !px-2
                                !py-1.5

                                !text-[7px]
                                !font-bold

                                !text-[#168795]
                            "
                        >
                            {savedRoutes.includes(
                                getRouteId(
                                    activeRoute
                                )
                            )
                                ? "Guardada"
                                : "Guardar"}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setActiveRoute(
                                    null
                                )
                            }
                            className="
                                !flex
                                !h-7
                                !w-7

                                !items-center
                                !justify-center

                                !rounded-full

                                !bg-slate-100
                            "
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}