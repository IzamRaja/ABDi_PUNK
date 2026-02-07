import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useArisanStore } from '../hooks/useArisanStore';
import { Users, ClipboardList, MapPin, Target, MessageSquare, CheckSquare } from 'lucide-react';

export default function NotulensiPage() {
  const { anggota } = useArisanStore();
  
  // Otomatis mengambil data dari Buku Iuran (Filter: Hadir atau Titip)
  const daftarHadir = anggota.filter(a => a.kehadiran === 'Hadir' || a.kehadiran === 'Titip');

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-700">
        
        {/* HEADER NOTULENSI */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">NOTULENSI RAPAT</h1>
            <p className="text-slate-400 text-sm font-medium mt-1">Dokumentasi hasil musyawarah anggota arisan</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">Sistem Notulensi v2.0</span>
          </div>
        </div>

        {/* 1. DAFTAR HADIR OTOMATIS */}
        <Card className="rounded-3xl border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-slate-50 border-b flex flex-row items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600">Daftar Hadir (Otomatis)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {daftarHadir.length === 0 ? (
                <p className="text-slate-400 italic text-sm">Silakan isi absensi di Buku Iuran terlebih dahulu...</p>
              ) : (
                daftarHadir.map(p => (
                  <span key={p.id} className="bg-white px-4 py-2 rounded-xl border-2 text-xs font-black text-slate-700 shadow-sm flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${p.kehadiran === 'Hadir' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    {p.nama}
                  </span>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* 2. LOKASI & AGENDA (Keterangan di dalam boks) */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-3xl border-none shadow-md p-2">
            <CardContent className="pt-4 space-y-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                <Input 
                  className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold placeholder:text-slate-400 placeholder:font-medium" 
                  placeholder="Di mana lokasi rapat hari ini?" 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-md p-2">
            <CardContent className="pt-4 space-y-4">
              <div className="relative">
                <Target className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                <Input 
                  className="pl-12 h-14 bg-slate-50 border-none rounded-2xl font-bold placeholder:text-slate-400 placeholder:font-medium" 
                  placeholder="Apa agenda utama rapat kali ini?" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. HASIL PEMBAHASAN & KESIMPULAN (Keterangan di dalam boks) */}
        <Card className="rounded-3xl border-none shadow-lg">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">Hasil Pembahasan</span>
              </div>
              <Textarea 
                className="min-h-[200px] bg-slate-50 border-none rounded-2xl p-6 font-medium placeholder:text-slate-400 leading-relaxed shadow-inner"
                placeholder="Tuliskan poin-poin diskusi, masukan anggota, dan jalannya rapat secara mendalam di sini..."
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <CheckSquare className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">Kesimpulan & Instruksi</span>
              </div>
              <Textarea 
                className="min-h-[120px] bg-blue-50/50 border-none rounded-2xl p-6 font-bold text-blue-900 placeholder:text-blue-300 shadow-inner"
                placeholder="Apa keputusan final rapat ini? Tulis rencana tindak lanjut atau instruksi kerja di sini..."
              />
            </div>
          </CardContent>
        </Card>

      </div>
    </PageLayout>
  );
}