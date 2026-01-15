import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebaseconfig";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import { ArrowLeftIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";
import "./ForgotPassword.css";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail("");
    } catch (err: any) {
      console.error("Password reset error:", err);

      // Handle specific Firebase errors
      if (err.code) {
        switch (err.code) {
          case "auth/user-not-found":
            setError("No account found with this email address");
            break;
          case "auth/invalid-email":
            setError("Invalid email address");
            break;
          case "auth/too-many-requests":
            setError("Too many requests. Please try again later");
            break;
          case "auth/network-request-failed":
            setError("Network error. Please check your connection");
            break;
          default:
            setError("Failed to send password reset email. Please try again");
        }
      } else {
        setError("An unexpected error occurred. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <div className="company-logo">
            LUNDER
            <br />
            UNDERGROUND SERVICES
            <br />
            CORP
          </div>
          <div className="company-subtitle">
            Engineering Excellence Underground
          </div>
        </div>

        {success ? (
          <div className="success-message">
            <div className="success-icon">
              <CheckCircleIcon />
            </div>
            <h2>Email Sent!</h2>
            <p>
              We've sent a password reset link to your email address. Please
              check your inbox and follow the instructions to reset your
              password.
            </p>
            <p className="success-note">
              If you don't see the email, please check your spam folder.
            </p>
            <Button
              type="button"
              variant="primary"
              size="full"
              onClick={handleBackToLogin}
              className="back-to-login-button"
            >
              <ArrowLeftIcon className="button-icon" />
              Back to Login
            </Button>
          </div>
        ) : (
          <>
            <div className="forgot-password-content">
              <h1>Forgot Password?</h1>
              <p className="forgot-password-description">
                Enter your email address below and we'll send you a link to
                reset your password.
              </p>

              {error && (
                <div className="error-message">
                  <AlertCircleIcon className="error-icon" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="forgot-password-form">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(value) => {
                    setEmail(value);
                    setError(null);
                  }}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="full"
                  loading={loading}
                  disabled={loading}
                  className="reset-button"
                >
                  {loading ? "" : "Send Reset Link"}
                </Button>
              </form>
            </div>

            <div className="forgot-password-footer">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="back-link"
                disabled={loading}
              >
                <ArrowLeftIcon className="back-icon" />
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

