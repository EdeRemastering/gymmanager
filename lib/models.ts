export interface Persona {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono?: string
}

export interface Entrenador extends Persona {
  especialidad: string
  certificaciones?: string[]
  experienciaAnios: number
}

export interface Plan {
  id: number
  nombre: string
  duracionSemanas: number
  precio: number
  descripcion?: string
}

export interface Cliente extends Persona {
  fechaNacimiento?: string
  objetivo?: string
  entrenadorId?: number
  planId?: number
}
