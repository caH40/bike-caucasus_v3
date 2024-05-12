import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  ListObjectsCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';

import { CloudConfig } from '@/configs/clouds';
import { convertBytesTo } from '@/libs/utils/handler-data';

// название сконфигурированных облаков
type Clouds = 'vk';

/**
 * Работа с облаком используя aws sdk.
 */
export class Cloud {
  private config: S3ClientConfig;
  private s3: S3Client;

  maxSizeFileInMBytes: number;

  constructor(cloudName: Clouds, maxSizeFileInMBytes?: number) {
    // Получение соответствующего конфигурацию для облака "cloudName".
    const cloudConfig = new CloudConfig();
    const config = cloudConfig.get(cloudName);
    this.maxSizeFileInMBytes = maxSizeFileInMBytes || 7;

    if (!config) {
      throw new Error('Нет конфигурации для запрашиваемого облака');
    }

    this.config = config;
    this.s3 = new S3Client(this.config);
  }

  /**
   * Сохранение файла в облаке
   * @param cloudName название облака ("vk")
   * @param file сохраняемый файл в формате File
   * @param fileName название файла с расширением, по умолчанию берется из входного параметра file
   */
  public async saveFile(file: File, bucketName: string, fileName?: string) {
    if (!file || !bucketName) {
      throw new Error('Переданы не все обязательные параметры');
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // проверка на максимальный разрешенный размер загружаемого файла
    const sizeFileInMBytes = convertBytesTo(file.size, 'mB');
    if (sizeFileInMBytes > this.maxSizeFileInMBytes) {
      throw new Error(`Размер файла не должен превышать ${this.maxSizeFileInMBytes} МБайт`);
    }

    //
    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Body: buffer,
      Key: fileName ?? file.name,
      ContentType: file.type,
      ACL: 'public-read', // Установка общедоступного доступа
    };

    const command = new PutObjectCommand(params);
    const response = await this.s3.send(command);
    return response.$metadata;
  }

  /**
   * Удаляет указанный файл из заданного ведра (bucket) в облаке.
   * @param bucketName - Имя ведра (bucket) в облаке.
   * @param fileName - Имя файла, который нужно удалить.
   * @returns Объект с информацией об успешном выполнении или ошибке удаления файла.
   */
  public async deleteFile(
    bucketName: string,
    fileName: string
  ): Promise<{ ok: boolean; message: string }> {
    try {
      // Создание параметров для команды удаления файла.
      const params: DeleteObjectCommandInput = {
        Bucket: bucketName,
        Key: fileName,
      };

      // Создание команды удаления файла.
      const deleteCommand = new DeleteObjectCommand(params);

      // Отправка команды удаления файла в S3.
      await this.s3.send(deleteCommand);

      return { ok: true, message: 'Файл удален из облака' };
    } catch (error) {
      return { ok: false, message: 'Ошибка при удалении файла из облака' };
    }
  }

  /**
   * Удаляет все объекты с заданным префиксом из указанного ведра (bucket) в облаке.
   * @param bucketName - Имя ведра (bucket) в облаке.
   * @param prefix - Префикс (путь) к объектам, которые нужно удалить.
   * @returns Объект с информацией об успешном выполнении или ошибке удаления файлов.
   */
  public async deleteFiles(
    bucketName: string,
    prefix: string
  ): Promise<{ ok: boolean; message: string }> {
    try {
      // Создаем параметры запроса для получения списка объектов с заданным префиксом
      const params = {
        Bucket: bucketName, // Имя ведра (bucket) в облаке
        Prefix: prefix, // Префикс (путь) к объектам, которые нужно удалить
      };

      // Создаем команду для получения списка объектов с заданным префиксом
      const listObjectsCommand = new ListObjectsCommand(params);

      // Отправляем запрос для получения списка объектов с заданным префиксом
      const listObjects = await this.s3.send(listObjectsCommand);

      // Получаем список объектов (если он не пустой)
      const contents = listObjects.Contents;
      // Удаляем объекты с заданным ключом (именем файла)
      if (contents && !!contents.length) {
        for (const object of contents) {
          if (!object.Key) {
            continue; // Пропускаем объект, если у него нет ключа (имени файла)
          }
          await this.deleteFile(bucketName, object.Key);
        }
      }

      return { ok: true, message: 'Файлы удалены из облака' };
    } catch (error) {
      return { ok: false, message: 'Ошибка при удалении файлов из облака' };
    }
  }
}
