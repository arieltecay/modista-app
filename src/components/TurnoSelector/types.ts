export interface Turno {
  _id: string;
  diaSemana?: string;
  fecha?: string;
  horaInicio: string;
  horaFin: string;
  cupoMaximo: number;
  cuposInscriptos: number;
}

export interface TurnoSelectorProps {
  courseId: string;
  onSelect: (turnoId: string) => void;
  selectedTurnoId: string | null;
}
