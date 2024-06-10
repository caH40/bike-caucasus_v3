'use client';

import AdContainer from '@/components/AdContainer/AdContainer';
import { useAd } from '@/hooks/useAd';

type Props = {};

export default function Banner({}: Props) {
  useAd([5]);
  return <AdContainer number={5} />;
}
