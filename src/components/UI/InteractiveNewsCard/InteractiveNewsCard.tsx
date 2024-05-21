'use client';

import IconHandThumbUp from '@/components/Icons/IconHandThumbUp';
import IconChatBubble from '@/components/Icons/IconChatBubble';
import IconShare from '@/components/Icons/IconShare';
import IconEye from '@/components/Icons/IconEye';
import styles from './InteractiveNewsCard.module.css';

type Props = {
  likes?: number; // Количество лайков.
  messages?: number; // Количество сообщений.
};

export default function InteractiveNewsCard({ likes, messages }: Props) {
  const getShare = () => {};
  const getLike = () => {};
  return (
    <div className={styles.wrapper}>
      <div className={styles.box__icon}>
        <IconHandThumbUp getClick={getLike} squareSize={20} />
        {likes && <span className={styles.icon__label}>{likes}</span>}
      </div>
      <div className={styles.box__icon}>
        <IconChatBubble squareSize={20} />
        {messages && <span className={styles.icon__label}>{messages}</span>}
      </div>
      <div className={styles.box__icon}>
        <IconEye squareSize={20} />
      </div>
      <div className={styles.box__icon}>
        <IconShare squareSize={20} getClick={getShare} />
      </div>
    </div>
  );
}
