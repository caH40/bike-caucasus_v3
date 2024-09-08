import { ObjectId } from 'mongoose';

import { errorLogger } from '@/errors/error';
import { handlerErrorDB } from './mongodb/error';
import { connectToMongo } from '@/database/mongodb/mongoose';
import { deserializationResultRaceRider } from '@/libs/utils/deserialization/resultRaceRider';
import { ResultRaceModel } from '@/database/mongodb/Models/ResultRace';
import { ChampionshipModel } from '@/database/mongodb/Models/Championship';
import { User as UserModel } from '@/database/mongodb/Models/User';
import { dtoResultsRace } from '@/dto/results-race';
import { ResponseServer, TResultRaceFromDB } from '@/types/index.interface';
import { TResultRaceDto } from '@/types/dto.types';
import { getCategoryAge } from '@/libs/utils/age-category';
import { TRace, TResultRaceDocument } from '@/types/models.interface';
import { calculateAverageSpeed, sortCategoriesString } from '@/libs/utils/championship';

/**
 * Сервис работы с результатами заезда Чемпионата.
 */
export class ResultRaceService {
  private errorLogger;
  private handlerErrorDB;
  private dbConnection: () => Promise<void>;

  constructor() {
    this.errorLogger = errorLogger;
    this.handlerErrorDB = handlerErrorDB;
    this.dbConnection = connectToMongo;
  }

  public async getOne(): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      return { data: null, ok: true, message: 'Данные заезда Чемпионата' };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Добавление результата райдера в Заезде Чемпионата в протокол.
   */
  public async post({
    dataFromFormSerialized,
    creatorId,
  }: {
    dataFromFormSerialized: FormData;
    creatorId: string;
  }): Promise<ResponseServer<null>> {
    try {
      const dataDeserialized = deserializationResultRaceRider(dataFromFormSerialized);

      if (!dataDeserialized.lastName) {
        throw new Error('Отсутствует фамилия');
      } else if (!dataDeserialized.firstName) {
        throw new Error('Отсутствует имя');
      } else if (!dataDeserialized.yearBirthday || +dataDeserialized.yearBirthday === 0) {
        throw new Error('Отсутствует год рождения');
      } else if (!dataDeserialized.timeDetailsInMilliseconds) {
        throw new Error('Отсутствует финишное время');
      }

      // Подключение к БД.
      await this.dbConnection();

      // const res = await ChampionshipModel.findOneAndUpdate(
      //   {
      //     _id: dataDeserialized.championshipId,
      //     'races.number': dataDeserialized.raceNumber,
      //   },
      //   {
      //     $set: {
      //       'races.$[race].categoriesAgeFemale': [{ min: 18, max: 200 }],
      //       'races.$[race].categoriesAgeMale': [
      //         { min: 18, max: 39 },
      //         { min: 40, max: 49 },
      //         { min: 50, max: 59 },
      //         { min: 60, max: 200 },
      //       ],
      //     },
      //   },
      //   { arrayFilters: [{ 'race.number': dataDeserialized.raceNumber }] }
      // );

      // Проверка существования Чемпионата с нужным заездом.
      const champDB = await ChampionshipModel.findOne(
        {
          _id: dataDeserialized.championshipId,
          'races.number': dataDeserialized.raceNumber,
        },
        { races: { $elemMatch: { number: dataDeserialized.raceNumber } }, name: true }
      ).lean();

      if (!champDB) {
        throw new Error(
          `Не найден чемпионат с _id:${dataDeserialized.championshipId} и заездом №${dataDeserialized.raceNumber} для добавления финишного результата!`
        );
      }

      // Проверка дублирование результата Райдера в Чемпионате заезда.
      // Проверка по id пользователя на сайте.
      let resultRaceDB = {} as { _id: ObjectId } | null;

      if (dataDeserialized._id) {
        resultRaceDB = await ResultRaceModel.findOne(
          {
            rider: dataDeserialized._id,
            championship: dataDeserialized.championshipId,
            raceNumber: dataDeserialized.raceNumber,
          },
          { _id: true }
        ).lean();
      }

      if (resultRaceDB?._id) {
        throw new Error(
          `Результат райдера bcId:${dataDeserialized.id} существует в протоколе заезда №${dataDeserialized.raceNumber} "${champDB.name}"`
        );
      }

      // Проверка занят или нет стартовый номер у райдера, результат которого вносится в протокол.
      const registrationDB: { profile: { lastName: string; firstName: string } } | null =
        await ResultRaceModel.findOne(
          {
            championship: dataDeserialized.championshipId,
            raceNumber: dataDeserialized.raceNumber,
            startNumber: dataDeserialized.startNumber,
          },
          { 'profile.lastName': true, 'profile.firstName': true }
        ).lean();

      let riderDB = {} as { _id: ObjectId } | null;
      if (dataDeserialized.id) {
        riderDB = await UserModel.findOne({ id: dataDeserialized.id }, { _id: true }).lean();
      }

      if (registrationDB) {
        throw new Error(
          `Данный стартовый номер: ${dataDeserialized.startNumber} уже есть в протоколе у райдера: ${registrationDB.profile.lastName} ${registrationDB.profile.firstName}`
        );
      }

      // Присвоение возрастной категории
      const categoriesAgeMale = champDB.races[0].categoriesAgeMale;
      const categoriesAgeFemale = champDB.races[0].categoriesAgeFemale;
      const isFemale = dataDeserialized.gender === 'female';

      const categoryAge = getCategoryAge({
        yearBirthday: dataDeserialized.yearBirthday,
        categoriesAge: isFemale ? categoriesAgeFemale : categoriesAgeMale,
        gender: isFemale ? 'F' : 'M',
      });

      // Сохранение в БД результата райдера в Заезде Чемпионата.
      await ResultRaceModel.create({
        championship: dataDeserialized.championshipId,
        raceNumber: dataDeserialized.raceNumber,
        startNumber: dataDeserialized.startNumber,
        ...(riderDB && { rider: riderDB._id }),
        profile: {
          firstName: dataDeserialized.firstName,
          lastName: dataDeserialized.lastName,
          ...(dataDeserialized.patronymic && { patronymic: dataDeserialized.patronymic }),
          ...(dataDeserialized.team && { team: dataDeserialized.team }),
          city: dataDeserialized.city,
          yearBirthday: dataDeserialized.yearBirthday,
          gender: dataDeserialized.gender,
        },
        categoryAge,
        ...(dataDeserialized.id && { id: dataDeserialized.id }),
        raceTimeInMilliseconds: dataDeserialized.timeDetailsInMilliseconds,
        creator: creatorId,
      });

      return {
        data: null,
        ok: true,
        message: `Результат райдера "${dataDeserialized.lastName} ${dataDeserialized.firstName}" добавлен в финишный протокол.`,
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Получение протокола заезда чемпионата.
   */
  public async getProtocolRace({
    championshipId,
    raceNumber,
  }: {
    championshipId: string;
    raceNumber: number;
  }): Promise<ResponseServer<{ protocol: TResultRaceDto[]; categories: string[] } | null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Проверка наличия Заезда Чемпионата в БД.
      const champDB = await ChampionshipModel.findOne(
        {
          _id: championshipId,
          'races.number': raceNumber,
        },
        { _id: true, name: true }
      ).lean();

      if (!champDB) {
        throw new Error(
          `Не найден чемпионат с _id:${championshipId} и заездом №${raceNumber} для добавления финишного результата!`
        );
      }

      // Получение результатов заезда raceNumber в чемпионате championshipId.
      const resultsRaceDB: TResultRaceFromDB[] = await ResultRaceModel.find(
        {
          championship: championshipId,
          raceNumber,
        },
        { 'positions._id': false }
      )
        .populate({
          path: 'rider',
          select: ['id', 'image', 'imageFromProvider', 'provider.image', '-_id'],
        })
        .lean();

      // Подготовка данных для клиента.
      const resultsAfterDto = dtoResultsRace(resultsRaceDB);

      // Сортируем по времени заезда.
      const resultsSorted = resultsAfterDto.sort(
        (a, b) => a.raceTimeInMilliseconds - b.raceTimeInMilliseconds
      );

      // Создание списка всех категорий в заезде (категории без результатов не учитываются).
      const categoriesSet = new Set<string>();
      for (const result of resultsAfterDto) {
        categoriesSet.add(result.categoryAge);
      }

      // Сортируем категории по возрастанию года рождения.
      const categoriesSorted = sortCategoriesString([...categoriesSet]);

      return {
        data: { protocol: resultsSorted, categories: categoriesSorted },
        ok: true,
        message: 'Протокол заезда Чемпионата',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }

  /**
   * Обновление возрастных категорий.
   * Обновление финишного протокола заезда чемпионата.
   * Распределение мест в каждой возрастной категории и в абсолюте.
   * !!! проработать исключение дисквалифицированных в обновлении данных.
   * !!! проработать выставление мест для категорий по уровню подготовки. Добавить их в Коллекцию Map.
   */
  public async updateProtocolRace({
    championshipId,
    raceNumber,
  }: {
    championshipId: string;
    raceNumber: number;
  }): Promise<ResponseServer<null>> {
    try {
      // Подключение к БД.
      await this.dbConnection();

      // Проверка и получение данных Заезда Чемпионата.
      const racesInChampDB: { races: TRace[] } | null = await ChampionshipModel.findOne(
        {
          _id: championshipId,
          'races.number': raceNumber,
        },
        { races: { $elemMatch: { number: raceNumber } } }
      ).lean();

      // Данные обрабатываемого заезда.
      const race = racesInChampDB?.races[0];

      if (!racesInChampDB || race?.number !== raceNumber) {
        throw new Error(
          ` Не найден чемпионат с _id:${championshipId} и заездом №${raceNumber}`
        );
      }

      const resultsRaceDB: TResultRaceDocument[] = await ResultRaceModel.find({
        championship: championshipId,
        raceNumber,
      }).lean();

      // Мужские и женские категории в заезде, в котором обновляются данные.
      const categoriesAgeMale = race.categoriesAgeMale;
      const categoriesAgeFemale = race.categoriesAgeFemale;

      // Коллекция всех возрастных категорий и абсолютных категорий в заезде.
      const categoriesInRace = new Map<string, number>([
        ['absolute', 1],
        ['absoluteMale', 1],
        ['absoluteFemale', 1],
      ]);

      // 1. Обновление возрастных категории участникам в результатах Заезда.
      for (const result of resultsRaceDB) {
        // Присвоение возрастной категории
        const isFemale = result.profile.gender === 'female';

        const categoryAge = getCategoryAge({
          yearBirthday: result.profile.yearBirthday,
          categoriesAge: isFemale ? categoriesAgeFemale : categoriesAgeMale,
          gender: isFemale ? 'F' : 'M',
        });

        // Добавление в коллекцию Map возрастных категорий со счетчиком позиций(места на финише), начиная с 1 позиции.
        categoriesInRace.set(categoryAge, 1);

        result.categoryAge = categoryAge;
      }

      // Сортировка всего протокола по финишному времени от меньшего к большему.
      resultsRaceDB.sort((a, b) => a.raceTimeInMilliseconds - b.raceTimeInMilliseconds);

      // 2. Проставление мест в возрастных категориях для мужчин и женщин.
      for (const result of resultsRaceDB) {
        // 2.1. Проставление мест для абсолюта.
        const positionAbsolute = categoriesInRace.get('absolute')!; // Ключ 'absolute' существует так как задает при инициализации Map, поэтому positionAbsolute не может быть undefined.
        // Присваиваем текущее место в категории.
        result.positions.absolute = positionAbsolute;

        // Увеличиваем счётчик мест в этой категории для следующего участника.
        categoriesInRace.set('absolute', positionAbsolute + 1);

        // 2.2. Проставление мест для абсолюта по полу
        if (result.profile.gender === 'female') {
          const positionAbsoluteFemale = categoriesInRace.get('absoluteFemale')!; // Ключ 'absoluteFemale' существует так как задает при инициализации Map, поэтому positionAbsolute не может быть undefined.

          // Присваиваем текущее место в категории.
          result.positions.absoluteGender = positionAbsoluteFemale;
          // Увеличиваем счётчик мест в этой категории для следующего участника.
          categoriesInRace.set('absoluteFemale', positionAbsoluteFemale + 1);
        } else {
          const positionAbsoluteMale = categoriesInRace.get('absoluteMale')!; // Ключ 'absoluteMale' существует так как задает при инициализации Map, поэтому positionAbsolute не может быть undefined.
          // Присваиваем текущее место в категории.
          result.positions.absoluteGender = positionAbsoluteMale;
          // Увеличиваем счётчик мест в этой категории для следующего участника.
          categoriesInRace.set('absoluteMale', positionAbsoluteMale + 1);
        }

        // 2.3. Проставление мест для возрастных категорий.
        const positionAge = categoriesInRace.get(result.categoryAge);
        if (!positionAge) {
          // Если категория не найдена, пропускаем (логическая ошибка).
          continue;
        }
        // Присваиваем текущее место в категории.
        result.positions.category = positionAge;
        // Увеличиваем счётчик мест в этой категории для следующего участника.
        categoriesInRace.set(result.categoryAge, positionAge + 1);

        // 2.4 Расчет средней скорости.
        result.averageSpeed = calculateAverageSpeed(
          race.distance,
          result.raceTimeInMilliseconds
        );
      }

      // Обновление позиций и прочих данных для каждого результата.
      for (const result of resultsRaceDB) {
        await ResultRaceModel.updateOne(
          { _id: result._id },
          {
            $set: {
              'positions.absolute': result.positions.absolute,
              'positions.absoluteGender': result.positions.absoluteGender,
              'positions.category': result.positions.category,
              averageSpeed: result.averageSpeed,
              categoryAge: result.categoryAge,
              // categorySkillLevel: result.categorySkillLevel,
              // averageSpeed: result.averageSpeed,
            },
          }
        );
      }

      return {
        data: null,
        ok: true,
        message:
          'Обновлены возрастные категории и места во всех категориях финишного протокола!',
      };
    } catch (error) {
      this.errorLogger(error);
      return this.handlerErrorDB(error);
    }
  }
}
