"use client";

import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>; // or loader
  }

  return <>{children}</>;
}