"use client"

import { useEffect, useState } from "react"
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { Plan } from "@/lib/models"
import { createPlan, deletePlan, getPlanes, updatePlan } from "@/lib/api"

export default function PlanesPage() {
  const [planes, setPlanes] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const [precio, setPrecio] = useState(0)

  const [openEdit, setOpenEdit] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

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

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan)
    setNombre(plan.nombre)
    setPrecio(plan.precio)
    setOpenEdit(true)
  }

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedPlan) return

    if (!nombre || precio <= 0) return

    try {
      await updatePlan(selectedPlan.id!, { nombre, precio })
      setOpenEdit(false)
      setSelectedPlan(null)
      setNombre("")
      setPrecio(0)
      await fetchData()
    } catch (err) {
      setError("Error al actualizar plan")
      console.error(err)
    }
  }

  const handleDelete = async (plan: Plan) => {
    if (!plan.id) return

    try {
      await deletePlan(plan.id)
      await fetchData()
    } catch (err) {
      setError("Error al eliminar plan")
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

      <Sheet open={openEdit} onOpenChange={setOpenEdit}>
        <SheetContent side="right" className="w-[min(95vw,450px)]">
          <SheetHeader>
            <SheetTitle>Editar Plan</SheetTitle>
            <SheetDescription>Modifica los datos del plan.</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleUpdate} className="space-y-4 p-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-nombre">Nombre</Label>
              <Input id="edit-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-precio">Precio</Label>
              <Input id="edit-precio" type="number" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} required />
            </div>
            <SheetFooter>
              <Button type="submit">Actualizar Plan</Button>
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
            <TableHead>Precio</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {planes.map((plan) => (
            <TableRow key={plan.id ?? `${plan.nombre}-${Math.random()}`}>
              <TableCell>{plan.id ?? "-"}</TableCell>
              <TableCell>{plan.nombre}</TableCell>
              <TableCell>{plan.precio.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
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
                        <AlertDialogTitle>¿Eliminar plan?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará el plan "{plan.nombre}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(plan)}>Eliminar</AlertDialogAction>
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
