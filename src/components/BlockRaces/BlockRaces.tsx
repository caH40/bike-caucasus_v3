'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

import { TChampionshipStatus, TChampionshipTypes } from '@/types/models.interface';
import Wrapper from '../Wrapper/Wrapper';
import ParamsRace from '../ParamsRace/ParamsRace';
import BoxRegistrationChamp from '../UI/BoxRegistrationChamp/BoxRegistrationChamp';
import { TRaceForForm } from '@/types/index.interface';
const MapWithElevation = dynamic(() => import('@/components/Map/MapWrapper'));
import styles from './BlockRaces.module.css';
import Spacer from '../Spacer/Spacer';

type Props = {
  races: TRaceForForm[];
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

            {race.trackGPX.url && (
              <Spacer margin="b-md">
                <Link
                  className={styles.link}
                  target="blank"
                  href={race.trackGPX.url}
                  rel="noreferrer"
                >
                  Скачать GPX
                </Link>
              </Spacer>
            )}

            <div className={styles.wrapper__params}>
              <ParamsRace race={race} />
            </div>

            <MapWithElevation url={race.trackGPX.url} key={race._id} />
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
