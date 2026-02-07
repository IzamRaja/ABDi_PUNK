import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArisanProvider } from "./hooks/useArisanStore";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

import Dashboard from "./pages/Dashboard";
import IuranPage from "./pages/IuranPage";
import UndianPage from "./pages/UndianPage";
import NotulensiPage from "./pages/NotulensiPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ArisanProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/iuran" element={<IuranPage />} />
              <Route path="/undian" element={<UndianPage />} />
              <Route path="/notulensi" element={<NotulensiPage />} />
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