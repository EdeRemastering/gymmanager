import { Cliente, Entrenador, Plan } from "./models"

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080"

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: "no-store" })
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`)
  }
  return res.json()
}

// Clientes
export const getClientes = () => fetchJson<Cliente[]>(`${BACKEND_BASE}/api/clientes`)
export const getCliente = (id: number) => fetchJson<Cliente>(`${BACKEND_BASE}/api/clientes/${id}`)
export const createCliente = (payload: Omit<Cliente, "id">) =>
  fetchJson<Cliente>(`${BACKEND_BASE}/api/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
export const updateCliente = (id: number, payload: Partial<Cliente>) =>
  fetchJson<Cliente>(`${BACKEND_BASE}/api/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
export const deleteCliente = (id: number) =>
  fetchJson<void>(`${BACKEND_BASE}/api/clientes/${id}`, {
    method: "DELETE",
  })

// Entrenadores
export const getEntrenadores = () =>
  fetchJson<Entrenador[]>(`${BACKEND_BASE}/api/entrenadores`)

// Planes
export const getPlanes = () => fetchJson<Plan[]>(`${BACKEND_BASE}/api/planes`)
