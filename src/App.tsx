import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ArisanProvider, useArisanStore } from "./hooks/useArisanStore";

// Import Halaman
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import AnggotaPage from "./pages/AnggotaPage";
import IuranPage from "./pages/IuranPage";
import NotulensiPage from "./pages/NotulensiPage";
import UndianPage from "./pages/UndianPage";
import LaporanPage from "./pages/LaporanPage";
import SimpanPinjamPage from "./pages/SimpanPinjamPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Komponen Proteksi Rute (Agar tidak bisa masuk dashboard sebelum login)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useArisanStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ArisanProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Rute Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rute Terproteksi (Hanya bisa dibuka jika sudah login) */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/anggota" element={<ProtectedRoute><AnggotaPage /></ProtectedRoute>} />
            <Route path="/iuran" element={<ProtectedRoute><IuranPage /></ProtectedRoute>} />
            <Route path="/notulensi" element={<ProtectedRoute><NotulensiPage /></ProtectedRoute>} />
            <Route path="/undian" element={<ProtectedRoute><UndianPage /></ProtectedRoute>} />
            <Route path="/laporan" element={<ProtectedRoute><LaporanPage /></ProtectedRoute>} />
            <Route path="/simpan-pinjam" element={<ProtectedRoute><SimpanPinjamPage /></ProtectedRoute>} />

            {/* Rute 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </ArisanProvider>
  </QueryClientProvider>
);

export default App;