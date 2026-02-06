import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Otak & Provider
import { ArisanProvider, useArisanStore } from "./hooks/useArisanStore";

// Import Halaman
import Dashboard from "./pages/Dashboard";
import AnggotaPage from "./pages/AnggotaPage";
import IuranPage from "./pages/IuranPage";
import UndianPage from "./pages/UndianPage";
import SimpanPinjamPage from "./pages/SimpanPinjamPage";
import NotulensiPage from "./pages/NotulensiPage";
import LaporanPage from "./pages/LaporanPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// --- KOMPONEN SATPAM (PROTECTED ROUTE) ---
// Tugasnya: Mengecek apakah user sudah login?
// Jika belum -> Tampilkan Halaman Login.
// Jika sudah -> Tampilkan Halaman yang dituju (Dashboard, dll).
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useArisanStore();
  
  if (!currentUser) {
    return <LoginPage />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* PENTING: ArisanProvider harus membungkus BrowserRouter */}
      <ArisanProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Route Halaman Utama (Semuanya Dilindungi Satpam) */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/anggota" element={<ProtectedRoute><AnggotaPage /></ProtectedRoute>} />
            <Route path="/iuran" element={<ProtectedRoute><IuranPage /></ProtectedRoute>} />
            <Route path="/undian" element={<ProtectedRoute><UndianPage /></ProtectedRoute>} />
            <Route path="/simpan-pinjam" element={<ProtectedRoute><SimpanPinjamPage /></ProtectedRoute>} />
            <Route path="/notulensi" element={<ProtectedRoute><NotulensiPage /></ProtectedRoute>} />
            <Route path="/laporan" element={<ProtectedRoute><LaporanPage /></ProtectedRoute>} />
            
            {/* Halaman Tidak Ditemukan */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ArisanProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;