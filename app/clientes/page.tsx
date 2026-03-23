"use client"

import { useEffect, useMemo, useState } from "react"
import { EditIcon, PlusIcon, TrashIcon, UserPlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { Cliente, Plan, Entrenador } from "@/lib/models"
import { asignarEntrenadorACliente, createCliente, deleteCliente, getClientes, getEntrenadores, getPlanes, updateCliente } from "@/lib/api"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [planes, setPlanes] = useState<Plan[]>([])
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const [identificacion, setIdentificacion] = useState("")
  const [planId, setPlanId] = useState<number | undefined>(undefined)

  const [openEdit, setOpenEdit] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)

  const [openAssign, setOpenAssign] = useState(false)
  const [selectedClienteForAssign, setSelectedClienteForAssign] = useState<Cliente | null>(null)
  const [entrenadorId, setEntrenadorId] = useState<number | undefined>(undefined)

  const fetchData = async () => {
    setError(null)
    setLoading(true)
    try {
      const [clientesResp, planesResp, entrenadoresResp] = await Promise.all([getClientes(), getPlanes(), getEntrenadores()])
      setClientes(clientesResp)
      setPlanes(planesResp)
      setEntrenadores(entrenadoresResp)
    } catch (err) {
      setError("No fue posible cargar datos. Revisa el backend y CORS.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const planOptions = useMemo(
    () => planes.map((p) => ({ label: p.nombre, value: p.id ?? 0 })),
    [planes]
  )

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const planIdToSend = planId ?? planOptions[0]?.value

    if (!nombre.trim() || !identificacion.trim()) {
      setError("Nombre e identificación son obligatorios.")
      return
    }

    if (!planIdToSend || planIdToSend <= 0) {
      setError("Selecciona un plan válido antes de crear el cliente.")
      return
    }

    const selectedPlanObj = planes.find(p => p.id === planIdToSend)
    if (!selectedPlanObj) {
      setError("El plan seleccionado no existe.")
      return
    }

    setError(null)

    const clientPayload = {
      nombre,
      identificacion,
      plan: selectedPlanObj,
    }

    console.log("Creating cliente with:", clientPayload)

    try {
      await createCliente(clientPayload)
      setOpen(false)
      setNombre("")
      setIdentificacion("")
      setPlanId(undefined)
      await fetchData()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido"
      setError(`Error al crear cliente: ${message}. Revisa backend y CORS.`)
      console.error(err)
    }
  }

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setNombre(cliente.nombre)
    setIdentificacion(cliente.identificacion)
    setPlanId(cliente.plan?.id)
    setOpenEdit(true)
  }

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedCliente) return

    const planIdToSend = planId ?? planOptions[0]?.value

    if (!nombre.trim() || !identificacion.trim()) {
      setError("Nombre e identificación son obligatorios.")
      return
    }

    if (!planIdToSend || planIdToSend <= 0) {
      setError("Selecciona un plan válido antes de editar el cliente.")
      return
    }

    const selectedPlanObj = planes.find(p => p.id === planIdToSend)
    if (!selectedPlanObj) {
      setError("El plan seleccionado no existe.")
      return
    }

    setError(null)

    const clientPayload = {
      nombre,
      identificacion,
      plan: selectedPlanObj,
    }

    console.log("Updating cliente with:", clientPayload)

    try {
      await updateCliente(selectedCliente.id!, clientPayload)
      setOpenEdit(false)
      setSelectedCliente(null)
      setNombre("")
      setIdentificacion("")
      setPlanId(undefined)
      await fetchData()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido"
      setError(`Error al actualizar cliente: ${message}. Revisa backend y CORS.`)
      console.error(err)
    }
  }

  const handleDelete = async (cliente: Cliente) => {
    if (!cliente.id) return

    try {
      await deleteCliente(cliente.id)
      await fetchData()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido"
      setError(`Error al eliminar cliente: ${message}. Revisa backend y CORS.`)
      console.error(err)
    }
  }

  const handleAssign = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedClienteForAssign || !entrenadorId) return

    try {
      await asignarEntrenadorACliente(selectedClienteForAssign.id!, entrenadorId)
      setOpenAssign(false)
      setSelectedClienteForAssign(null)
      setEntrenadorId(undefined)
      await fetchData()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido"
      setError(`Error al asignar entrenador: ${message}`)
      console.error(err)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="default" size="sm" className="gap-2" disabled={planOptions.length === 0}>
              <PlusIcon /> Crear Cliente
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(95vw,450px)]">
            <SheetHeader>
              <SheetTitle>Crear Cliente</SheetTitle>
              <SheetDescription>Ingresa los datos del nuevo cliente.</SheetDescription>
              {planOptions.length === 0 && (
                <p className="mt-2 rounded-md border border-yellow-300 bg-yellow-50 p-2 text-sm text-yellow-800">
                  No hay planes disponibles. Ve a la sección Planes y crea uno para asignar.
                </p>
              )}
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
                <Label htmlFor="plan">Plan</Label>
                <Select value={planId?.toString() ?? ""} onValueChange={(v) => setPlanId(Number(v))}>
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Selecciona un plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {planOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <SheetFooter>
                <Button type="submit">Guardar Cliente</Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <Sheet open={openEdit} onOpenChange={setOpenEdit}>
        <SheetContent side="right" className="w-[min(95vw,450px)]">
          <SheetHeader>
            <SheetTitle>Editar Cliente</SheetTitle>
            <SheetDescription>Modifica los datos del cliente.</SheetDescription>
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
              <Label htmlFor="edit-plan">Plan</Label>
              <Select value={planId?.toString() ?? ""} onValueChange={(v) => setPlanId(Number(v))}>
                <SelectTrigger id="edit-plan">
                  <SelectValue placeholder="Selecciona un plan" />
                </SelectTrigger>
                <SelectContent>
                  {planOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SheetFooter>
              <Button type="submit">Actualizar Cliente</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={openAssign} onOpenChange={setOpenAssign}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Asignar Entrenador</AlertDialogTitle>
            <AlertDialogDescription>
              Selecciona un entrenador para asignar a {selectedClienteForAssign?.nombre}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleAssign} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="entrenador">Entrenador</Label>
              <Select value={entrenadorId?.toString() ?? ""} onValueChange={(v) => setEntrenadorId(Number(v))}>
                <SelectTrigger id="entrenador">
                  <SelectValue placeholder="Selecciona un entrenador" />
                </SelectTrigger>
                <SelectContent>
                  {entrenadores.map((entrenador) => (
                    <SelectItem key={entrenador.id} value={entrenador.id!.toString()}>
                      {entrenador.nombre} - {entrenador.especialidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction type="submit">Asignar</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-destructive">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Identificación</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id ?? `${cliente.nombre}-${cliente.identificacion}-${Math.random()}`}>
              <TableCell>{cliente.id ?? "-"}</TableCell>
              <TableCell>{cliente.nombre}</TableCell>
              <TableCell>{cliente.identificacion}</TableCell>
              <TableCell>{planes.find(p => p.id === cliente.plan?.id)?.nombre ?? "-"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(cliente)}>
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => { setSelectedClienteForAssign(cliente); setOpenAssign(true) }}>
                    <UserPlusIcon className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará el cliente "{cliente.nombre}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(cliente)}>Eliminar</AlertDialogAction>
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
