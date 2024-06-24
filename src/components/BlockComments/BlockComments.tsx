'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { getTimerLocal } from '@/libs/utils/date-local';
import { deleteComment, saveComment, setLike } from '@/actions/comment';
import { lcSuffixComment } from '@/constants/local-storage';
import FormComment from '../UI/FormComment/FormComment';
import Avatar from '../Avatar/Avatar';
import IconHandThumbUp from '../Icons/IconHandThumbUp';
import useHasAccess from '@/hooks/useHasAccess';
import type { TCommentDto } from '@/types/dto.types';
import styles from './BlockComments.module.css';
import { useGetComments } from '@/hooks/useGetComments';

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
  // Показывать все комментарии к данному посту, или сокращенное количество.
  const [showAllComments, setShowAllComments] = useState<boolean>(false);
  // Текс комментария в textarea.
  const [text, setText] = useState<string>('');
  // Режим редактирования комментария.
  const [isModeEdit, setIsModeEdit] = useState<boolean>(false);
  // id комментария, который сейчас редактируется.
  const [idCommentForEdit, setIdCommentForEdit] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Может ли пользователь удалять любые комментарии.
  const hasPermissionForDelete = useHasAccess('delete.comment');

  const { commentsCurrent, setTrigger } = useGetComments({ comments, document, idUserDB });

  // Установка/снятие лайка для комментария.
  const likeComment = async (commentId: string) => {
    try {
      await setLike(commentId);
      setTrigger(true);
    } catch (error) {
      toast.error('Ошибка при установке лайка');
    }
  };

  const handlerSubmit = async () => {
    // Удаление пробелов в начале и в конце текста.
    const trimmedText = text.trim();
    // Если комментарий пустой, то не отправлять на сервер.
    if (trimmedText.length === 0) {
      return;
    }

    try {
      const response = await saveComment({ text, document, isModeEdit, idCommentForEdit });

      // При удачном сохранении нового комментария обновляются все комментарии
      if (response.isSaved) {
        setTrigger(true);
        setText('');
        setIsModeEdit(false);
        setIdCommentForEdit(null);
        localStorage.removeItem(`${lcSuffixComment}${document.type}`);
      }
    } catch (error) {
      toast.error('Ошибка при сохранении комментария');
    }
  };

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

    try {
      const res = await deleteComment(idComment);
      if (res.ok) {
        setTrigger(true);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error('Ошибка при удалении комментария');
    }
  };

  // Запуск редактирования комментария.
  const handlerEditComment = (idComment: string, textFromComment: string) => {
    setText(textFromComment);
    setIsModeEdit(true);
    setIdCommentForEdit(idComment);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

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

                  {/* Удаление/редактирование комментария */}
                  <div className={styles.control__mobile}>
                    {userId === comment.author.id && (
                      <button
                        className={styles.btn__control}
                        onClick={() => handlerEditComment(comment._id, comment.text)}
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
                        getClick={() => likeComment(comment._id)}
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

      {idUserDB && (
        <FormComment
          text={text}
          setText={setText}
          handlerSubmit={handlerSubmit}
          type={document.type}
          isModeEdit={isModeEdit}
          textareaRef={textareaRef}
        />
      )}
    </div>
  );
}
