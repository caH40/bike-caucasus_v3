'use client';

import IconHandThumbUp from '@/components/Icons/IconHandThumbUp';
import IconChatBubble from '@/components/Icons/IconChatBubble';

import IconEye from '@/components/Icons/IconEye';
import styles from '../InteractiveBlockNews/InteractiveBlockNews.module.css';

import { toast } from 'sonner';
import { getInteractive } from '@/actions/trail';
import { useEffect, useState } from 'react';
import { InteractiveBlockProps } from '@/types/index.interface';
import { setLike } from '@/actions/trail';

/**
 * Интерактивный блок для маршрута, отображение количества лайков, просмотров, фиксация лайка.
 */
export default function InteractiveBlockTrail({
  likesCount,
  isLikedByUser,
  messages,
  idDocument,
  viewsCount,
}: InteractiveBlockProps) {
  // Данные интерактивного блока
  const [interData, setInterData] = useState({
    likesCount,
    viewsCount,
    isLikedByUser,
  });

  const [updateInter, setUpdateInter] = useState(false);
  // Обработка клика лайка.
  const getLike = async () => {
    const response = await setLike(idDocument);
    setUpdateInter(true);
    if (!response.ok) {
      toast.error(response.message);
    }
  };

  // Запрос актуальных данных интерактивного блока после "Лайка"
  useEffect(() => {
    // Не обновлять, если не было клика по лайку (Первое получение данных происходит из серверного экшена).
    if (!updateInter) {
      return;
    }

    getInteractive({ idDocument }).then((res) => {
      if (!res.data) {
        return;
      }

      setInterData({
        likesCount: res.data.likesCount,
        viewsCount: res.data.viewsCount,
        isLikedByUser: res.data.isLikedByUser,
      });
      setUpdateInter(false);
    });
  }, [idDocument, updateInter]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.box__icon}>
        <IconHandThumbUp
          getClick={getLike}
          squareSize={20}
          isActive={interData.isLikedByUser}
          colors={{ default: 'currentColor', active: '#fafafa80', hover: 'orange' }}
        />
        {interData.likesCount && (
          <span className={styles.icon__label}>{interData.likesCount}</span>
        )}
      </div>
      <div className={styles.box__icon}>
        <IconChatBubble squareSize={20} />
        {messages && <span className={styles.icon__label}>{messages}</span>}
      </div>
      <div className={styles.box__icon}>
        <IconEye squareSize={20} />
        {interData.viewsCount && (
          <span className={styles.icon__label}>{interData.viewsCount}</span>
        )}
      </div>
    </div>
  );
}
