import { getPlanes } from "@/lib/api"
import type { Plan } from "@/lib/models"

export default async function PlanesPage() {
  let planes: Plan[] = []
  try {
    planes = await getPlanes()
  } catch (error) {
    console.error("Error fetching planes", error)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Planes</h1>
      {planes.length === 0 ? (
        <p>No hay planes cargados o no se pudo conectar al backend.</p>
      ) : (
        <div className="rounded-lg border bg-background shadow-sm">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/10 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Duración</th>
                <th className="px-3 py-2">Precio</th>
              </tr>
            </thead>
            <tbody>
              {planes.map((plan) => (
                <tr key={plan.id} className="border-b">
                  <td className="px-3 py-2">{plan.id}</td>
                  <td className="px-3 py-2">{plan.nombre}</td>
                  <td className="px-3 py-2">{plan.duracionSemanas} semanas</td>
                  <td className="px-3 py-2">${plan.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
