import { type MouseEvent, useState, RefObject } from 'react';
import { toast } from 'sonner';

import type { TNewsBlocksEdit } from '@/types/index.interface';

type Props = {
  refTextArea: RefObject<HTMLTextAreaElement>;
  // eslint-disable-next-line no-unused-vars
  handlerInput: (value: string) => void;
  block: TNewsBlocksEdit;
};

/**
 * Хук заменяет выделенный текс в области textarea на тэг
 * <a href={введенный текст в модальном окне}>{выделенный текст}</a>
 */
export default function useInsertLink({ refTextArea, handlerInput, block }: Props) {
  // Позиции начала и конца выделенного текста.
  const [selectedText, setSelectedText] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  // Вводимый url для тэга <a href={url}>.
  const [url, setUrl] = useState<string>('https://');

  // Обрабатывает выделенный текст, устанавливая selectedText начало и конец выделенного текста.
  const handleSelection = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      !refTextArea?.current ||
      refTextArea.current.selectionStart === refTextArea.current.selectionEnd
    ) {
      toast.error('Необходимо выделить текст, в который будет добавлена ссылка!');
      return;
    }

    // Начало выделенного текста.
    const start = refTextArea.current.selectionStart;
    // Конец выделенного текста.
    const end = refTextArea.current.selectionEnd;

    setSelectedText({ start, end });
    setShowModal(true);
  };

  // const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setUrl(e.target.value);
  // };

  // Обработчик нажатия кнопки Вставить link в модальном окне.
  const handleInsertLink = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { start, end } = selectedText;
    if (url && selectedText) {
      const beginString = block.text.slice(0, start);
      const endString = block.text.slice(end);
      const selected = block.text.slice(start, end);

      // Формирование тэга <a></a>.
      const newText = `${beginString}<a className="link__news" href="${url}">${selected}</a>${endString}`;

      handlerInput(newText);
      setShowModal(false);
      setUrl('');
      setSelectedText({
        start: 0,
        end: 0,
      });
    }
  };

  return { showModal, setShowModal, url, setUrl, handleInsertLink, handleSelection };
}
