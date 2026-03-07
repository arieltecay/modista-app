import React from 'react';
import { useWhatsapp } from '../../context/WhatsappContext';
import { XMarkIcon } from '@heroicons/react/24/solid';
import Spinner from '../Spinner';

interface WhatsappQRModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReady: () => void; // Callback para cuando WhatsApp esté listo
}

export const WhatsappQRModal: React.FC<WhatsappQRModalProps> = ({ isOpen, onClose, onReady }) => {
    const { status, qrCode, statusMessage, initWhatsapp } = useWhatsapp();

    React.useEffect(() => {
        if (status === 'ready') {
            onReady(); // Llama al callback cuando el servicio está listo
        }
    }, [status, onReady]);

    if (!isOpen) return null;

    const renderContent = () => {
        // 1. Estado final: Conexión exitosa con WhatsApp
        if (status === 'ready') {
            return (
                <div className="text-center">
                    <h3 className="text-lg font-medium text-green-600">¡Conectado!</h3>
                    <p className="mt-2 text-sm text-gray-500">{statusMessage}</p>
                    <button
                        onClick={onClose}
                        className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    >
                        Cerrar
                    </button>
                </div>
            );
        }

        // 2. Hay un QR para escanear
        if (qrCode) {
            return (
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">Escanear Código QR</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Abra WhatsApp en su teléfono y escanee el código para conectar.
                    </p>
                    <img src={qrCode} alt="Código QR de WhatsApp" className="mx-auto mt-4 h-64 w-64" />
                    <p className="mt-4 text-sm text-gray-600 animate-pulse">{statusMessage}</p>
                </div>
            );
        }

        // 3. El proceso está en marcha (después de hacer clic en el botón)
        if (status === 'initializing' || status === 'authenticating') {
            return (
                <div className="text-center">
                    <Spinner />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Inicializando...</h3>
                    <p className="mt-2 text-sm text-gray-500">{statusMessage}</p>
                </div>
            );
        }
        
        // 4. Estado inicial: listo para que el usuario inicie el proceso
        return (
            <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Conectar a WhatsApp</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Haga clic en el botón para generar un código QR y conectar su cuenta de WhatsApp.
                </p>
                 <p className="mt-2 text-sm text-gray-500">{statusMessage}</p>
                <button
                    onClick={initWhatsapp}
                    className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                    Iniciar Conexión
                </button>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
                <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
