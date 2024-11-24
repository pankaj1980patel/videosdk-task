export const buildQueryString = (params: Record<string, any>): string => {
  return Object.keys(params)
    .filter(
      (key) =>
        params[key] !== undefined && params[key] !== "" && params[key] !== "all"
    )
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
};
