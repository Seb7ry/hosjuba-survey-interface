import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import SessionWarningModal from "./SessionWarning";
import { refreshSession } from "../../services/session.service";

interface DecodedToken {
  exp: number;
  jti?: string;
  username?: string;
  name?: string;
  position?: string;
  department?: string;
}

const SessionMonitor = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const checkIntervalRef = useRef<number | null>(null);
  const lastTokenIdRef = useRef<string | null>(null);

  const WARNING_THRESHOLD = 30 * 1000; // 30 segundos
  const CHECK_INTERVAL = 1000; // 1 segundo
  const SAFETY_MARGIN = 5000; // 5 segundos de margen de seguridad

  const getSessionData = () => {
    return {
      token: sessionStorage.getItem("access_token"),
      expiredAt: sessionStorage.getItem("expiredDateAt"),
      username: sessionStorage.getItem("username")
    };
  };

  const logout = () => {
    console.log("Ejecutando logout...");
    sessionStorage.clear();
    window.location.href = "/";
  };

  const getTokenInfo = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return {
        expirationTime: decoded.exp * 1000,
        tokenId: decoded.jti || String(decoded.exp),
        username: decoded.username,
        userData: {
          name: decoded.name,
          position: decoded.position,
          department: decoded.department
        }
      };
    } catch (error) {
      console.error("Error decodificando token:", error);
      return { expirationTime: null, tokenId: null, username: null, userData: null };
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

    const { expirationTime: jwtExpiration, tokenId, username } = getTokenInfo(token);
    const backendExpiration = expiredAt ? new Date(expiredAt).getTime() : null;
    
    // Usamos el que expire primero entre JWT y MongoDB
    const effectiveExpiration = backendExpiration && jwtExpiration
      ? Math.min(jwtExpiration, backendExpiration)
      : jwtExpiration || backendExpiration;

    if (tokenId !== lastTokenIdRef.current) {
      lastTokenIdRef.current = tokenId;
      if (tokenId) sessionStorage.removeItem(`warning_shown_${tokenId}`);
    }

    const now = Date.now();
    const remainingTime = effectiveExpiration ? effectiveExpiration - now - SAFETY_MARGIN : 0;

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
  const currentUsername = sessionStorage.getItem("username");
  if (currentUsername) {
    try {
      const result = await refreshSession(currentUsername);
      if (result) {
        // Obtenemos la información del token decodificado
        const tokenInfo = getTokenInfo(result.accessToken);
        
        // Actualizamos los datos del usuario en sessionStorage
        if (tokenInfo.userData) {
          const { name, position, department } = tokenInfo.userData;
          if (name) sessionStorage.setItem("name", name);
          if (position) sessionStorage.setItem("position", position);
          if (department) sessionStorage.setItem("department", department);
        }
        
        // El username viene directamente del token decodificado, no de userData
        if (tokenInfo.username) {
          sessionStorage.setItem("username", tokenInfo.username);
        }
        
        setShowWarning(false);
      }
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