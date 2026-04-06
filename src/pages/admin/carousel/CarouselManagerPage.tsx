import React, { useState, useEffect, Fragment } from 'react';
import { carouselService } from '../../../services/carouselService';
import { CarouselSlide, CarouselSlideFormData } from './types';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  Bars3Icon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import CloudinaryImageUploader from '../shared/components/CloudinaryImageUploader';
import { getCourses } from '../../../services/courses/coursesService';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

// Zod Schema for validation
const slideSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subtitle: z.string().optional(),
  imageUrl: z.string().url('URL de imagen no válida'),
  imagePublicId: z.string().min(1, 'La imagen es requerida'),
  link: z.string().min(1, 'El link es requerido'),
  buttonText: z.string().min(1, 'El texto del botón es requerido'),
  isActive: z.boolean(),
  publishAt: z.string().optional().nullable(),
  expireAt: z.string().optional().nullable(),
});

type SlideFormValues = z.infer<typeof slideSchema>;

interface LinkOption {
  id: string;
  name: string;
  url: string;
  type: 'curso' | 'taller' | 'otro';
}

// Sortable Item Component
const SortableSlide = ({ slide, onEdit, onDelete }: { 
  slide: CarouselSlide; 
  onEdit: (slide: CarouselSlide) => void;
  onDelete: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: slide._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`
        bg-white border border-gray-200 rounded-xl p-4 mb-3 flex items-center gap-4 group
        ${isDragging ? 'shadow-2xl ring-2 ring-indigo-500' : 'hover:shadow-md'}
        transition-all duration-200
      `}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600">
        <Bars3Icon className="w-5 h-5" />
      </div>

      <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-gray-900 truncate">{slide.title}</h3>
        <p className="text-xs text-gray-500 truncate">{slide.subtitle || 'Sin subtítulo'}</p>
        <div className="mt-1 flex items-center gap-2">
          {slide.isActive ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
              <EyeIcon className="w-3 h-3 mr-1" /> Activo
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800">
              <EyeSlashIcon className="w-3 h-3 mr-1" /> Inactivo
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(slide)}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(slide._id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const CarouselManagerPage: React.FC = () => {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [linkOptions, setLinkOptions] = useState<LinkOption[]>([]);
  const [query, setQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<SlideFormValues>({
    resolver: zodResolver(slideSchema),
    defaultValues: {
      buttonText: 'Ver más',
      isActive: true
    }
  });

  const watchValues = watch();

  useEffect(() => {
    loadSlides();
    loadLinkOptions();
  }, []);

  const loadLinkOptions = async () => {
    try {
      const courses = await getCourses();
      const options: LinkOption[] = courses.map(c => ({
        id: c.uuid || c.id || c._id,
        name: c.title,
        url: c.isPresencial ? `/admin/workshops/${c.uuid || c.id || c._id}` : `/cursos/${c.uuid || c.id || c._id}`,
        type: c.isPresencial ? 'taller' : 'curso'
      }));
      
      // Add static options
      options.unshift(
        { id: 'home', name: 'Inicio', url: '/', type: 'otro' },
        { id: 'cursos-all', name: 'Todos los Cursos', url: '/cursos', type: 'otro' },
        { id: 'sobre-mi', name: 'Sobre Mí', url: '/sobre-mi', type: 'otro' },
        { id: 'tarifario', name: 'Tarifario', url: '/tarifario', type: 'otro' }
      );

      setLinkOptions(options);
    } catch (error) {
      console.error('Error loading link options:', error);
    }
  };

  const filteredLinkOptions =
    query === ''
      ? linkOptions
      : linkOptions.filter((option) =>
          option.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  const selectedLinkOption = linkOptions.find(opt => opt.url === watchValues.link) || null;

  useEffect(() => {
    loadSlides();
  }, []);

  useEffect(() => {
    if (editingSlide) {
      reset({
        title: editingSlide.title,
        subtitle: editingSlide.subtitle,
        imageUrl: editingSlide.imageUrl,
        imagePublicId: editingSlide.imagePublicId,
        link: editingSlide.link,
        buttonText: editingSlide.buttonText,
        isActive: editingSlide.isActive,
        publishAt: editingSlide.publishAt ? new Date(editingSlide.publishAt).toISOString().split('T')[0] : '',
        expireAt: editingSlide.expireAt ? new Date(editingSlide.expireAt).toISOString().split('T')[0] : '',
      });
    } else {
      reset({
        title: '',
        subtitle: '',
        imageUrl: '',
        imagePublicId: '',
        link: '',
        buttonText: 'Ver más',
        isActive: true,
        publishAt: '',
        expireAt: '',
      });
    }
  }, [editingSlide, reset]);

  const loadSlides = async () => {
    try {
      setLoading(true);
      const data = await carouselService.getAllSlides();
      setSlides(data);
    } catch (error) {
      toast.error('Error al cargar los slides');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((i) => i._id === active.id);
      const newIndex = slides.findIndex((i) => i._id === over.id);
      const newArray = arrayMove(slides, oldIndex, newIndex);
      setSlides(newArray);
        
      const reorderData = newArray.map((slide, index) => ({
        slideId: slide._id,
        order: index
      }));
        
      try {
        await carouselService.reorderSlides(reorderData);
        toast.success('Orden actualizado');
      } catch (error) {
        toast.error('Error al guardar el orden');
        loadSlides(); // Revert on error
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este slide?')) {
      try {
        await carouselService.deleteSlide(id);
        setSlides(slides.filter(s => s._id !== id));
        toast.success('Slide eliminado');
      } catch (error) {
        toast.error('Error al eliminar el slide');
      }
    }
  };

  const onSubmit = async (data: SlideFormValues) => {
    try {
      const formattedData: CarouselSlideFormData = {
        ...data,
        publishAt: data.publishAt ? new Date(data.publishAt).toISOString() : undefined,
        expireAt: data.expireAt ? new Date(data.expireAt).toISOString() : undefined,
      };

      if (editingSlide) {
        const updated = await carouselService.updateSlide(editingSlide._id, formattedData);
        setSlides(slides.map(s => s._id === editingSlide._id ? updated : s));
        toast.success('Slide actualizado');
      } else {
        const created = await carouselService.createSlide(formattedData);
        setSlides([...slides, created]);
        toast.success('Slide creado');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar el slide');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestión de Carrusel</h1>
          <p className="text-slate-500 text-sm">Organiza y administra los anuncios de la página principal.</p>
        </div>
        <button 
          onClick={() => {
            setEditingSlide(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo Slide
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* List Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 px-1">Tus Slides</h2>
            {slides.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
                <ViewColumnsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No hay slides</h3>
                <p className="text-gray-500">Agrega tu primer anuncio.</p>
              </div>
            ) : (
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={slides.map(s => s._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-1">
                    {slides.map(slide => (
                      <SortableSlide 
                        key={slide._id} 
                        slide={slide} 
                        onEdit={(s) => {
                          setEditingSlide(s);
                          setIsModalOpen(true);
                        }}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          {/* Real-time Preview Section */}
          <div className="hidden lg:block space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-gray-900">Vista Previa</h2>
              <div className="flex bg-gray-200 p-1 rounded-lg">
                <button 
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                >
                  <ComputerDesktopIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                >
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className={`
              sticky top-8 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500
              ${previewMode === 'mobile' ? 'max-w-[320px] aspect-[9/16] mx-auto' : 'aspect-[16/9]'}
              flex items-center justify-center text-white border-4 border-slate-800
            `}>
               <div className="relative w-full h-full">
                  {watchValues.imageUrl ? (
                    <>
                      <img src={watchValues.imageUrl} className="w-full h-full object-cover opacity-50" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                        <motion.h2 
                          key={watchValues.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`font-black mb-2 tracking-tight ${previewMode === 'mobile' ? 'text-2xl' : 'text-4xl'}`}
                        >
                          {watchValues.title || 'Tu Título Aquí'}
                        </motion.h2>
                        <motion.p 
                           key={watchValues.subtitle}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.1 }}
                           className={`text-slate-200 mb-6 ${previewMode === 'mobile' ? 'text-sm' : 'text-lg'}`}
                        >
                          {watchValues.subtitle || 'Un subtítulo descriptivo para atraer clics.'}
                        </motion.p>
                        <motion.button
                           key={watchValues.buttonText}
                           initial={{ opacity: 0, scale: 0.8 }}
                           animate={{ opacity: 1, scale: 1 }}
                           className={`bg-indigo-600 text-white font-bold rounded-full shadow-lg shadow-indigo-600/30 ${previewMode === 'mobile' ? 'px-6 py-2 text-xs' : 'px-8 py-3'}`}
                        >
                          {watchValues.buttonText || 'Ver más'}
                        </motion.button>
                      </div>
                    </>
                  ) : slides[0] ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
                       <p>Usa los datos del formulario para previsualizar</p>
                    </div>
                  ) : (
                    <p className="text-slate-400">Agrega un slide para previsualizar</p>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingSlide ? 'Editar Slide' : 'Nuevo Slide'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <form id="slide-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Image Uploader */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Imagen del Slide</label>
                    <CloudinaryImageUploader 
                      selectedImage={watchValues.imageUrl}
                      onImageSelect={(url, publicId) => {
                        setValue('imageUrl', url);
                        setValue('imagePublicId', publicId);
                      }}
                    />
                    {errors.imagePublicId && <p className="text-xs text-red-500 font-bold ml-1 mt-1">{errors.imagePublicId.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Título Principal</label>
                      <input 
                        {...register('title')}
                        placeholder="Ej: Nuevos Cursos 2024"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all"
                      />
                      {errors.title && <p className="text-xs text-red-500 font-bold ml-1">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Subtítulo</label>
                      <input 
                        {...register('subtitle')}
                        placeholder="Ej: Aprende con Mica Guevara"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Texto del Botón</label>
                      <input 
                        {...register('buttonText')}
                        placeholder="Ej: Ver más"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all"
                      />
                      {errors.buttonText && <p className="text-xs text-red-500 font-bold ml-1">{errors.buttonText.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Link de Destino</label>
                      <Combobox value={selectedLinkOption} onChange={(val: LinkOption | null) => val && setValue('link', val.url)}>
                        <div className="relative mt-1">
                          <div className="relative w-full cursor-default overflow-hidden rounded-xl bg-gray-50 text-left border-2 border-transparent focus-within:border-indigo-500 transition-all">
                            <Combobox.Input
                              className="w-full border-none py-3 pl-4 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 bg-transparent outline-none"
                              displayValue={(option: LinkOption) => option?.name || ''}
                              onChange={(event) => setQuery(event.target.value)}
                              placeholder="Buscar curso, taller o página..."
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </Combobox.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setQuery('')}
                          >
                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {filteredLinkOptions.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                  Nada encontrado.
                                </div>
                              ) : (
                                filteredLinkOptions.map((option) => (
                                  <Combobox.Option
                                    key={option.id}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                      }`
                                    }
                                    value={option}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <div className="flex items-center justify-between">
                                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {option.name}
                                          </span>
                                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            {option.type}
                                          </span>
                                        </div>
                                        {selected ? (
                                          <span
                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                              active ? 'text-white' : 'text-indigo-600'
                                            }`}
                                          >
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))
                              )}
                            </Combobox.Options>
                          </Transition>
                        </div>
                      </Combobox>
                      {errors.link && <p className="text-xs text-red-500 font-bold ml-1">{errors.link.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Publicar el...</label>
                      <input 
                        {...register('publishAt')}
                        type="date"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Expira el...</label>
                      <input 
                        {...register('expireAt')}
                        type="date"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <input 
                      {...register('isActive')}
                      type="checkbox"
                      id="isActive"
                      className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="isActive" className="text-sm font-bold text-indigo-900 cursor-pointer">
                      El slide estará activo inmediatamente
                    </label>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  form="slide-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Guardar Slide'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarouselManagerPage;

function ViewColumnsIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  );
}
