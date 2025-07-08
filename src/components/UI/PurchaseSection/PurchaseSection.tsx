'use client';

import { useState } from 'react';
import Button from '../Button/Button';
import styles from './PurchaseSection.module.css';
import BoxInputSimpleNew from '../BoxInput/BoxInputSimpleNew';

type Props = {
  handleClickPurchase: (quantity: number) => void;
  isLoading: boolean;
};

const DEFAULT_QUANTITY = '1';

export default function PurchaseSection({ handleClickPurchase, isLoading }: Props) {
  const [quantity, setQuantity] = useState<string>(DEFAULT_QUANTITY);

  return (
    <section className={styles.wrapper}>
      <div className={styles.box__input}>
        <BoxInputSimpleNew
          id={'quantitySlot'}
          type="number"
          value={quantity}
          setValue={setQuantity}
          min={1}
          step={1}
        />
      </div>

      <Button
        theme="green"
        getClick={() => handleClickPurchase(Number(quantity))}
        name={'Купить'}
        disabled={isLoading}
      />
    </section>
  );
}
