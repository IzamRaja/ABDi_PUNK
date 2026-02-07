import { useState, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useArisanStore } from '../hooks/useArisanStore';
import { PlusCircle, Trash2, Wallet, Book, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function LaporanPage() {
  const store = useArisanStore();

  if (!store || !store.iuran) return <div className="p-8 text-center text-gray-500">Memuat Laporan...</div>;

  const { 
    iuran, undian, simpanPinjam, transaksiLain, 
    getCurrentPeriod, formatInputRupiah, parseInputRupiah,
    tambahTransaksi, hapusTransaksi, currentUser, getNamaAnggota
  } = store;

  const defaultPeriode = getCurrentPeriod ? getCurrentPeriod() : new Date().toISOString().slice(0, 7);
  const [periode, setPeriode] = useState(defaultPeriode);

  const [ketManual, setKetManual] = useState("");
  const [nomManual, setNomManual] = useState("");
  const [tipeManual, setTipeManual] = useState<'pemasukan' | 'pengeluaran'>('pemasukan');

  // --- LOGIKA HITUNG LAPORAN (CASH BASIS) ---
  const dataLaporan = useMemo(() => {
    const bulanPilihan = periode || "2024-01"; 
    
    // 1. HITUNG SALDO AWAL (Semua transaksi yang TANGGAL-nya sebelum bulan ini)
    let saldoAwalKas = 0;
    let saldoAwalTabungan = 0;
    
    // Fungsi cek masa lalu berdasarkan TANGGAL TRANSAKSI (Bukan Periode)
    const hitungLalu = (tgl: string, jumlah: number, jenis: 'in' | 'out', sumber: 'kas' | 'tab') => {
      if ((tgl || "") < bulanPilihan + "-01") {
        if (sumber === 'kas') {
          jenis === 'in' ? (saldoAwalKas += jumlah) : (saldoAwalKas -= jumlah);
        } else {
          jenis === 'in' ? (saldoAwalTabungan += jumlah) : (saldoAwalTabungan -= jumlah);
        }
      }
    };

    // Loop data
    (iuran || []).forEach(i => hitungLalu(i.tanggalBayar, Number(i.jumlah), 'in', 'kas'));
    (undian || []).forEach(u => hitungLalu(u.tanggalUndian, Number(u.jumlahDiterima), 'out', 'kas'));
    (simpanPinjam || []).forEach(sp => {
      if (sp.jenis === 'pinjaman') {
        hitungLalu(sp.tanggal, Number(sp.jumlah), 'out', 'kas'); 
        (sp.historyAngsuran || []).forEach(h => hitungLalu(h.tanggal, Number(h.jumlah), 'in', 'kas'));
      } else {
        hitungLalu(sp.tanggal, Number(sp.jumlah), 'in', 'tab');
      }
    });
    (transaksiLain || []).forEach(t => {
      hitungLalu(t.tanggal, Number(t.jumlah), t.tipe === 'pemasukan' ? 'in' : 'out', t.sumberDana === 'kas' ? 'kas' : 'tab');
    });

    // 2. DATA BULAN INI (Berdasarkan Tanggal Transaksi di Bulan Ini)
    
    // A. Iuran Wajib
    let totalIuran = 0;
    let countIuran = 0;
    (iuran || []).forEach(i => {
      if ((i.tanggalBayar || "").startsWith(bulanPilihan)) { // Cek Tanggal Bayar
        totalIuran += Number(i.jumlah);
        countIuran++;
      }
    });

    // B. Undian
    let totalUndian = 0;
    (undian || []).forEach(u => {
      if ((u.tanggalUndian || "").startsWith(bulanPilihan)) totalUndian += Number(u.jumlahDiterima);
    });

    // C. Rincian
    const rincianMasuk: any[] = [];
    const rincianKeluar: any[] = [];

    (simpanPinjam || []).forEach(sp => {
      // Pinjaman Cair
      if (sp.jenis === 'pinjaman' && (sp.tanggal || "").startsWith(bulanPilihan)) {
        rincianKeluar.push({ id: sp.id, label: `Pinjaman Cair - ${getNamaAnggota(sp.anggotaId)}`, jumlah: Number(sp.jumlah) });
      }
      // Angsuran Masuk
      if (sp.jenis === 'pinjaman') {
        (sp.historyAngsuran || []).filter(h => (h.tanggal || "").startsWith(bulanPilihan)).forEach(h => {
          rincianMasuk.push({ id: sp.id + h.ke, label: `Angsuran Pinjaman - ${getNamaAnggota(sp.anggotaId)}`, jumlah: Number(h.jumlah) });
        });
      }
    });

    (transaksiLain || []).filter(t => (t.tanggal || "").startsWith(bulanPilihan) && t.sumberDana === 'kas').forEach(t => {
      const item = { id: t.id, label: t.keterangan, jumlah: Number(t.jumlah), isManual: true };
      t.tipe === 'pemasukan' ? rincianMasuk.push(item) : rincianKeluar.push(item);
    });

    const totalRincianMasuk = rincianMasuk.reduce((sum, item) => sum + item.jumlah, 0);
    const totalSemuaPemasukan = totalIuran + totalRincianMasuk;
    const totalRincianKeluar = rincianKeluar.reduce((sum, item) => sum + item.jumlah, 0);
    const totalSemuaPengeluaran = totalUndian + totalRincianKeluar;
    const saldoAkhir = saldoAwalKas + totalSemuaPemasukan - totalSemuaPengeluaran;


    // 3. TABUNGAN
    let tabunganMasukBulanIni = 0;
    let countPenyetorTabungan = 0;
    
    (simpanPinjam || []).forEach(sp => {
      // Cek Tanggal Setor
      if (sp.jenis === 'simpanan' && (sp.tanggal || "").startsWith(bulanPilihan)) {
        tabunganMasukBulanIni += Number(sp.jumlah);
        countPenyetorTabungan++;
      }
    });

    let tabunganKeluarBulanIni = 0; 
    (transaksiLain || []).filter(t => (t.tanggal || "").startsWith(bulanPilihan) && t.sumberDana === 'simpanan').forEach(t => {
      if (t.tipe === 'pemasukan') tabunganMasukBulanIni += Number(t.jumlah);
      else tabunganKeluarBulanIni += Number(t.jumlah);
    });

    const saldoAkhirTabungan = saldoAwalTabungan + tabunganMasukBulanIni - tabunganKeluarBulanIni;

    return {
      saldoAwalKas,
      summaryIuran: { count: countIuran, total: totalIuran },
      summaryUndian: { total: totalUndian },
      rincianMasuk, rincianKeluar,
      totalSemuaPemasukan, totalSemuaPengeluaran, saldoAkhir,
      saldoAwalTabungan,
      tabunganMasukBulanIni, countPenyetorTabungan,
      tabunganKeluarBulanIni,
      saldoAkhirTabungan
    };
  }, [iuran, undian, simpanPinjam, transaksiLain, periode]);

  // HANDLER
  const handleSimpanManual = () => {
    if (!ketManual || !nomManual) return toast.error("Lengkapi data!");
    tambahTransaksi({
      keterangan: ketManual,
      jumlah: parseInputRupiah(nomManual),
      tipe: tipeManual,
      sumberDana: 'kas'
    });
    setKetManual(""); setNomManual("");
    toast.success("Disimpan");
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
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
        
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LAPORAN KEUANGAN</h1>
            <p className="text-gray-500 text-sm uppercase font-bold">{currentUser}</p>
          </div>
          <Select value={periode} onValueChange={setPeriode}>
            <SelectTrigger className="w-[160px] font-bold"><SelectValue /></SelectTrigger>
            <SelectContent>
              {listPeriode.map((p) => (<SelectItem key={p.val} value={p.val}>{p.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        {/* INPUT MANUAL */}
        <Card className="bg-gray-50 border-dashed border-2 border-gray-300">
          <CardHeader className="pb-2 pt-4"><CardTitle className="text-sm flex items-center gap-2 text-gray-700"><PlusCircle className="w-4 h-4" /> Catat Transaksi Manual</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-2 items-end">
              <div className="flex-1 w-full"><Label className="text-xs">Keterangan</Label><Input value={ketManual} onChange={e => setKetManual(e.target.value)} placeholder="Misal: Denda, Sumbangan" className="bg-white h-9" /></div>
              <div className="w-full md:w-[150px]"><Label className="text-xs">Jumlah</Label><Input value={nomManual} onChange={e => setNomManual(store.formatInputRupiah(e.target.value))} placeholder="0" className="bg-white font-bold h-9" /></div>
              <div className="w-full md:w-[120px]"><Label className="text-xs">Jenis</Label><div className="flex bg-white rounded-md border h-9"><button onClick={() => setTipeManual('pemasukan')} className={`flex-1 text-xs font-bold ${tipeManual === 'pemasukan' ? 'bg-green-100 text-green-700' : 'text-gray-400'}`}>Masuk</button><div className="w-[1px] bg-gray-200"></div><button onClick={() => setTipeManual('pengeluaran')} className={`flex-1 text-xs font-bold ${tipeManual === 'pengeluaran' ? 'bg-red-100 text-red-700' : 'text-gray-400'}`}>Keluar</button></div></div>
              <Button onClick={handleSimpanManual} className="h-9 bg-gray-800 text-white">Simpan</Button>
            </div>
          </CardContent>
        </Card>

        {/* 1. TABEL LAPORAN KAS */}
        <Card className="shadow-lg border-t-4 border-t-blue-600">
          <CardHeader className="bg-blue-50/50 py-4 border-b">
            <CardTitle className="flex items-center gap-2 text-blue-800"><FileText className="w-5 h-5" /> LAPORAN KAS</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {/* A. SALDO AWAL */}
                <TableRow className="bg-gray-100">
                  <TableCell className="font-bold text-gray-700 py-3 w-[60%] pl-6">SALDO BULAN LALU</TableCell>
                  <TableCell className="text-right font-bold text-gray-800 text-lg pr-6">Rp {dataLaporan.saldoAwalKas.toLocaleString('id-ID')}</TableCell>
                </TableRow>

                {/* B. PEMASUKAN */}
                <TableRow><TableCell colSpan={2} className="bg-green-50 font-bold text-green-800 text-xs py-1 pl-6">A. PEMASUKAN</TableCell></TableRow>
                <TableRow className="hover:bg-green-50/20">
                  <TableCell className="pl-6 py-2 text-sm">Iuran Wajib ({dataLaporan.summaryIuran.count} Org)</TableCell>
                  <TableCell className="text-right py-2 text-sm pr-6">Rp {dataLaporan.summaryIuran.total.toLocaleString('id-ID')}</TableCell>
                </TableRow>
                {dataLaporan.rincianMasuk.map((item, idx) => (
                   <TableRow key={idx} className="hover:bg-green-50/20">
                     <TableCell className="pl-6 py-2 text-sm">
                       {item.label}
                       {item.isManual && <Trash2 className="inline w-3 h-3 ml-2 text-red-300 cursor-pointer hover:text-red-600" onClick={() => hapusTransaksi(item.id)} />}
                     </TableCell>
                     <TableCell className="text-right py-2 text-sm pr-6">Rp {item.jumlah.toLocaleString('id-ID')}</TableCell>
                   </TableRow>
                ))}
                <TableRow className="bg-green-50/80 border-t border-green-200">
                  <TableCell className="font-bold text-green-900 pl-6">Total Pemasukan</TableCell>
                  <TableCell className="text-right font-bold text-green-900 pr-6">Rp {dataLaporan.totalSemuaPemasukan.toLocaleString('id-ID')}</TableCell>
                </TableRow>

                {/* C. PENGELUARAN */}
                <TableRow><TableCell colSpan={2} className="bg-red-50 font-bold text-red-800 text-xs py-1 pl-6">B. PENGELUARAN</TableCell></TableRow>
                <TableRow className="hover:bg-red-50/20">
                  <TableCell className="pl-6 py-2 text-sm">Undian Arisan</TableCell>
                  <TableCell className="text-right py-2 text-sm pr-6">Rp {dataLaporan.summaryUndian.total.toLocaleString('id-ID')}</TableCell>
                </TableRow>
                {dataLaporan.rincianKeluar.map((item, idx) => (
                   <TableRow key={idx} className="hover:bg-red-50/20">
                     <TableCell className="pl-6 py-2 text-sm">
                       {item.label}
                       {item.isManual && <Trash2 className="inline w-3 h-3 ml-2 text-red-300 cursor-pointer hover:text-red-600" onClick={() => hapusTransaksi(item.id)} />}
                     </TableCell>
                     <TableCell className="text-right py-2 text-sm pr-6">Rp {item.jumlah.toLocaleString('id-ID')}</TableCell>
                   </TableRow>
                ))}
                <TableRow className="bg-red-50/80 border-t border-red-200">
                  <TableCell className="font-bold text-red-900 pl-6">Total Pengeluaran</TableCell>
                  <TableCell className="text-right font-bold text-red-900 pr-6">Rp {dataLaporan.totalSemuaPengeluaran.toLocaleString('id-ID')}</TableCell>
                </TableRow>

                {/* D. SALDO AKHIR */}
                <TableRow className="bg-blue-100 border-t-2 border-blue-300">
                  <TableCell className="font-bold text-blue-900 py-3 pl-6">SALDO AKHIR</TableCell>
                  <TableCell className="text-right font-bold text-blue-900 text-lg pr-6">Rp {dataLaporan.saldoAkhir.toLocaleString('id-ID')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 2. TABEL LAPORAN TABUNGAN */}
        <Card className="shadow border-t-4 border-t-purple-600">
          <CardHeader className="bg-purple-50/50 py-4 border-b">
            <CardTitle className="flex items-center gap-2 text-purple-800"><Book className="w-5 h-5" /> LAPORAN TABUNGAN</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <Table>
                <TableBody>
                   <TableRow className="bg-gray-50">
                      <TableCell className="font-bold text-gray-700 pl-6">Saldo Tabungan Lalu</TableCell>
                      <TableCell className="text-right font-bold text-gray-800 pr-6">Rp {dataLaporan.saldoAwalTabungan.toLocaleString('id-ID')}</TableCell>
                   </TableRow>
                   <TableRow>
                      <TableCell className="pl-6">Setoran Tabungan ({dataLaporan.countPenyetorTabungan} Org)</TableCell>
                      <TableCell className="text-right font-bold text-green-700 pr-6">Rp {dataLaporan.tabunganMasukBulanIni.toLocaleString('id-ID')}</TableCell>
                   </TableRow>
                   {dataLaporan.tabunganKeluarBulanIni > 0 && (
                      <TableRow>
                        <TableCell className="pl-6">Penarikan Tabungan</TableCell>
                        <TableCell className="text-right font-bold text-red-700 pr-6">- Rp {dataLaporan.tabunganKeluarBulanIni.toLocaleString('id-ID')}</TableCell>
                      </TableRow>
                   )}
                   <TableRow className="bg-purple-100 border-t border-purple-200">
                      <TableCell className="font-bold text-purple-900 py-3 pl-6">TOTAL TABUNGAN ANGGOTA</TableCell>
                      <TableCell className="text-right font-bold text-purple-900 text-lg pr-6">Rp {dataLaporan.saldoAkhirTabungan.toLocaleString('id-ID')}</TableCell>
                   </TableRow>
                </TableBody>
             </Table>
          </CardContent>
        </Card>

      </div>
    </PageLayout>
  );
}