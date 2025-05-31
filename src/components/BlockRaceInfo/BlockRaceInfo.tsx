import React, { useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { TRaceForForm } from '@/types/index.interface';
import BlockMessage from '../BlockMessage/BlockMessage';
import cn from 'classnames/bind';
import styles from './BlockRaceInfo.module.css';

const cx = cn.bind(styles);

type Props = {
  race: TRaceForForm;
};

export default function BlockRaceInfo({ race }: Props) {
  const nodeRef = useRef(null);

  return (
    <BlockMessage>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={race._id}
          nodeRef={nodeRef}
          timeout={200}
          classNames={{
            enter: cx('fadeEnter'),
            enterActive: cx('fadeEnterActive'),
            exit: cx('fadeExit'),
            exitActive: cx('fadeExitActive'),
          }}
        >
          <dl ref={nodeRef} className={styles.list}>
            <dt className={styles.desc__title}>Название</dt>
            <dd className={styles.desc__detail}>{race.name}</dd>

            <dt className={styles.desc__title}>Дистанция</dt>
            <dd className={styles.desc__detail}>{race.distance} км</dd>

            {race.ascent != null && (
              <>
                <dt className={styles.desc__title}>Общий набор</dt>
                <dd className={styles.desc__detail}>{race.ascent} м</dd>
              </>
            )}

            <dt className={styles.desc__title}>Описание</dt>
            <dd className={styles.desc__detail}>{race.description}</dd>
          </dl>
        </CSSTransition>
      </SwitchTransition>
    </BlockMessage>
  );
}
