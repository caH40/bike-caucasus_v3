'use client';

import { ServerResponse } from '@/types/index.interface';
import FormResultEdit from '../UI/Forms/FormResultAdd/FormResultEdit';
import { TRiderRaceResultDto } from '@/types/dto.types';
import styles from './WrapperResultRaceEdit.module.css';

type Props = {
  result: TRiderRaceResultDto;
  putResultRaceRider: ({
    // eslint-disable-next-line no-unused-vars
    result,
  }: {
    result: FormData;
  }) => Promise<ServerResponse<void>>;
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
