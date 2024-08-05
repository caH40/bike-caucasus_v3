// Страница описания Организатора Чемпионатов
/**
 * Название
 * Лого
 * Описание
 * Контактные данные
 * Список прошедших и будущих Чемпионатов, проводимых организатором.
 * * Отзывы
 */

type Props = {
  params: {
    urlSlug: string;
  };
};

export default function OrganizerPage({ params: { urlSlug } }: Props) {
  return <div>{urlSlug}</div>;
}
