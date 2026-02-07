import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Pastikan export interface ini ada agar halaman lain bisa membacanya
export interface Anggota {
  id: string;
  nama: string;
  statusBayar: 'Lunas' | 'Belum';
  kehadiran: 'Hadir' | 'Titip' | 'Absen';
}

export interface Pemenang {
  id: string;
  anggotaId: string;
  namaAnggota: string;
  tanggal: string;
  periode: string;
  nominalDiterima?: number;
}

interface ArisanStore {
  anggota: Anggota[];
  pemenang: Pemenang[];
  addPemenang: (data: Pemenang) => void;
  updateAnggota: (id: string, data: Partial<Anggota>) => void;
}

export const useArisanStore = create<ArisanStore>()(
  persist(
    (set) => ({
      anggota: [
        { id: '1', nama: 'Bpk. Ahmad', statusBayar: 'Belum', kehadiran: 'Absen' },
        { id: '2', nama: 'Ibu Fatimah', statusBayar: 'Belum', kehadiran: 'Absen' },
        { id: '3', nama: 'Bpk. Bambang', statusBayar: 'Belum', kehadiran: 'Absen' },
      ],
      pemenang: [],
      addPemenang: (data) => set((state) => ({
        pemenang: [data, ...state.pemenang]
      })),
      updateAnggota: (id, data) => set((state) => ({
        anggota: state.anggota.map((a) => a.id === id ? { ...a, ...data } : a)
      })),
    }),
    { name: 'arisan-storage-v2' } // Versi baru agar tidak bentrok data lama
  )
);