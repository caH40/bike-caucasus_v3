import { getFullName } from '@/libs/utils/text';
import { TRaceRegistrationDto } from '@/types/dto.types';
import { TFormResultRace } from '@/types/index.interface';
import { useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';

type Props = {
  startNumber: number;
  registeredRiders: TRaceRegistrationDto[];
  fullName: string;
  setValue: UseFormSetValue<TFormResultRace>;
};

/**
 * Синхронизация данных startNumber и fullName при их изменениях.
 */
export function useAddResultRace({ startNumber, registeredRiders, fullName, setValue }: Props) {
  useEffect(() => {
    if (startNumber !== 0) {
      const selectedRider = registeredRiders.find((elm) => elm.startNumber === +startNumber);

      if (selectedRider) {
        setValue('fullName', getFullName(selectedRider.rider));
      }
    }
  }, [startNumber, registeredRiders, setValue]);

  useEffect(() => {
    if (fullName !== '') {
      const selectedRider = registeredRiders.find((elm) => getFullName(elm.rider) === fullName);

      if (selectedRider?.startNumber) {
        setValue('startNumber', selectedRider.startNumber);
      }
    }
  }, [fullName, registeredRiders, setValue]);

  return {};
}
