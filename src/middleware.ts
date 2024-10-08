import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  // `withAuth` добавляет токен пользователя в запрос.
  function middleware(req) {
    const token = req.nextauth.token;

    // Проверка токена и роли в нём.
    if (!token) {
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }

    // Разрешения пользователя, находящиеся в token (включенные в callback ->jwt из БД).
    const userPermissions = token.rolePermissions || [];

    // Для admin открыты все маршруты.
    if (userPermissions.includes('all')) {
      return NextResponse.next();
    }

    const pathname = req.nextUrl.pathname;

    // Проверка пути с динамическими маршрутами
    const path = paths.find((p) => {
      if (p.path.includes('[urlSlug]')) {
        // Регулярное выражение для обработки динамического маршрута.
        const regex = new RegExp(`^${p.path.replace(/\[urlSlug\]/g, '[\\w-]+')}$`);

        return regex.test(pathname);
      }

      return p.path === pathname;
    });

    if (!path) {
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }

    // Проверка разрешений
    const hasPermission = path.permission.some((p) => userPermissions.includes(p));

    if (!hasPermission) {
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }

    return NextResponse.next();
  }
);

export const config = {
  matcher: [
    '/admin',
    '/admin/(.*)',
    '/account',
    '/account/(.*)',
    '/moderation',
    '/moderation/(.*)',
  ],
};

// Обновлённый список путей с поддержкой динамических маршрутов.
const paths = [
  {
    path: '/moderation',
    permission: ['moderation'],
  },
  {
    path: '/moderation/news/create',
    permission: ['moderation.news.create'],
  },
  {
    path: '/moderation/news/edit',
    permission: ['moderation.news.edit'],
  },
  {
    path: '/moderation/news/edit/[urlSlug]', // Добавляем динамический маршрут
    permission: ['moderation.news.edit'],
  },
  {
    path: '/moderation/news/list',
    permission: ['moderation.news.list'],
  },
  // Доступ к маршрутам
  {
    path: '/moderation/trails',
    permission: ['moderation.trails'],
  },
  {
    path: '/moderation/trails/create',
    permission: ['moderation.trails.create'],
  },
  {
    path: '/moderation/trails/edit',
    permission: ['moderation.trails.edit'],
  },
  {
    path: '/moderation/trails/edit/[urlSlug]', // Добавляем динамический маршрут
    permission: ['moderation.trails.edit'],
  },
  {
    path: '/moderation/trails/list',
    permission: ['moderation.trails.list'],
  },
  // Доступ к чемпионатам.
  {
    path: '/moderation/championship',
    permission: ['moderation.championship'],
  },
  {
    path: '/moderation/championship/create',
    permission: ['moderation.championship.create'],
  },
  {
    path: '/moderation/championship/edit',
    permission: ['moderation.championship.edit'],
  },
  {
    path: '/moderation/championship/edit/[urlSlug]', // Добавляем динамический маршрут
    permission: ['moderation.championship.edit'],
  },
  {
    path: '/moderation/championship/list',
    permission: ['moderation.championship.list'],
  },
  {
    path: '/moderation/championship/protocol',
    permission: ['moderation.championship.protocol'],
  },
  {
    path: '/moderation/championship/protocol/[urlSlug]',
    permission: ['moderation.championship.protocol'],
  },
  {
    path: '/moderation/championship/protocol/[urlSlug]/[urlSlug]',
    permission: ['moderation.championship.protocol'],
  },
  {
    path: '/moderation/organizer',
    permission: ['moderation.organizer'],
  },
  {
    path: '/moderation/organizer/create',
    permission: ['moderation.organizer.create'],
  },
  {
    path: '/moderation/organizer/edit',
    permission: ['moderation.organizer.edit'],
  },
  {
    path: '/account',
    permission: ['authorized'],
  },
  {
    path: '/account/profile',
    permission: ['authorized'],
  },
  {
    path: '/account/team',
    permission: ['authorized'],
  },
  {
    path: '/account/details',
    permission: ['authorized'],
  },
  {
    path: '/admin',
    permission: ['admin'],
  },
  {
    path: '/admin/users',
    permission: ['admin'],
  },
  {
    path: '/admin/logs/admin',
    permission: ['admin'],
  },
  {
    path: '/admin/logs/errors',
    permission: ['admin'],
  },
];
