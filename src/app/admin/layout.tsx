
"use client"; // Required for hooks like useAuth and useRouter

import type React from "react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar/admin-sidebar";
import { Loader2 } from "lucide-react";

// No Next.js metadata here as it's a client component now. 
// Metadata should be in a parent server component or page.tsx if needed specifically for /admin path.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authLoading && !currentUser && pathname !== '/login') {
      router.push('/login');
    }
  }, [currentUser, authLoading, router, pathname]);

  if (authLoading || (!currentUser && pathname !== '/login')) {
    // Show a loading spinner or a blank page while checking auth or redirecting
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user is not logged in and somehow tries to access /admin/* (and it's not /login page itself)
  // this check might be redundant due to useEffect but serves as a safeguard
  if (!currentUser && pathname !== '/login') {
    return null; // Or redirect again, though useEffect should handle it
  }


  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
