import { Cliente, Entrenador, Pago, Plan } from "./models"

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080"

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: "no-store" })
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`)
  }
  if (res.status === 204 || !res.headers.get('content-type')?.includes('application/json')) {
    return undefined as T
  }
  return res.json()
}

// Clientes
export const getClientes = () => fetchJson<Cliente[]>(`${BACKEND_BASE}/clientes`)
export const getCliente = (id: number) => fetchJson<Cliente>(`${BACKEND_BASE}/clientes/${id}`)
export type CreateClientePayload = {
  nombre: string
  identificacion: string
  plan: Plan
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
export const updateEntrenador = (id: number, payload: Partial<Entrenador>) =>
  fetchJson<Entrenador>(`${BACKEND_BASE}/entrenadores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
export const deleteEntrenador = (id: number) =>
  fetchJson<void>(`${BACKEND_BASE}/entrenadores/${id}`, {
    method: "DELETE",
  })

// Planes
export const getPlanes = () => fetchJson<Plan[]>(`${BACKEND_BASE}/planes`)
export const createPlan = (payload: Omit<Plan, "id">) =>
  fetchJson<Plan>(`${BACKEND_BASE}/planes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
export const updatePlan = (id: number, payload: Partial<Plan>) =>
  fetchJson<Plan>(`${BACKEND_BASE}/planes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
export const deletePlan = (id: number) =>
  fetchJson<void>(`${BACKEND_BASE}/planes/${id}`, {
    method: "DELETE",
  })

// Pagos
export const getPagos = () => fetchJson<Pago[]>(`${BACKEND_BASE}/pagos`)
export const getPagosPorCliente = (clienteId: number) => fetchJson<Pago[]>(`${BACKEND_BASE}/pagos/cliente/${clienteId}`)
export const getPagosPorEstado = (estado: string) => fetchJson<Pago[]>(`${BACKEND_BASE}/pagos/estado/${estado}`)
export const createPago = (payload: Omit<Pago, "id">) =>
  fetchJson<Pago>(`${BACKEND_BASE}/pagos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
export const updatePago = (id: number, payload: Partial<Pago>) =>
  fetchJson<Pago>(`${BACKEND_BASE}/pagos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
export const deletePago = (id: number) =>
  fetchJson<void>(`${BACKEND_BASE}/pagos/${id}`, {
    method: "DELETE",
  })

// Asignar entrenador a cliente
export const asignarEntrenadorACliente = (clienteId: number, entrenadorId: number) =>
  fetchJson<Cliente>(`${BACKEND_BASE}/clientes/${clienteId}/entrenador/${entrenadorId}`, {
    method: "PUT",
  })
