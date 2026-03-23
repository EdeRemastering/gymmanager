"use client"

import { useEffect, useState } from "react"
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { Pago, Cliente } from "@/lib/models"
import { createPago, deletePago, getClientes, getPagos, updatePago } from "@/lib/api"

export default function PagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedPago, setSelectedPago] = useState<Pago | null>(null)

  const [clienteId, setClienteId] = useState<number | undefined>(undefined)
  const [monto, setMonto] = useState(0)
  const [estado, setEstado] = useState<Pago["estado"]>("PENDIENTE")

  const fetchData = async () => {
    setError(null)
    setLoading(true)
    try {
      const [pagosResp, clientesResp] = await Promise.all([getPagos(), getClientes()])
      setPagos(pagosResp)
      setClientes(clientesResp)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido"
      setError(`No fue posible cargar datos: ${message}. Revisa el backend (¿está corriendo en http://localhost:8080?) y CORS.`)
      console.error("Error loading pagos:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!clienteId || monto <= 0) return

    const selectedCliente = clientes.find(c => c.id === clienteId)
    if (!selectedCliente) {
      setError("Cliente no encontrado.")
      return
    }

    setError(null)

    const payload = {
      cliente: selectedCliente,
      monto,
      fecha: new Date().toISOString().split('T')[0], // Fecha actual automática
      estado,
    }

    try {
      await createPago(payload)
      setOpen(false)
      resetForm()
      await fetchData()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido"
      setError(`Error al crear pago: ${message}`)
      console.error(err)
    }
  }

  const handleEdit = (pago: Pago) => {
    setSelectedPago(pago)
    setClienteId(typeof pago.cliente === 'object' ? pago.cliente.id : pago.cliente)
    setMonto(pago.monto)
    setEstado(pago.estado)
    setOpenEdit(true)
  }

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedPago) return

    if (!clienteId || monto <= 0) return

    const selectedCliente = clientes.find(c => c.id === clienteId)
    if (!selectedCliente) {
      setError("Cliente no encontrado.")
      return
    }

    setError(null)

    const payload = {
      cliente: selectedCliente,
      monto,
      fecha: selectedPago.fecha, // Mantener la fecha original
      estado,
    }

    try {
      await updatePago(selectedPago.id!, payload)
      setOpenEdit(false)
      setSelectedPago(null)
      resetForm()
      await fetchData()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido"
      setError(`Error al actualizar pago: ${message}`)
      console.error(err)
    }
  }

  const handleDelete = async (pago: Pago) => {
    if (!pago.id) return

    try {
      await deletePago(pago.id)
      await fetchData()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido"
      setError(`Error al eliminar pago: ${message}`)
      console.error(err)
    }
  }

  const resetForm = () => {
    setClienteId(undefined)
    setMonto(0)
    setEstado("PENDIENTE")
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pagos</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="default" size="sm" className="gap-2">
              <PlusIcon /> Crear Pago
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(95vw,450px)]">
            <SheetHeader>
              <SheetTitle>Crear Pago</SheetTitle>
              <SheetDescription>Registra un nuevo pago.</SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCreate} className="space-y-4 p-2">
              <div className="grid gap-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select value={clienteId?.toString() ?? ""} onValueChange={(v) => setClienteId(Number(v))}>
                  <SelectTrigger id="cliente">
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id!.toString()}>
                        {cliente.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="monto">Monto</Label>
                <Input id="monto" type="number" value={monto} onChange={(e) => setMonto(Number(e.target.value))} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={estado} onValueChange={(v: Pago["estado"]) => setEstado(v)}>
                  <SelectTrigger id="estado">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                    <SelectItem value="PAGADO">Pagado</SelectItem>
                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <SheetFooter>
                <Button type="submit">Guardar Pago</Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <Sheet open={openEdit} onOpenChange={setOpenEdit}>
        <SheetContent side="right" className="w-[min(95vw,450px)]">
          <SheetHeader>
            <SheetTitle>Editar Pago</SheetTitle>
            <SheetDescription>Modifica los datos del pago.</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleUpdate} className="space-y-4 p-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-cliente">Cliente</Label>
              <Select value={clienteId?.toString() ?? ""} onValueChange={(v) => setClienteId(Number(v))}>
                <SelectTrigger id="edit-cliente">
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id!.toString()}>
                      {cliente.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-monto">Monto</Label>
              <Input id="edit-monto" type="number" value={monto} onChange={(e) => setMonto(Number(e.target.value))} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-estado">Estado</Label>
              <Select value={estado} onValueChange={(v: Pago["estado"]) => setEstado(v)}>
                <SelectTrigger id="edit-estado">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  <SelectItem value="PAGADO">Pagado</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SheetFooter>
              <Button type="submit">Actualizar Pago</Button>
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
            <TableHead>Cliente</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagos.map((pago) => {
            const clienteId = typeof pago.cliente === 'object' ? pago.cliente.id : pago.cliente
            const clienteNombre = typeof pago.cliente === 'object' && 'nombre' in pago.cliente ? pago.cliente.nombre : clientes.find(c => c.id === clienteId)?.nombre || "Cliente desconocido"
            return (
            <TableRow key={pago.id ?? `${pago.fecha || 'no-fecha'}-${pago.monto}-${Math.random()}`}>
              <TableCell>{pago.id ?? "-"}</TableCell>
              <TableCell>{clienteNombre}</TableCell>
              <TableCell>{pago.monto.toFixed(2)}</TableCell>
              <TableCell>{pago.fecha ? pago.fecha.split('T')[0] : "Sin fecha"}</TableCell>
              <TableCell>{pago.estado}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(pago)}>
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
                        <AlertDialogTitle>¿Eliminar pago?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará el pago de {clienteNombre}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(pago)}>Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}