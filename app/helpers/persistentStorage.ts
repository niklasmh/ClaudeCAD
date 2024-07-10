export const saveToPersistentStore = <T>(key: string, data: T) => {
  try {
    if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.log(e);
  }
};

export const receiveFromPersistentStore = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window === "undefined") {
      return defaultValue;
    }
    return (JSON.parse(localStorage.getItem(key) as string) as T) ?? defaultValue;
  } catch (e) {
    console.log(e);
    return defaultValue;
  }
};
