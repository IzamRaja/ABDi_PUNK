import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArisanProvider } from "./hooks/useArisanStore";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

// Import Semua Halaman Asli
import Dashboard from "./pages/Dashboard";
import AnggotaPage from "./pages/AnggotaPage";
import IuranPage from "./pages/IuranPage";
import NotulensiPage from "./pages/NotulensiPage";
import UndianPage from "./pages/UndianPage";
import LaporanPage from "./pages/LaporanPage";
import SimpanPinjamPage from "./pages/SimpanPinjamPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ArisanProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/anggota" element={<AnggotaPage />} />
              <Route path="/iuran" element={<IuranPage />} />
              <Route path="/notulensi" element={<NotulensiPage />} />
              <Route path="/undian" element={<UndianPage />} />
              <Route path="/laporan" element={<LaporanPage />} />
              <Route path="/simpan-pinjam" element={<SimpanPinjamPage />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ArisanProvider>
    </QueryClientProvider>
  );
}