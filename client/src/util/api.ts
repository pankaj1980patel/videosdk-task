export const buildQueryString = (
  params: Record<string, string | number | boolean>
): string => {
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
