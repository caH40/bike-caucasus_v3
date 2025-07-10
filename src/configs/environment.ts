type TEnvCloudVk = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  endpoint: string;
  bucketName: string;
  endpointDomain: string;
};

/**
 * Получение данных переменных окружения, их проверка и возвращения в удобном виде.
 */
export class Environment {
  private env: NodeJS.ProcessEnv;

  constructor() {
    const { env } = process;
    if (!env) {
      throw new Error('Нет доступа к переменным окружения');
    }
    this.env = env;
  }

  /**
   * Данные из переменных окружения для Cloud VK  aws-sdk
   */
  public getCloudVk(): TEnvCloudVk {
    const accessKeyId = this.env.VK_AWS_CLOUD_ACCESS_ID;
    const secretAccessKey = this.env.VK_AWS_CLOUD_SECRET_ID;
    const region = this.env.VK_AWS_REGION;
    const endpoint = this.env.VK_AWS_ENDPOINT;
    const bucketName = this.env.VK_AWS_BUCKET_NAME;
    const endpointDomain = this.env.VK_AWS_ENDPOINT_DOMAIN;

    if (
      !accessKeyId ||
      !secretAccessKey ||
      !region ||
      !endpoint ||
      !bucketName ||
      !endpointDomain
    ) {
      throw new Error('Не получены данные конфигурации для vk-cloud');
    }

    return { accessKeyId, secretAccessKey, region, endpoint, bucketName, endpointDomain };
  }

  /**
   * Данные YooKassa.
   */
  getYooKassaConfig() {
    const secretKey = this.env.YOO_SECRET_KEY;
    const shopId = this.env.YOO_SHOP_ID;

    if (!secretKey || !shopId) {
      throw new Error('Не получены данные конфигурации для yookassa');
    }

    return { secretKey, shopId };
  }
}
