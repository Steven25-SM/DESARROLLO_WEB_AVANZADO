export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? "Error de red");
  return data as T;
}

export const errMsg = (e: unknown) =>
  e instanceof Error ? e.message : "Error inesperado";
