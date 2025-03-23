"use client";

import { SearchForm } from "@/components/ui/search-form";
import { Button } from "../ui/button";
import { Bell, Maximize, Minimize, Moon, Sun } from "lucide-react";
import { LanguagesDropdown } from "../ui/languages-dropdown";
import { useTheme } from "next-themes";
import { useState } from "react";
import { NavUser } from "../ui/nav-user";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (isMaximized) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <header className="px-4 py-3 flex items-center justify-between border-b bg-background">
      <div className="w-96">
        <SearchForm />
      </div>
      <div className="flex-1 flex items-center justify-end gap-2">
        <LanguagesDropdown />
        <Button variant="outline" size="icon" iconSize="md" className="shadow-none cursor-pointer" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="text-primary" /> : <Moon className="text-primary" />}
        </Button>
        <Button variant="outline" size="icon" iconSize="md" className="shadow-none cursor-pointer">
          <Bell className="text-primary" />
        </Button>
        <Button variant="outline" size="icon" iconSize="md" className="shadow-none cursor-pointer" onClick={handleMaximize}>
          {isMaximized ? <Minimize className="text-primary" /> : <Maximize className="text-primary" />}
        </Button>
        <NavUser />
      </div>
    </header>
  );
};

export default Header;
