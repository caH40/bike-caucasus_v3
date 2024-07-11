'use client';

import { useState } from 'react';
import Link from 'next/link';

import PermissionCheck from '@/hoc/permission-check';
import IconEllipsisVertical from '@/components/Icons/IconEllipsisVertical';
import type { TMenuOnPage } from '@/types/index.interface';
import styles from './MenuControl.module.css';

type Props = {
  buttons: TMenuOnPage[]; // Кнопки управления.
};

/**
 * Popup меню управления новостью/маршрутом и т.д.
 */
export default function MenuControl({ buttons }: Props) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <>
      <IconEllipsisVertical
        colors={{ hover: '#ec9c07' }}
        getClick={() => setIsVisible((prev) => !prev)}
      />
      {isVisible && (
        <div
          className={styles.popup}
          onClick={() => setIsVisible(false)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <ul className={styles.list}>
            {buttons.map((button) =>
              // если href есть, значит это линк, иначе это кнопка с действием onClick
              button.href ? (
                <PermissionCheck permission={button.permission} key={button.id}>
                  <li className={styles.item} key={button.id}>
                    <Link href={button.href} className={styles.link}>
                      {button.icon && <button.icon squareSize={22} />}

                      {button.name}
                    </Link>
                  </li>
                </PermissionCheck>
              ) : (
                <PermissionCheck permission={button.permission} key={button.id}>
                  <li className={styles.item} key={button.id}>
                    <div className={styles.link} onClick={button.onClick}>
                      {button.icon && <button.icon squareSize={22} />}

                      {button.name}
                    </div>
                  </li>
                </PermissionCheck>
              )
            )}
          </ul>
        </div>
      )}
    </>
  );
}
