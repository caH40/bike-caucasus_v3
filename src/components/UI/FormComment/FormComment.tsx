import TextareaAutosize from 'react-textarea-autosize';

import Button from '../Button/Button';
import styles from './FormComment.module.css';
import { type Dispatch, type SetStateAction, useEffect, RefObject } from 'react';
import { lcSuffixComment } from '@/constants/local-storage';

type Props = {
  // eslint-disable-next-line no-unused-vars
  handlerSubmit: () => void;
  type: 'news' | 'trail';
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  isModeEdit: boolean; // Режим редактирования комментария.
  textareaRef: RefObject<HTMLTextAreaElement>;
};

export default function FormComment({
  text,
  setText,
  handlerSubmit,
  type,
  isModeEdit,
  textareaRef,
}: Props) {
  // Инициализация текста, сохраненного в Локальном хранилище.
  useEffect(() => {
    const textFromLS = localStorage.getItem(`${lcSuffixComment}${type}`) || '';
    setText(textFromLS);
  }, [type, setText]);

  // Сохранение текста в Локальном хранилище. При редактировании (isModeEdit=true)
  // не сохранять в Локальное хранилище.
  useEffect(() => {
    if (text === '' || isModeEdit) {
      return;
    }
    localStorage.setItem(`${lcSuffixComment}${type}`, text);
  }, [text, type, isModeEdit]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handlerSubmit();
      }}
      className={styles.form}
    >
      <TextareaAutosize
        value={text}
        className={styles.textarea}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handlerSubmit();
          }
        }}
        ref={textareaRef}
      ></TextareaAutosize>
      <Button
        name={isModeEdit ? 'Сохранить' : 'Отправить'}
        theme="green"
        disabled={text.trim().length === 0}
      />
    </form>
  );
}
