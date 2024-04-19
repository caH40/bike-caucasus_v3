import { Roboto, Montserrat_Alternates } from 'next/font/google';

export const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
});

export const montserrat_Alternates = Montserrat_Alternates({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat_Alternates',
});
