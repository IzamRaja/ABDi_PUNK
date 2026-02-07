import { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useArisanStore } from '../hooks/useArisanStore';
import { Gift, Trophy, RotateCcw, CheckCircle2, History, Wallet, Coins } from 'lucide-react';
import { toast } from 'sonner';

export default function UndianPage() {
  const { anggota, pemenang: riwayatPemenang, addPemenang } = useArisanStore();
  
  // State Sesuai Instruksi
  const [jumlahInput, setJumlahInput] = useState(0); // Default 0
  const [uangDiterima, setUangDiterima] = useState(0);
  const [totalDikeluarkan, setTotalDikeluarkan] = useState(0);
  
  const [pemenangSementara, setPemenangSementara] = useState<any[]>([]);
  const [isDone, setIsDone] = useState(false);

  // Logika Tiered Priority
  const getKandidatTiers = () => {
    const belumMenang = anggota.filter(a => !riwayatPemenang.some(p => p.anggotaId === a.id));
    return {
      t1: belumMenang.filter(a => a.statusBayar === 'Lunas' && a.kehadiran === 'Hadir'),
      t2: belumMenang.filter(a => a.statusBayar === 'Lunas' && a.kehadiran === 'Absen'),
      t3: belumMenang.filter(a => a.statusBayar !== 'Lunas' && a.kehadiran === 'Hadir'),
      t4: belumMenang.filter(a => a.statusBayar !== 'Lunas' && a.kehadiran === 'Absen')
    };
  };

  const jalankanUndian = () => {
    if (jumlahInput <= 0) return toast.error("Masukkan jumlah pemenang lebih dari 0");
    
    const tiers = getKandidatTiers();
    let hasil: any[] = [];
    
    // Alur Prioritas Berjenjang
    const allCandidates = [...tiers.t1, ...tiers.t2, ...tiers.t3, ...tiers.t4];
    
    if (tiers.t1.length >= jumlahInput) {
      hasil = [...tiers.t1].sort(() => 0.5 - Math.random()).slice(0, jumlahInput);
    } else {
      hasil = [...tiers.t1];
      const sisa = jumlahInput - hasil.length;
      const nextPool = [...tiers.t2, ...tiers.t3, ...tiers.t4].sort(() => 0.5 - Math.random());
      hasil = [...hasil, ...nextPool.slice(0, sisa)];
    }

    setPemenangSementara(hasil);
    setIsDone(true);
    toast.info("Hasil sementara keluar. Lakukan validasi subyektif jika perlu.");
  };

  const finalisasiPemenang = () => {
    pemenangSementara.forEach(p => {
      addPemenang({
        id: Date.now().toString() + Math.random(),
        anggotaId: p.id,
        namaAnggota: p.nama,
        tanggal: new Date().toLocaleDateString('id-ID'),
        periode: new Date().toLocaleString('default', { month: 'long' }),
        nominalDiterima: uangDiterima,
        totalBiaya: totalDikeluarkan
      });
    });
    setPemenangSementara([]);
    setIsDone(false);
    toast.success("Pemenang sah telah dicatat di riwayat!");
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-24">
        
        {/* IKON BINGKISAN DALAM BOKS PERSEGI */}
        <div className="flex justify-center">
          <div className="w-48 h-48 bg-white border-4 border-slate-200 rounded-3xl flex items-center justify-center shadow-inner overflow-hidden">
            <Gift 
              strokeWidth={1.2} // Dibuat lebih ramping
              className={`w-32 h-32 ${isDone ? 'text-amber-500 scale-110' : 'text-slate-400'} transition-all duration-700`} 
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* PANEL KONTROL UNDIAN */}
          <Card className="rounded-3xl shadow-xl border-none bg-white">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Jumlah Undian</Label>
                <Input 
                  type="number" 
                  value={jumlahInput} 
                  onChange={(e) => setJumlahInput(Number(e.target.value))}
                  className="text-center text-3xl font-black h-16 border-2 focus:border-emerald-500 rounded-2xl"
                />
              </div>

              {/* INPUT FINANSIAL */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label className="text-[10px] font-bold uppercase flex items-center gap-1 text-slate-500"><Wallet className="w-3 h-3"/> Uang Diterima</Label>
                  <Input type="number" value={uangDiterima} onChange={(e) => setUangDiterima(Number(e.target.value))} placeholder="Rp" className="font-bold text-emerald-600"/>
                </div>
                <div className="space-y-2 text-left">
                  <Label className="text-[10px] font-bold uppercase flex items-center gap-1 text-slate-500"><Coins className="w-3 h-3"/> Total Keluar</Label>
                  <Input type="number" value={totalDikeluarkan} onChange={(e) => setTotalDikeluarkan(Number(e.target.value))} placeholder="Rp" className="font-bold text-rose-600"/>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={jalankanUndian}
                  className={`h-14 text-lg font-bold rounded-2xl transition-all shadow-lg ${
                    isDone ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isDone ? <><RotateCcw className="mr-2 w-5 h-5" /> Kocok Ulang</> : "Kocok"}
                </Button>

                <Button 
                  disabled={!isDone}
                  onClick={finalisasiPemenang}
                  className="h-20 text-2xl font-black bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-xl disabled:opacity-30 gap-3"
                >
                  <CheckCircle2 className="w-8 h-8" /> PEMENANG
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* DISPLAY HASIL SEMENTARA */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               Kandidat Terpilih {isDone && <Trophy className="w-4 h-4 text-amber-500 animate-bounce"/>}
            </h2>
            {!isDone ? (
              <div className="h-full border-2 border-dashed rounded-3xl flex items-center justify-center text-slate-300 italic p-12">
                Tekan tombol kocok untuk memulai undian.
              </div>
            ) : (
              <div className="grid gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
                {pemenangSementara.map((p, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-md flex justify-between items-center">
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-amber-600 uppercase">Slot {i + 1}</p>
                      <h3 className="text-xl font-black text-slate-800">{p.nama}</h3>
                    </div>
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border capitalize">
                      {p.statusBayar} | {p.kehadiran}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIWAYAT PEMENANG (DIBERIKAN KEMBALI) */}
        <Card className="rounded-3xl shadow-lg border-none overflow-hidden">
          <CardHeader className="bg-slate-50 border-b p-6">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" /> Riwayat Pemenang
              </CardTitle>
              <span className="bg-slate-200 text-slate-600 text-xs px-3 py-1 rounded-full font-bold">Total: {riwayatPemenang.length}</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Nama</th>
                    <th className="px-6 py-4 text-center">Periode</th>
                    <th className="px-6 py-4 text-right">Diterima</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {riwayatPemenang.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">Belum ada riwayat kemenangan.</td></tr>
                  ) : (
                    riwayatPemenang.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{p.namaAnggota}</td>
                        <td className="px-6 py-4 text-center text-slate-500">{p.periode} {p.tanggal.split('/')[2]}</td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">Rp {p.nominalDiterima?.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </PageLayout>
  );
}