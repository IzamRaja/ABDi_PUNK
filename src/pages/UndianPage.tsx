import { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useArisanStore } from '../hooks/useArisanStore';
import { Gift, Trophy, RotateCcw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UndianPage() {
  const { anggota, pemenang: riwayatPemenang, addPemenang } = useArisanStore();
  const [jumlahInput, setJumlahInput] = useState(1);
  const [pemenangSementara, setPemenangSementara] = useState<any[]>([]);
  const [isDone, setIsDone] = useState(false);

  // LOGIKA TIERED PRIORITY (Hanya yang belum pernah menang)
  const getKandidatTiers = () => {
    const belumMenang = anggota.filter(a => !riwayatPemenang.some(p => p.anggotaId === a.id));
    
    return {
      t1: belumMenang.filter(a => a.statusBayar === 'Lunas' && a.kehadiran === 'Hadir'),
      t2: belumMenang.filter(a => a.statusBayar === 'Lunas' && a.kehadiran === 'Absen'), // Titip/Sakit
      t3: belumMenang.filter(a => a.statusBayar !== 'Lunas' && a.kehadiran === 'Hadir'),
      t4: belumMenang.filter(a => a.statusBayar !== 'Lunas' && a.kehadiran === 'Absen')
    };
  };

  const jalankanUndian = () => {
    const tiers = getKandidatTiers();
    let hasil: any[] = [];
    let pool: any[] = [...tiers.t1, ...tiers.t2, ...tiers.t3, ...tiers.t4];

    // Ambil sesuai urutan peringkat hingga jumlah terpenuhi
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
    toast.info("Nama berhasil dikocok. Cek kelayakan!");
  };

  const finalisasiPemenang = () => {
    pemenangSementara.forEach(p => {
      addPemenang({
        id: Date.now().toString() + Math.random(),
        anggotaId: p.id,
        namaAnggota: p.nama,
        tanggal: new Date().toLocaleDateString('id-ID'),
        periode: new Date().toLocaleString('default', { month: 'long' })
      });
    });
    setPemenangSementara([]);
    setIsDone(false);
    toast.success("Pemenang telah dicatat ke riwayat!");
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto space-y-8 text-center pb-20">
        
        {/* AREA IKON BINGKISAN BESAR */}
        <div className="flex justify-center py-6">
          <div className="relative">
            <Gift className={`w-40 h-40 ${isDone ? 'text-amber-500 scale-110' : 'text-emerald-500'} transition-all duration-500`} />
            {isDone && <Trophy className="absolute -top-4 -right-4 w-12 h-12 text-yellow-400 animate-bounce" />}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Jumlah Pemenang</h2>
            <Input 
              type="number" 
              value={jumlahInput} 
              onChange={(e) => setJumlahInput(Number(e.target.value))}
              className="text-center text-3xl font-black h-16 border-2 focus:border-emerald-500 rounded-2xl"
            />
          </div>

          <div className="flex flex-col gap-3 items-center">
            {/* TOMBOL KOCOK / KOCOK ULANG */}
            <Button 
              onClick={jalankanUndian}
              className={`w-1/2 h-14 text-lg font-bold rounded-2xl transition-all shadow-lg ${
                isDone ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isDone ? <><RotateCcw className="mr-2 w-5 h-5" /> Kocok Ulang</> : "Kocok"}
            </Button>

            {/* TOMBOL PEMENANG (EMAS) */}
            <Button 
              disabled={!isDone}
              onClick={finalisasiPemenang}
              className="w-full h-20 text-2xl font-black bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-xl disabled:opacity-30 gap-3"
            >
              <CheckCircle2 className="w-8 h-8" /> PEMENANG
            </Button>
          </div>
        </div>

        {/* DISPLAY HASIL SEMENTARA */}
        {isDone && (
          <div className="grid gap-4 animate-in slide-in-from-bottom-4 duration-500">
            {pemenangSementara.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border-2 border-amber-200 shadow-md flex justify-between items-center">
                <div className="text-left">
                  <p className="text-xs font-bold text-amber-600 uppercase">Pemenang {i + 1}</p>
                  <h3 className="text-2xl font-black text-slate-800">{p.nama}</h3>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    p.kehadiran === 'Hadir' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {p.statusBayar} | {p.kehadiran}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </PageLayout>
  );
}