import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import SessionWarningModal from "./SessionWarning";
import { refreshSession } from "../../services/session.service"; 

interface DecodedToken {
  exp: number;
  jti?: string;
}

const SessionMonitor = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const checkIntervalRef = useRef<number | null>(null);
  const lastTokenIdRef = useRef<string | null>(null);

  const WARNING_THRESHOLD = 30 * 1000; // 30 segundos
  const CHECK_INTERVAL = 1000; // 1 segundo

  const getSessionData = () => {
    return {
      token: sessionStorage.getItem("access_token"),
      expiredAt: sessionStorage.getItem("expiredDateAt"),
      username: sessionStorage.getItem("username")
    };
  };

  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  const getTokenInfo = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return {
        expirationTime: decoded.exp * 1000,
        tokenId: decoded.jti || String(decoded.exp)
      };
    } catch (error) {
      console.error("Error decodificando token:", error);
      return { expirationTime: null, tokenId: null };
    }
  };

  const shouldShowWarning = (tokenId: string | null): boolean => {
    if (!tokenId) return true;
    return sessionStorage.getItem(`warning_shown_${tokenId}`) !== "true";
  };

  const markWarningAsShown = (tokenId: string | null) => {
    if (tokenId) {
      sessionStorage.setItem(`warning_shown_${tokenId}`, "true");
    }
  };

  const checkSession = () => {
    const { token, expiredAt } = getSessionData();
    
    if (!token) {
      logout();
      return;
    }

    const { expirationTime: jwtExpiration, tokenId } = getTokenInfo(token);
    const backendExpiration = expiredAt ? new Date(expiredAt).getTime() : null;
    const effectiveExpiration = backendExpiration 
      ? Math.max(jwtExpiration || 0, backendExpiration)
      : jwtExpiration;

    if (tokenId !== lastTokenIdRef.current) {
      lastTokenIdRef.current = tokenId;
      if (tokenId) sessionStorage.removeItem(`warning_shown_${tokenId}`);
    }

    const now = Date.now();
    const remainingTime = effectiveExpiration ? effectiveExpiration - now : 0;

    setTimeLeft(remainingTime);

    if (remainingTime <= 0) {
      logout();
      return;
    }

    if (remainingTime <= WARNING_THRESHOLD && !showWarning && shouldShowWarning(tokenId)) {
      setShowWarning(true);
      markWarningAsShown(tokenId);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.max(Math.floor(ms / 1000), 0);
    return `${seconds} segundos`;
  };

  const handleExtendSession = async () => {
    const username = sessionStorage.getItem("username");
    if (username) {
      try {
        await refreshSession(username);
        checkSession(); 
        setShowWarning(false);
      } catch (error) {
        console.error("Error al extender sesión:", error);
      }
    }
  };

  useEffect(() => {
    checkSession();
    checkIntervalRef.current = window.setInterval(checkSession, CHECK_INTERVAL);

    return () => {
      if (checkIntervalRef.current) {
        window.clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  return (
    <SessionWarningModal
      isOpen={showWarning}
      onRequestClose={() => setShowWarning(false)}
      timeLeft={timeLeft}
      onLogout={logout}
      onExtendSession={handleExtendSession}
    />
  );
};

export default SessionMonitor;