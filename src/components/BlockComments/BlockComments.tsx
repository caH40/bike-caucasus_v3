'use client';

import { TCommentDto } from '@/types/dto.types';
import FormComment from '../UI/FormComment/FormComment';
import styles from './BlockComments.module.css';
import Avatar from '../Avatar/Avatar';
import { getTimerLocal } from '@/libs/utils/date-local';
import IconHandThumbUp from '../Icons/IconHandThumbUp';
import { useState } from 'react';
import IconDelete from '../Icons/IconDelete';
import IconPen from '../Icons/IconPen';

type Props = {
  comments: TCommentDto[];
  authorId: number;
  userId: number | null; // ID авторизованного пользователя.
};

/**
 * Блок комментариев.
 */
export default function BlockComments({ comments, authorId, userId }: Props) {
  // Показывать все комментарии к данному посту, или сокращенное количество.
  const [showAllComments, setShowAllComments] = useState<boolean>(false);
  // Устанавливается Id комментария на который наведен курсор мыши.
  const [idForShowMenu, setIdForShowMenu] = useState<string | null>(null);
  const getLike = () => {};
  console.log(idForShowMenu);

  return (
    <div className={styles.wrapper}>
      <section className={styles.wrapper__comments}>
        {comments
          .map((comment) => (
            <div
              className={styles.wrapper__comment}
              key={comment._id}
              onMouseOver={() => setIdForShowMenu(comment._id)}
              onMouseLeave={() => setIdForShowMenu(null)}
            >
              <Avatar squareSize={32} author={comment.author} />

              {/* Блок управления комментарием */}
              {idForShowMenu === comment._id && userId === comment.author.id && (
                <div className={styles.box__control}>
                  <IconPen squareSize={16} colors={{ hover: '#ec9c07' }} />
                  <IconDelete squareSize={16} colors={{ hover: '#ec9c07' }} />
                </div>
              )}

              <div className={styles.block__comment}>
                {/* ФИО автора комментария */}
                <div className={styles.author}>
                  {`${comment.author.person.lastName} ${comment.author.person.firstName}`}
                  {authorId === comment.author.id && (
                    <>
                      <span className={styles.dot}></span>
                      <span>Автор</span>
                    </>
                  )}
                </div>

                {/* Текст комментария */}
                <div className={styles.text}>{comment.text}</div>

                {/* Футер комментария: дата создания, интерактивный блок */}
                <div className={styles.footer}>
                  {/* Дата создания комментария */}
                  <div className={styles.box__data}>
                    <span className={styles.data}>
                      {getTimerLocal(comment.createdAt, 'DDMMYYHm')}
                    </span>
                  </div>

                  {/* Иконка активная - лайк комментария */}
                  <div className={styles.box__icon}>
                    <IconHandThumbUp
                      getClick={getLike}
                      squareSize={20}
                      isActive={comment.isLikedByUser}
                      colors={{ default: 'currentColor', active: '#fafafa80', hover: 'orange' }}
                    />
                    {/* Количество лайков */}
                    {comment.count.likes && (
                      <span className={styles.icon__label}>{comment.count.likes}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
          .slice(0, showAllComments ? undefined : 4)}
        {showAllComments ? (
          <button onClick={() => setShowAllComments(false)} className={styles.btn}>
            Скрыть часть комментариев
          </button>
        ) : (
          <button onClick={() => setShowAllComments(true)} className={styles.btn}>
            Показать все комментарии
          </button>
        )}
      </section>
      <FormComment />
    </div>
  );
}
