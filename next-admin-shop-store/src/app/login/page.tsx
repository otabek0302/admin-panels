'use client';

import Loading from '../loading';
import Image from 'next/image';

import { signIn, useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { logo } from '@/assets';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
    const { t } = useTranslation();
    const { status } = useSession();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (status === 'loading') return <Loading />;
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/',
      });
      setIsLoading(false);
    };

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <section className="w-full max-w-sm md:max-w-3xl">
      <div className='flex flex-col gap-6'>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{t('pages.login.title')}</h1>
                <p className="text-muted-foreground text-balance">{t('pages.login.description')}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('pages.login.email')}</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('pages.login.password')}</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    {t('pages.login.forgot-password')}
                  </a>
                </div>
                <Input id="password" type="password" placeholder="********" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('pages.login.login-button-loading') : t('pages.login.login-button')}
              </Button>
            </div>
          </form>
          <div className="relative hidden border-l md:block">
            <Image src={logo} alt="Login" priority fill className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </CardContent>
      </Card>
    </div>
      </section>
    </main>
  )
}

export default LoginPage
