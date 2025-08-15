"use client";

import type React from "react";
import { useState } from "react";
import Button from "../ui/Button/Button";
import Input from "../ui/Input/Input";
import "./LoginForm.css";

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <Input
        label="Email"
        type="text"
        value={email}
        onChange={setEmail}
        placeholder="Enter your email"
        required
        error={errors.email}
        disabled={loading}
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Enter your password"
        required
        error={errors.password}
        disabled={loading}
      />

      <Button
        type="submit"
        variant="primary"
        size="full"
        loading={loading}
        disabled={loading}
      >
        {loading ? "Signing In..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
