import { getRoles } from '@/actions/permissions';
import { getProfile } from '@/actions/user';
import { FormModerateUser } from '@/components/UI/Forms/FormModerateUser/FormModerateUser';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * Страница модерации пользователя.
 */
export default async function UserModeration(props: Props) {
  const params = await props.params;

  const { id } = params;

  const [roles, profile] = await Promise.all([
    getRoles(),
    getProfile({ userId: +id, isPrivate: true }),
  ]);

  if (!profile.data) {
    return <h2>Пользователь не найден!</h2>;
  }
  if (!roles.data) {
    return <h2>Роли не найдены!</h2>;
  }

  return (
    <div>
      <FormModerateUser profile={profile.data} roles={roles.data} />
    </div>
  );
}
