import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

import { Logo } from "@/assets";

const Sidebar = () => {
  return (
    <aside className="flex h-screen w-64 flex-col items-center justify-between overflow-y-auto border-r bg-background px-4 py-6">
      <div className="flex flex-col gap-10">
        <Link href="/">
          <Image src={Logo} alt="logo" width={100} height={100} />
        </Link>
      </div>
      <div >
        <ul>
          <li></li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar
