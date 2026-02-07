import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useArisanStore } from '../hooks/useArisanStore';
import { Wallet, PiggyBank, Users, CreditCard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { saldo, anggota, simpanPinjam, currentUser, logout } = useArisanStore();

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // Hitung Real Piutang
  const realPiutang = simpanPinjam
    .filter(sp => sp.jenis === 'pinjaman')
    .reduce((sum, sp) => sum + (sp.sisaPinjaman || 0), 0);

  return (
    <PageLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* HEADER STANDARD */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">DASHBOARD</h1>
            <p className="text-gray-500 text-sm uppercase font-bold">{currentUser}</p>
          </div>
          
          <Button variant="destructive" onClick={logout} className="gap-2">
            <LogOut className="w-4 h-4" /> Keluar
          </Button>
        </div>

        {/* BARIS KOTAK STATISTIK (4 Kotak yang Identik) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* KAS TUNAI */}
          <Card className="shadow-md border-t-4 border-t-blue-600">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-100 rounded-xl"><Wallet className="w-6 h-6 text-blue-600" /></div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">Kas Tunai</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{formatRupiah(saldo.saldoKas)}</h3>
              <p className="text-xs text-gray-400 mt-2">Saldo Real (Fisik)</p>
            </CardContent>
          </Card>
          
          {/* TABUNGAN */}
          <Card className="shadow-md border-t-4 border-t-purple-600">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-100 rounded-xl"><PiggyBank className="w-6 h-6 text-purple-600" /></div>
                <Badge variant="secondary" className="bg-purple-50 text-purple-700">Tabungan</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{formatRupiah(saldo.totalSimpanan)}</h3>
              <p className="text-xs text-gray-400 mt-2">Total Milik Anggota</p>
            </CardContent>
          </Card>
          
          {/* PIUTANG */}
          <Card className="shadow-md border-t-4 border-t-orange-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-100 rounded-xl"><CreditCard className="w-6 h-6 text-orange-600" /></div>
                <Badge variant="secondary" className="bg-orange-50 text-orange-700">Piutang</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{formatRupiah(realPiutang)}</h3>
              <p className="text-xs text-gray-400 mt-2">Sisa Tagihan Pinjaman</p>
            </CardContent>
          </Card>

          {/* TOTAL ANGGOTA (Sekarang Identik dengan Kotak Lain) */}
          <Card className="shadow-md border-t-4 border-t-emerald-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-100 rounded-xl"><Users className="w-6 h-6 text-emerald-600" /></div>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">Anggota</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{anggota.length} Orang</h3>
              <p className="text-xs text-gray-400 mt-2">Warga Dusun Terdaftar</p>
            </CardContent>
          </Card>
        </div>

      </div>
    </PageLayout>
  );
}