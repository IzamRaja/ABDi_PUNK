import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useArisanStore } from '../hooks/useArisanStore';
import { Gift, Sparkles, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export default function UndianPage() {
  const { 
    undian, lakukanUndian, 
    getCurrentPeriod, getNamaAnggota, getAnggotaBelumMenang, 
    formatInputRupiah, parseInputRupiah 
  } = useArisanStore();

  const [periode, setPeriode] = useState(getCurrentPeriod());
  const [pemenangBaru, setPemenangBaru] = useState<any[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);

  // STATE INPUT MANUAL
  const [jmlPemenang, setJmlPemenang] = useState(1);
  const [nominalHadiah, setNominalHadiah] = useState(""); 

  const belumMenang = getAnggotaBelumMenang().filter(a => 
    !undian.some(u => u.pemenangId === a.id)
  );

  const handleKocok = () => {
    if (belumMenang.length === 0) return toast.error("Semua anggota sudah menang!");
    const nominalAsli = parseInputRupiah(nominalHadiah);
    if (nominalAsli <= 0) return toast.error("Masukkan nominal hadiah!");
    if (jmlPemenang < 1) return toast.error("Minimal 1 pemenang!");
    if (jmlPemenang > belumMenang.length) return toast.error(`Hanya tersisa ${belumMenang.length} kandidat!`);

    setIsSpinning(true);
    setPemenangBaru([]); // Reset tampilan pemenang lama
    
    setTimeout(() => {
      const hasil = lakukanUndian(periode, jmlPemenang, nominalAsli);
      
      if (hasil && hasil.length > 0) {
        setPemenangBaru(hasil);
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
        toast.success(`Selamat kepada pemenang!`);
      } else {
        toast.error("Gagal mengocok undian.");
      }
      setIsSpinning(false);
    }, 2000); // Putar selama 2 detik
  };

  const totalKeluarDisplay = parseInputRupiah(nominalHadiah) * jmlPemenang;

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* AREA UTAMA (TENGAH) */}
        <div className="flex flex-col items-center space-y-6 text-center">
          
          {/* 1. LOGO HADIAH TENGAH */}
          <div className="bg-green-100 p-6 rounded-full shadow-inner animate-in zoom-in">
             <Gift className="w-16 h-16 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800">UNDIAN ARISAN</h1>

          {/* 2. TOMBOL KOCOK HIJAU TENGAH */}
          {!isSpinning && pemenangBaru.length === 0 && (
             <Button 
                size="lg" 
                onClick={handleKocok}
                className="bg-green-600 hover:bg-green-700 text-white text-xl px-4 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
             >
                <Sparkles className="mr-2" /> Kocok...!
             </Button>
          )}

          {/* EFEK LOADING / MENAMPILKAN PEMENANG */}
          {isSpinning && (
            <div className="py-4
         animate-bounce text-2xl font-bold text-green-600">
              Kocok Terus...!
            </div>
          )}

          {pemenangBaru.length > 0 && (
            <Card className="w-full bg-yellow-50 border-yellow-400 border-2 shadow-xl animate-in fade-in zoom-in">
              <CardHeader><CardTitle className="text-center text-yellow-800">🎉 Selamat Kepada 🎉</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {pemenangBaru.map((p, idx) => (
                   <div key={idx} className="text-3xl font-black text-gray-900">{p.nama}</div>
                ))}
                <p className="text-lg font-bold text-green-700 mt-4">
                   Mendapatkan Rp {parseInputRupiah(nominalHadiah).toLocaleString('id-ID')}
                </p>
                <Button variant="outline" onClick={() => setPemenangBaru([])} className="mt-4 border-yellow-600 text-yellow-700">
                   Tutup
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* INPUT DATA (2 KOLOM) */}
        <Card>
           <CardContent className="p-6 space-y-6">
              
              {/* BARIS 1: ORANG & UANG PER ORANG */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label className="font-semibold text-gray-600">Jumlah Undian</Label>
                    <Input 
                      type="number" min={1} 
                      className="text-center font-bold text-lg"
                      value={jmlPemenang} 
                      onChange={e => setJmlPemenang(Number(e.target.value))} 
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="font-semibold text-gray-600">Uang Undian</Label>
                    <Input 
                      className="text-center font-bold text-lg"
                      placeholder="0"
                      value={nominalHadiah} 
                      onChange={e => setNominalHadiah(formatInputRupiah(e.target.value))} 
                    />
                 </div>
              </div>

              {/* BARIS 2: PERIODE & TOTAL KELUAR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t">
                 <div className="space-y-2">
                    <Label className="font-semibold text-gray-600">Periode Arisan</Label>
                    <Input 
                       type="month" 
                       className="text-center"
                       value={periode} 
                       onChange={e => setPeriode(e.target.value)} 
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="font-semibold text-gray-600">Total Uang Undian</Label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm font-bold text-red-600 items-center justify-center">
                       Rp {totalKeluarDisplay.toLocaleString('id-ID')}
                    </div>
                 </div>
              </div>

           </CardContent>
        </Card>

        {/* RIWAYAT PEMENANG (TABEL) */}
        <Card>
          <CardHeader><CardTitle>Riwayat Pemenang Undian</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Pemenang</TableHead>
                  <TableHead className="text-center">Periode</TableHead>
                  <TableHead className="text-right">Nominal Diterima</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {undian.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-4 text-gray-400">Belum ada riwayat.</TableCell></TableRow>
                ) : (
                  undian.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                         <Trophy className="w-4 h-4 text-yellow-500" /> {useArisanStore().getNamaAnggota(u.pemenangId)}
                      </TableCell>
                      <TableCell className="text-center">{u.periode}</TableCell>
                      <TableCell className="text-right font-bold text-gray-700">Rp {u.jumlahDiterima.toLocaleString('id-ID')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </PageLayout>
  );
}