// src/constants/surfaceTranslations.ts
import type { TSurfaceType } from '@/types/index.interface';

export const SURFACE_TYPE_TRANSLATIONS: Record<TSurfaceType, string> = {
  road: 'Асфальт',
  gravel: 'Гравий',
  trail: 'Тропа',
  mixed: 'Смешанное',
  dirt: 'Грунт',
};
