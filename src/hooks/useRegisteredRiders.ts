import { useEffect } from 'react';
import { toast } from 'sonner';

import { useRegistrationRace } from '@/store/registration-race';
import { getRegisteredRidersRace } from '@/actions/registration-champ';

/**
 * Хук для загрузки зарегистрированных райдеров по номеру заезда.
 */
export const useRegisteredRiders = (raceId: string) => {
  const setRegisteredRiders = useRegistrationRace((state) => state.setRegisteredRiders);
  const trigger = useRegistrationRace((state) => state.trigger);

  useEffect(() => {
    async function fetchRegisteredRiders() {
      const registeredRiders = await getRegisteredRidersRace(raceId);

      if (registeredRiders.ok && registeredRiders.data) {
        setRegisteredRiders(registeredRiders.data);
      } else {
        toast.error(registeredRiders.message);
      }
    }

    if (raceId) {
      fetchRegisteredRiders();
    }
  }, [raceId, setRegisteredRiders, trigger]);
};
