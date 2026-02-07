import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent } from '../components/ui/card';
import { useArisanStore } from '../hooks/useArisanStore';
import { CheckCircle2, XCircle, UserCheck } from 'lucide-react';

export default function IuranPage() {
  const { anggota, updateAnggota } = useArisanStore();

  return (
    <PageLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-black">BUKU IURAN & ABSENSI</h1>
        <Card className="rounded-2xl overflow-hidden shadow-lg border-none">
          <CardContent className="p-0">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-6 py-4">Nama Anggota</th>
                  <th className="px-6 py-4 text-center">Status Iuran</th>
                  <th className="px-6 py-4 text-center">Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {anggota.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-700">{a.nama}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => updateAnggota(a.id, { statusBayar: a.statusBayar === 'Lunas' ? 'Belum' : 'Lunas' })}
                        className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                          a.statusBayar === 'Lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {a.statusBayar === 'Lunas' ? 'LUNAS' : 'BELUM'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={a.kehadiran}
                        onChange={(e) => updateAnggota(a.id, { kehadiran: e.target.value as any })}
                        className="text-xs font-bold bg-white border rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Hadir">HADIR</option>
                        <option value="Titip">TITIP SETOR</option>
                        <option value="Absen">ABSEN</option>
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