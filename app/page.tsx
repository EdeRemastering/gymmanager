import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DumbbellIcon } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <DumbbellIcon className="h-12 w-12 text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-900">Remastering Gym</h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            ¡Bienvenido al Sistema de Gestión de Gimnasio!
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gestiona tus clientes, entrenadores y planes de manera eficiente.
            Accede a todas las herramientas necesarias para administrar tu gimnasio
            desde un solo lugar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-indigo-600">Clientes</CardTitle>
              <CardDescription>
                Gestiona la información de tus miembros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/clientes">
                <Button className="w-full">Ver Clientes</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-indigo-600">Entrenadores</CardTitle>
              <CardDescription>
                Administra tu equipo de profesionales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/entrenadores">
                <Button className="w-full">Ver Entrenadores</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-indigo-600">Planes</CardTitle>
              <CardDescription>
                Crea y modifica planes de suscripción
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/planes">
                <Button className="w-full">Ver Planes</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-gray-500">
          <p>Selecciona una sección del menú lateral para comenzar.</p>
        </div>
      </div>
    </div>
  )
}
