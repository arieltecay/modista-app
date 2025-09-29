import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { courseSchema, defaultCourseValues } from '../validation/courseValidation';
import ImageSelector from './ImageSelector';

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
      // Convertir precio a número
      const formData = {
        ...data,
        price: parseFloat(data.price)
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
            <input
              {...field}
              type="text"
              id="title"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          )}
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

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
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.shortDescription ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Breve descripción del curso (máx. 200 caracteres)"
            />
          )}
        />
        {errors.shortDescription && (
          <p className="mt-1 text-sm text-red-600">{errors.shortDescription.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {watch('shortDescription')?.length || 0}/200 caracteres
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
              rows={6}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.longDescription ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Descripción completa del curso con detalles sobre contenido, duración, etc."
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.deeplink ? 'border-red-500' : 'border-gray-300'
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.videoUrl ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://youtube.com/watch?v=..."
            />
          )}
        />
        {errors.videoUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.videoUrl.message}</p>
        )}
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