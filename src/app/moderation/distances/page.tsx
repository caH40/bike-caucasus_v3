import IconChampionship from '@/components/Icons/IconChampionship';
import Wrapper from '@/components/Wrapper/Wrapper';
import styles from './layout.module.css';

export default function ModerationDistancePage() {
  return (
    <div className={styles.content}>
      <Wrapper hSize={1} title="Управление и настройка Дистанций" Icon={IconChampionship}>
        <h2 className={styles.title}>
          Добро пожаловать на страницу создания и редактирования Дистанций.
        </h2>
        <h3 className={styles.subtitle}>
          Дистанция — это сегмент маршрута, используемый в заездах чемпионата. Дистанция
          создаётся один раз. После создания доступно редактирование в течение недели.
        </h3>

        <section className={styles.section}>
          <h3 className={styles.title__list}>Что включает в себя дистанция:</h3>
          <ol className={styles.list}>
            <li className={styles.item}>
              <strong>Название</strong>: короткое и уникальное название маршрута (например,
              &quot;Гора Орел 12K&quot;).
            </li>
            <li className={styles.item}>
              <strong>Описание</strong>: свободная форма. Можно указать особенности маршрута,
              подводки к подъёму, опасные участки и т.п.
            </li>
            <li className={styles.item}>
              <strong>GPX-трек</strong>: файл или объект маршрута, включающий географические
              точки и высоту. Используется для визуализации и расчётов.
            </li>
            <li className={styles.item}>
              <strong>Длина маршрута</strong>: автоматически рассчитывается из GPX (в метрах).
            </li>
            <li className={styles.item}>
              <strong>Набор высоты</strong>: общий подъём по маршруту (в метрах), также
              рассчитывается автоматически.
            </li>
            <li className={styles.item}>
              <strong>Средний градиент</strong>: средний уклон по маршруту (в процентах).
            </li>
            <li className={styles.item}>
              <strong>Мин. и макс. высота</strong>: крайние точки по высоте на всем маршруте.
            </li>
            <li className={styles.item}>
              <strong>Тип покрытия</strong>: road / gravel / trail / mixed — влияет на сложность
              и стиль прохождения.
            </li>
            <li className={styles.item}>
              <strong>Публичность</strong>: если включено — дистанция доступна для выбора
              другими организаторами.
            </li>
            <li className={styles.item}>
              <strong>Профиль высоты</strong>: создаётся автоматически на сервере и используется
              для отображения графика.
            </li>
          </ol>
        </section>
      </Wrapper>
    </div>
  );
}
