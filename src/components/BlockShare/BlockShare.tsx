'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  VKShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  OKShareButton,
  OKIcon,
} from 'react-share';

import styles from './BlockShare.module.css';

type Props = {
  title?: string;
};

const server = process.env.NEXT_PUBLIC_SERVER_FRONT;

export default function BlockShare({ title }: Props) {
  const path = usePathname();
  const url = server + path;
  return (
    <div className={styles.wrapper}>
      {title && <span className={styles.title}>{title}</span>}

      <TelegramShareButton url={url}>
        <Image width={24} height={24} src={`/images/icons/telegram.svg`} alt={'telegram'} />
      </TelegramShareButton>

      <VKShareButton url={url}>
        <Image width={24} height={24} src={`/images/icons/vk.svg`} alt={'vk'} />
      </VKShareButton>

      <WhatsappShareButton url={url}>
        <WhatsappIcon round={true} size={24} />
      </WhatsappShareButton>

      <OKShareButton url={url}>
        <OKIcon round={true} size={24} />
      </OKShareButton>
    </div>
  );
}
