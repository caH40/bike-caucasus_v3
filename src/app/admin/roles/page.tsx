import IconRole from '@/components/Icons/IconRole';
import Wrapper from '@/components/Wrapper/Wrapper';

import styles from './roles.module.css';

export const dynamic = 'force-dynamic';

export default async function RolesAdminPage() {
  return (
    <Wrapper
      title="Администрирование ролей и разрешений (доступов) к ресурсам сайта"
      hSize={1}
      Icon={IconRole}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>Основные функции:</h2>
        <div className={styles.paragraph}>
          <h3>Создание, редактирование и удаление ролей</h3>
          <ul>
            <li>Создание новых ролей с указанием названия и описания.</li>
            <li>Редактирование существующих ролей для изменения их параметров.</li>
            <li>Удаление ролей, которые больше не нужны.</li>
          </ul>
        </div>

        <div className={styles.paragraph}>
          <h3>Управление разрешениями</h3>
          <ul>
            <li>
              Создание новых разрешений для определения доступа к функциональным возможностям
              сайта.
            </li>
            <li>Редактирование разрешений для обновления описания или прав доступа.</li>
            <li>Удаление устаревших разрешений.</li>
          </ul>
        </div>

        <div className={styles.paragraph}>
          <h3>Назначение ролей пользователям</h3>
          <ul>
            <li>Присвоение пользователю конкретной роли для управления его правами доступа.</li>
            <li>Просмотр и изменение текущих назначений ролей.</li>
          </ul>
        </div>

        <div>
          <h3>Управление текущими настройками</h3>
          <ul>
            <li>Просмотр и поиск текущих назначений ролей и разрешений.</li>
            <li>Фильтрация данных для удобства администрирования.</li>
          </ul>
        </div>

        <div className={styles.paragraph}>
          Эти функции обеспечивают гибкость и безопасность управления доступом к ресурсам сайта,
          позволяя администраторам точно настраивать права пользователей в соответствии с
          требованиями и изменениями в системе.
        </div>
      </div>
    </Wrapper>
  );
}