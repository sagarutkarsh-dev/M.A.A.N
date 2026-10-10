import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useInspectorAuth() {
  const router = useRouter();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [authMethod, setAuthMethod] = useState<"PIN" | "BIOMETRIC" | "OTP">("PIN");
  const [badgeId, setBadgeId] = useState("LMO-KL-408");
  const [pin, setPin] = useState("772910");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successStep, setSuccessStep] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("maan-theme");
      if (stored === "light") {
        setIsDarkMode(false);
      } else if (stored === "dark") {
        setIsDarkMode(true);
      }
    } catch {
      // Local storage fallback
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    try {
      localStorage.setItem("maan-theme", next ? "dark" : "light");
    } catch {
      // Local storage fallback
    }
  };

  const handleVerifyCredential = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!badgeId.trim()) {
      setErrorMessage("Please enter your Officer Service ID / Badge Number.");
      return;
    }

    if (authMethod === "PIN" && !pin.trim()) {
      setErrorMessage("Please enter your secure access PIN or passphrase.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessStep(true);

      setTimeout(() => {
        router.push("/inspector");
      }, 700);
    }, 1100);
  };

  const handleBiometricAuth = () => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessStep(true);
      setTimeout(() => {
        router.push("/inspector");
      }, 700);
    }, 900);
  };

  return {
    isDarkMode,
    toggleTheme,
    authMethod,
    setAuthMethod,
    badgeId,
    setBadgeId,
    pin,
    setPin,
    showPassword,
    setShowPassword,
    isLoading,
    errorMessage,
    successStep,
    handleVerifyCredential,
    handleBiometricAuth,
  };
}

export default useInspectorAuth;
