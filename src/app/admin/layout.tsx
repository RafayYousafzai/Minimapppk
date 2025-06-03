import type React from "react"
import type { Metadata } from "next"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar/admin-sidebar"

export const metadata: Metadata = {
  title: "ShopWave Admin",
  description: "Admin dashboard for ShopWave e-commerce store.",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
