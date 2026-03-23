"use client"

import { useEffect, useState } from "react"
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { Entrenador } from "@/lib/models"
import { createEntrenador, deleteEntrenador, getEntrenadores, updateEntrenador } from "@/lib/api"

export default function EntrenadoresPage() {
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const [identificacion, setIdentificacion] = useState("")
  const [especialidad, setEspecialidad] = useState("")

  const [openEdit, setOpenEdit] = useState(false)
  const [selectedEntrenador, setSelectedEntrenador] = useState<Entrenador | null>(null)

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

  const handleEdit = (entrenador: Entrenador) => {
    setSelectedEntrenador(entrenador)
    setNombre(entrenador.nombre)
    setIdentificacion(entrenador.identificacion)
    setEspecialidad(entrenador.especialidad)
    setOpenEdit(true)
  }

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedEntrenador) return

    if (!nombre || !identificacion || !especialidad) return

    try {
      await updateEntrenador(selectedEntrenador.id!, { nombre, identificacion, especialidad })
      setOpenEdit(false)
      setSelectedEntrenador(null)
      setNombre("")
      setIdentificacion("")
      setEspecialidad("")
      await fetchData()
    } catch (err) {
      setError("Error al actualizar entrenador")
      console.error(err)
    }
  }

  const handleDelete = async (entrenador: Entrenador) => {
    if (!entrenador.id) return

    try {
      await deleteEntrenador(entrenador.id)
      await fetchData()
    } catch (err) {
      setError("Error al eliminar entrenador")
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

      <Sheet open={openEdit} onOpenChange={setOpenEdit}>
        <SheetContent side="right" className="w-[min(95vw,450px)]">
          <SheetHeader>
            <SheetTitle>Editar Entrenador</SheetTitle>
            <SheetDescription>Modifica los datos del entrenador.</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleUpdate} className="space-y-4 p-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-nombre">Nombre</Label>
              <Input id="edit-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-identificacion">Identificación</Label>
              <Input id="edit-identificacion" value={identificacion} onChange={(e) => setIdentificacion(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-especialidad">Especialidad</Label>
              <Input id="edit-especialidad" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} required />
            </div>
            <SheetFooter>
              <Button type="submit">Actualizar Entrenador</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-destructive">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Identificación</TableHead>
            <TableHead>Especialidad</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entrenadores.map((e) => (
            <TableRow key={e.id ?? `${e.nombre}-${e.identificacion}-${Math.random()}`}>
              <TableCell>{e.id ?? "-"}</TableCell>
              <TableCell>{e.nombre}</TableCell>
              <TableCell>{e.identificacion}</TableCell>
              <TableCell>{e.especialidad}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(e)}>
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar entrenador?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará el entrenador "{e.nombre}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(e)}>Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
