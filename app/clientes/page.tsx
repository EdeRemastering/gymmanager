import { getClientes } from "@/lib/api"
import type { Cliente } from "@/lib/models"

export default async function ClientesPage() {
  let clientes: Cliente[] = []
  try {
    clientes = await getClientes()
  } catch (error) {
    console.error("Error fetching clientes", error)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>
      {clientes.length === 0 ? (
        <p>No hay clientes registrados o no se pudo contactar al backend.</p>
      ) : (
        <div className="rounded-lg border bg-background shadow-sm">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/10 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Objetivo</th>
                <th className="px-3 py-2">Entrenador</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="border-b">
                  <td className="px-3 py-2">{cliente.id}</td>
                  <td className="px-3 py-2">{cliente.nombre} {cliente.apellido}</td>
                  <td className="px-3 py-2">{cliente.email}</td>
                  <td className="px-3 py-2">{cliente.objetivo ?? "-"}</td>
                  <td className="px-3 py-2">{cliente.entrenadorId ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
