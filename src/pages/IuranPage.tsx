import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent } from '../components/ui/card';
import { useArisanStore } from '../hooks/useArisanStore';
import { UserCheck, Wallet2, Clock } from 'lucide-react';

export default function IuranPage() {
  const { anggota, updateAnggota } = useArisanStore();

  return (
    <PageLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">BUKU IURAN & ABSENSI</h1>
          <div className="flex gap-4 text-xs font-bold">
            <span className="flex items-center gap-1 text-emerald-600"><UserCheck className="w-4 h-4"/> Lunas: {anggota.filter(a => a.statusBayar === 'Lunas').length}</span>
            <span className="flex items-center gap-1 text-blue-600"><Clock className="w-4 h-4"/> Hadir: {anggota.filter(a => a.kehadiran === 'Hadir').length}</span>
          </div>
        </div>

        <Card className="rounded-2xl overflow-hidden shadow-xl border-none">
          <CardContent className="p-0">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-6 py-4">Nama Anggota</th>
                  <th className="px-6 py-4 text-center">Status Iuran</th>
                  <th className="px-6 py-4 text-center">Kehadiran (Absensi)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {anggota.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-700">{a.nama}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => updateAnggota(a.id, { statusBayar: a.statusBayar === 'Lunas' ? 'Belum' : 'Lunas' })}
                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all shadow-sm ${
                          a.statusBayar === 'Lunas' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {a.statusBayar === 'Lunas' ? 'LUNAS' : 'BELUM'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={a.kehadiran}
                        onChange={(e) => updateAnggota(a.id, { kehadiran: e.target.value as any })}
                        className={`text-xs font-bold border-2 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                          a.kehadiran === 'Hadir' ? 'border-blue-200 bg-blue-50 text-blue-700' : 
                          a.kehadiran === 'Titip' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-400'
                        }`}
                      >
                        <option value="Absen">TIDAK HADIR</option>
                        <option value="Hadir">HADIR (FISIK)</option>
                        <option value="Titip">TITIP SETOR</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}