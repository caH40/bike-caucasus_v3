import { TChampionshipStatus } from '@/types/models.interface';

/**
 * Эмуляция данных для формирования Карточки Чемпионата, в частности блока Этапов.
 */
export const initStages: {
  number: number;
  status: TChampionshipStatus;
  startDate: Date;
  startEnd: Date;
}[] = [
  {
    number: 1,
    status: 'completed',
    startDate: new Date('2024-08-14'),
    startEnd: new Date('2024-09-20'),
  },
  {
    number: 2,
    status: 'completed',
    startDate: new Date('2024-09-21'),
    startEnd: new Date('2024-09-21'),
  },
  {
    number: 3,
    status: 'completed',
    startDate: new Date('2024-09-22'),
    startEnd: new Date('2024-09-22'),
  },
  {
    number: 4,
    status: 'upcoming',
    startDate: new Date('2024-09-23'),
    startEnd: new Date('2024-09-23'),
  },
];
