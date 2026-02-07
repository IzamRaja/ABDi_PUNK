import React from "react";
import { PageLayout } from "../components/layout/PageLayout";
import { useArisanStore } from "../hooks/useArisanStore";
import { Users, Wallet, Trophy, ClipboardCheck } from "lucide-react";

export default function Dashboard() {
  const { anggota, pemenang } = useArisanStore();

  const stats = [
    { label: "Total Anggota", val: anggota?.length || 0, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pemenang", val: pemenang?.length || 0, icon: Trophy, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Kehadiran", val: anggota?.filter(a => a.kehadiran === 'Hadir').length || 0, icon: ClipboardCheck, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Sudah Bayar", val: anggota?.filter(a => a.statusBayar === 'Lunas').length || 0, icon: Wallet, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <PageLayout>
      <div className="space-y-8 pb-10">
        {/* Header Mewah */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-black italic tracking-tighter">ABDi PUNK</h1>
            <p className="text-emerald-100 font-bold uppercase tracking-widest text-xs mt-1">Asisten Buku Digital Punk • Admin Mode</p>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Stats Asli */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border-none shadow-xl shadow-slate-200/50 flex flex-col items-center gap-4 transition-transform hover:scale-105">
              <div className={`p-4 ${s.bg} rounded-2xl`}>
                <s.icon className={`w-8 h-8 ${s.color}`} />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{s.label}</p>
                <h3 className="text-3xl font-black text-slate-900">{s.val}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}