import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getComments } from '@/actions/comment';
import type { TCommentDto } from '@/types/dto.types';

type Props = {
  comments: TCommentDto[];
  document: { _id: string; type: 'news' | 'trail' };
  idUserDB?: string;
};

/**
 * Получение актуальных комментариев.
 */
export const useGetComments = ({ comments, document, idUserDB }: Props) => {
  const [commentsCurrent, setCommentsCurrent] = useState<TCommentDto[]>(comments);
  const [trigger, setTrigger] = useState<boolean>(false);

  // Запрос обновленных данных при изменении триггера на true.
  useEffect(() => {
    if (!trigger) {
      return;
    }

    const fetchComments = async () => {
      try {
        const data = await getComments({ document, idUserDB });
        setCommentsCurrent(data);
      } catch (error) {
        toast.error('Ошибка при получении комментариев');
      } finally {
        setTrigger(false);
      }
    };

    fetchComments();
  }, [trigger, document, idUserDB]);

  return { commentsCurrent, setTrigger };
};
