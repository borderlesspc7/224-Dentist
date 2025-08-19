"use client";

import React from "react";
import "./Input.css";

interface InputProps {
  label?: string;
  type?: "text" | "password" | "email" | "date";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  className = "",
  min,
  max,
}) => {
  const inputClasses = ["input-field", error ? "error" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="input-group">
      <label className="input-label">
        {label}
        {required && <span style={{ color: "#dc2626" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
        required={required}
        min={min}
        max={max}
      />
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

export default Input;
