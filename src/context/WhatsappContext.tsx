import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { logger } from '../utils/logger';
import { initWhatsApp as initWhatsAppService } from '../services/inscriptions';

type WhatsappStatus = 'disconnected' | 'initializing' | 'authenticating' | 'ready' | 'error' | 'connected';

interface WhatsappContextType {
    socket: Socket | null;
    status: WhatsappStatus;
    qrCode: string | null;
    statusMessage: string;
    initWhatsapp: () => void;
}

const WhatsappContext = createContext<WhatsappContextType | undefined>(undefined);

interface WhatsappProviderProps {
    children: ReactNode;
}

export const WhatsappProvider: React.FC<WhatsappProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [status, setStatus] = useState<WhatsappStatus>('disconnected');
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('Esperando para conectar...');

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            logger.error("VITE_API_URL no está definida en el archivo .env");
            setStatus('error');
            setStatusMessage('Error de configuración: URL de API no encontrada.');
            return;
        }

        const newSocket = io(apiUrl, {
            withCredentials: true,
        });

        setSocket(newSocket);
        setStatus('disconnected');
        
        newSocket.on('connect', () => {
            setStatus('connected');
            setStatusMessage('Conectado al servidor. Listo para iniciar WhatsApp.');
            logger.info(`Socket.IO conectado a ${apiUrl}`);
        });

        newSocket.on('disconnect', () => {
            setStatus('disconnected');
            setStatusMessage('Desconectado del servidor.');
            logger.warn('Socket.IO desconectado');
        });

        newSocket.on('qr_code', (qr: string) => {
            setQrCode(qr);
            setStatus('authenticating');
            setStatusMessage('Escanee el código QR con su WhatsApp.');
            logger.info('Código QR recibido');
        });

        newSocket.on('status_update', (data: { status: WhatsappStatus; message: string }) => {
            setStatus(data.status);
            setStatusMessage(data.message);
            if (data.status === 'ready') {
                setQrCode(null);
            }
            logger.info(`Actualización de estado de WhatsApp: ${data.status} - ${data.message}`);
        });

        // Limpieza al desmontar el componente
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const initWhatsapp = async () => {
        if (status === 'initializing' || status === 'ready') {
            logger.warn('No se puede inicializar WhatsApp, ya está en proceso o listo.');
            return;
        }
        
        try {
            setStatus('initializing');
            setStatusMessage('Solicitando inicialización de WhatsApp...');
            logger.info('Llamando al servicio para iniciar WhatsApp...');
            await initWhatsAppService(); // Llamada al endpoint POST /api/whatsapp/init
            logger.info('Solicitud de inicialización enviada correctamente.');
        } catch (error: any) {
            logger.error('Error al solicitar la inicialización de WhatsApp:', error);
            setStatus('error');
            setStatusMessage(error.response?.data?.message || 'Error al iniciar el proceso.');
        }
    };

    const contextValue: WhatsappContextType = {
        socket,
        status,
        qrCode,
        statusMessage,
        initWhatsapp,
    };

    return <WhatsappContext.Provider value={contextValue}>{children}</WhatsappContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useWhatsapp = (): WhatsappContextType => {
    const context = useContext(WhatsappContext);
    if (context === undefined) {
        throw new Error('useWhatsapp debe ser usado dentro de un WhatsappProvider');
    }
    return context;
};
