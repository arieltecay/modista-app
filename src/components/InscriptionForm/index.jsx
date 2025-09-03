import React, { useState } from 'react';
import { createInscription } from '../../services/api';
import Spinner from '../Spinner';

const InscriptionForm = ({ course }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    celular: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  const validateEmail = (email) => {
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio.';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El formato del email no es válido.';
    }
    if (!formData.celular.trim()) newErrors.celular = 'El celular es obligatorio.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const inscriptionData = {
        ...formData,
        courseId: course?.id || '1',
        courseTitle: course?.title || 'Curso por defecto',
        coursePrice: course?.price || 0
      };
      await createInscription(inscriptionData);
      setFormMessage({ type: 'success', text: '¡Gracias por inscribirte! Nos pondremos en contacto contigo pronto.' });
      setFormData({ nombre: '', apellido: '', email: '', celular: '' });
    } catch (error) {
      const errorMessage = error.message || 'Ocurrió un error al enviar tu inscripción. Por favor, intenta de nuevo.';
      setFormMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const isFree = parseFloat(course?.price || 0) === 0;

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {isFree ? '¡Curso Gratuito!' : '¡Inscríbete ahora!'}
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Completa tus datos para inscribirte al curso "{course?.title || 'Curso'}"
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.nombre ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Tu nombre"
                  />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                </div>

                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    required
                    value={formData.apellido}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.apellido ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Tu apellido"
                  />
                  {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="tu@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="celular" className="block text-sm font-medium text-gray-700 mb-1">
                  Número de celular
                </label>
                <input
                  id="celular"
                  name="celular"
                  type="tel"
                  required
                  value={formData.celular}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.celular ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Tu número de celular"
                />
                {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular}</p>}
              </div>

              <div className="flex flex-col items-center space-y-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
                >
                  {loading ? <Spinner /> : 'Enviar Inscripción'}
                </button>

                <a
                  href="https://wa.me/3813508796"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition duration-300 shadow-lg"
                >
                  📱 Contactar por WhatsApp
                </a>
              </div>

              {formMessage && (
                <div className={`text-center p-3 rounded-md mt-4 ${formMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {formMessage.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InscriptionForm;