import Image from 'next/image';
import styles from './ButtonIconAuth.module.css';
import { signIn } from 'next-auth/react';

type Props = {
  provider: string;
  iconSrc: string;
  callbackUrl: string;
  size?: number;
};

export default function ButtonIconAuth({ provider, iconSrc, callbackUrl, size = 24 }: Props) {
  const getAuth = () => {
    signIn(provider, { callbackUrl });
  };
  return (
    <button className={styles.btn}>
      <Image width={size} height={size} alt={provider} src={iconSrc} onClick={getAuth} />
    </button>
  );
}
