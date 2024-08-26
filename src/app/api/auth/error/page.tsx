/**
 * Страница отображения ошибок из next-auth
 */
export default function page(props: any) {
  return (
    <div>
      <h1>Непредвиденная ошибка при авторизации</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
}
