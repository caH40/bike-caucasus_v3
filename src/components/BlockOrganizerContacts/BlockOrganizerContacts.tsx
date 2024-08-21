import IconEmail from '../Icons/IconEmail';
import styles from './BlockOrganizerContacts.module.css';
import IconPhone from '../Icons/IconPhone';
import IconWWW from '../Icons/IconWWW';
import IconTelegram from '../Icons/IconTelegram';
import IconVk from '../Icons/IconVk';
import { OrganizerContactInfo } from '@/types/models.interface';
import Wrapper from '../Wrapper/Wrapper';

type Props = { organizer: OrganizerContactInfo };

/**
 * Блок-заголовок для страницы Организатора Чемпионатов.
 */
export default function BlockOrganizerContacts({ organizer }: Props) {
  return (
    <Wrapper hSize={2} title="Контакты">
      <div className={styles.block__contacts}>
        {organizer.email && (
          <div className={styles.box__contacts}>
            <IconEmail squareSize={20} />
            <a className={styles.link} href={`mailto:${organizer.email}`}>
              {organizer.email}
            </a>
          </div>
        )}

        {organizer.phone && (
          <div className={styles.box__contacts}>
            <IconPhone squareSize={20} />
            <a className={styles.link} href={`tel:${organizer.phone}`}>
              {organizer.phone}
            </a>
          </div>
        )}

        {organizer.website && (
          <div className={styles.box__contacts}>
            <IconWWW squareSize={20} />
            <a
              className={styles.link}
              href={organizer.website}
              rel={'noopener noreferrer'}
              target="_blank"
            >
              {organizer.website.length > 25 ? 'Сайт организатора' : organizer.website}
            </a>
          </div>
        )}

        {organizer.socialMedia?.telegram && (
          <div className={styles.box__contacts}>
            <IconTelegram squareSize={20} />

            <a
              className={styles.link}
              href={organizer.socialMedia?.telegram}
              rel={'noopener noreferrer'}
              target="_blank"
            >
              {organizer.socialMedia?.telegram}
            </a>
          </div>
        )}

        {organizer.socialMedia?.telegramGroup && (
          <div className={styles.box__contacts}>
            <IconTelegram squareSize={20} />
            <a
              className={styles.link}
              href={organizer.socialMedia?.telegramGroup}
              rel={'noopener noreferrer'}
              target="_blank"
            >
              {organizer.socialMedia?.telegramGroup}
            </a>
          </div>
        )}

        {organizer.socialMedia?.vk && (
          <div className={styles.box__contacts}>
            <IconVk squareSize={20} />
            <a
              className={styles.link}
              href={organizer.socialMedia?.vk}
              rel={'noopener noreferrer'}
              target="_blank"
            >
              {organizer.socialMedia?.vk}
            </a>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
