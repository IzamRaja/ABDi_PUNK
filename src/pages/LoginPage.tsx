import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useArisanStore } from '../hooks/useArisanStore';
import { Wallet } from 'lucide-react';

export default function LoginPage() {
  const { login } = useArisanStore();
  const [username, setUsername] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return alert("Nama Arisan wajib diisi!");
    login(username); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit">
            <Wallet className="w-10 h-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">ABDiPUNK</CardTitle>
          <CardDescription>Asisten Buku Digital Pungkuran</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Kelompok Arisan</Label>
              <Input 
                placeholder="Contoh: RT01, Keluarga..." 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 text-lg">
              Masuk
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}