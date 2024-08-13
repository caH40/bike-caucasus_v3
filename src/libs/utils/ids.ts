/**
 * Генерация случайного id из символов a-z,A-Z.
 */
export function generateRandomId(length = 8): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomId = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomId += charset[randomIndex];
  }
  return randomId;
}

/**
 * Генерация id из имени файла, или из символов a-z,A-Z.
 */
export function generateIdFromFilename(path: string | undefined): string {
  return path?.split('/').pop()?.split('.')[0] || generateRandomId(4);
}
