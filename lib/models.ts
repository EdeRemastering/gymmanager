export interface Persona {
  id?: number
  nombre: string
  identificacion: string
}

export interface Plan {
  id?: number
  nombre: string
  precio: number
}

export interface Cliente extends Persona {
  plan?: Plan | { id: number }
}

export interface Entrenador extends Persona {
  especialidad: string
}

export interface Pago {
  id?: number
  cliente: Cliente | { id: number }
  monto: number
  fecha: string
  estado: 'PENDIENTE' | 'PAGADO' | 'CANCELADO'
}

