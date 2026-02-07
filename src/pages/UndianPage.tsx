import { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useArisanStore } from '../hooks/useArisanStore';
import { Gift, RotateCcw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UndianPage() {
  const { anggota, pemenang, addPemenang } = useArisanStore();
  const [jumlah, setJumlah] = useState(0);
  const [terima, setTerima] = useState(0);
  const [hasil, setHasil] = useState<any[]>([]);
  const [isDone, setIsDone] = useState(false);

  const kocok = () => {
    if (jumlah <= 0) return toast.error("Isi jumlah!");
    const belum = anggota.filter(a => !pemenang.some(p => p.anggotaId === a.id));
    const t1 = belum.filter(a => a.statusBayar === 'Lunas' && a.kehadiran === 'Hadir');
    const t2 = belum.filter(a => a.statusBayar === 'Lunas' && a.kehadiran === 'Titip');
    let pool = [...t1];
    if (pool.length < jumlah) pool = [...pool, ...t2];
    setHasil(pool.sort(() => 0.5 - Math.random()).slice(0, jumlah));
    setIsDone(true);
  };

  const simpan = () => {
    hasil.forEach(h => addPemenang({ id: Math.random().toString(), anggotaId: h.id, namaAnggota: h.nama, tanggal: "07/02", periode: "Feb", nominalDiterima: terima }));
    setHasil([]); setIsDone(false); toast.success("Sah!");
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto space-y-8 pb-20">
        <div className="flex justify-center">
          <div className="w-40 h-40 bg-white border-4 rounded-3xl flex items-center justify-center shadow-inner">
            <Gift strokeWidth={1} className={`w-24 h-24 ${isDone ? 'text-amber-500' : 'text-slate-200'}`} />
          </div>
        </div>
        <Card className="rounded-3xl shadow-xl p-8 space-y-6">
          <Input type="number" value={jumlah} onChange={e => setJumlah(Number(e.target.value))} className="text-center text-4xl font-black h-20 rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
             <Input type="number" placeholder="Uang Diterima" onChange={e => setTerima(Number(e.target.value))} />
             <Input type="number" placeholder="Total Keluar" />
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={kocok} className={`h-14 rounded-2xl font-bold ${isDone ? 'bg-red-600' : 'bg-emerald-600'}`}>
              {isDone ? "KOCOK ULANG" : "KOCOK"}
            </Button>
            <Button onClick={simpan} disabled={!isDone} className="h-20 rounded-2xl bg-amber-500 text-2xl font-black">PEMENANG</Button>
          </div>
        </Card>
        {isDone && <div className="grid gap-2">{hasil.map((h, i) => <div key={i} className="bg-white p-4 border-2 border-amber-200 rounded-xl font-black">{h.nama}</div>)}</div>}
        <Card className="rounded-3xl border-none shadow-lg"><CardHeader><CardTitle className="text-sm">RIWAYAT</CardTitle></CardHeader>
          <CardContent>{pemenang.map(p => <div key={p.id} className="flex justify-between py-2 border-b font-bold"><span>{p.namaAnggota}</span><span className="text-emerald-600">Rp {p.nominalDiterima?.toLocaleString()}</span></div>)}</CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}