'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Страница когда задан несуществующий путь (адрес страницы)
 */
export default function Page404() {
  const pathWrong = usePathname();

  const urlServerFront = process.env.NEXT_PUBLIC_SERVER_FRONT;

  return (
    <div className="page404">
      <h1 className="page404__title">Ошибка 404</h1>
      <p>
        Мы не смогли найти страницу{' '}
        <span className="page404__link-wrong">{`${urlServerFront}${pathWrong}`}</span>
      </p>
      <p>Не расстраивайтесь, у нас много других интересных страниц!</p>
      <Link href="/" className="page404__link">
        на главную страницу
      </Link>
    </div>
  );
}
