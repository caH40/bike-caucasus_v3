// import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { redirect } from 'next/navigation';

/**
 * На странице сделать список карточек Одиночных чемпионатов и Этапов с открытой регистрацией.
 */
export default function Registration() {
  redirect('/championships');
  // return (
  //   <TitleAndLine hSize={1} title="Одноэтапный Чемпионаты и Этапы с открытой регистрацией" />
  // );
}
