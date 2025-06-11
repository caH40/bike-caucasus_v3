import { Types, UpdateQuery } from 'mongoose';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';

import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import { CategoriesModel } from '@/database/mongodb/Models/Categories';
import { deserializeCategories } from '@/libs/utils/deserialization/categories';

// types
import type {
  ServerResponse,
  TDeserializedCategories,
  TGender,
  TServiceEntity,
} from '@/types/index.interface';
import { RaceModel } from '@/database/mongodb/Models/Race';
import { TCategories } from '@/types/models.interface';
import { RaceRegistrationModel } from '@/database/mongodb/Models/Registration';
import { ModeratorActionLogService } from './ModerationActionLog';

/**
 * Класс работы с сущностью Категории чемпионата.
 */
export class ChampionshipCategories {
  private errorLogger;
  private handlerErrorDB;
  private entity: TServiceEntity;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.entity = 'championshipCategories';
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
    moderator,
  }: {
    dataSerialized: FormData;
    championshipId: string;
    moderator: string;
  }): Promise<ServerResponse<null>> {
    try {
      // Десериализованные данные с клиента.
      const { categoriesConfigs, client } = deserializeCategories(dataSerialized);

      // Проверка на дубликаты названий пакетов категорий.
      this.validateUniqueCategoryNames(categoriesConfigs);

      // Получаем все существующие пакеты категорий (кроме 'Стандартный') для текущего чемпионата.
      const oldCategories = await CategoriesModel.find(
        { championship: championshipId, name: { $ne: 'Стандартный' } },
        { _id: true }
      ).lean<{ _id: Types.ObjectId }[]>();

      // Сохраняем _id обновлённых пакетов.
      const updatedIds = new Set<string>();

      for (const config of categoriesConfigs) {
        if (config._id) {
          // Обновляем существующий пакет по _id.
          const update: UpdateQuery<TCategories> = {
            $set: { ...config, championship: championshipId },
          };
          // Если skillLevel === undefined, значит необходимо удалить из документа БД.
          if (config.skillLevel === undefined) {
            update.$unset = { skillLevel: '' };
          }

          await CategoriesModel.updateOne({ _id: config._id }, update);
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
      const championship = await ChampionshipModel.findOneAndUpdate(
        { _id: championshipId },
        { $set: { categoriesConfigs: [...updatedIds] } }
      );

      if (!championship) {
        throw new Error(
          `Не найден чемпионат в котором обновляются категории с _id: ${championshipId}`
        );
      }

      // Удаляем те пакеты, _id которых не было среди обновлённых.
      const toDelete = oldCategories
        .filter((cat) => !updatedIds.has(cat._id.toString()))
        .map((c) => c._id);

      // Проверка на использование удаляемых пакетов категорий в заездах. При наличии таких заездов, замена удаляемых _id на _id стандартного пакета категорий.
      await this.replaceDeletedCategoryConfigInRaces({ categoryIds: toDelete, championshipId });

      // Обнуление skillLevel категорий в регистрациях, названия которых изменились или были удалены в конфигурациях категорий.
      for (const categoriesConfig of categoriesConfigs) {
        await this.resetInvalidCategorySkillLevels(categoriesConfig);
      }

      // Удаление документов Categories из БД, которые были удалены на клиенте.
      if (toDelete.length > 0) {
        await CategoriesModel.deleteMany({
          _id: { $in: toDelete },
        });
      }

      // Логирование действия.
      await ModeratorActionLogService.create({
        moderator: moderator,
        changes: {
          description: `Обновление всех конфигураций категорий чемпионата "${championship.name}"`,
          params: {
            dataSerialized: {
              description: 'Данные в FormData',
              fromFormData: categoriesConfigs,
            },
            championshipId,
            moderator,
          },
        },
        action: 'update',
        entity: this.entity,
        entityIds: [...updatedIds],
        client,
      });

      return { data: null, ok: true, message: 'Пакеты категорий успешно обновлены.' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Метод сбрасывает (null) категорию skillLevel у зарегистрированных участников заезда (если участник выбрал skillLevel категорию) при удалении или изменении названия skillLevel категории.
   * Для male и female необходимо делать отдельную проверку, так как названия skillLevel для f,m могут совпадать.
   */
  private async resetInvalidCategorySkillLevels(
    categories: TDeserializedCategories
  ): Promise<void> {
    try {
      // Запрос на все заезды, которые используют данную конфигурацию категорий.
      const racesDB = await RaceModel.find({ categories: categories._id }, { _id: true }).lean<
        { _id: Types.ObjectId }[]
      >();

      // Создание массивов названий skillLevel для male, female
      const maleSkillLevelNames: string[] =
        categories.skillLevel?.male.map((c) => c.name) || [];
      const femaleSkillLevelNames: string[] =
        categories.skillLevel?.female.map((c) => c.name) || [];

      if (maleSkillLevelNames.length === 0 && femaleSkillLevelNames.length === 0) {
        return;
      }

      const RaceRegistrationDB = await RaceRegistrationModel.find(
        {
          race: { $in: racesDB.map(({ _id }) => _id) },
          categorySkillLevel: { $exists: true, $ne: null },
        },
        { _id: true, rider: true, categorySkillLevel: true }
      )
        .populate({ path: 'rider', select: ['person.gender', '-_id'] })
        .lean<
          {
            _id: Types.ObjectId;
            rider: { person: { gender: TGender } };
            categorySkillLevel: string;
          }[]
        >();

      // Массив _id регистраций в которых необходимо установить categorySkillLevel: null.
      const raceRegIds: Types.ObjectId[] = RaceRegistrationDB.filter((reg) => {
        return reg.rider.person.gender === 'male'
          ? !maleSkillLevelNames.includes(reg.categorySkillLevel)
          : !femaleSkillLevelNames.includes(reg.categorySkillLevel);
      }).map(({ _id }) => _id);

      // Обнуление categorySkillLevel в регистрациях названия которых больше не существуют.
      if (raceRegIds.length > 0) {
        await RaceRegistrationModel.updateMany(
          { _id: { $in: raceRegIds } },
          { $set: { categorySkillLevel: null } }
        );
      }
    } catch (error) {
      this.errorLogger(error);
    }
  }

  /**
   * Проверка на использование удаляемых пакетов категорий в заездах. При наличии таких заездов, замена удаляемых _id на _id стандартного пакета категорий.
   */
  private async replaceDeletedCategoryConfigInRaces({
    categoryIds,
    championshipId,
  }: {
    categoryIds: Types.ObjectId[];
    championshipId: string;
  }): Promise<void> {
    // Получаем все существующие пакеты категорий (кроме 'Стандартный') для текущего чемпионата.
    const defaultCategories = await CategoriesModel.findOne(
      { championship: championshipId, name: 'Стандартный' },
      { _id: true }
    ).lean<{ _id: Types.ObjectId }>();

    if (!defaultCategories) {
      throw new Error(
        `Не найдена стандартная конфигурация категорий для чемпионата _id: ${championshipId}`
      );
    }

    // Обновление id конфигурации категорий во всех заезда данного чемпионата на "Стандартный", при удалении конфигурации категорий (categoryIds).
    await RaceModel.updateMany(
      { championship: championshipId, categories: { $in: categoryIds } },
      { $set: { categories: defaultCategories._id } }
    );
  }

  /**
   * Проверяет уникальность названий пакетов категорий.
   * @param categoriesConfigs Массив конфигураций категорий.
   */
  private validateUniqueCategoryNames(categoriesConfigs: Array<{ name: string }>): void {
    const names = new Set<string>();

    for (const config of categoriesConfigs) {
      if (names.has(config.name.toLowerCase())) {
        throw new Error(
          `Название пакета категорий должно быть уникальным. Дублируется название: "${config.name}"`
        );
      }
      names.add(config.name.toLowerCase());
    }
  }
}
