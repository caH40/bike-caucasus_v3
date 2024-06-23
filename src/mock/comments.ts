import { TCommentDto } from '@/types/dto.types';

export const comments: TCommentDto[] = [
  {
    _id: '1',
    text: 'Велосоревнование было просто потрясающим! Отличная организация и участие.',
    author: {
      _id: '665306537d71bdea3ea91605',
      id: 1000,
      provider: {
        image:
          'https://avatars.yandex.net/get-yapic/42215/henxJrhGNjQbEaAIaWGmL9jVsI-1/islands-200',
      },
      imageFromProvider: false,
      image: 'https://bike-caucasus.hb.vkcs.cloud/user_1000_logo-1716926543373.jpg',
      person: {
        firstName: 'Александр',
        lastName: 'Бережнев',
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    count: {
      likes: 15,
    },
    isLikedByUser: true,
  },
  {
    _id: '2',
    text: 'Жаль, что не смог принять участие. Но болел за своих друзей!',
    author: {
      _id: '665309a0cf4a4d43148d82d8',
      id: 1001,
      provider: {
        image:
          'https://lh3.googleusercontent.com/a/ACg8ocLdA_a5RmYD5lLRxoiH24L6nzrDTH_ZAB1HFNs9bGzOYGru2mqy=s96-c',
      },
      imageFromProvider: false,
      image: 'https://bike-caucasus.hb.vkcs.cloud/user_1001_logo-1716724337108.jpg',
      person: {
        firstName: 'User',
        lastName: 'Tester',
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    count: {
      likes: 5,
    },
    isLikedByUser: false,
  },
  {
    _id: '3',
    text: 'Было интересно наблюдать за борьбой лидеров до самого конца! Организаторы постарались на славу! В следующем году обязательно приеду снова. Организаторы постарались на славу! В следующем году обязательно приеду снова.',
    author: {
      _id: '665318c219682d933f6477ef',
      id: 1003,
      provider: {
        image:
          'https://sun1-97.userapi.com/s/v1/ig2/dwJVqSr3maVoki0dI1IVaxOe_8c7vXSsFHL-ISNIuK5_DpfHX2EfjipcDOYiLfgduqtAij3jUAsL22iZ58Mw7peB.jpg?size=100x100&quality=95&crop=408,0,1708,1708&ava=1',
      },
      imageFromProvider: false,
      image: 'https://bike-caucasus.hb.vkcs.cloud/user_1003_logo-1716724221380.jpeg',
      person: {
        firstName: 'User',
        lastName: 'Tester-2',
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    count: {
      likes: 8,
    },
    isLikedByUser: true,
  },
  {
    _id: '4',
    text: 'Организаторы постарались на славу! В следующем году обязательно приеду снова.',
    author: {
      _id: '66531a7f7597b3fec13e6e4a',
      id: 1002,
      provider: {
        image: '',
      },
      imageFromProvider: false,
      image: 'https://bike-caucasus.hb.vkcs.cloud/user_1004_logo-1716724513434.jpeg',
      person: {
        firstName: 'Moderaror',
        lastName: 'Tester-3',
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    count: {
      likes: 12,
    },
    isLikedByUser: false,
  },
  {
    _id: '5',
    text: 'Первый раз участвовал в таком крупном мероприятии, незабываемые впечатления!',
    author: {
      _id: '66700b7ab5ba3a1233c37264',
      id: 1005,
      provider: {
        image: '',
      },
      imageFromProvider: false,
      image: '',
      person: {
        firstName: 'Petro',
        lastName: '',
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    count: {
      likes: 10,
    },
    isLikedByUser: true,
  },
  {
    _id: '6',
    text: 'Порадовало большое количество участников и высокий уровень соревнований.',
    author: {
      _id: '665306537d71bdea3ea91605',
      id: 1000,
      provider: {
        image:
          'https://avatars.yandex.net/get-yapic/42215/henxJrhGNjQbEaAIaWGmL9jVsI-1/islands-200',
      },
      imageFromProvider: false,
      image: 'https://bike-caucasus.hb.vkcs.cloud/user_1000_logo-1716926543373.jpg',
      person: {
        firstName: 'Александр',
        lastName: 'Бережнев',
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    count: {
      likes: 7,
    },
    isLikedByUser: true,
  },
  {
    _id: '7',
    text: 'Уровень подготовки и трассы были на высоте!',
    author: {
      _id: '665309a0cf4a4d43148d82d8',
      id: 1001,
      provider: {
        image:
          'https://lh3.googleusercontent.com/a/ACg8ocLdA_a5RmYD5lLRxoiH24L6nzrDTH_ZAB1HFNs9bGzOYGru2mqy=s96-c',
      },
      imageFromProvider: false,
      image: 'https://bike-caucasus.hb.vkcs.cloud/user_1001_logo-1716724337108.jpg',
      person: {
        firstName: 'User',
        lastName: 'Tester',
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    count: {
      likes: 6,
    },
    isLikedByUser: false,
  },
  {
    _id: '8',
    text: 'Отличный заезд! Приятно видеть такое количество увлеченных людей.',
    author: {
      _id: '665318c219682d933f6477ef',
      id: 1003,
      provider: {
        image:
          'https://sun1-97.userapi.com/s/v1/ig2/dwJVqSr3maVoki0dI1IVaxOe_8c7vXSsFHL-ISNIuK5_DpfHX2EfjipcDOYiLfgduqtAij3jUAsL22iZ58Mw7peB.jpg?size=100x100&quality=95&crop=408,0,1708,1708&ava=1',
      },
      imageFromProvider: false,
      image: 'https://bike-caucasus.hb.vkcs.cloud/user_1003_logo-1716724221380.jpeg',
      person: {
        firstName: 'User',
        lastName: 'Tester-2',
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    count: {
      likes: 9,
    },
    isLikedByUser: true,
  },
  {
    _id: '9',
    text: 'Было приятно пообщаться с другими участниками и обменяться опытом.',
    author: {
      _id: '66531a7f7597b3fec13e6e4a',
      id: 1002,
      provider: {
        image: '',
      },
      imageFromProvider: false,
      image: 'https://bike-caucasus.hb.vkcs.cloud/user_1004_logo-1716724513434.jpeg',
      person: {
        firstName: 'Moderaror',
        lastName: 'Tester-3',
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    count: {
      likes: 11,
    },
    isLikedByUser: false,
  },
];
