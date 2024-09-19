import { TPermissionDto, TRoleDto } from '@/types/dto.types';
import { TPermission, TRoleModel } from '@/types/models.interface';

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

/**
 * DTO получения Роли.
 */
export function dtoRole(role: TRoleModel): TRoleDto {
  const _id = String(role._id);

  return {
    _id,
    name: role.name,
    description: role.description,
    permissions: role.permissions,
  };
}

/**
 * DTO получения Ролей.
 */
export function dtoRoles(roles: TRoleModel[]): TRoleDto[] {
  return roles.map((role) => dtoRole(role));
}
