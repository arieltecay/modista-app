import { ReactNode } from 'react';

export interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
}

export interface AdminSidebarProps {
  onClose?: () => void;
}
