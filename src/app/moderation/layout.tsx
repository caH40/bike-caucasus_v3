import UserModerationData from '@/components/UserModerationData/UserModerationData';

/**
 * Пустой layout для сбора данных модератора.
 */
export default function ModerationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserModerationData />
      {children}
    </>
  );
}
