import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Anggota {
  id: string;
  nama: string;
  statusBayar: 'Lunas' | 'Belum';
  kehadiran: 'Hadir' | 'Titip' | 'Absen'; // Status kehadiran baru
}

interface Pemenang {
  id: string;
  anggotaId: string;
  namaAnggota: string;
  tanggal: string;
  periode: string;
  nominalDiterima?: number;
  totalBiaya?: number;
}

interface ArisanStore {
  anggota: Anggota[];
  pemenang: Pemenang[];
  currentUser: string;
  setCurrentUser: (name: string) => void;
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
      currentUser: '',
      setCurrentUser: (name) => set({ currentUser: name }),
      updateAnggota: (id, data) => set((state) => ({
        anggota: state.anggota.map((a) => a.id === id ? { ...a, ...data } : a)
      })),
      addPemenang: (data) => set((state) => ({
        pemenang: [data, ...state.pemenang]
      })),
    }),
    { name: 'arisan-storage' }
  )
);