import React from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ArisanProvider, useArisanStore } from "./hooks/useArisanStore";

import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useArisanStore();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ArisanProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ArisanProvider>
    </QueryClientProvider>
  );
}