'use client';

import IconHandThumbUp from '@/components/Icons/IconHandThumbUp';
import IconChatBubble from '@/components/Icons/IconChatBubble';

import IconEye from '@/components/Icons/IconEye';
import styles from './InteractiveBlockNews.module.css';

import { toast } from 'sonner';
import { getInteractive, setLike } from '@/services/server_actions/news';
import { useEffect, useState } from 'react';

type Props = {
  likesCount?: number; // Количество лайков.
  messages?: number; // Количество сообщений.
  viewsCount?: number; // Количество просмотров.
  idNews: string | undefined;
  isLikedByUser: boolean;
};

export default function InteractiveNewsCard({
  likesCount,
  isLikedByUser,
  messages,
  idNews,
  viewsCount,
}: Props) {
  // Данные интерактивного блока
  const [interData, setInterData] = useState({
    likesCount,
    viewsCount,
    isLikedByUser,
  });

  const [updateInter, setUpdateInter] = useState(false);
  // Обработка клика лайка.
  const getLike = async () => {
    const response = await setLike({ idNews });
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

    getInteractive({ idNews }).then((res) => {
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
  }, [idNews, updateInter]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.box__icon}>
        <IconHandThumbUp
          getClick={getLike}
          squareSize={20}
          isActive={interData.isLikedByUser}
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
