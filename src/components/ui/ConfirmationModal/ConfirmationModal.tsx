import React from "react";
import { AlertTriangleIcon, XIcon } from "lucide-react";
import "./ConfirmationModal.css";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  loading = false,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="confirmation-modal-overlay"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="confirmation-modal">
        <div className="confirmation-modal-header">
          <div className="confirmation-modal-icon">
            <AlertTriangleIcon className={`icon-${type}`} />
          </div>
          <h3 className="confirmation-modal-title">{title}</h3>
          <button
            className="confirmation-modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Fechar modal"
          >
            <XIcon />
          </button>
        </div>

        <div className="confirmation-modal-body">
          <p className="confirmation-modal-message">{message}</p>
        </div>

        <div className="confirmation-modal-footer">
          <button
            className="confirmation-modal-button cancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            className="confirmation-modal-button confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <div className="loading-spinner"></div> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
