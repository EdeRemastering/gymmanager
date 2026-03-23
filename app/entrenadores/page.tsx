"use client"

import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Entrenador } from "@/lib/models"
import { createEntrenador, getEntrenadores } from "@/lib/api"

export default function EntrenadoresPage() {
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const [identificacion, setIdentificacion] = useState("")
  const [especialidad, setEspecialidad] = useState("")

  const fetchData = async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await getEntrenadores()
      setEntrenadores(data)
    } catch (err) {
      setError("No fue posible cargar entrenadores")
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
    if (!nombre || !identificacion || !especialidad) return

    try {
      await createEntrenador({ nombre, identificacion, especialidad })
      setOpen(false)
      setNombre("")
      setIdentificacion("")
      setEspecialidad("")
      await fetchData()
    } catch (err) {
      setError("Error al crear entrenador")
      console.error(err)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Entrenadores</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="default" size="sm" className="gap-2">
              <PlusIcon /> Crear Entrenador
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(95vw,450px)]">
            <SheetHeader>
              <SheetTitle>Crear Entrenador</SheetTitle>
              <SheetDescription>Ingresa los datos del nuevo entrenador.</SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCreate} className="space-y-4 p-2">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="identificacion">Identificación</Label>
                <Input id="identificacion" value={identificacion} onChange={(e) => setIdentificacion(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="especialidad">Especialidad</Label>
                <Input id="especialidad" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} required />
              </div>
              <SheetFooter>
                <Button type="submit">Guardar Entrenador</Button>
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
            <TableHead>Identificación</TableHead>
            <TableHead>Especialidad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entrenadores.map((e) => (
            <TableRow key={e.id ?? `${e.nombre}-${e.identificacion}-${Math.random()}`}>
              <TableCell>{e.id ?? "-"}</TableCell>
              <TableCell>{e.nombre}</TableCell>
              <TableCell>{e.identificacion}</TableCell>
              <TableCell>{e.especialidad}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
