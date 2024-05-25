// export { default } from 'next-auth/middleware';

// export const config = {
//   matcher: ['/account/(.*)'],
// };
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const token = req.nextauth.token;

    // Проверка токена и роли в нём.
    if (!token) {
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }

    // Разрешения пользователя, находящиеся в token (включенные в callback ->jwt из бд).
    const userPermissions = token.rolePermissions || [];

    // Для admin открыты все маршруты
    if (userPermissions.includes('all')) {
      return NextResponse.next();
    }

    const pathname = req.nextUrl.pathname;

    // Find a matching path with dynamic path handling
    const path = paths.find((p) => {
      // if (p.path.includes('[id]')) {
      //   // Replace '[id]' with a regex pattern and test the pathname
      //   const regex = new RegExp(`^${p.path.replace('[id]', '\\w+')}$`);
      //   return regex.test(pathname);
      // }
      return p.path === pathname;
    });

    if (!path) {
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }

    const hasPermission = path.permission.some((p) => userPermissions.includes(p));

    if (!hasPermission) {
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }

    return NextResponse.next();
  }
);

export const config = {
  matcher: ['/account', '/account/(.*)', '/moderation', '/moderation/(.*)'],
};

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
    path: '/moderation/news/list',
    permission: ['moderation.news.list'],
  },
  {
    path: '/account',
    permission: ['moderation.account'],
  },
  // {
  //   path: '/products',
  //   permission: ['products.list', 'products.all'],
  // },
  // {
  //   path: '/products/create',
  //   permission: ['products.create', 'products.all'],
  // },
  // {
  //   path: '/products/[id]',
  //   permission: ['products.edit', 'products.view', 'products.delete', 'products.all'],
  // },
];
