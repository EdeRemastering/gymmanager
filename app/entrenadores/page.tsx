import { getEntrenadores } from "@/lib/api"
import type { Entrenador } from "@/lib/models"

export default async function EntrenadoresPage() {
  let entrenadores: Entrenador[] = []
  try {
    entrenadores = await getEntrenadores()
  } catch (error) {
    console.error("Error fetching entrenadores", error)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Entrenadores</h1>
      {entrenadores.length === 0 ? (
        <p>No hay entrenadores disponibles o no se pudo conectar al backend.</p>
      ) : (
        <div className="rounded-lg border bg-background shadow-sm">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/10 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Especialidad</th>
                <th className="px-3 py-2">Experiencia (años)</th>
              </tr>
            </thead>
            <tbody>
              {entrenadores.map((entrenador) => (
                <tr key={entrenador.id} className="border-b">
                  <td className="px-3 py-2">{entrenador.id}</td>
                  <td className="px-3 py-2">{entrenador.nombre} {entrenador.apellido}</td>
                  <td className="px-3 py-2">{entrenador.especialidad}</td>
                  <td className="px-3 py-2">{entrenador.experienciaAnios}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
