'use client';

import { TChampRegistrationRiderDto } from '@/types/dto.types';
import { TChampionshipForRegisteredClient } from '@/types/index.interface';
import { getDateChampionship } from '@/libs/utils/date';
import { getPdfRegistered } from '@/libs/pdf/registeredRace';
import IconPdf from '@/components/Icons/IconPDF';
import { getPdfBlankForProtocol } from '@/libs/pdf/blankForProtocol';
import styles from './ContainerDownloadRegistered.module.css';

type Props = {
  champRegistrationRiders: TChampRegistrationRiderDto[];
  championship: TChampionshipForRegisteredClient;
};

/**
 *  Клиентский контейнер для скачивания документов с зарегистрированными участниками Чемпионата.
 */
export default function ContainerDownloadRegistered({
  championship,
  champRegistrationRiders,
}: Props) {
  // Скачивание PDF файла таблицы с зарегистрированными райдерами.
  const handlerClickRegistered = (race: TChampRegistrationRiderDto) => {
    const subTitles = [
      championship.name,
      `Заезд: ${race.raceName}`,
      `Дата: ${getDateChampionship({
        startDate: championship.startDate,
        endDate: championship.endDate,
      })}`,
    ];

    getPdfRegistered({
      data: race.raceRegistrationRider,
      subTitles,
    });
  };

  // Скачивание PDF файла таблицы бланка протокола с участниками для фиксации результатов.
  const handlerClickBlankProtocol = (race: TChampRegistrationRiderDto) => {
    const subTitles = [
      championship.name,
      `Заезд: ${race.raceName}`,
      `Дата: ${getDateChampionship({
        startDate: championship.startDate,
        endDate: championship.endDate,
      })}`,
    ];
    getPdfBlankForProtocol({ subTitles });
  };

  return (
    <div className={styles.wrapper}>
      {champRegistrationRiders.map((race, index) => (
        <div className={styles.block} key={index}>
          <IconPdf
            squareSize={24}
            getClick={() => handlerClickRegistered(race)}
            tooltip={{
              id: `dlPdfRegistered-${race.raceId}`,
              text: 'скачать pdf-файл',
            }}
          />
          <span
            className={styles.title__file}
          >{`Таблица зарегистрированных участников в заезде "${race.raceName}", pdf`}</span>
        </div>
      ))}

      {champRegistrationRiders.map((race, index) => (
        <div className={styles.block} key={index}>
          <IconPdf
            squareSize={24}
            getClick={() => handlerClickBlankProtocol(race)}
            tooltip={{
              id: `dlPdfProtocol-${race.raceId}`,
              text: 'скачать pdf-файл',
            }}
          />
          <span
            className={styles.title__file}
          >{`Бланк протокола для фиксации результатов участников в заезде "${race.raceName}", pdf`}</span>
        </div>
      ))}
    </div>
  );
}
