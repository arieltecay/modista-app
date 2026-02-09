import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getAvailableTurnosForInscription, updateInscriptionSchedule } from '../../services/inscriptions/workshopInscriptionService';
import Spinner from '../Spinner';
import { Turno, InscriptionDetails, ScheduleUpdateModalProps } from './types';

const ScheduleUpdateModal: React.FC<ScheduleUpdateModalProps> = ({
  isOpen,
  onClose,
  inscription,
  courseId,
  workshopTitle
}) => {
  if (!inscription) return null;

  const [availableTurnos, setAvailableTurnos] = useState<Turno[]>([]);
  const [selectedTurnoId, setSelectedTurnoId] = useState<string>('');
  const [loadingTurnos, setLoadingTurnos] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && courseId && inscription?.turnoId) {
      fetchTurnos();
      // Set initial selection to the current turno if it's a valid object or string
      if (typeof inscription.turnoId === 'string') {
        setSelectedTurnoId(inscription.turnoId);
      } else if (typeof inscription.turnoId === 'object' && inscription.turnoId !== null) {
        setSelectedTurnoId(inscription.turnoId._id);
      }
    }
  }, [isOpen, courseId, inscription]); // Depend on inscription to get current turnoId

  const fetchTurnos = async () => {
    setLoadingTurnos(true);
    try {
      // Fetch only available turnos (server-side validation)
      const turnos = await getAvailableTurnosForInscription(inscription._id);
      setAvailableTurnos(turnos);
    } catch (error) {
      toast.error('Error al cargar los horarios disponibles.');
      console.error('Error fetching turnos:', error);
    } finally {
      setLoadingTurnos(false);
    }
  };

  const handleSave = async () => {
    if (!selectedTurnoId) {
      toast.error('Por favor, selecciona un nuevo horario.');
      return;
    }

    // Prevent saving if it's the same turno
    let currentTurnoId = '';
    if (typeof inscription.turnoId === 'string') {
      currentTurnoId = inscription.turnoId;
    } else if (typeof inscription.turnoId === 'object' && inscription.turnoId !== null) {
      currentTurnoId = inscription.turnoId._id;
    }

    if (selectedTurnoId === currentTurnoId) {
      toast.error('El horario seleccionado es el mismo que el actual.');
      // onClose(); // Dont close, let user choose another one
      return;
    }

    setIsSaving(true);
    try {
      await updateInscriptionSchedule(inscription._id, selectedTurnoId);
      toast.success('Horario actualizado exitosamente.');
      onClose(); // Close modal on success
      // Optionally, refetch data in the parent component
      // window.location.reload(); // A simple reload, or use a state update/callback
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar el horario.');
      console.error('Error updating schedule:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatTurnoLabel = (turno: Turno) => {
    let dayLabel = '';
    if (turno.fecha) {
      const dateObj = new Date(turno.fecha);
      dayLabel = dateObj.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'numeric' });
    } else if (turno.diaSemana) {
      dayLabel = turno.diaSemana;
    } else {
      dayLabel = 'Fecha no disponible';
    }

    // Capitalize first letter
    dayLabel = dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1);

    return `${dayLabel}, ${turno.horaInicio} - ${turno.horaFin} (Cupos: ${turno.cupoMaximo - turno.cuposInscriptos}/${turno.cupoMaximo})`;
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Reagendar Inscripción</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <p className="mb-4">
          Actualizar horario para: <strong className="capitalize">{inscription.nombre} {inscription.apellido}</strong> en el taller <strong className="capitalize">{workshopTitle}</strong>.
        </p>

        {loadingTurnos ? (
          <div className="flex justify-center items-center py-8"><Spinner /></div>
        ) : (
          <>
            <label htmlFor="turno-select" className="block text-sm font-medium text-gray-700 mb-2">
              Nuevo Horario
            </label>
            <select
              id="turno-select"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedTurnoId}
              onChange={(e) => setSelectedTurnoId(e.target.value)}
              disabled={availableTurnos.length === 0}
            >
              <option value="" disabled>
                {availableTurnos.length === 0 && !loadingTurnos
                  ? "No hay horarios disponibles"
                  : "Selecciona un horario..."}
              </option>
              {availableTurnos.map((turno) => (
                <option key={turno._id} value={turno._id}>
                  {formatTurnoLabel(turno)}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !selectedTurnoId}
            className={`px-4 py-2 rounded-md text-white font-semibold ${isSaving || !selectedTurnoId
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleUpdateModal;
