import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useArisanStore } from '../hooks/useArisanStore';
import { PlusCircle, User, Phone, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function AnggotaPage() {
  const { anggota, tambahAnggota, updateAnggota, hapusAnggota, currentUser } = useArisanStore();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nama: '', noHP: '' });

  const handleSubmit = () => {
    if (!formData.nama) return toast.error("Nama wajib diisi");
    if (editId) {
      updateAnggota(editId, formData);
      toast.success("Data diperbarui");
    } else {
      tambahAnggota(formData);
      toast.success("Anggota ditambahkan");
    }
    setOpen(false);
    setFormData({ nama: '', noHP: '' });
    setEditId(null);
  };

  const handleEdit = (a: any) => {
    setEditId(a.id);
    setFormData({ nama: a.nama, noHP: a.noHP || '' });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus anggota ini?")) {
      hapusAnggota(id);
      toast.success("Anggota dihapus");
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* HEADER STANDARD */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">DATA ANGGOTA</h1>
            <p className="text-gray-500 text-sm uppercase font-bold">{currentUser}</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditId(null); setFormData({ nama: '', noHP: '' }); }} className="bg-gray-900 text-white gap-2">
                <PlusCircle className="w-4 h-4" /> Tambah
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? 'Edit Anggota' : 'Anggota Baru'}</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div><Label>Nama Lengkap</Label><Input value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} placeholder="Contoh: Budi Santoso" /></div>
                <div><Label>No. WhatsApp (Opsional)</Label><Input value={formData.noHP} onChange={e => setFormData({...formData, noHP: e.target.value})} placeholder="0812..." /></div>
                <Button onClick={handleSubmit} className="w-full">Simpan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* TABEL */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[50px] text-center">No</TableHead>
                  <TableHead>Nama Anggota</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anggota.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-400 italic">Belum ada data anggota.</TableCell></TableRow>
                ) : (
                  anggota.map((a, idx) => (
                    <TableRow key={a.id} className="hover:bg-gray-50">
                      <TableCell className="text-center font-medium text-gray-500">{idx + 1}</TableCell>
                      <TableCell className="font-medium flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">{a.nama.charAt(0)}</div>
                        {a.nama}
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">{a.noHP || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(a)}><Edit className="w-4 h4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDelete(a.id)}><Trash2 className="w-4 h4" /></Button>
                        </div>
                      </TableCell>
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