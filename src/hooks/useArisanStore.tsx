import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';

// PENYAMBUNG: Agar App.tsx tidak blank putih
export const ArisanProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

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
  currentUser: string | null;
  login: (user: string) => void; // KUNCI LOGIN
  logout: () => void;
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
      currentUser: null,

      // Fungsi Login untuk LoginPage.tsx
      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),

      addPemenang: (data) => set((state) => ({
        pemenang: [data, ...state.pemenang]
      })),

      updateAnggota: (id, data) => set((state) => ({
        anggota: state.anggota.map((a) => a.id === id ? { ...a, ...data } : a)
      })),
    }),
    { name: 'arisan-storage-vfinal' }
  )
);