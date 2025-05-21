import { Types } from 'mongoose';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import { CategoriesModel } from '@/database/mongodb/Models/Categories';
import { deserializeCategories } from '@/libs/utils/deserialization/categories';

// types
import type { ResponseServer } from '@/types/index.interface';

/**
 * Класс работы с сущностью Категории Чемпионата.
 */
export class ChampionshipCategories {
  private errorLogger;
  private handlerErrorDB;
  private dbConnection: () => Promise<void>;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.dbConnection = connectToMongo;
  }

  /**
   * Обновление пакетов категорий для чемпионата.
   * Приходит массив пакетов TCategories:
   * 1. Пакет по умолчанию у которого есть _id и он не изменяется и не удаляется (создается при создании чемпионата);
   * 2. Дополнительный(ые) пакеты категорий, если есть несколько заездов в Чемпионате с разными категориями.
   */
  async updateAll({
    dataSerialized,
    championshipId,
  }: {
    dataSerialized: FormData;
    championshipId: string;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      const categoriesConfigs = deserializeCategories(dataSerialized);

      // Проверка на дубликаты названий пакетов категорий.
      this.validateUniqueCategoryNames(categoriesConfigs);

      // Получаем все существующие пакеты категорий (кроме 'default') для текущего чемпионата.
      const oldCategories = await CategoriesModel.find(
        { championship: championshipId, name: { $ne: 'default' } },
        { _id: true }
      ).lean<{ _id: Types.ObjectId }[]>();

      // Сохраняем _id обновлённых пакетов.
      const updatedIds = new Set<string>();

      for (const config of categoriesConfigs) {
        if (config._id) {
          // Обновляем существующий пакет по _id.
          await CategoriesModel.updateOne(
            { _id: config._id },
            { $set: { ...config, championship: championshipId } }
          );
          updatedIds.add(config._id); // Добавляем _id в список обновлённых.
        } else {
          // Создаём новый пакет, если _id нет.
          const created = await CategoriesModel.create({
            ...config,
            championship: championshipId,
          });
          updatedIds.add(created._id.toString()); // Добавляем созданный _id.
        }
      }

      // Обновление categoriesConfigs в Чемпионате.
      await ChampionshipModel.findOneAndUpdate(
        { _id: championshipId },
        { $set: { categoriesConfigs: [...updatedIds] } }
      );

      // Удаляем те пакеты, _id которых не было среди обновлённых.
      const toDelete = oldCategories.filter((cat) => !updatedIds.has(cat._id.toString()));

      if (toDelete.length > 0) {
        await CategoriesModel.deleteMany({
          _id: { $in: toDelete.map((c) => c._id) },
        });
      }

      return { data: null, ok: true, message: 'Пакеты категорий успешно обновлены.' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Проверяет уникальность названий пакетов категорий.
   * @param categoriesConfigs Массив конфигураций категорий.
   */
  private validateUniqueCategoryNames(categoriesConfigs: Array<{ name: string }>): void {
    const names = new Set<string>();

    for (const config of categoriesConfigs) {
      if (names.has(config.name)) {
        throw new Error(
          `Название пакета категорий должно быть уникальным. Дублируется название: "${config.name}"`
        );
      }
      names.add(config.name);
    }
  }
}
