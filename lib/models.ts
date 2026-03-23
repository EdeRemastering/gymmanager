export interface Persona {
  id?: number
  nombre: string
  identificacion: string
}

export interface Cliente extends Persona {
  planId?: number
}

export interface Entrenador extends Persona {
  especialidad: string
}

export interface Plan {
  id?: number
  nombre: string
  precio: number
}

