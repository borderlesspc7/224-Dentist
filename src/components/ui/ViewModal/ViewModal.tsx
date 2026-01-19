import React from "react";
import { XIcon } from "lucide-react";
import "./ViewModal.css";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
  loading?: boolean;
}

const ViewModal: React.FC<ViewModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  loading = false,
}) => {
  if (!isOpen) return null;

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value instanceof Date) {
      return value.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (typeof value === "object") {
      if (value.toDate && typeof value.toDate === "function") {
        return value.toDate().toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(", ") : "N/A";
      }
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const shouldHideField = (key: string): boolean => {
    const hiddenFields = ["id", "uid"];
    return hiddenFields.includes(key.toLowerCase());
  };

  const getFieldOrder = (key: string): number => {
    const order: Record<string, number> = {
      name: 1,
      displayName: 1,
      fullName: 1,
      email: 2,
      phone: 3,
      company: 4,
      status: 5,
      role: 6,
      createdAt: 999,
      updatedAt: 1000,
    };
    return order[key] || 100;
  };

  const sortedEntries = Object.entries(data).sort((a, b) => {
    const orderA = getFieldOrder(a[0]);
    const orderB = getFieldOrder(b[0]);
    if (orderA !== orderB) return orderA - orderB;
    return a[0].localeCompare(b[0]);
  });

  return (
    <div className="view-modal-overlay" onClick={onClose}>
      <div className="view-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="view-modal-header">
          <h2>{title}</h2>
          <button className="view-modal-close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="view-modal-body">
          {loading ? (
            <div className="view-modal-loading">
              <div className="loading-spinner"></div>
              <p>Loading details...</p>
            </div>
          ) : sortedEntries.length === 0 ? (
            <div className="view-modal-empty">
              <p>No data available</p>
            </div>
          ) : (
            <div className="view-modal-fields">
              {sortedEntries.map(([key, value]) => {
                if (shouldHideField(key)) return null;

                return (
                  <div key={key} className="view-modal-field">
                    <div className="view-modal-label">{formatKey(key)}</div>
                    <div className="view-modal-value">
                      {formatValue(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="view-modal-footer">
          <button className="view-modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
