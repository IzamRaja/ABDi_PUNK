import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { db } from '../lib/firebase'; 
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  query, where, onSnapshot, setDoc 
} from 'firebase/firestore';
import { Anggota, Iuran, Undian, SimpanPinjam, Notulensi, Saldo, TransaksiManual } from '../types/arisan';

// ... (Tipe data FinancialRecord, getCurrentDate, getCurrentPeriod tetap sama) ...
export interface FinancialRecord { id: string; tanggal: string; keterangan: string; masuk: number; keluar: number; sumber: 'Kas' | 'Tabungan' | 'Pinjaman' | 'Arisan' | 'Manual'; tipe: 'in' | 'out'; }
const getCurrentDate = () => new Date().toISOString().split('T')[0];
const getCurrentPeriod = () => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; };

function useArisanLogic() {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('current_user') || '');
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [iuran, setIuran] = useState<Iuran[]>([]);
  const [undian, setUndian] = useState<Undian[]>([]);
  const [simpanPinjam, setSimpanPinjam] = useState<SimpanPinjam[]>([]);
  const [transaksiLain, setTransaksiLain] = useState<TransaksiManual[]>([]);
  
  // REVISI: Default awal dibuat 0 agar bersih
  const [masterIuran, setMasterIuran] = useState({ wajib: 0, simpanan: 0 });

  useEffect(() => { localStorage.setItem('current_user', currentUser); }, [currentUser]);
  const login = (username: string) => { setCurrentUser(username); };
  const logout = () => { setCurrentUser(''); window.location.href = '/'; };

  useEffect(() => {
    if (!currentUser) return;

    // ... (Listener anggota, iuran, dll tetap sama) ...
    const unsubAnggota = onSnapshot(query(collection(db, "anggota"), where("groupId", "==", currentUser)), (s) => setAnggota(s.docs.map(d => ({ ...d.data(), id: d.id }) as any)));
    const unsubIuran = onSnapshot(query(collection(db, "iuran"), where("groupId", "==", currentUser)), (s) => setIuran(s.docs.map(d => ({ ...d.data(), id: d.id }) as any)));
    const unsubUndian = onSnapshot(query(collection(db, "undian"), where("groupId", "==", currentUser)), (s) => setUndian(s.docs.map(d => ({ ...d.data(), id: d.id }) as any)));
    const unsubSP = onSnapshot(query(collection(db, "simpan_pinjam"), where("groupId", "==", currentUser)), (s) => setSimpanPinjam(s.docs.map(d => ({ ...d.data(), id: d.id }) as any)));
    const unsubTrans = onSnapshot(query(collection(db, "transaksi"), where("groupId", "==", currentUser)), (s) => setTransaksiLain(s.docs.map(d => ({ ...d.data(), id: d.id }) as any)));

    // REVISI: Listener Config Permanen
    const unsubConfig = onSnapshot(doc(db, "config", currentUser), (snap) => {
      if (snap.exists()) {
        setMasterIuran(snap.data() as any);
      }
    });

    return () => { unsubAnggota(); unsubIuran(); unsubUndian(); unsubSP(); unsubTrans(); unsubConfig(); };
  }, [currentUser]);

  // REVISI: Fungsi Update Tarif Permanen ke Firebase
  const updateMasterIuran = async (wajib: number, simpanan: number) => {
    if (!currentUser) return;
    try {
      await setDoc(doc(db, "config", currentUser), { wajib, simpanan, groupId: currentUser });
    } catch (error) {
      console.error("Gagal simpan tarif:", error);
    }
  };

  // ... (Sisa fungsi hitungSaldo, tambahAnggota, cekTagihan, dll tetap sama) ...
  const hitungSaldo = useCallback((): Saldo => {
    const totalIuran = iuran.filter(i => i.status === 'lunas').reduce((sum, i) => sum + Number(i.jumlah), 0);
    const totalSimpananAnggota = simpanPinjam.filter(sp => sp.jenis === 'simpanan').reduce((sum, sp) => sum + Number(sp.jumlah), 0);
    const totalDibayarkanUndian = undian.reduce((sum, u) => sum + Number(u.jumlahDiterima), 0);
    const totalPinjamanKeluar = simpanPinjam.filter(sp => sp.jenis === 'pinjaman').reduce((sum, sp) => sum + Number(sp.jumlah), 0);
    const totalPengembalianPinjaman = simpanPinjam.filter(sp => sp.jenis === 'pinjaman').reduce((sum, sp) => {
         const totalBayar = sp.historyAngsuran?.reduce((hSum, h) => hSum + Number(h.jumlah), 0) || 0;
         return sum + totalBayar;
      }, 0);
    const manualMasukKas = transaksiLain.filter(t => t.tipe === 'pemasukan' && t.sumberDana === 'kas').reduce((sum, t) => sum + Number(t.jumlah), 0);
    const manualKeluarKas = transaksiLain.filter(t => t.tipe === 'pengeluaran' && t.sumberDana === 'kas').reduce((sum, t) => sum + Number(t.jumlah), 0);
    const manualKeluarSimpanan = transaksiLain.filter(t => t.tipe === 'pengeluaran' && t.sumberDana === 'simpanan').reduce((sum, t) => sum + Number(t.jumlah), 0);
    const saldoKas = (totalIuran + totalPengembalianPinjaman + manualMasukKas) - (totalDibayarkanUndian + totalPinjamanKeluar + manualKeluarKas);
    const totalSimpanan = totalSimpananAnggota - manualKeluarSimpanan;
    return { totalIuran, totalDibayarkan: totalDibayarkanUndian, totalSimpanan, totalPinjaman: totalPinjamanKeluar, totalPengembalianPinjaman, saldoKas };
  }, [iuran, undian, simpanPinjam, transaksiLain]);
  const formatInputRupiah = (value: string) => { const n = value.replace(/\D/g, ''); return n ? new Intl.NumberFormat('id-ID').format(parseInt(n)) : ''; };
  const parseInputRupiah = (value: string) => parseInt(value.replace(/\./g, '') || '0');
  const getNamaAnggota = (id: string) => anggota.find(a => a.id === id)?.nama || 'Warga';
  const tambahAnggota = async (data: any) => { await addDoc(collection(db, "anggota"), { ...data, groupId: currentUser, tanggalDaftar: getCurrentDate(), status: 'aktif' }); };
  const updateAnggota = async (id: string, data: Partial<Anggota>) => { await updateDoc(doc(db, "anggota", id), data); };
  const hapusAnggota = async (id: string) => { await deleteDoc(doc(db, "anggota", id)); };
  const tambahIuran = async (anggotaId: string, periode: string) => {
    const tanggal = getCurrentDate();
    const w = Number(masterIuran.wajib);
    const s = Number(masterIuran.simpanan);
    await addDoc(collection(db, "iuran"), { groupId: currentUser, anggotaId, periode, tanggalBayar: tanggal, jumlah: w, status: 'lunas', tipe: 'wajib' });
    if (s > 0) { await addDoc(collection(db, "simpan_pinjam"), { groupId: currentUser, anggotaId, jenis: 'simpanan', jumlah: s, tanggal, keterangan: `Simpanan Wajib - ${periode}` }); }
  };
  const bayarSekaligus = async (anggotaId: string, listPeriode: string[]) => {
    const tanggal = getCurrentDate(); const w = Number(masterIuran.wajib); const s = Number(masterIuran.simpanan); const batchOps = [];
    for (const per of listPeriode) {
        batchOps.push(addDoc(collection(db, "iuran"), { groupId: currentUser, anggotaId, periode: per, tanggalBayar: tanggal, jumlah: w, status: 'lunas', tipe: 'wajib' }));
        if (s > 0) { batchOps.push(addDoc(collection(db, "simpan_pinjam"), { groupId: currentUser, anggotaId, jenis: 'simpanan', jumlah: s, tanggal, keterangan: `Simpanan Wajib - ${per}` })); }
    }
    await Promise.all(batchOps);
  };
  const cekTagihan = useCallback((anggotaId: string, periodeSaatIni: string) => {
    const targetAnggota = anggota.find(a => a.id === anggotaId);
    const tglDaftarStr = targetAnggota?.tanggalDaftar || getCurrentDate(); 
    const [thnDaftar, blnDaftar] = tglDaftarStr.split('-').map(Number);
    const dateMulaiAktif = new Date(thnDaftar, blnDaftar - 1, 1); 
    const listCheck: string[] = [];
    const [thn, bln] = periodeSaatIni.split('-').map(Number);
    const dateCek = new Date(thn, bln - 1, 1); 
    for (let i = 24; i >= 0; i--) {
        const d = new Date(dateCek.getFullYear(), dateCek.getMonth() - i, 1);
        if (d >= dateMulaiAktif) {
           const pStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
           listCheck.push(pStr);
        }
    }
    const tunggakan = listCheck.filter(p => !iuran.some(i => i.anggotaId === anggotaId && i.periode === p));
    const totalPerBulan = Number(masterIuran.wajib) + Number(masterIuran.simpanan);
    return { listTunggakan: tunggakan, totalBulan: tunggakan.length, totalRupiah: tunggakan.length * totalPerBulan };
  }, [iuran, masterIuran, anggota]);
  const hapusIuran = async (anggotaId: string, periode: string) => { 
    // Logika hapus iuran untuk fitur Batal
    const q = query(collection(db, "iuran"), where("anggotaId", "==", anggotaId), where("periode", "==", periode), where("groupId", "==", currentUser));
    const unsub = onSnapshot(q, (snap) => {
      snap.docs.forEach(d => deleteDoc(doc(db, "iuran", d.id)));
      unsub();
    });
  };
  const tambahSimpanan = async (anggotaId: string, jumlah: number, keterangan: string) => { await addDoc(collection(db, "simpan_pinjam"), { groupId: currentUser, anggotaId, jenis: 'simpanan', jumlah, tanggal: getCurrentDate(), keterangan }); };
  const tambahPinjaman = async (anggotaId: string, pokok: number, bungaPersen: number, tenor: number, keterangan: string) => { const bungaPerBulan = pokok * (bungaPersen / 100); const totalTagihan = pokok + (bungaPerBulan * tenor); await addDoc(collection(db, "simpan_pinjam"), { groupId: currentUser, anggotaId, jenis: 'pinjaman', jumlah: pokok, tanggal: getCurrentDate(), keterangan, statusPinjaman: 'aktif', bungaPersen, tenor, totalTagihan, sisaPinjaman: totalTagihan, historyAngsuran: [] }); };
  const bayarPinjaman = async (id: string, jumlahBayar: number) => { const sp = simpanPinjam.find(s => s.id === id); if (!sp) return; const sisa = Math.max(0, (sp.sisaPinjaman ?? sp.jumlah) - jumlahBayar); const hist = [...(sp.historyAngsuran || []), { tanggal: getCurrentDate(), jumlah: jumlahBayar, ke: (sp.historyAngsuran?.length || 0) + 1 }]; await updateDoc(doc(db, "simpan_pinjam", id), { sisaPinjaman: sisa, statusPinjaman: sisa === 0 ? 'lunas' : 'aktif', historyAngsuran: hist }); };
  const tambahTransaksi = async (d: any) => { await addDoc(collection(db, "transaksi"), { ...d, groupId: currentUser, tanggal: getCurrentDate() }); };
  const hapusTransaksi = async (id: string) => { await deleteDoc(doc(db, "transaksi", id)); };
  const lakukanUndian = (periode: string, jumlahPemenang: number, nominal: number) => { const sudahMenang = new Set(undian.map(u => u.pemenangId)); let kandidat = anggota.filter(a => a.status === 'aktif' && !sudahMenang.has(a.id)); if (kandidat.length < jumlahPemenang) return []; const winners: any[] = []; const batchOps = []; for (let i = 0; i < jumlahPemenang; i++) { const idx = Math.floor(Math.random() * kandidat.length); const p = kandidat[idx]; winners.push(p); batchOps.push(addDoc(collection(db, "undian"), { groupId: currentUser, pemenangId: p.id, periode, tanggalUndian: getCurrentDate(), jumlahDiterima: nominal })); kandidat.splice(idx, 1); } Promise.all(batchOps); return winners; };
  const getRiwayatLengkap = useCallback((): FinancialRecord[] => {
    const recs: FinancialRecord[] = [];
    iuran.forEach(i => recs.push({ id: i.id, tanggal: i.tanggalBayar, keterangan: `Iuran - ${getNamaAnggota(i.anggotaId)}`, masuk: i.jumlah, keluar: 0, sumber: 'Kas', tipe: 'in' }));
    simpanPinjam.filter(s => s.jenis === 'simpanan').forEach(s => recs.push({ id: s.id, tanggal: s.tanggal, keterangan: `Simpanan - ${getNamaAnggota(s.anggotaId)}`, masuk: s.jumlah, keluar: 0, sumber: 'Tabungan', tipe: 'in' }));
    simpanPinjam.filter(s => s.jenis === 'pinjaman').forEach(s => { recs.push({ id: s.id, tanggal: s.tanggal, keterangan: `Pinjaman Cair - ${getNamaAnggota(s.anggotaId)}`, masuk: 0, keluar: s.jumlah, sumber: 'Pinjaman', tipe: 'out' }); s.historyAngsuran?.forEach((h, idx) => recs.push({ id: `${s.id}_${idx}`, tanggal: h.tanggal, keterangan: `Angsuran - ${getNamaAnggota(s.anggotaId)}`, masuk: h.jumlah, keluar: 0, sumber: 'Pinjaman', tipe: 'in' })); });
    undian.forEach(u => recs.push({ id: u.id, tanggal: u.tanggalUndian, keterangan: `Undian - ${getNamaAnggota(u.pemenangId)}`, masuk: 0, keluar: u.jumlahDiterima, sumber: 'Arisan', tipe: 'out' }));
    transaksiLain.forEach(t => recs.push({ id: t.id, tanggal: t.tanggal, keterangan: t.keterangan, masuk: t.tipe === 'pemasukan' ? t.jumlah : 0, keluar: t.tipe === 'pengeluaran' ? t.jumlah : 0, sumber: t.sumberDana === 'kas' ? 'Kas' : 'Manual' as any, tipe: t.tipe === 'pemasukan' ? 'in' : 'out' }));
    return recs.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [iuran, simpanPinjam, undian, transaksiLain, anggota]);

  return {
    currentUser, login, logout, anggota, iuran, undian, simpanPinjam, transaksiLain, masterIuran, saldo: hitungSaldo(),
    tambahAnggota, updateAnggota, hapusAnggota, tambahIuran, hapusIuran, updateMasterIuran, tambahSimpanan, tambahPinjaman, bayarPinjaman,
    tambahTransaksi, hapusTransaksi, lakukanUndian, formatInputRupiah, parseInputRupiah, getNamaAnggota, getRiwayatLengkap,
    getAnggotaBelumMenang: () => anggota.filter(a => a.status === 'aktif'), getCurrentPeriod, cekTagihan, bayarSekaligus
  };
}

const ArisanContext = createContext<ReturnType<typeof useArisanLogic> | null>(null);
export const ArisanProvider = ({ children }: { children: React.ReactNode }) => { const store = useArisanLogic(); return <ArisanContext.Provider value={store}>{children}</ArisanContext.Provider>; };
export const useArisanStore = () => { const context = useContext(ArisanContext); if (!context) throw new Error("useArisanStore harus dalam ArisanProvider"); return context; };