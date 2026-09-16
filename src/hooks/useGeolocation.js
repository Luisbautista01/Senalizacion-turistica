import { useCallback, useEffect, useState } from "react";

const isValidCoordinate = (lat, lng) => {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation(null);
      setError(
        "La geolocalización no está disponible en este navegador."
      );
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(
          position.coords.latitude
        );

        const lng = Number(
          position.coords.longitude
        );

        const accuracy = Number(
          position.coords.accuracy
        );

        if (!isValidCoordinate(lat, lng)) {
          setLocation(null);
          setError(
            "La ubicación obtenida no contiene coordenadas válidas."
          );
          setLoading(false);
          return;
        }

        setLocation({
          lat,
          lng,
          latitude: lat,
          longitude: lng,
          accuracy: Number.isFinite(accuracy)
            ? accuracy
            : null,
        });

        setLoading(false);
      },

      (geoError) => {
        setLocation(null);

        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError(
              "Permiso de ubicación denegado."
            );
            break;

          case geoError.POSITION_UNAVAILABLE:
            setError(
              "No fue posible obtener tu ubicación."
            );
            break;

          case geoError.TIMEOUT:
            setError(
              "La solicitud de ubicación tardó demasiado."
            );
            break;

          default:
            setError(
              geoError.message ||
                "No fue posible obtener tu ubicación."
            );
        }

        setLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    location,
    loading,
    error,
    requestLocation,
  };
};