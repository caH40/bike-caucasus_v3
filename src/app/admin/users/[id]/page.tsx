type Props = {
  params: {
    id: string;
  };
};

/**
 * Страница модерации пользователя.
 */
export default function UserModeration({ params: { id } }: Props) {
  return <div>{id}</div>;
}
