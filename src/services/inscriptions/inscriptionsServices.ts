import axios from 'axios';
import { apiClient } from '../api';

export const exportInscriptions = async (paymentStatusFilter = 'all', search, courseFilter) => {
  const token = localStorage.getItem('token');

  // Usamos una instancia separada de Axios para manejar la respuesta como blob
  // sin que el interceptor global de JSON interfiera.
  const downloadClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
  });

  try {
    const response = await downloadClient.get('/inscriptions/export', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { paymentStatusFilter, search, courseFilter },
      responseType: 'blob', // ¡Muy importante para manejar archivos!
    });

    // Crear una URL para el blob y simular un clic para descargar
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Extraer el nombre del archivo de los headers si está disponible
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'inscripciones.xlsx'; // fallback
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    // Limpieza
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    // Si el servidor devuelve un error en JSON (p.ej. 401 Unauthorized), 
    // el blob puede contener ese error. Necesitamos leerlo.
    if (error.response && error.response.data.type === 'application/json') {
      const errorJson = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(JSON.parse(reader.result));
        reader.readAsText(error.response.data);
      });
      throw new Error(errorJson.message || 'Error al exportar.');
    }
    throw new Error('No se pudo descargar el archivo. Verifica tu conexión y permisos.');
  }
};
