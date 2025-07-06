import styles from './Requisites.module.css';

type Props = {};

/**
 * Реквизиты владельца сайта (самозанятого).
 */
export default function Requisites({}: Props) {
  return (
    <section className={styles.wrapper}>
      <h4 className={styles.title}>Реквизиты</h4>

      <div className={styles.group}>
        <h4 className={styles.subtitle}>Юридическая информация</h4>
        <p>Самозанятый Бережнев Александр Викторович</p>
        <p>Налог на профессиональный доход (НПД)</p>
        <p>ИНН: 263212036872</p>
      </div>

      <address className={styles.list}>
        <h4 className={styles.subtitle}>Контакты</h4>
        <p>
          Телефон:{' '}
          <a href="tel:+79283708303" className={styles.link}>
            +7 928 370 83 03
          </a>
        </p>
        <p>
          Email:{' '}
          <a href="mailto:berezhnev-av@yandex.ru" className={styles.link}>
            berezhnev-av@yandex.ru
          </a>
        </p>
      </address>
    </section>
  );
}
