import React, { useState } from 'react';

const EmailTestPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    courseTitle: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    try {
      console.log('Enviando correo de prueba con datos:', formData);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/email/send-test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.email,
          subject: 'Confirmación de Compra de Curso',
          templateName: 'teamplate',
          data: {
            name: formData.name,
            courseTitle: formData.courseTitle,
            phone: '+1234567890', // Puedes hacer esto dinámico si lo necesitas
          },
        }),
      });

      if (response.ok) {
        alert('Correo de prueba enviado/simulado exitosamente. Revisa la carpeta api/sent_emails.');
        setFormData({ name: '', email: '', courseTitle: '' }); // Limpiar formulario
      } else {
        const errorData = await response.json();
        alert(`Error al enviar el correo: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      alert('Error de conexión al enviar el correo.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="courseTitle" className="block text-gray-700 text-sm font-bold mb-2">Título del Curso:</label>
          <input
            type="text"
            id="courseTitle"
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300 ease-in-out w-full"
        >
          Enviar Correo de Prueba
        </button>
      </form>
    </div>
  );
};

export default EmailTestPage;
