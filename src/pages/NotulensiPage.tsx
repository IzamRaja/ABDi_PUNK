import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useArisanStore } from '../hooks/useArisanStore';

export default function NotulensiPage() {
  const { anggota } = useArisanStore();
  const daftarHadir = anggota.filter(a => a.kehadiran === 'Hadir' || a.kehadiran === 'Titip');

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-black">NOTULENSI</h1>
        
        <Card className="rounded-2xl border-none shadow-md bg-slate-50">
          <CardContent className="p-6">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Peserta (Otomatis dari Iuran)</p>
            <div className="flex flex-wrap gap-2">
              {daftarHadir.map(p => (
                <span key={p.id} className="bg-white px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm">
                  {p.nama}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Input 
          className="h-16 rounded-2xl border-none shadow-md text-lg font-bold placeholder:text-slate-300" 
          placeholder="Lokasi Rapat?" 
        />
        
        <Input 
          className="h-16 rounded-2xl border-none shadow-md text-lg font-bold placeholder:text-slate-300" 
          placeholder="Agenda Utama?" 
        />

        <Textarea 
          className="min-h-[200px] rounded-3xl border-none shadow-md p-6 placeholder:text-slate-300" 
          placeholder="Tuliskan detail pembahasan rapat di sini..." 
        />

        <Textarea 
          className="min-h-[100px] rounded-3xl border-none shadow-md p-6 bg-blue-50 placeholder:text-blue-200 font-bold" 
          placeholder="Kesimpulan Akhir & Instruksi Kerja?" 
        />
      </div>
    </PageLayout>
  );
}