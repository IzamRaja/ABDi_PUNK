import { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { ScrollArea } from '../components/ui/scroll-area';
import { useArisanStore } from '../hooks/useArisanStore';
import { Save, Users, Calendar, MapPin, ClipboardList, CheckSquare, MessageSquare, AlertCircle, ListTodo, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function NotulensiPage() {
  const { anggota, currentUser } = useArisanStore();
  
  // State untuk form
  const [formData, setFormData] = useState({
    namaRapat: "",
    waktu: "",
    lokasi: "",
    agenda: "",
    pembahasan: "",
    keputusan: "",
    tindakLanjut: "",
    penutup: ""
  });

  const [hadir, setHadir] = useState<string[]>([]);

  const toggleHadir = (nama: string) => {
    setHadir(prev => 
      prev.includes(nama) ? prev.filter(a => a !== nama) : [...prev, nama]
    );
  };

  const handleSave = () => {
    if (!formData.namaRapat) return toast.error("Nama Rapat wajib diisi");
    console.log("Data Tersimpan:", { ...formData, daftarHadir: hadir });
    toast.success("Notulensi Berhasil Disimpan secara Lokal");
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
        
        {/* Header Dashboard */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">NOTULENSI RAPAT</h1>
            <p className="text-slate-500 text-sm font-medium">Petugas: <span className="text-emerald-600">{currentUser || 'Admin'}</span></p>
          </div>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 shadow-md gap-2 px-6">
            <Save className="w-4 h-4" /> Simpan Notulensi
          </Button>
        </div>

        {/* 1. INFORMASI DASAR */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <Calendar className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-lg">1. Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Nama Rapat</Label>
                <Input value={formData.namaRapat} onChange={e => setFormData({...formData, namaRapat: e.target.value})} placeholder="Misal: Arisan Rutin RT 01" />
              </div>
              <div className="grid gap-2">
                <Label>Hari/Tanggal & Waktu</Label>
                <Input type="datetime-local" value={formData.waktu} onChange={e => setFormData({...formData, waktu: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Lokasi</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input className="pl-9" value={formData.lokasi} onChange={e => setFormData({...formData, lokasi: e.target.value})} placeholder="Rumah Bpk. Syamsul" />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="flex justify-between">Daftar Hadir <span className="text-blue-600 text-xs font-bold">{hadir.length} Orang</span></Label>
              <ScrollArea className="h-[180px] w-full rounded-md border p-4 bg-slate-50/50">
                <div className="grid grid-cols-1 gap-3">
                  {anggota.map((person) => (
                    <div key={person.id} className="flex items-center space-x-2 bg-white p-2 rounded border shadow-sm">
                      <Checkbox 
                        id={person.id} 
                        checked={hadir.includes(person.nama)}
                        onCheckedChange={() => toggleHadir(person.nama)}
                      />
                      <label htmlFor={person.id} className="text-sm font-medium leading-none cursor-pointer">{person.nama}</label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* 2. AGENDA RAPAT */}
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <ClipboardList className="w-5 h-5 text-emerald-500" />
            <CardTitle className="text-lg">2. Agenda Rapat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-slate-500 italic bg-emerald-50 p-2 rounded border border-emerald-100">
              Tuliskan poin-poin utama yang direncanakan untuk dibahas. Ini membantu menjaga catatan tetap terstruktur sesuai alur pembicaraan.
            </p>
            <Textarea 
              value={formData.agenda} 
              onChange={e => setFormData({...formData, agenda: e.target.value})}
              placeholder="1. Pembukaan&#10;2. Laporan Keuangan..." 
              className="h-24 bg-white" 
            />
          </CardContent>
        </Card>

        {/* 3. PEMBAHASAN */}
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <MessageSquare className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-lg">3. Pembahasan & Ringkasan Diskusi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-slate-500 italic bg-amber-50 p-2 rounded border border-amber-100">
              Poin utama dari setiap topik yang dibahas, argumen penting atau kendala yang muncul, data atau fakta baru yang dibagikan.
            </p>
            <Textarea 
              value={formData.pembahasan} 
              onChange={e => setFormData({...formData, pembahasan: e.target.value})}
              placeholder="Bpk. X menyarankan agar..." 
              className="h-40 bg-white" 
            />
          </CardContent>
        </Card>

        {/* 4. KEPUTUSAN */}
        <Card className="border-l-4 border-l-rose-500 shadow-sm bg-rose-50/20">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <CardTitle className="text-lg text-rose-700">4. Keputusan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-slate-500 italic bg-white p-2 rounded border shadow-inner">
              Berikan penekanan khusus untuk hasil akhir diskusi agar tidak ada perdebatan di masa depan mengenai apa yang sudah disepakati.
            </p>
            <Textarea 
              value={formData.keputusan} 
              onChange={e => setFormData({...formData, keputusan: e.target.value})}
              placeholder="DISEPAKATI: Iuran naik menjadi..." 
              className="h-28 bg-white border-rose-200 focus-visible:ring-rose-500 font-bold text-rose-900" 
            />
          </CardContent>
        </Card>

        {/* 5. TINDAK LANJUT */}
        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <ListTodo className="w-5 h-5 text-indigo-500" />
            <CardTitle className="text-lg">5. Rencana Tindak Lanjut</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-slate-500 italic bg-indigo-50 p-2 rounded border border-indigo-100">
              Tugas: Apa yang harus dilakukan. | PIC: Siapa yang bertanggung jawab. | Deadline: Kapan harus selesai.
            </p>
            <Textarea 
              value={formData.tindakLanjut} 
              onChange={e => setFormData({...formData, tindakLanjut: e.target.value})}
              placeholder="Tugas: Belanja snack | PIC: Bpk. Y | Deadline: 10 Feb" 
              className="h-28 bg-white" 
            />
          </CardContent>
        </Card>

        {/* 6. PENUTUP */}
        <Card className="border-l-4 border-l-slate-500 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <Clock className="w-5 h-5 text-slate-500" />
            <CardTitle className="text-lg">6. Penutup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded border">
              Contoh: Waktu penutupan rapat.
            </p>
            <Input 
              value={formData.penutup} 
              onChange={e => setFormData({...formData, penutup: e.target.value})}
              placeholder="Rapat ditutup pukul 21.00 WIB dengan doa bersama." 
              className="bg-white" 
            />
          </CardContent>
        </Card>

      </div>
    </PageLayout>
  );
}