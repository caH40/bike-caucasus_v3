import FormAccount from '@/components/UI/FormAccaunt/FormAccount';
import type { MessageServiceDB } from '@/types/index.interface';
import styles from './AccountDetailsPage.module.css';

export default async function AccountDetailsPage() {
  // обновление данных аккаунта в БД
  const putAccount = async (): Promise<MessageServiceDB<any>> => {
    'use server';
  };
  return (
    <div className={styles.wrapper}>
      <FormAccount putAccount={putAccount} formData={{}} />
    </div>
  );
}
