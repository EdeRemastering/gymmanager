"use client"

import { useEffect, useMemo, useState } from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Cliente, Plan } from "@/lib/models"
import { createCliente, getClientes, getPlanes } from "@/lib/api"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [planes, setPlanes] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState("")
  const [identificacion, setIdentificacion] = useState("")
  const [planId, setPlanId] = useState<number | undefined>(undefined)

  const fetchData = async () => {
    setError(null)
    setLoading(true)
    try {
      const [clientesResp, planesResp] = await Promise.all([getClientes(), getPlanes()])
      setClientes(clientesResp)
      setPlanes(planesResp)
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

    setError(null)

    const clientPayload = {
      nombre,
      identificacion,
      plan: { id: planIdToSend },
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

      {loading && <p>Cargando...</p>}
      {error && <p className="text-destructive">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Identificación</TableHead>
            <TableHead>Plan ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id ?? `${cliente.nombre}-${cliente.identificacion}-${Math.random()}`}>
              <TableCell>{cliente.id ?? "-"}</TableCell>
              <TableCell>{cliente.nombre}</TableCell>
              <TableCell>{cliente.identificacion}</TableCell>
              <TableCell>{cliente.plan?.id ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
