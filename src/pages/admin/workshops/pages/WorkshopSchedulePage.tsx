import { type FC, useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTurnosByCourse, createTurno, updateTurno, deleteTurno } from '../../../../services/turnos/turnoService';
import { getCourseById } from '../../../../services/courses/coursesService';
import toast from 'react-hot-toast';
import { Spinner } from '@/components';
import ConfirmDeleteModal from '@/pages/admin/shared/components/ConfirmDeleteModal';
import { 
  LockClosedIcon, 
  LockOpenIcon, 
  TrashIcon, 
  PlusIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import type { WorkshopCourse, Turno, NewTurno } from '../types';

const WorkshopSchedulePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<WorkshopCourse | null>(null);
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

  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    turnoId: '', 
    turnoLabel: '' 
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const foundCourse = await getCourseById(id);
        setCourse(foundCourse as unknown as WorkshopCourse);

        const response = await getTurnosByCourse(id, { includeBlocked: true });
        const turnosData = Array.isArray(response) ? response : (response?.data || []);
        setTurnos(turnosData);

        if (foundCourse) {
          setNewTurno(prev => ({ ...prev, courseId: foundCourse._id || foundCourse.uuid || id }));
        }
      } catch (err: any) {
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
    } catch {
      toast.error('Error al agregar horario');
    }
  };

  const handleToggleBlock = async (turno: Turno) => {
    try {
      const updated: { data: Turno } = await updateTurno(turno._id, { isBlocked: !turno.isBlocked });
      setTurnos(turnos.map(t => t._id === turno._id ? updated.data : t));
      toast.success(updated.data.isBlocked ? 'Horario bloqueado' : 'Horario habilitado');
    } catch {
      toast.error('Error al actualizar estado');
    }
  };

  const handleDelete = (turno: Turno) => {
    setDeleteModal({
      isOpen: true,
      turnoId: turno._id,
      turnoLabel: `${turno.diaSemana} ${turno.horaInicio} - ${turno.horaFin}`
    });
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTurno(deleteModal.turnoId);
      setTurnos(turnos.filter(t => t._id !== deleteModal.turnoId));
      toast.success('Horario eliminado');
    } catch {
      toast.error('Error al eliminar');
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, turnoId: '', turnoLabel: '' });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Spinner /></div>;

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Botón Volver Estilo Breadcrumb */}
        <button
          onClick={() => navigate(`/admin/workshops/${id}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-700 mb-6 transition-colors group"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          <span className="text-lg font-medium">Volver al Taller</span>
        </button>

        {/* Header con el botón verde pro */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              Agenda: {course?.title} ✂️
            </h1>
            <p className="text-gray-400 text-xl mt-1 font-medium">Administra los horarios y cupos disponibles.</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${
              isAdding 
                ? 'bg-gray-200 text-gray-700' 
                : 'bg-[#00a76f] text-white hover:bg-[#008f5d] shadow-[#00a76f]/20'
            }`}
          >
            {isAdding ? 'Cancelar' : <><PlusIcon className="w-6 h-6 stroke-[3px]" /> Agregar Turno</>}
          </button>
        </div>

        {/* Formulario de Adición */}
        {isAdding && (
          <form onSubmit={handleAddTurno} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-emerald-50 mb-12 animate-in slide-in-from-top-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Configurar Nuevo Horario</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Día</label>
                <select
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700"
                  value={newTurno.diaSemana}
                  onChange={e => setNewTurno({ ...newTurno, diaSemana: e.target.value })}
                >
                  {dias.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Hora Inicio</label>
                <input
                  type="time"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold"
                  value={newTurno.horaInicio}
                  onChange={e => setNewTurno({ ...newTurno, horaInicio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Hora Fin</label>
                <input
                  type="time"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold"
                  value={newTurno.horaFin}
                  onChange={e => setNewTurno({ ...newTurno, horaFin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Cupos</label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700"
                  value={newTurno.cupoMaximo}
                  onChange={e => setNewTurno({ ...newTurno, cupoMaximo: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="mt-10 flex justify-end">
              <button type="submit" className="px-12 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95">
                Guardar Horario
              </button>
            </div>
          </form>
        )}

        {/* Lista de Turnos - DISEÑO FIEL A CAPTURA 1 */}
        <div className="space-y-6">
          {(!turnos || turnos.length === 0) && !isAdding && (
            <div className="bg-white p-20 text-center rounded-[3rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold text-xl">No hay horarios configurados.</p>
            </div>
          )}

          {Array.isArray(turnos) && [...turnos].sort((a, b) => dias.indexOf(a.diaSemana) - dias.indexOf(b.diaSemana)).map(turno => (
            <div
              key={turno._id}
              className={`bg-white p-7 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6 transition-all duration-300 ${
                turno.isBlocked ? 'opacity-50' : 'hover:shadow-xl'
              }`}
            >
              <div className="flex items-center gap-8 w-full sm:w-auto">
                {/* Caja de Iniciales (Izquierda) */}
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 font-bold text-2xl transition-colors ${
                  turno.isBlocked ? 'bg-gray-100 text-gray-400' : 'bg-gray-50 text-indigo-600'
                }`}>
                  {turno.diaSemana.substring(0, 2)}
                </div>
                
                {/* Información Central */}
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-800 tracking-tight">{turno.diaSemana}</h3>
                  <p className="text-gray-400 text-lg font-medium tracking-tight">{turno.horaInicio} - {turno.horaFin} hs</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-12 w-full sm:w-auto">
                {/* Cupos con Label Profesional */}
                <div className="text-right min-w-[80px]">
                  <p className="text-[11px] text-gray-300 uppercase font-black tracking-widest mb-1">Cupos</p>
                  <p className="text-3xl font-black text-gray-900 tracking-tighter">
                    <span className={turno.cuposInscriptos >= turno.cupoMaximo ? 'text-red-500' : 'text-emerald-500'}>
                      {turno.cuposInscriptos}
                    </span>
                    <span className="text-gray-200 mx-1.5">/</span>
                    <span className="text-gray-300">{turno.cupoMaximo}</span>
                  </p>
                </div>

                {/* Botones de Acción (Iconos en cajas) */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleToggleBlock(turno)}
                    className={`p-4 rounded-2xl transition-all border-2 ${
                      turno.isBlocked 
                        ? 'bg-gray-100 border-transparent text-gray-400 hover:bg-gray-200' 
                        : 'bg-white border-gray-50 text-gray-300 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50'
                    }`}
                    title={turno.isBlocked ? 'Habilitar' : 'Bloquear'}
                  >
                    {turno.isBlocked ? (
                      <LockClosedIcon className="w-7 h-7 stroke-[2.5px]" />
                    ) : (
                      <LockOpenIcon className="w-7 h-7 stroke-[2.5px]" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(turno)}
                    className="p-4 bg-white border-2 border-gray-50 text-gray-300 rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                    title="Eliminar Horario"
                  >
                    <TrashIcon className="w-7 h-7 stroke-[2.5px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        itemName={deleteModal.turnoLabel}
        itemType="el horario"
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default WorkshopSchedulePage;
