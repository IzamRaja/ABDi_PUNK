import React, { useState } from "react";
import { PageLayout } from "../components/layout/PageLayout";
import { useArisanStore } from "../hooks/useArisanStore";
import { Trophy, Dices, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

export default function UndianPage() {
  const { anggota, addPemenang } = useArisanStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const kocokArisan = () => {
    const kandidat = anggota.filter(a => a.statusBayar === 'Lunas');
    if (kandidat.length === 0) return toast.error("Tidak ada anggota yang lunas!");

    setIsSpinning(true);
    setTimeout(() => {
      const hasil = kandidat[Math.floor(Math.random() * kandidat.length)];
      setWinner(hasil.nama);
      addPemenang({ id: Date.now().toString(), namaAnggota: hasil.nama, tanggal: new Date().toLocaleDateString() });
      setIsSpinning(false);
      toast.success(`Selamat kepada ${hasil.nama}!`);
    }, 2000);
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-10 text-center pb-20">
        <h1 className="text-5xl font-black italic tracking-tighter text-slate-900">UNDIAN BERHADIAH</h1>
        
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-none relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center transition-all ${isSpinning ? 'bg-emerald-500 animate-spin' : 'bg-slate-100'}`}>
              <Trophy className={`w-20 h-20 ${isSpinning ? 'text-white' : 'text-slate-300'}`} />
            </div>
            
            <div className="h-20 flex items-center justify-center">
              {winner && !isSpinning ? (
                <h2 className="text-4xl font-black italic text-emerald-600 uppercase">{winner}</h2>
              ) : (
                <p className="text-slate-400 font-bold uppercase tracking-widest italic">Siapakah pemenangnya?</p>
              )}
            </div>

            <button 
              onClick={kocokArisan}
              disabled={isSpinning}
              className="w-full h-20 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] text-2xl font-black italic shadow-xl shadow-emerald-200 flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-50"
            >
              <Dices /> {isSpinning ? "MENGOCOK..." : "MULAI UNDIAN"}
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}