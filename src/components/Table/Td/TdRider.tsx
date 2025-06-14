import Image from 'next/image';
import cn from 'classnames/bind';
import Link from 'next/link';

import { blurBase64 } from '@/libs/image';
import styles from './Td.module.css';
import { getUserFullName } from '@/libs/utils/profile';

// types
import { TClientUser } from '@/types/index.interface';

type Props = {
  rider: TClientUser;
  linkAdditional?: string;
  showPatronymic?: boolean;
};

const cx = cn.bind(styles);

function TdRider({ rider, showPatronymic, linkAdditional }: Props) {
  const riderName = getUserFullName({
    person: rider,
    showPatronymic,
  });

  const riderContent = (
    <div className={cx('rider')}>
      <div className={cx('rider__logo')}>
        {rider.image ? (
          <Image
            className={cx('rider__img')}
            width={40}
            height={40}
            src={rider.image}
            alt={`${riderName}'s rider logo`}
            placeholder="blur"
            blurDataURL={blurBase64}
          />
        ) : (
          <div className={cx('rider__img__empty')}>
            {rider.firstName.slice(0, 1) + rider.lastName.slice(0, 1)}
          </div>
        )}
      </div>
      <div className={cx('name')}>{riderName}</div>
    </div>
  );

  return rider.id ? (
    <Link className={cx('link__news')} href={linkAdditional || `/profile/${rider.id}`}>
      {riderContent}
    </Link>
  ) : (
    <div className={cx('rider', 'disabled')}>{riderContent}</div>
  );
}

export default TdRider;
