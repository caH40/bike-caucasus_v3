import Image from 'next/image';
import Link from 'next/link';
import cn from 'classnames/bind';

import styles from './Td.module.css';
import { TRaceRegistrationRiderDto } from '@/types/dto.types';
import { blurBase64 } from '@/libs/image';

type Props = {
  rider: TRaceRegistrationRiderDto;
};

const cx = cn.bind(styles);

function TdRider({ rider }: Props) {
  const riderName = `${rider.firstName} ${rider.lastName}`;
  return (
    <Link className={cx('link__news')} href={`/profile/${rider.id}`}>
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
    </Link>
  );
}

export default TdRider;
