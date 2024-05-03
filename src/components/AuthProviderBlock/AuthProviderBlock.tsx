import ButtonIconAuth from '../UI/ButtonIconAuth/ButtonIconAuth';

import styles from './AuthProviderBlock.module.css';

type Props = {
  callbackUrl: string;
};

export default function AuthProviderBlock({ callbackUrl }: Props) {
  return (
    <div className={styles.wrapper}>
      <div>Войти через:</div>
      <div className={styles.buttons}>
        <ButtonIconAuth
          provider="yandex"
          iconSrc="/images/icons/yandex.svg"
          callbackUrl={callbackUrl}
          size={30}
        />
        <ButtonIconAuth
          provider="yandex"
          iconSrc="/images/icons/yandex.svg"
          callbackUrl={callbackUrl}
          size={30}
        />
        <ButtonIconAuth
          provider="yandex"
          iconSrc="/images/icons/yandex.svg"
          callbackUrl={callbackUrl}
          size={30}
        />
      </div>
    </div>
  );
}
