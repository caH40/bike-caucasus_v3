import {
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
  private cloudName: string;
  private config: S3ClientConfig;
  maxSizeFileInMBytes: number;

  constructor(cloudName: Clouds, maxSizeFileInMBytes?: number) {
    this.cloudName = cloudName;

    // Получение соответствующего конфигурацию для облака "cloudName".
    const cloudConfig = new CloudConfig();
    const config = cloudConfig.get(cloudName);
    this.maxSizeFileInMBytes = maxSizeFileInMBytes || 5;

    if (!config) {
      throw new Error('Нет конфигурации для запрашиваемого облака');
    }

    this.config = config;
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

    const s3 = new S3Client(this.config);

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

    const response = await s3.send(command);

    return response.$metadata;
  }
}
