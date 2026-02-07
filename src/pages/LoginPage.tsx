import React, { useState } from "react"; // Tambahkan React di sini!
import { useNavigate } from "react-router-dom";
import { useArisanStore } from "../hooks/useArisanStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const { login } = useArisanStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 2) return toast.error("Nama Arisan minimal 2 karakter!");
    
    login(username);
    toast.success("Berhasil Masuk");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600 p-6">
      <Card className="w-full max-w-xs rounded-3xl shadow-2xl border-none bg-white overflow-hidden">
        <CardContent className="p-8 space-y-6 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-800 uppercase italic">ABDi PUNK</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Digital Assistant</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nama Arisan..."
              className="text-center font-bold h-12 rounded-xl border-slate-200 focus:border-blue-500"
            />
            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-black rounded-xl shadow-lg transition-transform active:scale-95">
              MASUK
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}