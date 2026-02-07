import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useArisanStore } from '../hooks/useArisanStore';

export default function NotulensiPage() {
  const { anggota } = useArisanStore();
  const hadir = anggota.filter(a => a.kehadiran !== 'Absen');

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-black uppercase">Notulensi</h1>
        <Card className="rounded-2xl bg-slate-50 border-none shadow-inner p-4">
          <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">Hadir Otomatis:</p>
          <div className="flex flex-wrap gap-2">
            {hadir.map(h => <span key={h.id} className="bg-white px-3 py-1 rounded-full text-[10px] border font-bold">{h.nama}</span>)}
          </div>
        </Card>
        <Input className="h-14 rounded-xl border-none shadow-md font-bold" placeholder="Lokasi Rapat?" />
        <Input className="h-14 rounded-xl border-none shadow-md font-bold" placeholder="Agenda Utama?" />
        <Textarea className="min-h-[150px] rounded-2xl border-none shadow-md" placeholder="Tulis pembahasan rapat di sini..." />
        <Textarea className="min-h-[80px] rounded-2xl border-none shadow-md bg-blue-50 font-bold" placeholder="Kesimpulan Akhir?" />
      </div>
    </PageLayout>
  );
}