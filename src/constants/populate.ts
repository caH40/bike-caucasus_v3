// populate для запросов из БД для конкретных свойств.

/**
 * Данные пользователя User для публичного доступа.
 */
export const userPublicSelect = [
  'id',
  'person.firstName',
  'person.lastName',
  'provider.image',
  'imageFromProvider',
  'image',
];

/**
 * Данные пользователя User для публичного доступа.
 */
export const organizerSelect = ['_id', 'name', 'urlSlug', 'logoUrl', 'contactInfo'];
