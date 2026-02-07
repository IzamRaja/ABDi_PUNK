import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArisanStore } from "../hooks/useArisanStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const { login } = useArisanStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 2) return toast.error("Minimal 2 karakter!");
    login(username);
    toast.success("Berhasil Masuk");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600 p-6">
      <Card className="w-full max-w-xs rounded-3xl bg-white p-8">
        <CardContent className="space-y-6 text-center">
          <h2 className="text-xl font-black uppercase italic text-blue-600">ABDi PUNK</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nama Arisan..." className="text-center font-bold" />
            <Button type="submit" className="w-full h-12 bg-blue-600 font-black rounded-xl text-white">MASUK</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}