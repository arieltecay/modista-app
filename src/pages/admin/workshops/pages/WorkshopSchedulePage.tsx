import type { FC } from 'react';
import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTurnosByCourse, createTurno, updateTurno, deleteTurno } from '../../../../services/turnos/turnoService';
import { getCoursesAdmin } from '../../../../services/courses/coursesService';
import toast from 'react-hot-toast';
import Spinner from '../../../../components/Spinner';

interface Course {
  _id: string;
  uuid?: string;
  id?: string;
  title: string;
  courseId?: string;
}

interface Turno {
  _id: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  cupoMaximo: number;
  cuposInscriptos: number;
  courseId: string;
  isBlocked: boolean;
}

interface NewTurno {
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  cupoMaximo: number;
  courseId: string;
}

const WorkshopSchedulePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTurno, setNewTurno] = useState<NewTurno>({
    diaSemana: 'Lunes',
    horaInicio: '09:00',
    horaFin: '11:00',
    cupoMaximo: 4,
    courseId: id || ''
  });

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const coursesResponse: { data: Course[] } = await getCoursesAdmin(1, 100);
        const foundCourse = coursesResponse.data.find(c => c._id === id || c.uuid === id);
        setCourse(foundCourse || null);

        const response: Turno[] | { data: Turno[] } = await getTurnosByCourse(id || '', true);
        const turnosData = Array.isArray(response) ? response : (response?.data || []);
        setTurnos(turnosData);

        if (foundCourse) {
          setNewTurno(prev => ({ ...prev, courseId: foundCourse.courseId || foundCourse._id }));
        }
      } catch (error: any) {
        toast.error('Error al cargar la agenda');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddTurno = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response: { data: Turno } = await createTurno(newTurno);
      setTurnos([...turnos, response.data]);
      setIsAdding(false);
      toast.success('Horario agregado con éxito');
    } catch (error: any) {
      toast.error('Error al agregar horario');
    }
  };

  const handleToggleBlock = async (turno: Turno) => {
    try {
      const updated: { data: Turno } = await updateTurno(turno._id, { isBlocked: !turno.isBlocked });
      setTurnos(turnos.map(t => t._id === turno._id ? updated.data : t));
      toast.success(updated.data.isBlocked ? 'Horario bloqueado' : 'Horario habilitado');
    } catch (error: any) {
      toast.error('Error al actualizar estado');
    }
  };

  const handleDelete = async (turnoId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este horario?')) return;
    try {
      await deleteTurno(turnoId);
      setTurnos(turnos.filter(t => t._id !== turnoId));
      toast.success('Horario eliminado');
    } catch (error: any) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <button
            onClick={() => navigate(`/admin/workshops/${id}`)}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver al Taller
          </button>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Agenda: {course?.title}</h1>
              <p className="text-gray-500 text-lg">Administra los horarios y cupos disponibles.</p>
            </div>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md ${isAdding ? 'bg-gray-200 text-gray-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            >
              {isAdding ? 'Cancelar' : '+ Agregar Turno'}
            </button>
          </div>
        </header>

        {isAdding && (
          <form onSubmit={handleAddTurno} className="bg-white p-8 rounded-2xl shadow-lg border-2 border-emerald-100 mb-8 animate-in slide-in-from-top duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Nuevo Horario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Día</label>
                <select
                  className="w-full p-3 bg-gray-50 border rounded-lg"
                  value={newTurno.diaSemana}
                  onChange={e => setNewTurno({ ...newTurno, diaSemana: e.target.value })}
                >
                  {dias.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Desde</label>
                <input
                  type="time"
                  className="w-full p-3 bg-gray-50 border rounded-lg"
                  value={newTurno.horaInicio}
                  onChange={e => setNewTurno({ ...newTurno, horaInicio: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Hasta</label>
                <input
                  type="time"
                  className="w-full p-3 bg-gray-50 border rounded-lg"
                  value={newTurno.horaFin}
                  onChange={e => setNewTurno({ ...newTurno, horaFin: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Cupos</label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-3 bg-gray-50 border rounded-lg"
                  value={newTurno.cupoMaximo}
                  onChange={e => setNewTurno({ ...newTurno, cupoMaximo: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button type="submit" className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all">
                Guardar Horario
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {(turnos?.length === 0 || !turnos) && !isAdding && (
            <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">No hay horarios configurados para este taller.</p>
              <button onClick={() => setIsAdding(true)} className="text-indigo-600 font-bold hover:underline">
                Agregar el primer turno
              </button>
            </div>
          )}

          {Array.isArray(turnos) && [...turnos].sort((a, b) => dias.indexOf(a.diaSemana) - dias.indexOf(b.diaSemana)).map(turno => (
            <div
              key={turno._id}
              className={`bg-white p-6 rounded-2xl shadow-sm border flex flex-col sm:flex-row justify-between items-center gap-4 transition-all ${turno.isBlocked ? 'opacity-60 grayscale' : 'border-gray-100 hover:shadow-md'}`}
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-indigo-600">{turno.diaSemana.substring(0, 2)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{turno.diaSemana}</h3>
                  <p className="text-gray-500 font-medium">{turno.horaInicio} - {turno.horaFin} hs</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Cupos</p>
                  <p className="text-lg font-bold text-gray-800">
                    <span className={turno.cuposInscriptos >= turno.cupoMaximo ? 'text-red-600' : 'text-emerald-600'}>
                      {turno.cuposInscriptos}
                    </span> / {turno.cupoMaximo}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleBlock(turno)}
                    className={`p-2 rounded-lg transition-colors ${turno.isBlocked ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    title={turno.isBlocked ? 'Habilitar' : 'Bloquear'}
                  >
                    {turno.isBlocked ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(turno._id)}
                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkshopSchedulePage;
