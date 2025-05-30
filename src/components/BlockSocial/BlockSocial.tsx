import Image from 'next/image';

import styles from './BlockSocial.module.css';
import { TSocial } from '@/types/models.interface';

type Props = {
  /**
   * Объект, содержащий ссылки на социальные сети.
   * Ключи объекта представляют названия социальных сетей, значения - соответствующие ссылки.
   */
  social: TSocial;
};

/**
 * Компонент для отображения блока социальных сетей.
 * @param {Props} Props - Пропсы компонента.
 * @returns {JSX.Element} Элемент блока социальных сетей.
 */
export default function BlockSocial({ social: socialObj }: Props): JSX.Element {
  // Создание массива для отрисовки и фильтрация пустых ссылок на социальные сети.
  const socials = (Object.keys(socialObj) as (keyof TSocial)[])
    .map((key, index) => ({
      id: index,
      name: key,
      href: socialObj[key],
    }))
    .filter((elm) => elm.href);

  return (
    <div className={styles.wrapper}>
      {/* Отображение ссылок на социальные сети с помощью компонента изображения */}
      {socials.map((social) => (
        <a href={social.href} key={social.id} target={'_blank'} rel={'noreferrer'}>
          <Image
            width={26}
            height={26}
            src={`/images/icons/${social.name}.svg`}
            alt={social.name}
          />
        </a>
      ))}
    </div>
  );
}
