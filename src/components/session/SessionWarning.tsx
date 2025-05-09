import React from 'react';
import Modal from 'react-modal';

interface SessionWarningModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  timeLeft: number | null;
  onLogout: () => void;
  onExtendSession: () => void;
}

const SessionWarningModal: React.FC<SessionWarningModalProps> = ({
  isOpen,
  onRequestClose,
  timeLeft,
  onLogout,
  onExtendSession
}) => {
  const formatTime = (ms: number) => {
    const seconds = Math.max(Math.floor(ms / 1000), 0);
    return `${seconds} segundos`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Advertencia de sesión"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        },
        content: {
          position: 'relative',
          inset: 'auto',
          width: '90%',
          maxWidth: '400px',
          padding: '0',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <div className="p-4 max-w-md mx-auto bg-white rounded-lg">
        <h2 className="text-xl font-semibold mb-2">⚠️ Sesión por expirar</h2>
        <p className="mb-4">
          Tu sesión expirará en {timeLeft ? formatTime(timeLeft) : 'poco tiempo'}.
          Realiza alguna acción para mantenerla activa.
        </p>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cerrar sesión
          </button>
          <button 
            onClick={onExtendSession}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Entendido
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SessionWarningModal;