'use client';

import { useEffect, useState } from 'react';

import IconHandThumbUp from '@/components/Icons/IconHandThumbUp';
import IconChatBubble from '@/components/Icons/IconChatBubble';
import IconEye from '@/components/Icons/IconEye';
import {
  getInteractive as getInteractiveForTrail,
  setLike as setLikeForTrail,
} from '@/actions/trail';
import {
  getInteractive as getInteractiveForNews,
  setLike as setLikeForNews,
} from '@/actions/news';
import { InteractiveBlockProps } from '@/types/index.interface';
import styles from './InteractiveBlock.module.css';

/**
 * Интерактивный блок, отображение количества лайков, просмотров, фиксация лайка.
 */
export default function InteractiveBlock({
  likesCount,
  isLikedByUser,
  commentsCount,
  idDocument,
  viewsCount,
  target,
}: InteractiveBlockProps) {
  // Данные интерактивного блока
  const [interData, setInterData] = useState({
    likesCount,
    viewsCount,
    isLikedByUser,
    commentsCount,
  });

  const [updateInter, setUpdateInter] = useState(false);
  // Обработка клика лайка.
  const getLike = async () => {
    if (target === 'news') {
      await setLikeForNews(idDocument);
      setUpdateInter(true);
    } else if (target === 'trail') {
      await setLikeForTrail(idDocument);
      setUpdateInter(true);
    }
  };

  // Запрос актуальных данных интерактивного блока после "Лайка"
  useEffect(() => {
    // Не обновлять, если не было клика по лайку (Первое получение данных происходит из серверного экшена).
    if (!updateInter) {
      return;
    }

    if (target === 'news') {
      getInteractiveForNews(idDocument).then((res) => {
        if (!res.data) {
          return;
        }

        setInterData({
          likesCount: res.data.likesCount,
          viewsCount: res.data.viewsCount,
          isLikedByUser: res.data.isLikedByUser,
          commentsCount: res.data.commentsCount,
        });
        setUpdateInter(false);
      });
    } else if (target === 'trail') {
      getInteractiveForTrail(idDocument).then((res) => {
        if (!res.data) {
          return;
        }

        setInterData({
          likesCount: res.data.likesCount,
          viewsCount: res.data.viewsCount,
          isLikedByUser: res.data.isLikedByUser,
          commentsCount: res.data.commentsCount,
        });
        setUpdateInter(false);
      });
    }
  }, [idDocument, updateInter, target]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.box__icon}>
        <IconHandThumbUp
          getClick={getLike}
          squareSize={20}
          isActive={interData.isLikedByUser}
          colors={{ default: 'currentColor', active: '#fafafa80', hover: 'orange' }}
        />
        <span className={styles.icon__label}>{interData.likesCount}</span>
      </div>

      <div className={styles.box__icon}>
        <IconChatBubble squareSize={20} />
        <span className={styles.icon__label}>{interData.commentsCount}</span>
      </div>

      <div className={styles.box__icon}>
        <IconEye squareSize={20} />
        <span className={styles.icon__label}>{interData.viewsCount}</span>
      </div>
    </div>
  );
}
