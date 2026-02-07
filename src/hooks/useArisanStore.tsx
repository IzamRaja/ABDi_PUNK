import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const ArisanProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export interface Anggota {
  id: string;
  nama: string;
  statusBayar: 'Lunas' | 'Belum';
  kehadiran: 'Hadir' | 'Titip' | 'Absen';
}

interface ArisanStore {
  anggota: Anggota[];
  pemenang: any[];
  addPemenang: (data: any) => void;
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
      addPemenang: (data) => set((state) => ({ pemenang: [data, ...state.pemenang] })),
      updateAnggota: (id, data) => set((state) => ({
        anggota: state.anggota.map((a) => a.id === id ? { ...a, ...data } : a)
      })),
    }),
    { name: 'arisan-v-uji-coba' }
  )
);