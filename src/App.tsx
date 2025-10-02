import "./App.css";
import { AuthProvider } from "./context/authContext";
import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  );
}
