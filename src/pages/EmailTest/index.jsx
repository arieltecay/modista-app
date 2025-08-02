import React, { useState } from 'react';

const EmailTestPage = ({ courseData }) => { // Recibe courseData como prop
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
      // Asegurarse de que courseData esté disponible
      if (!courseData || !courseData.title) {
        alert('Error: Datos del curso no disponibles para enviar el correo.');
        return;
      }

      console.log('Enviando correo de confirmación con datos:', formData, 'y curso:', courseData);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/email/send-test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.email,
          subject: `Confirmación de Compra del Curso: ${courseData.title}`,
          templateName: 'teamplate',
          data: {
            name: formData.name,
            courseTitle: courseData.title,
            description: courseData.shortDescription,
            price: courseData.price,
            deeplink:courseData.deeplink,
          },
        }),
      });

      if (response.ok) {
        alert('Correo de confirmación enviado/simulado exitosamente. Revisa la carpeta api/sent_emails.');
        setFormData({ name: '', email: '' }); // Limpiar formulario
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
      {courseData && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md w-full max-w-md text-left mb-4">
          <h3 className="font-bold text-lg mb-2">Datos del Curso Recibidos:</h3>
          <p><strong>Título:</strong> {courseData.title}</p>
          <p><strong>Descripción Corta:</strong> {courseData.shortDescription}</p>
          <p><strong>Precio:</strong> ${courseData.price}</p>
        </div>
      )}
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
        <button
          type="submit"
          className="px-8 py-4 bg-[var(--color-green-600)] text-white font-semibold rounded-lg shadow-md hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-green-600)] focus:ring-opacity-75 transition duration-300 ease-in-out w-full"
        >
          Enviar Correo de Confirmación
        </button>
      </form>
    </div>
  );
};

export default EmailTestPage;
