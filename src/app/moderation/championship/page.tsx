import IconChampionship from '@/components/Icons/IconChampionship';
import Wrapper from '@/components/Wrapper/Wrapper';
import styles from './layout.module.css';
import ChampionshipSlotPurchasePanel from '@/components/SlotPurchasePanels/ChampionshipSlotPurchasePanel/ChampionshipSlotPurchasePanel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import ServerErrorMessage from '@/components/ServerErrorMessage/ServerErrorMessage';
import Spacer from '@/components/Spacer/Spacer';
import { getAvailableSlots } from '@/actions/slots';
import { getPriceTier } from '@/actions/price';

const entityName = 'championship';

export default async function ModerationChampionshipPage() {
  const session = await getServerSession(authOptions);

  const { id, name, email, idDB } = session?.user || {};

  if (isNaN(Number(id)) || !idDB) {
    return <ServerErrorMessage message={'Не получен userId!'} />;
  }

  if (!email) {
    return (
      <ServerErrorMessage
        message={
          'Для продолжения работы необходимо указать email в вашем профиле. Пожалуйста, добавьте email-адрес.'
        }
      />
    );
  }

  const availableSlots = await getAvailableSlots({ entityName, userDBId: idDB });

  if (!availableSlots.ok || !availableSlots.data) {
    return <ServerErrorMessage message={availableSlots.message} />;
  }

  const priceTier = await getPriceTier({ entityName });

  if (!priceTier.ok || !priceTier.data) {
    return <ServerErrorMessage message={priceTier.message} />;
  }

  return (
    <div className={styles.content}>
      <Wrapper hSize={1} title="Управление и настройка Чемпионатов" Icon={IconChampionship}>
        <h2 className={styles.title}>
          Добро пожаловать на страницу создания и редактирования Чемпионатов (соревнований)
        </h2>

        <Spacer margin="b-sm">
          <ChampionshipSlotPurchasePanel
            user={{ userId: Number(id), fullName: `${name}`, email: email }}
            availableSlots={availableSlots.data.availableSlots}
            priceTier={priceTier.data.tiers}
          />
        </Spacer>

        <h3 className={styles.subtitle}>
          Добро пожаловать на страницу управления чемпионатами! Здесь вы можете создавать новые
          чемпионаты или редактировать уже существующие. Чтобы помочь вам быстрее освоиться, вот
          краткое описание доступных возможностей:
        </h3>

        <section className={styles.section}>
          <h3 className={styles.title__list}>Создание нового чемпионата</h3>
          <ol className={styles.list}>
            <li className={styles.item}>
              <strong>Название</strong>: Введите уникальное название для вашего чемпионата. Оно
              должно быть легко узнаваемым и отражать суть мероприятия.
            </li>
            <li className={styles.item}>
              <strong>Описание</strong>: Опишите ваш чемпионат, включая важную информацию, такую
              как место старта. Подробное описание поможет участникам лучше понять формат и
              особенности вашего чемпионата.
            </li>
            <li className={styles.item}>
              <strong>Дата начала и окончания</strong>: Укажите точные даты и время начала и
              окончания чемпионата. Если чемпионат состоит из нескольких этапов, укажите дату
              первого и последнего этапов.
            </li>

            <li className={styles.item}>
              <strong>Статус</strong>: Статус чемпионата, меняется автоматически и может быть:
              <ul className={styles.list__ul}>
                <li className={styles.item}>
                  <strong>Upcoming (Предстоящий)</strong>: Чемпионат еще не начался.
                </li>
                <li className={styles.item}>
                  <strong>Ongoing (Идет)</strong>: Чемпионат в разгаре.
                </li>
                <li className={styles.item}>
                  <strong>Completed (Завершен)</strong>: Чемпионат завершился.
                </li>
                <li className={styles.item}>
                  <strong>Cancelled (Отменен)</strong>: Чемпионат был отменен.
                </li>
              </ul>
            </li>

            <li className={styles.item}>
              <strong>Тип чемпионата</strong>: Укажите тип чемпионата (например, Тур, Серия,
              Отдельный заезд).
            </li>

            <li className={styles.item}>
              <strong>Тип велосипеда</strong>: Выберите тип велосипеда, используемого в
              чемпионате (например, ТТ, горный, шоссейный, даунхильный).
            </li>

            <li className={styles.item}>
              <strong>Родительская страница</strong>: Если ваш чемпионат включает несколько
              этапов, то создайте сначала родительскую (общую) страницу.
            </li>

            <li className={styles.item}>
              <strong>Дочерние страницы</strong>: Если ваш чемпионат является этапом большого
              события, укажите ссылку на родительский чемпионат.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h3 className={styles.title__list}>Редактирование существующего чемпионата</h3>
          <ol className={styles.list}>
            <li className={styles.item}>
              <strong>Модераторы</strong>: Создавать/редактировать/удалять чемпионаты может
              создатель Организатора, а также пользователи, которых создатель Организатора
              добавил в модераторы Организатора. Пользователь может модерировать чемпионаты
              только одного Организатора!
            </li>
            <li className={styles.item}>
              <strong>Обновление информации</strong>: Вы можете изменять все указанные поля,
              чтобы поддерживать информацию о чемпионате актуальной. Если статус чемпионата
              завершен, или отменён, то редактирование данных блокируется.
            </li>
            <li className={styles.item}>
              <strong>Сохранение изменений</strong>: Не забудьте сохранить внесенные изменения
              после редактирования.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h3 className={styles.title__list}>Дополнительные возможности</h3>
          <ul className={styles.list__ul}>
            <li className={styles.item}>
              <strong>Просмотр списка чемпионатов</strong>: Ознакомьтесь с полным списком
              созданных вами чемпионатов и легко находите нужные.
            </li>
            <li className={styles.item}>
              <strong>Поиск и фильтрация</strong>: Используйте инструменты поиска и фильтрации
              для быстрого доступа к конкретным чемпионатам.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <p>
            Эта страница предоставляет все необходимые инструменты для эффективного управления
            чемпионатами. Если у вас возникнут вопросы или потребуется помощь, пожалуйста,
            обратитесь в нашу службу поддержки.{' '}
            <a href="mailto: support@bike-caucasus.ru" className="link__news">
              support@bike-caucasus.ru
            </a>
          </p>
        </section>
      </Wrapper>
    </div>
  );
}
