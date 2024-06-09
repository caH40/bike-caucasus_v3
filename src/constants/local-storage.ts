// Хранение названий переменных для LocalStorage

const suffixSite = '__bc_';

/**
 * Суффикс для localStorage при создание новости.
 * После суффикса следует название соответствующего поля вводя информации.
 */
export const lcSuffixNewsCreate = `${suffixSite}moderation_news_create-`;

/**
 * Название поля для хранения номера камеры г.Шаджатмаз в localStorage.
 */
export const lcWebcamShadzhatmaz = `${suffixSite}webcam_shadzhatmaz`;

/**
 * Суффикс для localStorage при создание новости.
 * После суффикса следует название соответствующего поля вводя информации.
 */
export const lcSuffixTrailModeration = `${suffixSite}moderation_trail-`;

/**
 * Суффикс для localStorage при фильтрации Маршрутов.
 * После суффикса следует название соответствующего поля вводя информации.
 */
export const lcSuffixTrailsFilters = `${suffixSite}trails_filters-`;
