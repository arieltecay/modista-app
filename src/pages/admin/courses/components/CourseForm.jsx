import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { courseSchema, defaultCourseValues } from '../validation/courseValidation';
import ImageSelector from '../../shared/components/ImageSelector';


/**
 * Componente de formulario reutilizable para crear/editar cursos
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.initialData - Datos iniciales para edición
 * @param {Function} props.onSubmit - Función a ejecutar al enviar el formulario
 * @param {boolean} props.isEditing - Indica si es modo edición
 * @param {boolean} props.isSubmitting - Indica si el formulario está enviándose
 */
const CourseForm = ({ initialData = {}, onSubmit, isEditing = false, isSubmitting = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(courseSchema),
    defaultValues: { ...defaultCourseValues, ...initialData },
    mode: 'onChange' // Validación en tiempo real
  });

  const handleImageSelect = (imageUrl) => {
    setValue('imageUrl', imageUrl, { shouldValidate: true });
  };

  const handleFormSubmit = async (data) => {
    try {
      // Convertir precio a número y filtrar campos opcionales vacíos
      const formData = {
        ...data,
        price: parseFloat(data.price),
        // Convertir campos opcionales vacíos a undefined para que se eliminen en la BD
        deeplink: data.deeplink === '' ? undefined : data.deeplink,
        videoUrl: data.videoUrl === '' ? undefined : data.videoUrl,
        coursePaid: data.coursePaid === '' ? undefined : data.coursePaid,
      };

      await onSubmit(formData);

      // Resetear formulario si es creación
      if (!isEditing) {
        reset(defaultCourseValues);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Campo de selección de imagen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagen del Curso *
        </label>
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <ImageSelector
              selectedImage={field.value}
              onImageSelect={handleImageSelect}
            />
          )}
        />
        {errors.imageUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
        )}
      </div>

      {/* Campo de título */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título del Curso *
        </label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={2}
              id="title"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ingresa el título del curso"
            />
          )}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Campo de categoría */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Categoría *
        </label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="category"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ej: Costura, Diseño, Patronaje"
            />
          )}
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      {/* Campo de precio */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
          Precio (ARS) *
        </label>
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              id="price"
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="0.00"
            />
          )}
        />
        <p className="mt-1 text-sm text-gray-400">0 (Cero) es un curso gratis</p>
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      {/* Configuración de curso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Tipo de Curso
          </label>
          <Controller
            name="isPresencial"
            control={control}
            render={({ field }) => (
              <div
                onClick={() => setValue('isPresencial', !field.value)}
                className={`
                  relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${field.value
                    ? 'bg-emerald-50 border-emerald-500'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mr-4
                  ${field.value ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}
                `}>
                  {field.value ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`font-bold ${field.value ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {field.value ? 'Taller Presencial' : 'Curso Online'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {field.value ? 'Activa la sección de Agenda' : 'Acceso mediante links de descarga/video'}
                  </p>
                </div>
                {field.value && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-emerald-500 text-white rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-bold text-gray-700 mb-3">
            Estado de Visibilidad
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="status"
                className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold ${field.value === 'active' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-100 border-gray-200 text-gray-500'
                  }`}
              >
                <option value="active">Público (Activo)</option>
                <option value="inactive">Oculto (Inactivo)</option>
              </select>
            )}
          />
          <p className="mt-2 text-xs text-gray-400 italic">
            * Los cursos inactivos no se muestran en la web pública pero son visibles para el admin.
          </p>
        </div>
      </div>

      {watch('isPresencial') && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <span className="font-bold">Nota:</span> Los horarios, fechas y cupos específicos se gestionan desde el <span className="font-bold italic">Panel de Talleres</span> (sección Agenda) una vez que el curso esté creado.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Campo de descripción corta */}
      <div>
        <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
          Descripción Corta *
        </label>
        <Controller
          name="shortDescription"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              id="shortDescription"
              rows={5}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.shortDescription ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Breve descripción del curso (máx. 200 caracteres)"
            />
          )}
        />
        {errors.shortDescription && (
          <p className="mt-1 text-sm text-red-600">{errors.shortDescription.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {watch('shortDescription')?.length || 0}/250 caracteres
        </p>
      </div>

      {/* Campo de descripción larga */}
      <div>
        <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 mb-2">
          Descripción Detallada *
        </label>
        <Controller
          name="longDescription"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              id="longDescription"
              rows={10}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.longDescription ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Descripción completa del curso con detalles sobre contenido, duración, etc."
              style={{ minHeight: '350px' }}
            />
          )}
        />
        {errors.longDescription && (
          <p className="mt-1 text-sm text-red-600">{errors.longDescription.message}</p>
        )}
      </div>

      {/* Campo de deeplink (opcional) */}
      <div>
        <label htmlFor="deeplink" className="block text-sm font-medium text-gray-700 mb-2">
          Enlace de WhatsApp (opcional)
        </label>
        <Controller
          name="deeplink"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="url"
              id="deeplink"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.deeplink ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="https://wa.me/5491234567890"
            />
          )}
        />
        {errors.deeplink && (
          <p className="mt-1 text-sm text-red-600">{errors.deeplink.message}</p>
        )}
      </div>

      {/* Campo de video URL (opcional) */}
      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
          URL del Video (opcional)
        </label>
        <Controller
          name="videoUrl"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="url"
              id="videoUrl"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.videoUrl ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="https://youtube.com/watch?v=..."
            />
          )}
        />
        {errors.videoUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.videoUrl.message}</p>
        )}
      </div>

      {/* Campo de link del curso pagado (opcional) */}
      <div>
        <label htmlFor="coursePaid" className="block text-sm font-medium text-gray-700 mb-2">
          Link del Curso Pagado (opcional)
        </label>
        <Controller
          name="coursePaid"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="url"
              id="coursePaid"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.coursePaid ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="https://drive.google.com/... o https://..."
            />
          )}
        />
        {errors.coursePaid && (
          <p className="mt-1 text-sm text-red-600">{errors.coursePaid.message}</p>
        )}
        <p className="mt-1 text-sm text-gray-400">Este link se enviará por email cuando el cliente pague el curso</p>
      </div>

      {/* Botones del formulario */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => reset({ ...defaultCourseValues, ...initialData })}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          disabled={isSubmitting}
        >
          Limpiar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isEditing ? 'Actualizando...' : 'Creando...'}
            </div>
          ) : (
            isEditing ? 'Actualizar Curso' : 'Crear Curso'
          )}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;