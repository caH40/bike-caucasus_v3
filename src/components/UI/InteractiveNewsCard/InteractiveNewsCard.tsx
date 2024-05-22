'use client';

import IconHandThumbUp from '@/components/Icons/IconHandThumbUp';
import IconChatBubble from '@/components/Icons/IconChatBubble';
import IconShare from '@/components/Icons/IconShare';
import IconEye from '@/components/Icons/IconEye';
import styles from './InteractiveNewsCard.module.css';

import { toast } from 'sonner';
import { setLike } from '@/services/server_actions/likes';

type Props = {
  likes?: number; // Количество лайков.
  messages?: number; // Количество сообщений.
  views?: number; // Количество просмотров.
  idNews: string | undefined;
  isLikedByUser: boolean;
};

export default function InteractiveNewsCard({
  likes,
  isLikedByUser,
  messages,
  idNews,
  views,
}: Props) {
  const getShare = () => {};

  // Обработка клика лайка.
  const getLike = async () => {
    const response = await setLike({ idNews });
    if (response) {
      toast.error(response.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.box__icon}>
        <IconHandThumbUp getClick={getLike} squareSize={20} isActive={isLikedByUser} />
        {likes && <span className={styles.icon__label}>{likes}</span>}
      </div>
      <div className={styles.box__icon}>
        <IconChatBubble squareSize={20} />
        {messages && <span className={styles.icon__label}>{messages}</span>}
      </div>
      <div className={styles.box__icon}>
        <IconEye squareSize={20} />
        {views && <span className={styles.icon__label}>{views}</span>}
      </div>
      <div className={styles.box__icon}>
        <IconShare squareSize={20} getClick={getShare} />
      </div>
    </div>
  );
}
