"use client";

import { useRouter } from "next/navigation";
import LoginForm from "../../modules/auth/components/LoginForm";
import { loginUser } from "../../modules/auth/services/auth.service";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {

  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (form: any) => {
    try {
      const data = await loginUser(form);

      login(data);

      // ❌ DO NOT CALL NAV HERE
      router.push("/dashboard");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}