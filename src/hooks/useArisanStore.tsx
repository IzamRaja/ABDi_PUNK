import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';

export const ArisanProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export interface Anggota {
  id: string;
  nama: string;
  statusBayar: 'Lunas' | 'Belum';
  kehadiran: 'Hadir' | 'Titip' | 'Absen';
}

interface ArisanStore {
  anggota: Anggota[];
  currentUser: string | null;
  login: (user: string) => void;
  logout: () => void;
  updateAnggota: (id: string, data: Partial<Anggota>) => void;
}

export const useArisanStore = create<ArisanStore>()(
  persist(
    (set) => ({
      anggota: [
        { id: '1', nama: 'Bpk. Ahmad', statusBayar: 'Belum', kehadiran: 'Absen' },
        { id: '2', nama: 'Ibu Fatimah', statusBayar: 'Belum', kehadiran: 'Absen' },
      ],
      currentUser: null,
      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
      updateAnggota: (id, data) => set((state) => ({
        anggota: state.anggota.map((a) => a.id === id ? { ...a, ...data } : a)
      })),
    }),
    { name: 'arisan-storage-final' }
  )
);