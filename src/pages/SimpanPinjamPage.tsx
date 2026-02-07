import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useArisanStore } from '../hooks/useArisanStore';
import { PlusCircle, Wallet, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

export default function SimpanPinjamPage() {
  const { 
    anggota, simpanPinjam, currentUser, 
    tambahSimpanan, tambahPinjaman, bayarPinjaman, 
    formatInputRupiah, parseInputRupiah, getNamaAnggota 
  } = useArisanStore();

  const [activeTab, setActiveTab] = useState("simpanan");
  const [openDialog, setOpenDialog] = useState(false);
  
  // Form State
  const [selectedAnggota, setSelectedAnggota] = useState("");
  const [nominal, setNominal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  // Form Pinjaman
  const [bunga, setBunga] = useState("10"); // Default 10%
  const [tenor, setTenor] = useState("10"); // Default 10x

  const handleSubmit = () => {
    if (!selectedAnggota || !nominal) return toast.error("Data belum lengkap");
    const jumlah = parseInputRupiah(nominal);

    if (activeTab === "simpanan") {
      tambahSimpanan(selectedAnggota, jumlah, keterangan || "Simpanan Sukarela");
      toast.success("Simpanan berhasil ditambahkan");
    } else {
      tambahPinjaman(selectedAnggota, jumlah, Number(bunga), Number(tenor), keterangan || "Pinjaman Anggota");
      toast.success("Pinjaman berhasil dicairkan");
    }
    setOpenDialog(false);
    setNominal(""); setKeterangan(""); setSelectedAnggota("");
  };

  const handleBayarCicilan = (id: string, sisa: number) => {
    const bayar = prompt("Masukkan jumlah pembayaran:", sisa.toString());
    if (bayar) {
      bayarPinjaman(id, parseInt(bayar));
      toast.success("Pembayaran cicilan berhasil!");
    }
  };

  const listSimpanan = simpanPinjam.filter(sp => sp.jenis === 'simpanan').sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  const listPinjaman = simpanPinjam.filter(sp => sp.jenis === 'pinjaman').sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  return (
    <PageLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* HEADER - SUDAH BERSIH TANPA IKON */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BUKU SIMPAN PINJAM</h1>
            <p className="text-gray-500 text-sm uppercase font-bold">{currentUser}</p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2"><PlusCircle className="w-4 h-4" /> Transaksi Baru</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{activeTab === 'simpanan' ? 'Tambah Simpanan' : 'Ajukan Pinjaman'}</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Anggota</Label>
                  <select className="w-full border p-2 rounded-md" value={selectedAnggota} onChange={e => setSelectedAnggota(e.target.value)}>
                    <option value="">-- Pilih Anggota --</option>
                    {anggota.map(a => <option key={a.id} value={a.id}>{a.nama}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Nominal (Rp)</Label>
                  <Input value={nominal} onChange={e => setNominal(formatInputRupiah(e.target.value))} placeholder="0" className="font-bold" />
                </div>
                {activeTab === 'pinjaman' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Bunga (%)</Label><Input value={bunga} onChange={e => setBunga(e.target.value)} type="number" /></div>
                    <div><Label>Tenor (x)</Label><Input value={tenor} onChange={e => setTenor(e.target.value)} type="number" /></div>
                  </div>
                )}
                <div><Label>Keterangan</Label><Input value={keterangan} onChange={e => setKeterangan(e.target.value)} placeholder="Opsional" /></div>
                <Button onClick={handleSubmit} className="w-full">Simpan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* TABS & TABEL */}
        <Tabs defaultValue="simpanan" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="simpanan">Tabungan</TabsTrigger>
            <TabsTrigger value="pinjaman">Pinjaman</TabsTrigger>
          </TabsList>

          <TabsContent value="simpanan">
            <Card>
              <CardHeader><CardTitle className="text-base">Riwayat Tabungan</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow><TableHead>Tanggal</TableHead><TableHead>Nama</TableHead><TableHead>Ket</TableHead><TableHead className="text-right">Jumlah</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {listSimpanan.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center italic text-gray-400">Belum ada data</TableCell></TableRow> : 
                      listSimpanan.map(s => (
                        <TableRow key={s.id}>
                          <TableCell>{s.tanggal}</TableCell>
                          <TableCell className="font-medium">{getNamaAnggota(s.anggotaId)}</TableCell>
                          <TableCell className="text-gray-500 text-xs">{s.keterangan}</TableCell>
                          <TableCell className="text-right font-bold text-emerald-600">+ {parseInt(s.jumlah.toString()).toLocaleString('id-ID')}</TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pinjaman">
             <Card>
              <CardHeader><CardTitle className="text-base">Daftar Pinjaman Aktif</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow><TableHead>Tanggal</TableHead><TableHead>Nama</TableHead><TableHead>Tagihan</TableHead><TableHead>Sisa</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {listPinjaman.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center italic text-gray-400">Belum ada pinjaman</TableCell></TableRow> : 
                      listPinjaman.map(p => (
                        <TableRow key={p.id}>
                          <TableCell>{p.tanggal}<div className="text-[10px] text-gray-400">Tenor: {p.tenor}x</div></TableCell>
                          <TableCell className="font-medium">{getNamaAnggota(p.anggotaId)}</TableCell>
                          <TableCell>
                            <div>Rp {p.totalTagihan?.toLocaleString('id-ID')}</div>
                            <div className="text-xs text-gray-400">Pokok: {p.jumlah.toLocaleString('id-ID')}</div>
                          </TableCell>
                          <TableCell className="font-bold text-red-600">Rp {p.sisaPinjaman?.toLocaleString('id-ID')}</TableCell>
                          <TableCell className="text-right">
                             {p.sisaPinjaman === 0 ? <span className="text-green-600 font-bold text-xs border border-green-200 bg-green-50 px-2 py-1 rounded">LUNAS</span> : 
                             <Button size="sm" variant="outline" onClick={() => handleBayarCicilan(p.id, p.sisaPinjaman || 0)}>Bayar</Button>}
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </PageLayout>
  );
}