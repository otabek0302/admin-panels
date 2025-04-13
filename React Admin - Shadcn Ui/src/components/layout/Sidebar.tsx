"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Logo } from "@/assets";
import { Activity, Bell, ChartBar, HomeIcon, LogOut, Package, Settings, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  
  // Sign out function
  const signOut = () => {
    alert("Signing out");
  };

  return (
    <aside className="flex w-64 flex-col justify-start overflow-y-auto border-r bg-background px-4">
      {/* Logo */}
      <div className="flex items-center justify-center gap-10 border-b">
        <Link href="/">
          <Image src={Logo} alt="logo" className="w-16 h-16" />
        </Link>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-8 px-2 py-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-primary uppercase">Main</h2>
          <Button variant="ghost" iconSize="md" className="w-full justify-start gap-4" asChild>
            <Link href="/">
              <HomeIcon className="h-6 w-6 text-primary" />
              <span>Home</span>
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-primary uppercase">Lists</h2>
          <Button variant="ghost" iconSize="md" className="w-full justify-start gap-4" asChild>
            <Link href="/users">
              <Users className="text-primary" />
              <span>Users</span>
            </Link>
          </Button>
          <Button variant="ghost" iconSize="md" className="w-full justify-start gap-4" asChild>
            <Link href="/products">
              <Package className="text-primary" />
              <span>Products</span>
            </Link>
          </Button>
          <Button variant="ghost" iconSize="md" className="w-full justify-start gap-4" asChild>
            <Link href="/orders">
              <Package className="text-primary" />
              <span>Orders</span>
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-primary uppercase">Useful</h2>
          <Button variant="ghost" iconSize="md" className="w-full justify-start gap-4" asChild>
            <Link href="/stats">
              <ChartBar className="text-primary" />
              <span>Stats</span>
            </Link>
          </Button>
          <Button variant="ghost" iconSize="md" className="w-full justify-start gap-4" asChild>
            <Link href="/notifications">
              <Bell className="text-primary" />
              <span>Notifications</span>
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-primary uppercase">Services</h2>
          <Button variant="ghost" iconSize="md" className="w-full justify-start gap-4" asChild>
            <Link href="/activity">
              <Activity className="text-primary" />
              <span>Activity</span>
            </Link>
          </Button>
          <Button variant="ghost" iconSize="md" className="w-full justify-start gap-4" asChild>
            <Link href="/settings">
              <Settings className="text-primary" />
              <span>Settings</span>
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-bold text-primary uppercase">Profile</h2>
          <Button variant="ghost" iconSize="md" className="w-full justify-start gap-4" asChild>
            <Link href="/profile">
              <User className="text-primary" />
              <span>Profile</span>
            </Link>
          </Button>
          <Button variant="ghost" iconSize="md" className="w-full justify-start gap-4" onClick={signOut}>
            <LogOut className="text-primary" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
