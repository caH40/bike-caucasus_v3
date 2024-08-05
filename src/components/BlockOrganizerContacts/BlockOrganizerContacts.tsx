import IconEmail from '../Icons/IconEmail';
import type { TDtoOrganizer } from '@/types/dto.types';
import styles from './BlockOrganizerContacts.module.css';
import IconPhone from '../Icons/IconPhone';
import IconWWW from '../Icons/IconWWW';
import IconTelegram from '../Icons/IconTelegram';
import IconVk from '../Icons/IconVk';

type Props = { organizer: TDtoOrganizer };

/**
 * Блок-заголовок для страницы Организатора Чемпионатов.
 */
export default function BlockOrganizerContacts({ organizer }: Props) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Контакты</h2>

      <div className={styles.block__contacts}>
        {organizer.contactInfo.email && (
          <div className={styles.box__contacts}>
            <IconEmail squareSize={20} />
            <a className={styles.link} href={`mailto:${organizer.contactInfo.email}`}>
              {organizer.contactInfo.email}
            </a>
          </div>
        )}

        {organizer.contactInfo.phone && (
          <div className={styles.box__contacts}>
            <IconPhone squareSize={20} />
            <a className={styles.link} href={`tel:${organizer.contactInfo.phone}`}>
              {organizer.contactInfo.phone}
            </a>
          </div>
        )}

        {organizer.contactInfo.website && (
          <div className={styles.box__contacts}>
            <IconWWW squareSize={20} />
            <a
              className={styles.link}
              href={organizer.contactInfo.website}
              rel={'noopener noreferrer'}
              target="_blank"
            >
              {organizer.contactInfo.website.length > 25
                ? 'Сайт организатора'
                : organizer.contactInfo.website}
            </a>
          </div>
        )}

        {organizer.contactInfo.socialMedia?.telegram && (
          <div className={styles.box__contacts}>
            <IconTelegram squareSize={20} />

            <a
              className={styles.link}
              href={organizer.contactInfo.socialMedia?.telegram}
              rel={'noopener noreferrer'}
              target="_blank"
            >
              {organizer.contactInfo.socialMedia?.telegram}
            </a>
          </div>
        )}

        {organizer.contactInfo.socialMedia?.telegramGroup && (
          <div className={styles.box__contacts}>
            <IconTelegram squareSize={20} />
            <a
              className={styles.link}
              href={organizer.contactInfo.socialMedia?.telegramGroup}
              rel={'noopener noreferrer'}
              target="_blank"
            >
              {organizer.contactInfo.socialMedia?.telegramGroup}
            </a>
          </div>
        )}

        {organizer.contactInfo.socialMedia?.vk && (
          <div className={styles.box__contacts}>
            <IconVk squareSize={20} />
            <a
              className={styles.link}
              href={organizer.contactInfo.socialMedia?.vk}
              rel={'noopener noreferrer'}
              target="_blank"
            >
              {organizer.contactInfo.socialMedia?.vk}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
