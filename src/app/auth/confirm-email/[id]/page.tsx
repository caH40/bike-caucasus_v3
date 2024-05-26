const server = process.env.NEXT_PUBLIC_SERVER_FRONT;

const fetchData = async (id: string): Promise<string> => {
  const response = await fetch(`${server}/api/auth/confirm-email/${id}`, {
    cache: 'no-cache',
  });
  if (!response.ok) {
    return 'Ошибка запросе данных с сервера';
  }
  const data = await response.json();
  return data.message;
};

export default async function ConfirmEmail({ params }: { params: { id: string } }) {
  const messageResponse = await fetchData(params.id);
  return (
    <div className="page404">
      <h1 className="page404__title">Страница активации аккаунта</h1>
      <p className="page404__text">{messageResponse}</p>
    </div>
  );
}
