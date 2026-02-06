// Tambahkan properti 'groupId' di setiap interface

export interface GroupArisan {
  id: string;
  nama: string;
}

export interface Anggota {
  id: string;
  groupId: string; // <--- Penanda Kelompok
  nama: string;
  noHP?: string;
  tanggalDaftar: string;
  status: 'aktif' | 'nonaktif';
}

export interface Iuran {
  id: string;
  groupId: string; // <--- Penanda Kelompok
  anggotaId: string;
  periode: string;
  tanggalBayar: string;
  jumlah: number;
  status: 'lunas' | 'tunggakan';
  tipe: 'wajib' | 'sukarela';
}

export interface Undian {
  id: string;
  groupId: string; // <--- Penanda Kelompok
  pemenangId: string;
  periode: string;
  tanggalUndian: string;
  jumlahDiterima: number;
}

export interface RiwayatAngsuran {
  tanggal: string;
  jumlah: number;
  ke: number;
}

export interface SimpanPinjam {
  id: string;
  groupId: string; // <--- Penanda Kelompok
  anggotaId: string;
  jenis: 'simpanan' | 'pinjaman';
  jumlah: number;
  tanggal: string;
  keterangan: string;
  
  bungaPersen?: number;
  tenor?: number;
  totalTagihan?: number;
  sisaPinjaman?: number;
  statusPinjaman?: 'aktif' | 'lunas' | 'macet';
  historyAngsuran?: RiwayatAngsuran[];
}

export interface TransaksiManual {
  id: string;
  groupId: string; // <--- Penanda Kelompok
  tanggal: string;
  tipe: 'pemasukan' | 'pengeluaran';
  kategori: string;
  jumlah: number;
  sumberDana: 'kas' | 'simpanan';
  keterangan: string;
}

export interface Notulensi {
  id: string;
  groupId: string; // <--- Penanda Kelompok
  tanggal: string;
  judul: string;
  isi: string;
  penulis: string;
}

export interface Saldo {
  totalIuran: number;
  totalDibayarkan: number;
  totalSimpanan: number;
  totalPinjaman: number;
  totalPengembalianPinjaman: number;
  saldoKas: number;
}