'use client';

import { Sun, Moon } from 'lucide-react';
import { Button } from './button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const Switcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="outline" size="icon" className="cursor-pointer rounded-lg" />;
  }

  return (
    <Button variant="outline" size="icon" className="cursor-pointer rounded-lg" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <Sun className="text-primary" /> : <Moon className="text-primary" />}
    </Button>
  );
};
