export async function apiFetcher(
  endpoint: string,
  params: object = {},
  method: string = "POST",
  fetchOptions: RequestInit = {},
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const isServer = typeof window === "undefined";
  const defaultCache: RequestCache = isServer ? "force-cache" : "no-store";

  const res = await fetch(`${baseUrl}/api/rg${endpoint}`, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      params: params,
    }),
    cache: (fetchOptions.cache as RequestCache) ?? defaultCache,
    ...fetchOptions,
  });

  // (no-op) — keep apiFetcher minimal for production use

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
  }

  const data = await res.json();
  return data?.result;
}
