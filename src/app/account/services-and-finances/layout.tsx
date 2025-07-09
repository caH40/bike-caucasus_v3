import { buttonsMenuServicesAndFinancesPage } from '@/constants/menu';
import DefaultLayout from '@/components/DefaultLayout/DefaultLayout';

export default function ServicesAndFinancesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DefaultLayout
      buttonsMenu={buttonsMenuServicesAndFinancesPage}
      buttonAdditional={{
        name: 'Вернуться',
        path: '/account/profile',
      }}
    >
      {children}
    </DefaultLayout>
  );
}
