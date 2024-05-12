import { S3ClientConfig } from '@aws-sdk/client-s3';
import { Environment } from './environment';

export class CloudConfig {
  private accessKeyId: string;
  private secretAccessKey: string;
  private region: string;
  private endpoint: string;

  constructor() {
    const env = new Environment();
    const { accessKeyId, secretAccessKey, region, endpoint } = env.getCloudVk();

    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.region = region;
    this.endpoint = endpoint;
    if (!this.accessKeyId) {
      throw new Error('Нет данных');
    }
  }

  /**
   * Конфигурация aws sdk для clouds.
   * Существующие конфигурации: "vk".
   */
  get(cloudName: string): S3ClientConfig | undefined {
    switch (cloudName) {
      case 'vk':
        return {
          credentials: {
            accessKeyId: this.accessKeyId,
            secretAccessKey: this.secretAccessKey,
          },
          endpoint: this.endpoint,
          region: this.region,
          defaultsMode: 'standard',
        };
    }
  }
}
