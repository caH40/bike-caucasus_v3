import { TPermissionDto } from '@/types/dto.types';
import { TPermission } from '@/types/models.interface';

/**
 * DTO получения массива разрешений (доступа) к ресурсам сайта.
 */
export function dtoPermission(permission: TPermission): TPermissionDto {
  return {
    _id: String(permission._id),
    name: permission.name,
    description: permission.description,
  };
}

/**
 * DTO получения массива разрешений (доступа) к ресурсам сайта.
 */
export function dtoPermissions(permissions: TPermission[]): TPermissionDto[] {
  return permissions.map((permission) => ({
    _id: String(permission._id),
    name: permission.name,
    description: permission.description,
  }));
}
