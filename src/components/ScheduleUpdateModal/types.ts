// modista-app/src/components/ScheduleUpdateModal/types.ts

import { TurnoInfo } from '../../services/inscriptions/types';

export interface Turno extends TurnoInfo {
  fecha?: string;
}

export interface InscriptionDetails {
  _id: string;
  nombre: string;
  apellido: string;
  turnoId: string | Turno;
  courseId: string;
}

export interface ScheduleUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  inscription: InscriptionDetails;
  courseId: string;
  workshopTitle: string;
}