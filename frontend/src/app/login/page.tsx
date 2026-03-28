"use client";

import { useRouter } from "next/navigation";

import LoginForm from "@modules/auth/components/LoginForm";
import { loginUser } from "@modules/auth/services/auth.service";

import { useAuthStore } from "@store/auth.store";
import { useNavigation } from "@modules/navigation/hooks/useNavigation";

import type { LoginPayload } from "@modules/auth/services/auth.service";

export default function LoginPage() {
  const router = useRouter();

  const login = useAuthStore((s) => s.login);
  const { loadNavigation } = useNavigation();

  const handleLogin = async (form: LoginPayload): Promise<void> => {
    try {
      // 🔐 Step 1: API call
      const data = await loginUser(form);

      // 🔐 Step 2: Save auth
      login(data);

      // 🔥 Step 3: Load navigation (CRITICAL FIX)
      await loadNavigation();

      // 🚀 Step 4: Redirect
      router.push("/dashboard");

    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Invalid credentials");
      }
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}