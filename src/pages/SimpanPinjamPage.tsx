import React from "react";
import { PageLayout } from "../components/layout/PageLayout";
import { useArisanStore } from "../hooks/useArisanStore";
import { PiggyBank, HandCoins, Landmark, ArrowUpRight, ArrowDownLeft, Receipt } from "lucide-react";

export default function SimpanPinjamPage() {
  const { anggota } = useArisanStore();

  // Logika Statis Sesuai Perintah Kemarin
  const totalSimpanan = anggota.length * 50000;
  const totalPinjaman = 750000;

  return (
    <PageLayout>
      <div className="space-y-10 pb-20">
        {/* Header Emerald Punk Asli */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 p-12 rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(5,150,105,0.4)] text-white relative overflow-hidden border-none">
          <div className="relative z-10">
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none mb-3">SIMPAN PINJAM</h1>
            <p className="text-emerald-100 font-bold text-xs uppercase tracking-[0.4em] opacity-80">
              Pengelolaan Dana Abadi • Admin Dashboard
            </p>
          </div>
          <Landmark className="absolute right-[-5%] bottom-[-15%] w-64 h-64 text-white/10 rotate-12" />
        </div>

        {/* Widget Stats Besar & Bold */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl flex items-center gap-8 transition-transform hover:scale-[1.02] border-none">
            <div className="p-6 bg-emerald-100 rounded-3xl text-emerald-600 shadow-inner">
              <ArrowDownLeft className="w-10 h-10" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TOTAL SALDO SIMPANAN</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Rp {totalSimpanan.toLocaleString()}</h2>
            </div>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl flex items-center gap-8 transition-transform hover:scale-[1.02] border-none">
            <div className="p-6 bg-amber-100 rounded-3xl text-amber-600 shadow-inner">
              <ArrowUpRight className="w-10 h-10" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TOTAL PINJAMAN AKTIF</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Rp {totalPinjaman.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        {/* Tabel Data Nasabah Punk Style */}
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-none">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-4">
              <Receipt className="text-emerald-600 w-8 h-8" />
              <h3 className="text-2xl font-black italic text-slate-800 uppercase tracking-tight">Data Buku Tabungan</h3>
            </div>
            <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black italic text-xs uppercase hover:bg-emerald-600 transition-colors">
              Cetak Laporan
            </button>
          </div>
          <div className="overflow-x-auto px-4 pb-4">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="p-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Nasabah</th>
                  <th className="p-8 text-[11px] font-black uppercase text-slate-400 text-center tracking-widest">Simpanan Pokok</th>
                  <th className="p-8 text-[11px] font-black uppercase text-slate-400 text-right tracking-widest">Pinjaman</th>
                </tr>
              </thead>
              <tbody>
                {anggota.map((a) => (
                  <tr key={a.id} className="border-b border-slate-50 hover:bg-emerald-50/40 transition-all cursor-default group">
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="font-black text-xl text-slate-700 uppercase italic group-hover:text-emerald-600 transition-colors">{a.nama}</span>
                        <span className="text-[10px] font-bold text-slate-400">ID: SP-{a.id}2026</span>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <span className="font-black text-lg text-slate-600">Rp 50.000</span>
                    </td>
                    <td className="p-8 text-right">
                      <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter shadow-sm ${a.id === '2' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                        {a.id === '2' ? 'Ada Pinjaman' : 'Lancar'}
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