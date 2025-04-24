import t from '@/locales/ru/moderation/championship.json';

export const validateDates = (startDate: string, endDate: string) => {
  if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
    return t.validation.texts.endDate;
  }
  return true;
};
