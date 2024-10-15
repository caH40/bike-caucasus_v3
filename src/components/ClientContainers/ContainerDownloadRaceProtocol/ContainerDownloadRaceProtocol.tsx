'use client';

import { getDateChampionship } from '@/libs/utils/date';
import IconPdf from '@/components/Icons/IconPDF';
import { getPdfProtocolRace } from '@/libs/pdf/protocolRace';
import { TChampionshipForRegisteredClient, TProtocolRace } from '@/types/index.interface';
import styles from './ContainerDownloadRaceProtocol.module.css';

type Props = {
  championship: TChampionshipForRegisteredClient;
  protocols: TProtocolRace[];
};

/**
 *  Клиентский контейнер для скачивания документов с зарегистрированными участниками Чемпионата.
 */
export default function ContainerDownloadRaceProtocol({ championship, protocols }: Props) {
  // Скачивание PDF файла таблицы с зарегистрированными райдерами.
  const handlerClickRegistered = (protocol: TProtocolRace) => {
    const subTitles = [
      championship.name,
      `Заезд: ${protocol.race.name}`,
      `Дата: ${getDateChampionship({
        startDate: championship.startDate,
        endDate: championship.endDate,
      })}`,
    ];

    getPdfProtocolRace({
      data: protocol,
      subTitles,
    });
  };

  return (
    <div className={styles.wrapper}>
      {protocols.map((protocol, index) => (
        <div className={styles.block} key={index}>
          <IconPdf
            squareSize={24}
            getClick={() => handlerClickRegistered(protocol)}
            tooltip={{
              id: `dlPdfProtocol-${protocol.race.number}`,
              text: 'скачать pdf-файл',
            }}
          />
          <span
            className={styles.title__file}
          >{`Финишные протоколы заезда "${protocol.race.name}"`}</span>
        </div>
      ))}
    </div>
  );
}
