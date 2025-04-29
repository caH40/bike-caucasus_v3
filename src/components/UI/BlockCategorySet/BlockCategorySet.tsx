// import {
//   FieldArrayWithId,
//   FieldErrors,
//   useFieldArray,
//   UseFormRegister,
//   Control,
// } from 'react-hook-form';
// import Image from 'next/image';

// import BoxInput from '../BoxInput/BoxInput';
// import { TFormChampionshipCreate } from '@/types/index.interface';
// import styles from './BlockCategorySet.module.css';
// import { TextValidationService } from '@/libs/utils/text';

// type Props = {
//   register: UseFormRegister<TFormChampionshipCreate>;
//   errors: FieldErrors<TFormChampionshipCreate>;
//   index: number; // Номер элемента в массиве races.
//   control: Control<TFormChampionshipCreate>; // добавляем control для useFieldArray
//   races: FieldArrayWithId<TFormChampionshipCreate, 'races', 'id'>[];
//   categoryProperty: 'categoriesAgeMale' | 'categoriesAgeFemale';
// };

// const textValidation = new TextValidationService();

// export default function BlockCategorySet({
//   register,
//   errors,
//   index,
//   control,
//   categoryProperty,
// }: Props) {
//   // Устанавливаем ключ для принудительного перерендеривания компонента при изменении categoryProperty
//   const key = `${index}-${categoryProperty}`;

//   // Доступ к массиву categories внутри races
//   const {
//     fields: categoryFields,
//     append: appendCategory,
//     remove: removeCategory,
//   } = useFieldArray({
//     control, // Передаем объект контроля из useForm
//     name: `races.${index}.${categoryProperty}`, // путь к массиву categories внутри массива races
//   });

//   const addCategory = (e: React.MouseEvent<HTMLButtonElement>): void => {
//     e.preventDefault();
//     appendCategory({ min: '0', max: '120', name: '' });
//   };

//   return (
//     <div key={key}>
//       {/* Добавляем key сюда */}

//       {categoryFields.map((field, categoryIndex) => (
//         <div key={field.id} className={styles.categoryItem}>
//           <div className={styles.block__icons}>
//             {/* Кнопка для добавления новой категории */}
//             <button onClick={(e) => addCategory(e)} className={styles.btn}>
//               <Image
//                 width={26}
//                 height={22}
//                 src="/images/icons/add-square.svg"
//                 alt="Insert a link"
//                 className={styles.icon__img}
//               />
//             </button>

//             {/* Удалить категорию */}
//             {categoryIndex !== 0 && (
//               <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   removeCategory(categoryIndex);
//                 }}
//                 className={styles.btn}
//               >
//                 <Image
//                   width={26}
//                   height={22}
//                   src="/images/icons/delete-square.svg"
//                   alt="Insert a link"
//                   className={styles.icon__img}
//                 />
//               </button>
//             )}
//           </div>

//           <div className={styles.block__inputs}>
//             <BoxInput
//               label={`Название ${
//                 categoryProperty === 'categoriesAgeMale' ? 'мужской' : 'женской'
//               } категории`}
//               id={`races.${index}.${categoryProperty}.${categoryIndex}.name`} // путь к полю name категории
//               autoComplete="off"
//               type="text"
//               register={register(`races.${index}.${categoryProperty}.${categoryIndex}.name`, {
//                 minLength: { value: 2, message: 'больше 1х символа' },
//                 maxLength: {
//                   value: 10,
//                   message: 'не больше 10 символов',
//                 },
//                 validate: textValidation.spaces,
//               })}
//               validationText={
//                 errors?.races?.[index]?.[categoryProperty]?.[categoryIndex]?.name?.message || ''
//               }
//             />

//             <BoxInput
//               label={`Нижнее значение:*`}
//               id={`races.${index}.${categoryProperty}.${categoryIndex}.min`} // путь к полю name категории
//               autoComplete="off"
//               type="number"
//               register={register(`races.${index}.${categoryProperty}.${categoryIndex}.min`, {
//                 required: 'заполните',
//               })}
//               validationText={
//                 errors?.races?.[index]?.[categoryProperty]?.[categoryIndex]?.min?.message || ''
//               }
//             />

//             <BoxInput
//               label={`Верхнее значение:*`}
//               id={`races.${index}.${categoryProperty}.${categoryIndex}.min`} // путь к полю name категории
//               autoComplete="off"
//               type="number"
//               register={register(`races.${index}.${categoryProperty}.${categoryIndex}.max`, {
//                 required: 'заполните',
//               })}
//               validationText={
//                 errors?.races?.[index]?.[categoryProperty]?.[categoryIndex]?.max?.message || ''
//               }
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
