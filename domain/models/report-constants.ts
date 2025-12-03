export type ReportStatus = 'Abierto' | 'En Progreso' | 'Resuelto' | 'Cerrado';

export const REPORT_STATUS_CONSTANTS: Record<ReportStatus, ReportStatus> = {
  'Abierto': 'Abierto',
  'En Progreso': 'En Progreso',
  'Resuelto': 'Resuelto',
  'Cerrado': 'Cerrado',
};

export const ReportStatusEnum = {
  ABIERTO: REPORT_STATUS_CONSTANTS.Abierto,
  EN_PROGRESO: REPORT_STATUS_CONSTANTS['En Progreso'],
  RESUELTO: REPORT_STATUS_CONSTANTS.Resuelto,
  CERRADO: REPORT_STATUS_CONSTANTS.Cerrado,
};