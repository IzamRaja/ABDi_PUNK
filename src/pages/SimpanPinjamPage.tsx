import React from "react";
import { PageLayout } from "../components/layout/PageLayout";
import { useArisanStore } from "../hooks/useArisanStore";
import { PiggyBank, ArrowUpRight, ArrowDownLeft, Landmark } from "lucide-react";

export default function SimpanPinjamPage() {
  const { anggota } = useArisanStore();

  return (
    <PageLayout>
      <div className="space-y-8 pb-20">
        {/* Header Simpan Pinjam Mewah */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Simpan Pinjam</h1>
            <p className="text-emerald-100 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 opacity-80">
              Pengelolaan Dana Sosial • Mode Admin
            </p>
          </div>
          <Landmark className="absolute right-[-5%] bottom-[-20%] w-48 h-48 text-white/10" />
        </div>

        {/* Ringkasan Saldo Punk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl flex items-center gap-6 border-none">
            <div className="p-5 bg-emerald-100 rounded-2xl text-emerald-600">
              <ArrowDownLeft className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Simpanan</p>
              <h2 className="text-3xl font-black text-slate-900">Rp 2.500.000</h2>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-xl flex items-center gap-6 border-none">
            <div className="p-5 bg-amber-100 rounded-2xl text-amber-600">
              <ArrowUpRight className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pinjaman</p>
              <h2 className="text-3xl font-black text-slate-900">Rp 750.000</h2>
            </div>
          </div>
        </div>

        {/* Daftar Transaksi/Anggota */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-none">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-black italic text-slate-800 uppercase">Data Nasabah</h3>
            <PiggyBank className="text-emerald-500 w-6 h-6" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400">Nama Anggota</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 text-center">Simpanan</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {anggota.map((a) => (
                  <tr key={a.id} className="border-b border-slate-50 hover:bg-emerald-50/30 transition-all">
                    <td className="p-6 font-black text-slate-700 uppercase italic">{a.nama}</td>
                    <td className="p-6 text-center font-bold text-slate-600">Rp 50.000</td>
                    <td className="p-6 text-right">
                      <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        Lancar
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}