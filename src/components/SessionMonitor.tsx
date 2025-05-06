import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  jti?: string;
}

const SessionMonitor = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const warningShownRef = useRef(false);
  const lastTokenRef = useRef<string | null>(null);

  const WARNING_TIME = 5 * 60 * 1000; // 5 minutos
  const VIBRATION_TIME = 1 * 60 * 1000; // 1 minuto

  const getAccessToken = () => {
    return sessionStorage.getItem("access_token") ?? null;
  };

  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const getExpiration = (token: string): number | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp * 1000;
    } catch (error) {
      console.error("❌ Error al decodificar el token:", error);
      return null;
    }
  };

  const getTokenId = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.jti || decoded.exp;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const checkSession = () => {
      const token = getAccessToken();
      if (!token) {
        logout();
        return;
      }

      if (token !== lastTokenRef.current) {
        lastTokenRef.current = token;
      }

      const expiresAt = getExpiration(token);
      if (!expiresAt) {
        logout();
        return;
      }

      const now = Date.now();
      const timeRemaining = expiresAt - now;

      setTimeLeft(timeRemaining);

      if (timeRemaining <= 0) {
        logout();
        return;
      }

      const tokenId = getTokenId(token);
      const alreadyWarnedKey = `warned_${tokenId}`;

      if (
        timeRemaining <= WARNING_TIME &&
        !warningShownRef.current &&
        !sessionStorage.getItem(alreadyWarnedKey)
      ) {
        setShowWarning(true);
        warningShownRef.current = true;
        sessionStorage.setItem(alreadyWarnedKey, "true");
      }

      if (timeRemaining > WARNING_TIME && warningShownRef.current) {
        setShowWarning(false);
        warningShownRef.current = false;
      }
    };

    checkSession();
    const intervalId = setInterval(checkSession, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatTimeLeft = (ms: number) => {
    const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <>
      {showWarning && timeLeft !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            className={`bg-white rounded-2xl shadow-xl p-6 max-w-md w-full border-4 ${
              timeLeft <= VIBRATION_TIME
                ? "border-yellow-400 animate-pulse"
                : "border-blue-500"
            }`}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              ⏳ Tu sesión está por expirar
            </h3>
            <p className="text-gray-700 mb-4">
              Tu sesión expirará en{" "}
              <strong className="text-blue-600">{formatTimeLeft(timeLeft)}</strong>.
              Realiza alguna acción para mantener la sesión activa.
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
              onClick={() => setShowWarning(false)}
            >
              Entiendo
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionMonitor;
