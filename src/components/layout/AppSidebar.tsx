import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Gift, 
  PiggyBank, 
  FileText, 
  BarChart3,
  Menu
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/anggota', icon: Users, label: 'Anggota' },
  { path: '/iuran', icon: Wallet, label: 'Iuran' },
  { path: '/undian', icon: Gift, label: 'Undian' },
  { path: '/simpan-pinjam', icon: PiggyBank, label: 'Simpan Pinjam' },
  { path: '/notulensi', icon: FileText, label: 'Notulensi' },
  { path: '/laporan', icon: BarChart3, label: 'Laporan' },
];

function SidebarContent() {
  const location = useLocation();
  
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-primary">🏘️ Arisan Desa</h1>
        <p className="text-xs text-sidebar-foreground/70 mt-1">Sistem Pencatatan Arisan</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg" 
                  : "text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/50 text-center">
          v1.0.0 - 2024
        </p>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-card shadow-md">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-sidebar min-h-screen flex-col shadow-xl">
        <SidebarContent />
      </aside>
    </>
  );
}
