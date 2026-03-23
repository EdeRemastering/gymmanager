"use client"

import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Plan } from "@/lib/models"
import { createPlan, getPlanes } from "@/lib/api"

export default function PlanesPage() {
  const [planes, setPlanes] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const [precio, setPrecio] = useState(0)

  const fetchData = async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await getPlanes()
      setPlanes(data)
    } catch (err) {
      setError("No fue posible cargar planes")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!nombre || precio <= 0) return

    try {
      await createPlan({ nombre, precio })
      setOpen(false)
      setNombre("")
      setPrecio(0)
      await fetchData()
    } catch (err) {
      setError("Error al crear plan")
      console.error(err)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Planes</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="default" size="sm" className="gap-2">
              <PlusIcon /> Crear Plan
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(95vw,450px)]">
            <SheetHeader>
              <SheetTitle>Crear Plan</SheetTitle>
              <SheetDescription>Añade un nuevo plan para clientes.</SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCreate} className="space-y-4 p-2">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="precio">Precio</Label>
                <Input id="precio" type="number" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} required />
              </div>
              <SheetFooter>
                <Button type="submit">Guardar Plan</Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-destructive">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Precio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {planes.map((plan) => (
            <TableRow key={plan.id ?? `${plan.nombre}-${Math.random()}`}>
              <TableCell>{plan.id ?? "-"}</TableCell>
              <TableCell>{plan.nombre}</TableCell>
              <TableCell>{plan.precio.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
