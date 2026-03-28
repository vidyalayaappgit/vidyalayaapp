'use client';

import { useAuthStore } from '@store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAuthStore((s) => s.auth.token);
  const isLoaded = useAuthStore((s) => s.isLoaded);

  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !token) {
      router.push('/login');
    }
  }, [isLoaded, token, router]);

  if (!isLoaded) return null;

  return <>{children}</>;
}