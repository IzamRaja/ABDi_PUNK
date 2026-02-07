import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent } from '../components/ui/card';
import { useArisanStore } from '../hooks/useArisanStore';

export default function IuranPage() {
  const { anggota, updateAnggota } = useArisanStore();

  return (
    <PageLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-black tracking-tighter">BUKU IURAN & ABSENSI</h1>
        <Card className="rounded-3xl shadow-xl border-none overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-4">Nama</th>
                  <th className="px-6 py-4 text-center">Iuran</th>
                  <th className="px-6 py-4 text-center">Absensi (Penting!)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {anggota.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-700">{a.nama}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => updateAnggota(a.id, { statusBayar: a.statusBayar === 'Lunas' ? 'Belum' : 'Lunas' })}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                          a.statusBayar === 'Lunas' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {a.statusBayar === 'Lunas' ? 'LUNAS' : 'BELUM'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={a.kehadiran}
                        onChange={(e) => updateAnggota(a.id, { kehadiran: e.target.value as any })}
                        className={`text-[10px] font-bold border-2 rounded-xl px-2 py-2 outline-none ${
                          a.kehadiran === 'Hadir' ? 'border-blue-200 bg-blue-50 text-blue-700' : 
                          a.kehadiran === 'Titip' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-100 bg-white'
                        }`}
                      >
                        <option value="Absen">TIDAK HADIR</option>
                        <option value="Hadir">HADIR (P1)</option>
                        <option value="Titip">TITIP SETOR (P2)</option>
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