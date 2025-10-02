import { useContext } from "react";
import type { ToastContextValue } from "../context/ToastContextAux";
import { ToastContext } from "../context/ToastContextAux";

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
