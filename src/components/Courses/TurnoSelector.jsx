import React, { useState, useEffect } from 'react';
import { getTurnosByCourse } from '../../services/turnos/turnoService';
import Spinner from '../Spinner';

const TurnoSelector = ({ courseId, onSelect, selectedTurnoId }) => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        setLoading(true);
        const response = await getTurnosByCourse(courseId);
        setTurnos(response.data);
      } catch (err) {
        setError('No se pudieron cargar los horarios disponibles.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchTurnos();
    }
  }, [courseId]);

  if (loading) return <div className="py-4 flex justify-center"><Spinner /></div>;
  if (error) return <div className="py-2 text-red-500 text-sm">{error}</div>;
  if (turnos.length === 0) return (
    <div className="py-4 px-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
      No hay turnos disponibles para este curso actualmente.
    </div>
  );

  return (
    <div className="space-y-4 my-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Selecciona tu horario
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {turnos.map((turno) => {
          const isFull = turno.cuposInscriptos >= turno.cupoMaximo;
          const isSelected = selectedTurnoId === turno._id;
          const available = turno.cupoMaximo - turno.cuposInscriptos;

          return (
            <button
              key={turno._id}
              type="button"
              disabled={isFull}
              onClick={() => onSelect(turno._id)}
              className={`
                relative p-4 rounded-xl border-2 text-left transition-all duration-200
                ${isFull
                  ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                  : isSelected
                    ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200'
                    : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md'
                }
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`font-bold ${isSelected ? 'text-indigo-700' : 'text-gray-900'}`}>
                  {turno.diaSemana || new Date(turno.fecha).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
                {isFull ? (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded-full">Lleno</span>
                ) : (
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${available <= 2 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                    {available} {available === 1 ? 'lugar' : 'lugares'}
                  </span>
                )}
              </div>
              <div className={`text-sm ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`}>
                {turno.horaInicio} a {turno.horaFin} hs
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TurnoSelector;
