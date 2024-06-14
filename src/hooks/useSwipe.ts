import { TouchEvent, useState } from 'react';

type Props = {
  getSwipeLeft: () => void;
  getSwipeRight: () => void;
};

/**
 * Хук свайпа по горизонтали.
 * Влево: выполняется функция getSwipeLeft
 * Вправо: выполняется функция getSwipeRight
 */
export function useSwipe({ getSwipeLeft, getSwipeRight }: Props) {
  const [touchStart, setTouchStart] = useState<number | null>(null); // Начало прикосновение к экрану.
  const [touchEnd, setTouchEnd] = useState<number | null>(null); // Конец прикосновение к экрану.

  // Обработчик начала касания, сохраняет начальную позицию касания по оси X.
  const handlerTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  // Обработчик движения касания, обновляет конечную позицию касания по оси X.
  const handlerTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Обработчик окончания касания, вычисляет дистанцию и вызывает соответствующую функцию.
  const handlerTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      return;
    }
    // Вычисление дистанции свайпа.
    const distanceX = touchStart - touchEnd;
    // Минимальная дистанция для распознавания свайпа.
    const distanceMinXForSwipe = 100;

    if (distanceX > distanceMinXForSwipe) {
      getSwipeLeft(); // Свайп влево
    } else if (distanceX < -distanceMinXForSwipe) {
      getSwipeRight(); // Свайп вправо
    }
  };

  // Возвращаем обработчики для использования в компоненте.
  return { handlerTouchStart, handlerTouchMove, handlerTouchEnd };
}
