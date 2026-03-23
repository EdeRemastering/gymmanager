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
export const getClientes = () => fetchJson<Cliente[]>(`${BACKEND_BASE}/clientes`)
export const getCliente = (id: number) => fetchJson<Cliente>(`${BACKEND_BASE}/clientes/${id}`)
export type CreateClientePayload = {
  nombre: string
  identificacion: string
  plan?: { id: number }
  planId?: number
}

export const createCliente = (payload: CreateClientePayload) =>
  fetchJson<Cliente>(`${BACKEND_BASE}/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
export const updateCliente = (id: number, payload: Partial<Cliente>) =>
  fetchJson<Cliente>(`${BACKEND_BASE}/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
export const deleteCliente = (id: number) =>
  fetchJson<void>(`${BACKEND_BASE}/clientes/${id}`, {
    method: "DELETE",
  })

// Entrenadores
export const getEntrenadores = () =>
  fetchJson<Entrenador[]>(`${BACKEND_BASE}/entrenadores`)
export const createEntrenador = (payload: Omit<Entrenador, "id">) =>
  fetchJson<Entrenador>(`${BACKEND_BASE}/entrenadores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

// Planes
export const getPlanes = () => fetchJson<Plan[]>(`${BACKEND_BASE}/planes`)
export const createPlan = (payload: Omit<Plan, "id">) =>
  fetchJson<Plan>(`${BACKEND_BASE}/planes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
