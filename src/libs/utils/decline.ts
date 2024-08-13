/**
 * Склоняет слово "день" в зависимости от числа.
 * @param count - Количество дней.
 * @returns Склоненная форма слова "день" с числом.
 */
export function declineDays(count: number): string {
  // Определение правильной формы слова "день" в зависимости от количества.
  let wordForm: string;

  const absCount = Math.abs(count); // Обработка отрицательных чисел.

  if (absCount % 10 === 1 && absCount % 100 !== 11) {
    wordForm = 'день';
  } else if (
    absCount % 10 >= 2 &&
    absCount % 10 <= 4 &&
    (absCount % 100 < 10 || absCount % 100 >= 20)
  ) {
    wordForm = 'дня';
  } else {
    wordForm = 'дней';
  }

  return `${count} ${wordForm}`;
}
