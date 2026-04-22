const DEFAULT_API_BASE_URL = "http://localhost:3001";

export function getApiBaseUrl() {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return value && value.length > 0
    ? value.replace(/\/+$/, "")
    : DEFAULT_API_BASE_URL;
}
