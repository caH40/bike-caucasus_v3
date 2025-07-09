import { buttonsMenuAccountPage } from '@/constants/menu';
import DefaultLayout from '@/components/DefaultLayout/DefaultLayout';

export default function TeamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DefaultLayout buttonsMenu={buttonsMenuAccountPage}>{children}</DefaultLayout>;
}
