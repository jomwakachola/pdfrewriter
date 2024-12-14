import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  children: ReactNode;
}

export function NavItem({ href, icon: Icon, children }: NavItemProps) {
  const isActive = window.location.pathname === href;

  return (
    <a
      href={href}
      className={cn(
        'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon className="mr-2 h-4 w-4" />
      {children}
    </a>
  );
}