type TEnvCloudVk = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  endpoint: string;
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

    if (!accessKeyId || !secretAccessKey || !region || !endpoint) {
      throw new Error('Не получены данные конфигурации для vk-cloud');
    }

    return { accessKeyId, secretAccessKey, region, endpoint };
  }
}
