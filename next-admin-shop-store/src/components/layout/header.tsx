'use client';

import Image from 'next/image';
import Link from 'next/link';

import { logo } from '@/assets';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Switcher } from '../ui/switcher';
import { Languages } from '../ui/languages';
import { HeaderActions } from '../ui/header-actions';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="z-50 px-4">
      <div className="flex items-center justify-between gap-2 border-b border-border py-2.5">
        <div className="flex items-center justify-center">
          {!pathname.includes('/admin') ? (
            <div className="relative h-12 w-12 rounded-full">
              <Link href="/">
                <Image src={logo} alt="logo" priority fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 50vw" />
              </Link>
            </div>
          ) : (
            <SidebarTrigger className="z-50 h-9 w-9 cursor-pointer rounded-lg border text-primary hover:bg-accent hover:text-primary" size="icon" />
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <Switcher />
          <Languages />
          <HeaderActions />
        </div>
      </div>
    </header>
  );
};

export default Header;
