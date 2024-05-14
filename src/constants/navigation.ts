// навигация по страницам
export const navLinksFull = [
  { id: 0, name: 'Главная', href: '/' },
  { id: 1, name: 'Вебкамеры', href: '/webcam' },
  { id: 2, name: 'Маршруты', href: '/trails' },
  { id: 3, name: 'Галерея', href: '/gallery' },
  { id: 4, name: 'Джилы-Су', href: '/dzhilsu' },
  { id: 5, name: 'Админ', href: '/admin' },
];
export const navLinksDesktop = navLinksFull.filter(
  (link) => link.name !== 'Вебкамеры' && link.name !== 'Админ'
);
