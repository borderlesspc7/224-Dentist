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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
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
      await onLogin(username, password);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <Input
        label="Username"
        type="text"
        value={username}
        onChange={setUsername}
        placeholder="Enter your username"
        required
        error={errors.username}
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
