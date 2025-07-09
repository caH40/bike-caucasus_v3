'use client';

import TableTransactionHistory from '../../TableTransactionHistory/TableTransactionHistory';

// types
import { TPaymentNotificationDto } from '@/types/dto.types';

type Props = {
  paymentHistory: TPaymentNotificationDto[];
};

export default function TransactionHistoryTableContainer({ paymentHistory }: Props) {
  return (
    <div>
      <TableTransactionHistory paymentHistory={paymentHistory} />
    </div>
  );
}
