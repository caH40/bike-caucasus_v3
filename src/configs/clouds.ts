import { S3ClientConfig } from '@aws-sdk/client-s3';
import { Environment } from './environment';

export class CloudConfig {
  private accessKeyId: string;
  private secretAccessKey: string;
  private region: string;
  private endpoint: string;
  private endpointDomainFromEnv: string;
  private bucketNameFromEnv: string;

  constructor() {
    const env = new Environment();
    const { accessKeyId, secretAccessKey, region, endpoint, endpointDomain, bucketName } =
      env.getCloudVk();

    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.region = region;
    this.endpoint = endpoint;
    this.endpointDomainFromEnv = endpointDomain;
    this.bucketNameFromEnv = bucketName;
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

  get bucketName() {
    return this.bucketNameFromEnv;
  }

  get endpointDomain() {
    return this.endpointDomainFromEnv;
  }

  /**
   * Url файла до название файла, который храниться в Бакете.
   */
  get urlSuffix() {
    return `https://${this.bucketName}.${this.endpointDomain}/`;
  }
}
