import { errorLogger } from '@/errors/error';
import { getPlaiceholder } from 'plaiceholder';
import { blurBase64 } from '../image';

/**
 * Делает размытие изображения для placeholder Image (nextjs).
 * @param url - Ссылка на изображение на удаленном сервере.
 * @returns - Размытое изображение в формате base64.
 */
export async function getBlur(url: string | undefined | null): Promise<string> {
  try {
    if (!url) {
      return blurBase64;
    }

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Не получено изображение с url:${url}`);
    }

    const buffer = await res.arrayBuffer();
    const { base64 } = await getPlaiceholder(Buffer.from(buffer));

    return base64;
  } catch (error) {
    errorLogger(error);
    return blurBase64;
  }
}
