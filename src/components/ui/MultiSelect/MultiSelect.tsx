"use client";

import type React from "react";
import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import "./MultiSelect.css";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select options...",
  error,
  required = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const getDisplayText = () => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      const option = options.find((opt) => opt.value === value[0]);
      return option ? option.label : value[0];
    }
    return `${value.length} items selected`;
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div
        className={`multiselect ${error ? "error" : ""} ${
          disabled ? "disabled" : ""
        }`}
      >
        <div
          className="multiselect-trigger"
          onClick={!disabled ? handleToggle : undefined}
        >
          <span className="multiselect-value">{getDisplayText()}</span>
          <span className={`multiselect-arrow ${isOpen ? "open" : ""}`}>▼</span>
        </div>
        {isOpen && (
          <div className="multiselect-dropdown">
            {options.map((option) => (
              <div
                key={option.value}
                className={`multiselect-option ${
                  value.includes(option.value) ? "selected" : ""
                }`}
                onClick={() => handleOptionClick(option.value)}
              >
                <span className="option-checkbox">
                  {value.includes(option.value) ? (
                    <FiCheck className="check-icon" />
                  ) : (
                    ""
                  )}
                </span>
                <span className="option-label">{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default MultiSelect;
