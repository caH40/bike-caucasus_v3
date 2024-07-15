import { TPermissionDto } from '@/types/dto.types';
import { TPermission } from '@/types/models.interface';

/**
 * DTO получения массива разрешений (доступа) к ресурсам сайта.
 */
export function dtoPermissions(permissions: TPermission[]): TPermissionDto[] {
  return permissions.map((permission) => ({ ...permission, _id: String(permission._id) }));
}
