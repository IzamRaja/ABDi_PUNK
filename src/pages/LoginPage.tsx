import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArisanStore } from "../hooks/useArisanStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { LogIn, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const { login } = useArisanStore(); // Memanggil fungsi login dari Store
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim().length < 3) {
      return toast.error("Nama Arisan minimal 3 karakter!");
    }

    // Eksekusi Login
    login(username); 
    
    toast.success(`Selamat datang di ABDi PUNK, ${username}!`);
    
    // Pindah ke Dashboard
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md rounded-3xl shadow-2xl border-none">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-2">
            <ShieldCheck className="w-10 h-10 text-emerald-600" />
          </div>
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tighter">
            ABDi PUNK
          </CardTitle>
          <p className="text-slate-400 text-sm font-medium">Asisten Buku Digital Punk</p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Nama Kelompok Arisan
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: RT01, Keluarga..."
                className="h-14 rounded-2xl border-2 focus:border-emerald-500 font-bold text-lg px-6"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xl font-black shadow-lg transition-all active:scale-95 flex gap-3"
            >
              <LogIn className="w-6 h-6" /> MASUK
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}