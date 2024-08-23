/**
 * Хук логики отображения блоков в Форме создания и редактирования Чемпионата.
 */
export function useShowChampionshipForm({
  typeInInput,
  typeInDB,
  isCreatingForm,
}: {
  typeInInput: string | undefined;
  typeInDB: string | undefined;
  isCreatingForm: boolean;
}) {
  const isStageOrSingle = typeInDB && ['single', 'stage'].includes(typeInDB);
  const isSeriesOrTour = typeInDB && ['series', 'tour'].includes(typeInDB);
  const isStage = typeInDB && ['stage'].includes(typeInDB);
  const isSeriesOrTourInForm = typeInInput && ['series', 'tour'].includes(typeInInput);
  const isStageInForm = typeInInput && ['stage'].includes(typeInInput);
  const inputUndefined = typeof typeInInput === 'undefined';
  const showTrackInput =
    (isCreatingForm && inputUndefined) ||
    (isStageOrSingle && inputUndefined) ||
    ['single', 'stage'].includes(String(typeInInput));

  // Отображения блока ввода количества Этапов в Серии или Туре.
  // При создании по умолчанию выбран Одиночный, значит блок должен быть скрыт.
  const showQuantityStage =
    (isCreatingForm && isSeriesOrTourInForm) || (!isCreatingForm && isSeriesOrTour);

  // const showNumberStage = !showQuantityStage;

  const showNumberStage = (isCreatingForm && isStageInForm) || isStage;

  return { showTrackInput, showQuantityStage, showNumberStage, isSeriesOrTourInForm };
}
