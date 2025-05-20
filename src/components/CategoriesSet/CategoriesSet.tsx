import AddRemoveSquareButtonGroup from '../AddRemoveSquareButtonGroup/AddRemoveSquareButtonGroup';
import TitleAndLine from '../TitleAndLine/TitleAndLine';
import AddRemoveSquareButton from '../UI/Buttons/AddRemoveSquareButton';
import styles from './CategoriesSet.module.css';

// types
import { TCategoriesSetProps } from '@/types/index.interface';
import BlockCategories from '../UI/BlockCategories/BlockCategories';

/**
 * Общий контейнер для для заполнения данных по категориям в чемпионате.
 */
function CategoriesSet({
  categories,
  register,
  isDefault,
  appendCategories,
  removeCategories,
  control,
  errors,
  categoriesIndex,
}: TCategoriesSetProps) {
  // Добавление
  const addCategoriesFn = (): void => {
    const age = {
      female: [{ min: 0, max: 120, name: '' }],
      male: [{ min: 0, max: 120, name: '' }],
    };

    appendCategories({ age, name: '', skillLevel: undefined });
  };

  const removeCategoriesFn = (): void => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить этот пакет конфигураций?');
    if (confirmed) {
      removeCategories(categoriesIndex);
    }
  };

  const currentAction = isDefault
    ? ({
        label: 'Добавление дополнительного пакета конфигураций',
        action: 'add',
        actionFunction: addCategoriesFn,
      } as const)
    : ({
        label: 'Удаление дополнительного пакета конфигураций',
        action: 'delete',
        actionFunction: removeCategoriesFn,
      } as const);

  return (
    <div className={styles.wrapper}>
      <TitleAndLine
        title={
          isDefault
            ? 'Редактирование конфигураций категорий'
            : 'Дополнительный пакет конфигураций категорий'
        }
        hSize={2}
      />

      <div className={styles.block__icons}>
        {/* Кнопка для добавления новой категории */}
        <AddRemoveSquareButtonGroup label={currentAction.label}>
          <AddRemoveSquareButton
            action={currentAction.action}
            actionFunction={currentAction.actionFunction}
          />
        </AddRemoveSquareButtonGroup>
      </div>

      <BlockCategories
        categories={categories}
        control={control}
        register={register}
        categoriesIndex={categoriesIndex}
        errors={errors}
      />
    </div>
  );
}

export default CategoriesSet;
