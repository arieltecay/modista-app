import type { FC } from 'react';
import React, { useState, useCallback, useMemo } from 'react';
import { apiClient } from '../../../../services/config/apiClient';
import { 
  HiCloudUpload, 
  HiCheckCircle, 
  HiOutlinePhotograph, 
  HiTrash, 
  HiSparkles, 
  HiRefresh, 
  HiChevronDown,
  HiChevronUp,
  HiArrowsExpand
} from 'react-icons/hi';
import toast from 'react-hot-toast';

interface CloudinaryImageUploaderProps {
  selectedImage: string;
  onImageSelect: (imageUrl: string, publicId: string) => void;
}

/**
 * Componente profesional simplificado para la gestión de imágenes con IA.
 * Optimiza automáticamente las imágenes y permite ajustes de formato (Uncrop) 
 * y eliminación de fondo de forma sencilla para usuarios no técnicos.
 * 
 * @param props.selectedImage - URL de la imagen actual.
 * @param props.onImageSelect - Callback al confirmar una nueva imagen o ajuste.
 */
const CloudinaryImageUploader: FC<CloudinaryImageUploaderProps> = ({ selectedImage, onImageSelect }) => {
  // Estados de carga y archivos
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [removeBackgroundOnUpload, setRemoveBackgroundOnUpload] = useState(false);
  const [currentPublicId, setCurrentPublicId] = useState<string | null>(null);
  const [showTools, setShowTools] = useState(false);

  // Estados de Ajustes IA Simplificados
  const [aspectRatio, setAspectRatio] = useState<'original' | '1:1' | '16:9' | '4:5' | '9:16'>('original');
  const [isSmartCropping, setIsSmartCropping] = useState(false);

  /**
   * Genera la URL optimizada y transformada.
   * Aplica f_auto,q_auto siempre de forma transparente.
   */
  const transformedUrl = useMemo(() => {
    if (!selectedImage || !selectedImage.includes('cloudinary.com')) return selectedImage;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ddfee9hht';
    const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
    
    const urlParts = selectedImage.split('/upload/');
    if (urlParts.length < 2) return selectedImage;
    
    const pathAfterUpload = urlParts[1];
    const pathParts = pathAfterUpload.split('/');
    if (pathParts[0].startsWith('v') && !isNaN(Number(pathParts[0].substring(1)))) {
      pathParts.shift();
    }
    const fileName = pathParts.join('/');

    const transformations: string[] = [];

    // OPTIMIZACIÓN AUTOMÁTICA (Siempre activa)
    transformations.push('f_auto,q_auto');

    // AJUSTE DE FORMATO (IA Generativa para completar bordes)
    if (aspectRatio !== 'original') {
      const arMap = { '1:1': '1.0', '16:9': '1.77', '4:5': '0.8', '9:16': '0.56' };
      transformations.push(`ar_${arMap[aspectRatio]},c_pad,b_gen_fill`);
    }

    // ENFOQUE AUTOMÁTICO
    if (isSmartCropping && aspectRatio === 'original') {
      transformations.push('c_fill,g_auto');
    }

    const transformString = transformations.join('/');
    return `${baseUrl}/${transformString}/${fileName}`;
  }, [selectedImage, aspectRatio, isSmartCropping]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleUpload(file);
  }, [removeBackgroundOnUpload, onImageSelect]);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('removeBackground', String(removeBackgroundOnUpload));
    formData.append('image', file);

    try {
      const response = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { imageUrl, publicId } = response;
      setCurrentPublicId(publicId);
      onImageSelect(imageUrl, publicId);
      setAspectRatio('original');
      toast.success('Imagen lista y optimizada');
    } catch (error) {
      toast.error('Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentPublicId) {
      onImageSelect('', '');
      return;
    }
    setIsDeleting(true);
    try {
      await apiClient.delete(`/upload?publicId=${currentPublicId}`);
      onImageSelect('', '');
      setCurrentPublicId(null);
      toast.success('Imagen eliminada');
    } catch (error) {
      toast.error('Error al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  const applyChanges = () => {
    onImageSelect(transformedUrl, currentPublicId || '');
    toast.success('Cambios aplicados correctamente');
  };

  const resetChanges = () => {
    setAspectRatio('original');
    setIsSmartCropping(false);
  };

  return (
    <div className="space-y-6 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
            <HiSparkles size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Cargador Inteligente</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Optimización Automática Activa</p>
          </div>
        </div>
        
        <label className="flex items-center space-x-3 cursor-pointer group bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-all">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">Quitar fondo al subir</span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={removeBackgroundOnUpload}
              onChange={(e) => setRemoveBackgroundOnUpload(e.target.checked)}
            />
            <div className={`w-10 h-5 rounded-full transition-colors ${removeBackgroundOnUpload ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${removeBackgroundOnUpload ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </div>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Subida */}
          <div className="relative">
            <input
              type="file"
              id="image-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading || isDeleting}
            />
            <label
              htmlFor="image-upload"
              className={`
                flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-[2rem] 
                transition-all duration-300 cursor-pointer
                ${(isUploading || isDeleting) ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-indigo-50/30 hover:border-indigo-300 border-gray-200'}
              `}
            >
              {isUploading ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-bold text-indigo-600">Procesando...</p>
                </div>
              ) : (
                <div className="text-center p-6">
                  <HiCloudUpload size={40} className="mx-auto text-indigo-400 mb-2" />
                  <p className="text-sm font-bold text-gray-800">Cargar Foto Nueva</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG o WebP</p>
                </div>
              )}
            </label>
          </div>

          {/* Herramientas Simplificadas */}
          {selectedImage && (
            <div className="bg-gray-50/50 rounded-3xl border border-gray-100 overflow-hidden">
              <button 
                onClick={() => setShowTools(!showTools)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-2 text-indigo-600">
                  <HiArrowsExpand size={20} />
                  <span className="text-sm font-bold uppercase tracking-wide">Adaptar Tamaño (Opcional)</span>
                </div>
                {showTools ? <HiChevronUp size={20} /> : <HiChevronDown size={20} />}
              </button>

              {showTools && (
                <div className="p-5 pt-0 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">Adaptar para...</label>
                      <select 
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value as any)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none cursor-pointer"
                      >
                        <option value="original">Original</option>
                        <option value="1:1">Cuadrado (Post)</option>
                        <option value="16:9">Banner (Web)</option>
                        <option value="4:5">Vertical (Instagram)</option>
                        <option value="9:16">Story (Pantalla completa)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end">
                      <button 
                        onClick={() => setIsSmartCropping(!isSmartCropping)}
                        className={`w-full py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${isSmartCropping ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-200 text-gray-500 hover:border-indigo-300'}`}
                      >
                        Centrar automáticamente
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button 
                      onClick={applyChanges}
                      className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <HiCheckCircle size={18} />
                      <span>Confirmar Ajuste</span>
                    </button>
                    <button 
                      onClick={resetChanges}
                      className="px-4 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <HiRefresh size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Previsualización */}
        <div className="flex flex-col">
          <div className="relative group rounded-[2.5rem] overflow-hidden border border-gray-100 bg-gray-50 aspect-video flex items-center justify-center shadow-inner">
            {selectedImage ? (
              <>
                <img
                  src={transformedUrl}
                  alt="Vista previa"
                  className="max-w-full max-h-full object-contain transition-all duration-500"
                  key={transformedUrl}
                />
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-red-600 p-2.5 rounded-2xl hover:bg-red-50 transition-all shadow-xl"
                >
                  {isDeleting ? <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div> : <HiTrash size={20} />}
                </button>
              </>
            ) : (
              <div className="text-center text-gray-300">
                <HiOutlinePhotograph size={64} className="mx-auto opacity-20 mb-2" />
                <p className="text-sm font-medium">Sube una imagen</p>
              </div>
            )}
          </div>
          
          {selectedImage && (
            <div className="mt-4 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Estado: Imagen Optimizada ✅</span>
              <span className="text-[9px] font-mono text-indigo-300 truncate max-w-[150px]">{currentPublicId || 'Sync'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudinaryImageUploader;
