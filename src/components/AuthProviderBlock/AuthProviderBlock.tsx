import { signIn } from 'next-auth/react';

import Button from '../UI/Button/Button';
import styles from './AuthProviderBlock.module.css';

type Props = {
  callbackUrl: string;
};

export default function AuthProviderBlock({ callbackUrl }: Props) {
  const getAuth = (provider: string, callbackUrl: string) => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.buttons}>
        <Button
          name="yandex"
          iconSrc="/images/icons/yandex.svg"
          getClick={() => getAuth('yandex', callbackUrl)}
          size={20}
        />
        <Button
          name="vk"
          iconSrc="/images/icons/vk.svg"
          getClick={() => getAuth('vk', callbackUrl)}
          size={20}
        />
        {/* <Button
          iconSrc="/images/icons/gmail.svg"
          getClick={() => getAuth('google', callbackUrl)}
          size={20}
          name="google"
        /> */}
      </div>
    </div>
  );
}
