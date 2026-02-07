import { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useArisanStore } from '../hooks/useArisanStore';
import { PlusCircle, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';

export default function NotulensiPage() {
  const { currentUser } = useArisanStore();
  
  // Kita pakai data lokal dulu agar tidak error "9+" 
  // karena di store pusat belum ada data 'notulensi'
  const [listNotulensi, setListNotulensi] = useState([
    { id: 1, judul: "Rapat Persiapan", isi: "Hasil rapat awal karang taruna...", tanggal: "2024-05-20" }
  ]);
  
  const [open, setOpen] = useState(false);
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");

  const handleSubmit = () => {
    if (!judul || !isi) return toast.error("Judul dan isi tidak boleh kosong");
    
    const baru = {
      id: Date.now(),
      judul,
      isi,
      tanggal: new Date().toLocaleDateString('id-ID')
    };
    
    setListNotulensi([baru, ...listNotulensi]);
    toast.success("Catatan rapat berhasil disimpan secara lokal");
    setOpen(false);
    setJudul(""); setIsi("");
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notulensi Rapat</h1>
            <p className="text-gray-500 text-sm uppercase font-bold">{currentUser || 'PENGURUS'}</p>
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
                <div>
                  <Label>Topik Rapat</Label>
                  <Input value={judul} onChange={e => setJudul(e.target.value)} placeholder="Misal: Agenda Kerja Bakti" />
                </div>
                <div>
                  <Label>Isi Pembahasan</Label>
                  <Textarea value={isi} onChange={e => setIsi(e.target.value)} placeholder="Tulis poin-poin penting..." className="h-32" />
                </div>
                <Button onClick={handleSubmit} className="w-full">Simpan Catatan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {listNotulensi.map((n) => (
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
          ))}
        </div>
      </div>
    </PageLayout>
  );
}