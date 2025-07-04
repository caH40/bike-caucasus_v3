import { useEffect, useRef } from 'react';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';

import { isObjectId } from '@/libs/utils/mongoose';

// types
import { TDistanceDto } from '@/types/dto.types';
import { TRaceForFormNew } from '@/types/index.interface';

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
  const prevTrackId = useRef<string | null>(null);

  useEffect(() => {
    // Если это первый рендер, просто сохраняем текущий ID и выходим.
    if (prevTrackId.current === null) {
      prevTrackId.current = selectedTrackId;
      return;
    }

    // Если ID не изменился, ничего не делаем.
    if (prevTrackId.current === selectedTrackId) {
      return;
    }

    const selectedTrack = distances.find((d) => d._id === String(selectedTrackId));
    if (selectedTrackId && selectedTrack && isObjectId(selectedTrackId)) {
      setValue(`races.${index}.name`, selectedTrack.name);
      setValue(`races.${index}.description`, selectedTrack.description || '');
      setValue(`races.${index}.distance`, selectedTrack.distanceInMeter / 1000);
      setValue(`races.${index}.ascent`, selectedTrack.ascentInMeter);
    }

    prevTrackId.current = selectedTrackId;
  }, [selectedTrackId, index, distances, setValue]);
}
