import { buttonsMenuAccountPage } from '@/constants/menu';
import DefaultLayout from '@/components/DefaultLayout/DefaultLayout';

export default function AccountDetailsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DefaultLayout buttonsMenu={buttonsMenuAccountPage}>{children}</DefaultLayout>;
}
