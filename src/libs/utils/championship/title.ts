// types
import { TDtoChampionship } from '@/types/dto.types';
import { TChampionshipTypes } from '@/types/models.interface';

/**
 * Формирование названия страницы результатов Чемпионата.
 */
export function getChampionshipPagesTitleName(
  championshipData: TDtoChampionship,
  pageName: string
): string {
  const typeName: Record<'series' | 'tour', string> = {
    series: 'серии заездов ',
    tour: 'тура ',
  };

  const parentType = championshipData.parentChampionship?.type;
  const parentName = championshipData.parentChampionship?.name;

  let parentTypeText = '';
  if (parentType === 'series' || parentType === 'tour') {
    parentTypeText = typeName[parentType];
  }

  const prefix: Record<TChampionshipTypes, string> = {
    series: `Серии заездов «${championshipData.name}»`,
    tour: `Тура «${championshipData.name}»`,
    stage: `Этапа «${championshipData.name}» ${parentTypeText}${
      parentName ? `«${parentName}»` : ''
    }`,
    single: `Соревнования «${championshipData.name}»`,
  };

  return `${pageName} ${prefix[championshipData.type]}`;
}
