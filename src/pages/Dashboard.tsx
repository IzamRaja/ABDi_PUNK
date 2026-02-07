import React from "react";
import { PageLayout } from "../components/layout/PageLayout";
import { useArisanStore } from "../hooks/useArisanStore";
import { Users, Trophy, Wallet, ClipboardCheck } from "lucide-react";

export default function Dashboard() {
  const { anggota, pemenang } = useArisanStore();

  const cards = [
    { label: "ANGGOTA", val: anggota?.length || 0, icon: Users, col: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "PEMENANG", val: pemenang?.length || 0, icon: Trophy, col: "text-amber-500", bg: "bg-amber-50" },
    { label: "HADIR", val: anggota?.filter(a => a.kehadiran === 'Hadir').length || 0, icon: ClipboardCheck, col: "text-blue-500", bg: "bg-blue-50" },
    { label: "LUNAS", val: anggota?.filter(a => a.statusBayar === 'Lunas').length || 0, icon: Wallet, col: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <PageLayout>
      <div className="space-y-10">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-12 rounded-[3rem] shadow-2xl text-white">
          <h1 className="text-5xl font-black italic tracking-tighter">ABDi PUNK</h1>
          <p className="font-bold text-xs uppercase tracking-[0.3em] opacity-80 mt-2">Digital Assistant • Admin Mode</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl flex flex-col items-center gap-4 transition-transform hover:scale-105">
              <div className={`p-4 ${c.bg} rounded-2xl`}><c.icon className={c.col} /></div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.label}</p>
                <h3 className="text-3xl font-black text-slate-900 leading-none">{c.val}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}