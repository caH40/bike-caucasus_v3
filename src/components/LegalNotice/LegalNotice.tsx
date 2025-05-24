import Link from 'next/link';

import styles from './LegalNotice.module.css';

type Props = { actionText: string };

export const LegalNotice = ({ actionText }: Props) => (
  <div className={styles.legal}>
    {actionText}, вы принимаете{' '}
    <Link className={'link-dark'} href="/legal/terms-of-use">
      пользовательское соглашение
    </Link>{' '}
    и{' '}
    <Link className={'link-dark'} href="/legal/privacy-policy">
      политику конфиденциальности
    </Link>
  </div>
);
