import Image from 'next/image';

import { getRoles } from '@/actions/permissions';
import { getProfile } from '@/actions/user';
import { FormModerateUser } from '@/components/UI/Forms/FormModerateUser/FormModerateUser';
import { blurBase64 } from '@/libs/image';

import styles from '../UsersAdminPage.module.css';
import { getLogoProfile, getUserFullName } from '@/libs/utils/profile';

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

  const profileImage = getLogoProfile(
    profile.data.imageFromProvider,
    profile.data.provider?.image,
    profile.data.image
  );

  const fullName = getUserFullName({
    person: profile.data.person,
    showPatronymic: profile.data.preferences.showPatronymic,
  });

  return (
    <div>
      <Image
        width={150}
        height={150}
        src={profileImage}
        alt={`Аватар пользователя ${fullName}`}
        className={styles.profile__image}
        priority={true}
        placeholder="blur"
        blurDataURL={blurBase64}
      />
      <FormModerateUser profile={profile.data} roles={roles.data} />
    </div>
  );
}
