'use client';

import { useEffect, useRef, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import InputCustom from '@/components/UI/InputCustom/InputCustom';
import Wrapper from '@/components/Wrapper/Wrapper';
import { findUsers } from '@/actions/user';
import type { TProfileSimpleDto } from '@/types/dto.types';
import type { TFormResultRace, TOptions } from '@/types/index.interface';

type Props = {
  setValue: UseFormSetValue<TFormResultRace>;
};

/**
 * Блок выбора зарегистрированного в Заезде райдера.
 */
export default function BlockSearchRider({ setValue }: Props) {
  const [lastNameSearch, setLastNameSearch] = useState<string>('');
  const [usersOptions, setUsersOptions] = useState<TOptions[]>([]);
  const users = useRef<TProfileSimpleDto[]>([]);

  useEffect(() => {
    findUsers({ lastNameSearch }).then((res) => {
      if (res.ok && res.data) {
        const options = res.data.map((user, index) => ({
          id: index,
          name: String(user.id),
          translation: `${user.lastName} ${user.firstName}`,
        }));
        setUsersOptions(options);
        users.current = res.data;
      }
    });
  }, [lastNameSearch]);

  const handlerSelect = (name: string) => {
    const rider = users.current.find((rider) => rider.id === +name);

    if (rider) {
      setLastNameSearch(rider.lastName);
      setValue('rider.firstName', rider.firstName, { shouldValidate: true });
      setValue('rider.lastName', rider.lastName, { shouldValidate: true });
      setValue('rider.patronymic', rider.patronymic || '');
      setValue('rider.id', rider.id);
      setValue('rider._id', rider._id);
      setValue('rider.gender', rider.gender);
      setValue('rider.city', rider.city, { shouldValidate: true });
      setValue('rider.yearBirthday', rider.yearBirthday, { shouldValidate: true });
    }
  };
  return (
    <Wrapper hSize={3} title="Поиск райдера в базе данных сайта">
      <InputCustom
        options={usersOptions}
        state={lastNameSearch}
        setState={setLastNameSearch}
        label="Фамилия участника:"
        handlerSelect={handlerSelect}
        id={'lastNameSearch'}
      />
    </Wrapper>
  );
}
