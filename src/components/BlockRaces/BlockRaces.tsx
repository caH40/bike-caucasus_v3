'use client';

import dynamic from 'next/dynamic';

import { TChampionshipStatus, TChampionshipTypes, TRace } from '@/types/models.interface';
import Wrapper from '../Wrapper/Wrapper';
import styles from './BlockRaces.module.css';
import ParamsRace from '../ParamsRace/ParamsRace';
import BoxRegistrationChamp from '../UI/BoxRegistrationChamp/BoxRegistrationChamp';

const MapWithElevation = dynamic(() => import('@/components/Map/Map'), { ssr: false });

type Props = {
  races: TRace[];
  registrationData: {
    type: TChampionshipTypes;
    status: TChampionshipStatus;
    urlSlugChamp: string;
  };
};

/**
 * Блок описания Race Заезда (дистанции).
 */
export default function BlockRaces({ races, registrationData }: Props) {
  return (
    <Wrapper hSize={2} title="Заезды">
      <div className={styles.wrapper__races}>
        {races.map((race) => (
          <div className={styles.wrapper__race} key={race.number}>
            <h3 className={styles.title}>{`${race.number}. ${race.name}`}</h3>
            <p className={styles.description}>{race.description}</p>

            <div className={styles.wrapper__params}>
              <ParamsRace race={race} />
            </div>

            <MapWithElevation url={race.trackGPX.url} key={race.number} />
          </div>
        ))}
      </div>

      <BoxRegistrationChamp
        type={registrationData.type}
        status={registrationData.status}
        urlSlugChamp={registrationData.urlSlugChamp}
      />
    </Wrapper>
  );
}
