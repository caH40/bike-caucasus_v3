'use client';

import FormDistance from '@/components/UI/Forms/FormDistance/FormDistance';
import styles from './ContainerDistanceForms.module.css';

import { TContainerDistanceFormsProps } from '@/types/index.interface';

/**
 * Форма создания дистанций для заездов чемпионата.
 */
export default function ContainerDistanceForms({
  postDistance,
  putDistance,
  distance,
}: TContainerDistanceFormsProps) {
  return (
    <div className={styles.wrapper}>
      <FormDistance postDistance={postDistance} putDistance={putDistance} distance={distance} />
    </div>
  );
}
