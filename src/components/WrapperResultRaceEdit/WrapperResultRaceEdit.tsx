'use client';

import { ResponseServer } from '@/types/index.interface';
import FormResultEdit from '../UI/Forms/FormResultAdd/FormResultEdit';
import { TResultRaceRiderDto } from '@/types/dto.types';
import styles from './WrapperResultRaceEdit.module.css';

type Props = {
  result: TResultRaceRiderDto;
  putResultRaceRider: ({
    // eslint-disable-next-line no-unused-vars
    dataFromFormSerialized,
  }: {
    dataFromFormSerialized: FormData;
  }) => Promise<ResponseServer<void>>;
};

/**
 * Обертка для клиентских компонентов страницы редактирования результата Заезда.
 */
export default function WrapperResultRaceEdit({ result, putResultRaceRider }: Props) {
  return (
    <div className={styles.wrapper}>
      <FormResultEdit result={result} putResultRaceRider={putResultRaceRider} />
    </div>
  );
}
