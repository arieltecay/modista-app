import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components';
import { registerUser } from '../../services/auth';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (userData: any) => { // TODO: Define a proper type for userData
    setLoading(true);
    setError(null);

    try {
      await registerUser(userData);
      toast.success('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error: any) {
      setError(error.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm
        mode="register"
        onSubmit={handleRegister}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default RegisterPage;