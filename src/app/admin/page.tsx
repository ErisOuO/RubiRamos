import { CheckCircle } from "lucide-react";

export default function LoginSuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="bg-white/90 rounded-2xl shadow-lg p-10 max-w-md">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          ¡Inicio de sesión exitoso!
        </h1>
        <p className="text-gray-600">
          Bienvenido al sistema. Redirigiéndote al panel principal...
        </p>
      </div>
    </main>
  );
}