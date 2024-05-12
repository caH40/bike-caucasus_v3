'use client';

import Button from '@/components/UI/Button/Button';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  handlerAction: () => Promise<any>;
};

export default function Template({ handlerAction }: Props) {
  const [message, setMessage] = useState<unknown>();

  const getClick = async () => {
    const response = await handlerAction();
    if (response.ok) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    setMessage(response);
  };

  return (
    <div>
      <hr style={{ margin: '30px 0px' }} />
      <Button getClick={getClick} name="запуск" theme="green" />
      <hr style={{ margin: '30px 0px' }} />
      <pre>{JSON.stringify(message, null, 2)}</pre>
    </div>
  );
}
