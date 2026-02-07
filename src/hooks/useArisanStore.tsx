import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';

// PROVIDER: Agar App.tsx tidak crash/blank
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
  currentUser: string | null;
  login: (user: string) => void; // Fungsi yang dicari LoginPage
  logout: () => void;
  addPemenang: (data: any) => void;
  updateAnggota: (id: string, data: Partial<Anggota>) => void;
}

export const useArisanStore = create<ArisanStore>()(
  persist(
    (set) => ({
      anggota: [
        { id: '1', nama: 'Bpk. Ahmad', statusBayar: 'Belum', kehadiran: 'Absen' },
        { id: '2', nama: 'Ibu Fatimah', statusBayar: 'Belum', kehadiran: 'Absen' },
      ],
      pemenang: [],
      currentUser: null,
      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
      addPemenang: (data) => set((state) => ({ pemenang: [data, ...state.pemenang] })),
      updateAnggota: (id, data) => set((state) => ({
        anggota: state.anggota.map((a) => a.id === id ? { ...a, ...data } : a)
      })),
    }),
    { name: 'arisan-storage-vfinal' }
  )
);