import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArisanProvider } from "./hooks/useArisanStore";

// Komponen UI
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

// Halaman
import Dashboard from "./pages/Dashboard";
import IuranPage from "./pages/IuranPage";
import NotulensiPage from "./pages/NotulensiPage";
import UndianPage from "./pages/UndianPage";
import AnggotaPage from "./pages/AnggotaPage";
import LaporanPage from "./pages/LaporanPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ArisanProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              {/* Semua rute dibuat terbuka tanpa login */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/anggota" element={<AnggotaPage />} />
              <Route path="/iuran" element={<IuranPage />} />
              <Route path="/notulensi" element={<NotulensiPage />} />
              <Route path="/undian" element={<UndianPage />} />
              <Route path="/laporan" element={<LaporanPage />} />
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