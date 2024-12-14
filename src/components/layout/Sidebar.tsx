import { FileText, Files, Settings, LogOut } from 'lucide-react';
import { NavItem } from './NavItem';
import { AuthService } from '@/lib/auth/auth.service';
import { useToast } from '@/hooks/use-toast';

export function Sidebar() {
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      window.location.href = '/login';
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <aside className="w-64 border-r bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <FileText className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold">PDF Assistant</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <NavItem href="/dashboard" icon={FileText}>
            PDF Rewriter
          </NavItem>
          <NavItem href="/dashboard/rewrites" icon={Files}>
            All Rewrites
          </NavItem>
          <NavItem href="/dashboard/settings" icon={Settings}>
            Settings
          </NavItem>
        </nav>

        {/* Logout */}
        <div className="border-t p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}