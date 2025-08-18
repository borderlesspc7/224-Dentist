"use client";

import "./SelectInput.css";
import React from "react";
import { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  error,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (!value) return placeholder;
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div className={`select-input ${error ? "error" : ""}`}>
        <div className="select-trigger" onClick={handleToggle}>
          <span className="select-value">{getDisplayText()}</span>
          <span className={`select-arrow ${isOpen ? "open" : ""}`}>▼</span>
        </div>
        {isOpen && (
          <div className="select-dropdown">
            {options.map((option) => (
              <div
                key={option.value}
                className={`select-option ${
                  value === option.value ? "selected" : ""
                }`}
                onClick={() => handleOptionClick(option.value)}
              >
                <span className="option-label">{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SelectInput;
