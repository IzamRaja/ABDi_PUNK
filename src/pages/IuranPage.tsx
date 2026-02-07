import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useArisanStore } from '../hooks/useArisanStore';
import { Wallet, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function IuranPage() {
  const store = useArisanStore();
  if (!store || !store.anggota) return <div className="p-8 text-center">Memuat...</div>;

  const { 
    anggota, iuran, hapusIuran, 
    formatInputRupiah, parseInputRupiah, masterIuran, updateMasterIuran,
    currentUser, getCurrentPeriod, cekTagihan, bayarSekaligus
  } = store;

  const defaultPeriode = getCurrentPeriod ? getCurrentPeriod() : new Date().toISOString().slice(0, 7);
  const [periode, setPeriode] = useState(defaultPeriode);
  
  const [editMode, setEditMode] = useState(false);
  const [tempWajib, setTempWajib] = useState("0");
  const [tempSimpanan, setTempSimpanan] = useState("0");

  useEffect(() => {
    if (formatInputRupiah) {
       setTempWajib(formatInputRupiah((masterIuran?.wajib || 0).toString()));
       setTempSimpanan(formatInputRupiah((masterIuran?.simpanan || 0).toString()));
    }
  }, [masterIuran, formatInputRupiah]);

  const handleBayar = (anggotaId: string, infoTagihan: any) => {
    if (infoTagihan.totalBulan > 0) {
      if (confirm(`Lunasi tagihan ${infoTagihan.totalBulan} bulan sebesar Rp ${infoTagihan.totalRupiah.toLocaleString('id-ID')}?`)) {
        bayarSekaligus(anggotaId, infoTagihan.listTunggakan);
        toast.success("Pembayaran berhasil dicatat!");
      }
    }
  };

  const handleBatal = (anggotaId: string) => {
    if (confirm("Batalkan status Lunas untuk bulan ini?")) {
      hapusIuran(anggotaId, periode);
      toast.info("Status pembayaran dibatalkan.");
    }
  };

  const handleSimpanMaster = () => {
    updateMasterIuran(parseInputRupiah(tempWajib), parseInputRupiah(tempSimpanan));
    setEditMode(false);
    toast.success("Tarif iuran diperbarui!");
  };

  const listPeriode = [];
  const today = new Date();
  for (let i = -6; i < 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    listPeriode.push({ val, label });
  }

  return (
    <PageLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BUKU IURAN</h1>
            <p className="text-gray-500 text-sm uppercase font-bold">{currentUser}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium px-2 text-gray-500">Periode:</span>
            <Select value={periode} onValueChange={setPeriode}>
              <SelectTrigger className="w-[180px] border-gray-200 font-bold text-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {listPeriode.map((p) => (
                  <SelectItem key={p.val} value={p.val}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* TARIF IURAN */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base flex items-center gap-2 text-blue-800">
                <Wallet className="w-4 h-4" /> Tarif Iuran per Anggota
              </CardTitle>
              {!editMode ? (
                <Button variant="ghost" size="sm" onClick={() => setEditMode(true)} className="text-blue-600 hover:bg-blue-100 h-8">Ubah Tarif</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditMode(false)} className="h-8">Batal</Button>
                  <Button size="sm" onClick={handleSimpanMaster} className="h-8 gap-1 bg-blue-600 hover:bg-blue-700"><Save className="w-3 h-3" /> Simpan</Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8 max-w-lg">
              <div>
                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Iuran Wajib</Label>
                {editMode ? (
                  <Input value={tempWajib} onChange={e => setTempWajib(formatInputRupiah(e.target.value))} className="h-9 bg-white mt-1 font-bold" />
                ) : (
                  <p className="text-xl font-black text-gray-800 mt-1">Rp {(masterIuran?.wajib || 0).toLocaleString('id-ID')}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tabungan</Label>
                {editMode ? (
                  <Input value={tempSimpanan} onChange={e => setTempSimpanan(formatInputRupiah(e.target.value))} className="h-9 bg-white mt-1 font-bold" />
                ) : (
                  <p className="text-xl font-black text-gray-800 mt-1">Rp {(masterIuran?.simpanan || 0).toLocaleString('id-ID')}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* JUDUL BAGIAN TABEL */}
        <h2 className="text-sm font-bold uppercase text-blue-800 tracking-wide px-1">
          Status Setoran Iuran
        </h2>

        {/* TABEL IURAN */}
        <Card className="shadow-sm overflow-hidden border-t-2 border-t-blue-600">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b-gray-200">
                  <TableHead className="pl-6 font-bold text-gray-700">Nama Anggota</TableHead>
                  <TableHead className="text-center font-bold text-gray-700">Status</TableHead>
                  <TableHead className="text-center font-bold text-gray-700">Jumlah Iuran</TableHead>
                  <TableHead className="text-right pr-6 font-bold text-gray-700">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anggota.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-12 text-gray-400 italic">Belum ada anggota.</TableCell></TableRow>
                ) : (
                  anggota.map((a) => {
                    const infoTagihan = cekTagihan(a.id, periode);
                    const isLunas = infoTagihan.totalBulan === 0;
                    
                    return (
                      <TableRow key={a.id} className="hover:bg-gray-50/80 transition-colors group">
                        <TableCell className="font-medium text-gray-900 pl-6">{a.nama}</TableCell>
                        <TableCell className="text-center">
                          {isLunas ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1 font-bold">Lunas</Badge>
                          ) : (
                            <Badge variant="destructive" className="px-3 py-1 font-bold">Belum Bayar</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`text-sm font-bold ${isLunas ? 'text-gray-400' : 'text-red-600'}`}>
                            Rp {infoTagihan.totalRupiah.toLocaleString('id-ID')}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          {isLunas ? (
                            <Button size="sm" variant="ghost" onClick={() => handleBatal(a.id)} 
                              className="text-orange-600 hover:bg-orange-50 h-8 gap-1">
                              <RotateCcw className="w-4 h-4" /> Batal
                            </Button>
                          ) : (
                            /* REVISI: Ukuran tombol Tagih disamakan dengan Badge Belum Bayar */
                            <Button size="sm" onClick={() => handleBayar(a.id, infoTagihan)} 
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-7 px-3 rounded-full text-[10px] uppercase">
                              Tagih
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </PageLayout>
  );
}