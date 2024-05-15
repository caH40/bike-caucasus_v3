import { useState, useEffect } from 'react';

import {
  SCREEN_SM,
  SCREEN_MD,
  SCREEN_LG,
  SCREEN_XL,
  SCREEN_XXL,
} from '@/constants/breakpoints';

export const useResize = () => {
  const [width, setWidth] = useState<number>(1000);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Вызываем функцию handleResize при монтировании компонента,
    // чтобы установить начальное значение ширины
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width,
    isScreenSm: width >= SCREEN_SM,
    isScreenMd: width >= SCREEN_MD,
    isScreenLg: width >= SCREEN_LG,
    isScreenXl: width >= SCREEN_XL,
    isScreenXxl: width >= SCREEN_XXL,
  };
};
