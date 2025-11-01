import type { Metadata } from "next";
import AdminLayoutClient from "@/components/dashboard/AdminLayoutClient";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin-AutoClick",
    default: "Admin-AutoClick",
  },
  description: "Panel administrativo de AutoClick - Sistema de cotización de autos seminuevos",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
