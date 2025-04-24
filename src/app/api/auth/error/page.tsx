/**
 * Страница отображения ошибок из next-auth
 */
export default function page(props: any) {
  return (
    <div>
      <h1>Непредвиденная ошибка при авторизации</h1>
      <pre>{JSON.stringify(/* @next-codemod-error 'props' is passed as an argument. Any asynchronous properties of 'props' must be awaited when accessed. */
      props, null, 2)}</pre>
    </div>
  );
}
