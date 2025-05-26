'use client';

import { Github, Instagram, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="px-4">
      <div className="flex w-full flex-col items-center justify-between gap-6 border-t border-border py-4 md:flex-row">
        <div className="flex flex-col items-center justify-start gap-4 md:flex-row md:justify-center">
          <a href="/terms-and-condition" className="text-xs text-gray-400 transition hover:text-primary md:text-sm">
            {t('pages.footer.links.terms-and-conditions')}
          </a>
          <a href="/privacy-policy" className="text-xs text-gray-400 transition hover:text-primary md:text-sm">
            {t('pages.footer.links.privacy-policy')}
          </a>
          <a href="/cookies" className="text-xs text-gray-400 transition hover:text-primary md:text-sm">
            {t('pages.footer.links.cookies')}
          </a>
        </div>

        <div className="flex justify-center gap-4 md:gap-6">
          <a href="mailto:otabekjon0302@gmail.com" rel="noreferrer" target="_blank" className="group flex h-8 w-8 items-center justify-center rounded-lg border border-primary hover:bg-primary">
            <span className="sr-only">Mail</span>
            <Mail className="size-4 text-primary group-hover:text-white" />
          </a>

          <a href="https://www.instagram.com/otabek_03.02" rel="noreferrer" target="_blank" className="group flex h-8 w-8 items-center justify-center rounded-lg border border-primary hover:bg-primary">
            <span className="sr-only">Instagram</span>
            <Instagram className="size-4 text-primary group-hover:text-white" />
          </a>

          <a href="https://github.com/otabek0302" rel="noreferrer" target="_blank" className="group flex h-8 w-8 items-center justify-center rounded-lg border border-primary hover:bg-primary">
            <span className="sr-only">GitHub</span>
            <Github className="size-4 text-primary group-hover:text-white" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
