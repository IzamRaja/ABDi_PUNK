import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useArisanStore } from '../hooks/useArisanStore';
import { PlusCircle, CalendarDays, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function NotulensiPage() {
  const { notulensi, currentUser } = useArisanStore();
  // Karena di store utama belum ada fungsi tambahNotulensi yang terekspos, 
  // kita asumsikan untuk sekarang kita pakai dummy dulu atau Anda perlu menambahkannya di store.
  // Tapi untuk menjaga layout, saya buat struktur UI-nya saja dulu.
  
  const [open, setOpen] = useState(false);
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");

  const handleSubmit = () => {
    toast.success("Notulensi disimpan (Simulasi)");
    setOpen(false);
    setJudul(""); setIsi("");
  };

  return (
    <PageLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* HEADER STANDARD */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notulensi Rapat</h1>
            <p className="text-gray-500 text-sm uppercase font-bold">{currentUser}</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                <PlusCircle className="w-4 h-4" /> Catat Baru
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Catatan Rapat Baru</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div><Label>Topik Rapat</Label><Input value={judul} onChange={e => setJudul(e.target.value)} placeholder="Misal: Pembubaran Panitia" /></div>
                <div><Label>Isi Pembahasan</Label><Textarea value={isi} onChange={e => setIsi(e.target.value)} placeholder="Tulis hasil rapat di sini..." className="h-32" /></div>
                <Button onClick={handleSubmit} className="w-full">Simpan Catatan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* LIST NOTULENSI */}
        <div className="grid gap-4">
          {notulensi.length === 0 ? (
            <div className="text-center py-12 text-gray-400 italic bg-gray-50 rounded-xl border border-dashed">
              Belum ada catatan rapat.
            </div>
          ) : (
            notulensi.map((n) => (
              <Card key={n.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800">{n.judul}</h3>
                    <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      <CalendarDays className="w-3 h-3 mr-1" /> {n.tanggal}
                    </div>
                  </div>
                  <p className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">{n.isi}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      </div>
    </PageLayout>
  );
}