import Link from 'next/link';

export function getDefaultValue(
  value: string | null | number,
  type: 'city' | 'firstName' | 'lastName' | 'gender' | 'yearBirthday'
): JSX.Element {
  const renderMissing = (text: string) => (
    <span>
      Укажите {text} в{' '}
      <Link href="/account/profile" className="link">
        настройках аккаунта
      </Link>
      .
    </span>
  );

  switch (type) {
    case 'firstName':
      return value ? <span>{value}</span> : renderMissing('имя');

    case 'lastName':
      return value ? <span>{value}</span> : renderMissing('фамилию');

    case 'city':
      return value ? <span>{value}</span> : renderMissing('город');

    case 'gender':
      if (!value) {
        return renderMissing('полу');
      }
      return <span>{value === 'male' ? 'мужской' : 'женский'}</span>;

    case 'yearBirthday':
      return value ? <span>{value}</span> : renderMissing('год рождения');

    default:
      return <span>нет данных</span>;
  }
}
