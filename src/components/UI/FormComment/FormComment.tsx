import TextareaAutosize from 'react-textarea-autosize';

import Button from '../Button/Button';
import styles from './FormComment.module.css';
import { useEffect, useState } from 'react';
import { lcSuffixComment } from '@/constants/local-storage';

type Props = {
  // eslint-disable-next-line no-unused-vars
  handlerSubmit: (text: string) => void;
  target: 'news' | 'trail';
};

export default function FormComment({ handlerSubmit, target }: Props) {
  const [text, setText] = useState<string>('');

  // Инициализация текста, сохраненного в Локальном хранилище.
  useEffect(() => {
    const textFromLS = localStorage.getItem(`${lcSuffixComment}${target}`) || '';
    setText(textFromLS);
  }, [target]);

  // Сохранение текста в Локальном хранилище.
  useEffect(() => {
    if (text === '') {
      return;
    }
    localStorage.setItem(`${lcSuffixComment}${target}`, text);
  }, [text, target]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handlerSubmit(text);
      }}
      className={styles.form}
    >
      <TextareaAutosize
        value={text}
        className={styles.textarea}
        onChange={(e) => setText(e.target.value)}
      ></TextareaAutosize>
      <Button name="Отправить" theme="green" disabled={text.length === 0} />
    </form>
  );
}
