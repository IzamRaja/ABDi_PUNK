import { PageLayout } from '../components/layout/PageLayout';
import { Card, CardContent } from '../components/ui/card';
import { useArisanStore } from '../hooks/useArisanStore';

export default function IuranPage() {
  const { anggota, updateAnggota } = useArisanStore();

  return (
    <PageLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-black">BUKU IURAN & ABSENSI</h1>
        <Card className="rounded-3xl shadow-xl border-none overflow-hidden">
          <CardContent className="p-0 text-xs font-bold">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 uppercase">
                <tr>
                  <th className="px-6 py-4">Nama</th>
                  <th className="px-6 py-4 text-center">Iuran</th>
                  <th className="px-6 py-4 text-center">Absensi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {anggota.map((a) => (
                  <tr key={a.id}>
                    <td className="px-6 py-4 text-slate-700">{a.nama}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => updateAnggota(a.id, { statusBayar: a.statusBayar === 'Lunas' ? 'Belum' : 'Lunas' })}
                        className={`px-3 py-1.5 rounded-lg font-black ${a.statusBayar === 'Lunas' ? 'bg-emerald-500 text-white' : 'bg-slate-100'}`}
                      >
                        {a.statusBayar}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={a.kehadiran}
                        onChange={(e) => updateAnggota(a.id, { kehadiran: e.target.value as any })}
                        className="bg-white border-2 rounded-lg p-1"
                      >
                        <option value="Absen">ABSEN</option>
                        <option value="Hadir">HADIR (P1)</option>
                        <option value="Titip">TITIP (P2)</option>
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