"use client";

import { useState, useTransition } from "react";

interface Props {
  onSubmit: (data: {
    groupCode: string;
    userCode: string;
    password: string;
  }) => void;
}

export default function LoginForm({ onSubmit }: Props) {
  const [form, setForm] = useState({
    userCode: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      onSubmit({
        groupCode: "LGCS",
        userCode: form.userCode,
        password: form.password,
      });
    });
  };

  const isFormValid = form.userCode.trim() && form.password.trim();

  return (
    <div className="login-container">

      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="login-brand">
          <h1>School ERP</h1>
          <p>Smart ERP platform for modern education</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-card">

          {/* HEADER */}
          <div className="login-header">
            <div className="login-icon">🏫</div>
            <h2>Welcome Back</h2>
            <p>Sign in to continue</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="login-form">

            {/* USER */}
            <div className="form-group floating-group">
              <div className="input-wrapper">
                <i className="fa fa-user input-icon"></i>

                <input
                  type="text"
                  value={form.userCode}
                  onChange={(e) => handleChange("userCode", e.target.value)}
                  disabled={isPending}
                  className="input login-input"
                  required
                />

                 {/* 👇 THIS IS THE FLOATING LABEL */}
    <label className={form.userCode ? "active" : ""}>
      User Code
    </label>
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-group floating-group">
              <div className="input-wrapper">
                <i className="fa fa-lock input-icon"></i>

                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  disabled={isPending}
                  className="input login-input"
                  required
                />

                {/* 👇 FLOATING LABEL */}
    <label className={form.password ? "active" : ""}>
      Password
    </label>

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="toggle-password"
                >
                  <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
            </div>

            {/* OPTIONS */}
            <div className="login-options">
              <label className="remember">
                <input type="checkbox" /> Remember me
              </label>

              <span className="forgot">Forgot password?</span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={!isFormValid || isPending}
              className={`btn login-btn ${
                isFormValid ? "btn-primary" : "btn-disabled"
              }`}
            >
              {isPending ? (
                <>
                  <i className="fa fa-spinner fa-spin"></i> Signing In...
                </>
              ) : (
                <>
                  <i className="fa fa-sign-in-alt"></i> Sign In
                </>
              )}
            </button>

          </form>

          {/* FOOTER */}
          <div className="login-footer">
            © 2026 School ERP
          </div>

        </div>
      </div>
    </div>
  );
}