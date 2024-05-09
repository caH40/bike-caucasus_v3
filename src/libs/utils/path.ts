import { join, resolve } from 'path';

export const myPath = {
  /**
   * Получение path до папки пользователя в uploads
   * @param id id профиля пользователя на сайте
   */
  getProfileUploads(id: number | string): { absolute: string; relative: string } {
    const rootDir = resolve(process.cwd());
    const relative = `/public/uploads/profiles/user_${id}`;
    const absolute = join(rootDir, relative);

    return { absolute, relative };
  },
};
