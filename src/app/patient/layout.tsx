import type { Metadata } from "next";
import AdminLayoutClient from "@/components/dashboard/AdminLayoutClient";
import ProtectedRoute from "@/components/auth/protected_route";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin",
    default: "Admin",
  },
  description: "Panel administrativo de Rubi Ramos - Consultorio Nutricional",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[1]}>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </ProtectedRoute>
  );
}
