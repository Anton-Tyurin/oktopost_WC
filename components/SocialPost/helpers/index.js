export const dataLocalUrl = (relativePath, baseUrl) =>
  new URL(relativePath, baseUrl).toString();
