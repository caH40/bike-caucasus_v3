import TextareaAutosize from 'react-textarea-autosize';

import Button from '../Button/Button';
import styles from './FormComment.module.css';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { lcSuffixComment } from '@/constants/local-storage';

type Props = {
  // eslint-disable-next-line no-unused-vars
  handlerSubmit: (text: string, setText: Dispatch<SetStateAction<string>>) => void;
  type: 'news' | 'trail';
};

export default function FormComment({ handlerSubmit, type }: Props) {
  const [text, setText] = useState<string>('');

  // Инициализация текста, сохраненного в Локальном хранилище.
  useEffect(() => {
    const textFromLS = localStorage.getItem(`${lcSuffixComment}${type}`) || '';
    setText(textFromLS);
  }, [type]);

  // Сохранение текста в Локальном хранилище.
  useEffect(() => {
    if (text === '') {
      return;
    }
    localStorage.setItem(`${lcSuffixComment}${type}`, text);
  }, [text, type]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handlerSubmit(text, setText);
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
            handlerSubmit(text, setText);
          }
        }}
      ></TextareaAutosize>
      <Button name="Отправить" theme="green" disabled={text.trim().length === 0} />
    </form>
  );
}
