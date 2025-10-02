import React, { useEffect } from "react";
import "./Toast.css";
import {
  CheckCircleIcon,
  AlertTriangleIcon,
  XCircleIcon,
  InfoIcon,
} from "lucide-react";

export interface ToastProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  });

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="toast-icon success" />;
      case "error":
        return <XCircleIcon className="toast-icon error" />;
      case "warning":
        return <AlertTriangleIcon className="toast-icon warning" />;
      case "info":
        return <InfoIcon className="toast-icon info" />;
      default:
        return <InfoIcon className="toast-icon info" />;
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {getIcon()}
        <div className="toast-text">
          <h3 className="toast-title">{title}</h3>
          <p className="toast-message">{message}</p>
        </div>
        <button
          className="toast-close"
          onClick={() => onClose(id)}
          aria-label="Close toast"
        >
          x
        </button>
      </div>
    </div>
  );
};

export default Toast;
