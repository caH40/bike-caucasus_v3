import { isObjectId } from '@/libs/utils/mongoose';
import { TDistanceDto } from '@/types/dto.types';
import { TRaceForFormNew } from '@/types/index.interface';
import { useEffect } from 'react';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';

type Params = {
  control: Control<{ races: TRaceForFormNew[] }, any>;
  setValue: UseFormSetValue<{
    races: TRaceForFormNew[];
  }>;
  distances: TDistanceDto[];
  index: number;
};

export function useTrackDistance({ control, setValue, distances, index }: Params) {
  const selectedTrackId = useWatch({ control, name: `races.${index}.trackDistance` });

  useEffect(() => {
    const selectedTrack = distances.find((d) => d._id === String(selectedTrackId));
    if (selectedTrackId && selectedTrack && isObjectId(selectedTrackId)) {
      // Обновление полей формы
      setValue(`races.${index}.name`, selectedTrack.name);
      setValue(`races.${index}.description`, selectedTrack.description || '');
      setValue(`races.${index}.distance`, selectedTrack.distanceInMeter / 1000);
      setValue(`races.${index}.ascent`, selectedTrack.ascentInMeter);
      // можно добавить и trackGPXUrl или другие поля
    }
    // else if (selectedTrackId === 'null') {
    //   setValue(`races.${index}.name`, '');
    //   setValue(`races.${index}.description`, '');
    //   setValue(`races.${index}.distance`, 0);
    //   setValue(`races.${index}.ascent`, 0);
    // }
  }, [selectedTrackId, index, distances, setValue]);
}
