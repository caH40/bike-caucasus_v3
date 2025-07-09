// src/constants/surfaceTranslations.ts
import type { TEntityNameForSlot, TSurfaceType } from '@/types/index.interface';

export const SURFACE_TYPE_TRANSLATIONS: Record<TSurfaceType, string> = {
  road: 'Асфальт',
  gravel: 'Гравий',
  trail: 'Тропа',
  mixed: 'Смешанное',
  dirt: 'Грунт',
};

export const ENTITY_NAME_TRANSLATIONS: Record<TEntityNameForSlot, string> = {
  championship: 'Чемпионат',
  team: 'Команда',
};
