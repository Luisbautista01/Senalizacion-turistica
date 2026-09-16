const STORAGE_PREFIX = "tourism_";

export const storageService = {
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(
        `${STORAGE_PREFIX}${key}`
      );

      return value
        ? JSON.parse(value)
        : fallback;
    } catch (error) {
      console.error(
        "Error leyendo localStorage:",
        error
      );

      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(
        `${STORAGE_PREFIX}${key}`,
        JSON.stringify(value)
      );

      return true;
    } catch (error) {
      console.error(
        "Error guardando localStorage:",
        error
      );

      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(
      `${STORAGE_PREFIX}${key}`
    );
  },

  clear() {
    Object.keys(localStorage)
      .filter((key) =>
        key.startsWith(STORAGE_PREFIX)
      )
      .forEach((key) =>
        localStorage.removeItem(key)
      );
  },
};