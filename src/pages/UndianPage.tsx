import { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useArisanStore } from '../hooks/useArisanStore';
import { Gift, RotateCcw, CheckCircle2, History } from 'lucide-react';
import { toast } from 'sonner';

export default function UndianPage() {
  const { anggota, pemenang, addPemenang } = useArisanStore();
  const [jumlahInput, setJumlahInput] = useState(0);
  const [uangDiterima, setUangDiterima] = useState(0);
  const [totalKeluar, setTotalKeluar] = useState(0);
  const [pemenangSementara, setPemenangSementara] = useState<any[]>([]);
  const [isDone, setIsDone] = useState(false);

  const jalankanUndian = () => {
    if (jumlahInput <= 0) return toast.error("Input jumlah dulu, Bos!");
    const belumMenang = anggota.filter(a => !pemenang.some(p => p.anggotaId === a.id));
    
    // LOGIKA PERINGKAT (P1 - P4)
    const t1 = belumMenang.filter(a => a.statusBayar === 'Lunas' && a.kehadiran === 'Hadir');
    const t2 = belumMenang.filter(a => a.statusBayar === 'Lunas' && a.kehadiran === 'Titip');
    const t3 = belumMenang.filter(a => a.statusBayar !== 'Lunas' && a.kehadiran === 'Hadir');
    const t4 = belumMenang.filter(a => a.kehadiran === 'Absen');

    let pool = [...t1];
    if (pool.length < jumlahInput) pool = [...pool, ...t2];
    if (pool.length < jumlahInput) pool = [...pool, ...t3];
    if (pool.length < jumlahInput) pool = [...pool, ...t4];

    const hasil = [...pool].sort(() => 0.5 - Math.random()).slice(0, jumlahInput);
    setPemenangSementara(hasil);
    setIsDone(true);
    toast.success("Kocokan selesai!");
  };

  const simpanPemenang = () => {
    pemenangSementara.forEach(p => {
      addPemenang({
        id: Math.random().toString(),
        anggotaId: p.id,
        namaAnggota: p.nama,
        tanggal: new Date().toLocaleDateString('id-ID'),
        periode: "Februari 2026",
        nominalDiterima: uangDiterima
      });
    });
    setPemenangSementara([]);
    setIsDone(false);
    toast.success("Pemenang sah dicatat!");
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto space-y-6 pb-20">
        <div className="flex justify-center">
          <div className="w-40 h-40 bg-white border-4 rounded-3xl flex items-center justify-center shadow-inner">
            <Gift strokeWidth={1} className={`w-20 h-20 ${isDone ? 'text-amber-500' : 'text-slate-200'}`} />
          </div>
        </div>

        <Card className="rounded-3xl shadow-2xl border-none">
          <CardContent className="p-8 space-y-6">
            <Input 
              type="number" value={jumlahInput} 
              onChange={e => setJumlahInput(Number(e.target.value))}
              className="text-center text-4xl font-black h-20 rounded-2xl border-2" 
              placeholder="0"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" placeholder="Uang Diterima" onChange={e => setUangDiterima(Number(e.target.value))} className="h-12 rounded-xl font-bold" />
              <Input type="number" placeholder="Total Keluar" onChange={e => setTotalKeluar(Number(e.target.value))} className="h-12 rounded-xl font-bold" />
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={jalankanUndian} className={`h-14 rounded-2xl font-bold ${isDone ? 'bg-red-600' : 'bg-emerald-600'}`}>
                {isDone ? <><RotateCcw className="mr-2" /> Kocok Ulang</> : "Kocok"}
              </Button>
              <Button onClick={simpanPemenang} disabled={!isDone} className="h-20 rounded-2xl bg-amber-500 text-2xl font-black shadow-xl">
                PEMENANG
              </Button>
            </div>
          </CardContent>
        </Card>

        {isDone && (
          <div className="grid gap-2">
            {pemenangSementara.map((p, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border-2 border-amber-200 flex justify-between items-center">
                <span className="font-black text-slate-800">{p.nama}</span>
                <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded capitalize">{p.kehadiran}</span>
              </div>
            ))}
          </div>
        )}

        <Card className="rounded-3xl border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-slate-50 border-b p-4 text-center">
            <CardTitle className="text-sm font-black uppercase flex items-center justify-center gap-2">
              <History className="w-4 h-4" /> Riwayat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs text-left">
              <tbody className="divide-y">
                {pemenang.map(p => (
                  <tr key={p.id}><td className="px-6 py-4 font-bold">{p.namaAnggota}</td><td className="px-6 py-4 text-right font-black text-emerald-600">Rp {p.nominalDiterima?.toLocaleString()}</td></tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}