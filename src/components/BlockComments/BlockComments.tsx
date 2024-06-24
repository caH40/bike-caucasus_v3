'use client';

import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getTimerLocal } from '@/libs/utils/date-local';
import { deleteComment, getComments, postComment, setLike } from '@/actions/comment';
import { lcSuffixComment } from '@/constants/local-storage';
import FormComment from '../UI/FormComment/FormComment';
import Avatar from '../Avatar/Avatar';
import IconHandThumbUp from '../Icons/IconHandThumbUp';
import useHasAccess from '@/hooks/useHasAccess';
import type { TCommentDto } from '@/types/dto.types';
import styles from './BlockComments.module.css';

type Props = {
  comments: TCommentDto[];
  authorId: number;
  userId: number | null; // ID авторизованного пользователя.
  document: { _id: string; type: 'news' | 'trail' };
  idUserDB?: string;
};

/**
 * Блок комментариев.
 */
export default function BlockComments({
  comments,
  authorId,
  userId,
  document,
  idUserDB,
}: Props) {
  const [commentsCurrent, setCommentsCurrent] = useState<TCommentDto[]>(comments);
  // Показывать все комментарии к данному посту, или сокращенное количество.
  const [showAllComments, setShowAllComments] = useState<boolean>(false);

  const [trigger, setTrigger] = useState<boolean>(false);
  // Может ли пользователь удалять любые комментарии.
  const hasPermissionForDelete = useHasAccess('delete.comment');

  // Установка/снятие лайка для комментария.
  const getLike = async (commentId: string) => {
    await setLike(commentId);
    setTrigger(true);
  };

  const handlerSubmit = async (text: string, setText: Dispatch<SetStateAction<string>>) => {
    // Удаление пробелов в начале и в конце текста.
    const trimmedText = text.trim();
    // Если комментарий пустой, то не отправлять на сервер.
    if (trimmedText.length === 0) {
      return;
    }

    const res = await postComment(text, document);
    // При удачном сохранении нового комментария обновляются все комментарии
    if (res.isSaved) {
      setTrigger(true);
      setText('');
      localStorage.removeItem(`${lcSuffixComment}${document.type}`);
    }
  };

  useEffect(() => {
    if (!trigger) {
      return;
    }
    setTrigger(false);
    getComments({ document, idUserDB }).then((data) => setCommentsCurrent(data));
  }, [trigger, document, idUserDB]);

  // Удаление комментария.
  const handlerDeleteComment = async (idComment: string) => {
    const textFromCommentCurrent =
      commentsCurrent.find((elm) => elm._id === idComment)?.text || 'Нет текста';
    const isConfirmed = window.confirm(
      `Вы действительно хотите удалить комментарий с текстом: "${textFromCommentCurrent}"?`
    );
    if (!isConfirmed) {
      toast.warning('Отмена удаления комментария!');
    }
    const res = await deleteComment(idComment);

    if (res.ok) {
      setTrigger(true);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  // Редактирование комментария.
  const handlerEditComment = (idComment: string) => {};

  return (
    <div className={styles.wrapper}>
      <section className={styles.wrapper__comments}>
        {commentsCurrent
          .map((comment) => (
            <div className={styles.wrapper__comment} key={comment._id}>
              <Avatar squareSize={32} author={comment.author} />

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

                  <div className={styles.control__mobile}>
                    {userId === comment.author.id && (
                      <button
                        className={styles.btn__control}
                        onClick={() => handlerEditComment(comment._id)}
                      >
                        Редактировать
                      </button>
                    )}
                    {(userId === comment.author.id || hasPermissionForDelete) && (
                      <button
                        className={styles.btn__control}
                        onClick={() => handlerDeleteComment(comment._id)}
                      >
                        Удалить
                      </button>
                    )}
                  </div>

                  {/* Иконка активная - лайк комментария */}
                  <div className={styles.block__icon}>
                    <div className={styles.box__icon}>
                      <IconHandThumbUp
                        getClick={() => getLike(comment._id)}
                        squareSize={20}
                        isActive={comment.isLikedByUser}
                        colors={{
                          default: 'currentColor',
                          active: '#fafafa80',
                          hover: 'orange',
                        }}
                      />
                      {/* Количество лайков */}
                      {comment.count.likes && (
                        <span className={styles.icon__label}>{comment.count.likes}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
          .slice(0, showAllComments ? undefined : 4)}

        {/* Отображать часть комментариев или все */}
        {!!commentsCurrent?.length &&
          commentsCurrent.length > 4 &&
          (showAllComments ? (
            <button onClick={() => setShowAllComments(false)} className={styles.btn}>
              Скрыть часть комментариев
            </button>
          ) : (
            <button onClick={() => setShowAllComments(true)} className={styles.btn}>
              Показать все комментарии
            </button>
          ))}
      </section>

      {idUserDB && <FormComment handlerSubmit={handlerSubmit} type={document.type} />}
    </div>
  );
}
