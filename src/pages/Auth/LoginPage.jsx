import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/AuthForm';
import { loginUser } from '../../services/auth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser(credentials);

      // Guardar token en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      toast.success('¡Inicio de sesión exitoso!');

      // Redirigir según el rol
      if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/'); // O a donde corresponda para usuarios normales
      }
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm
        mode="login"
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default LoginPage;