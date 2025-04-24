export default async function Page(props: any) {
  const keys = Object.keys(props);
  const resolvedProps: Record<string, any> = {};

  for (const key of keys) {
    try {
      resolvedProps[key] = await props[key];
    } catch {
      resolvedProps[key] = '[Async Error]';
    }
  }

  return (
    <div>
      <h1>Непредвиденная ошибка при авторизации</h1>
      <pre>{JSON.stringify(resolvedProps, null, 2)}</pre>
    </div>
  );
}
