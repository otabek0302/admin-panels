"use client";

import Image from "next/image";

import { logo } from "@/assets";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switcher } from "../ui/switcher";
import { Languages } from "../ui/languages";
import { HeaderActions } from "../ui/header-actions";

const Header = () => {
  const pathname = usePathname();
  
  return (
    <header className="z-50 px-4">
      <div className="border-border flex items-center justify-between gap-2 border-b py-2.5">
      <div className="flex items-center justify-center">
          {!pathname.includes('/admin') ? (
            <div className="relative h-12 w-12 rounded-full">
              <Image src={logo} alt="logo" priority fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          ) : (
            <SidebarTrigger className="hover:bg-accent hover:text-primary text-primary z-50 h-9 w-9 cursor-pointer border" size="icon" />
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