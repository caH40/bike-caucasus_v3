import { join, resolve } from 'path';

export const myPath = {
  /**
   * Получение path до папки пользователя в uploads
   * @param id id профиля пользователя на сайте
   */
  getProfileUploads(id: number | string): string {
    const rootDir = resolve(process.cwd());
    return join(rootDir, `/public/uploads/profiles/user_${id}`);
  },
};
