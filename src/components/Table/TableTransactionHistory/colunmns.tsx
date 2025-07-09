import { CellContext, ColumnDef } from '@tanstack/react-table';

import { getTimerLocal } from '@/libs/utils/date-local';

// types
import { TPaymentNotificationDto } from '@/types/dto.types';
import PaymentDetails from '@/components/PaymentDetails/PaymentDetails';
import { YKASSA_PAYMENT_STATUS } from '@/constants/translations';
import { TYooKassaPaymentStatus } from '@/types/index.interface';

// Универсальный рендер для простых текстовых ячеек
const renderCell = (
  props: CellContext<TPaymentNotificationDto & { rowId: number }, string | number>
) => props.getValue();

export const transactionHistoryTableColumns: ColumnDef<
  TPaymentNotificationDto & { rowId: number },
  any
>[] = [
  {
    header: '#',
    accessorKey: 'rowId',
    cell: renderCell,
  },
  {
    header: 'Операция',
    accessorKey: 'event',
    cell: (props: any) => {
      return props.getValue().includes('payment.') ? 'Платеж' : props.getValue();
    },
  },
  {
    header: 'Статус',
    accessorKey: 'status',
    cell: (props: any) => YKASSA_PAYMENT_STATUS[props.getValue() as TYooKassaPaymentStatus],
  },
  {
    header: 'Сумма',
    accessorKey: 'amount',
    cell: (props: any) => {
      const { value, currency } = props.getValue();
      return (
        <span>
          {value} {currency}
        </span>
      );
    },
  },
  {
    header: 'Описание',
    accessorKey: 'description',
    cell: renderCell,
  },
  {
    header: 'Детали',
    accessorKey: 'metadata',
    cell: (props: any) => {
      const { entityName, quantity } = props.getValue();
      return <PaymentDetails entityName={entityName} quantity={quantity} />;
    },
  },
  {
    header: 'Дата создания',
    accessorKey: 'createdAt',
    cell: (props: any) => <span>{getTimerLocal(props.getValue(), 'DDMMYYHm')}</span>,
  },
  {
    header: 'Дата оплаты',
    accessorKey: 'capturedAt',
    cell: (props: any) =>
      props.getValue() && <span>{getTimerLocal(props.getValue(), 'DDMMYYHm')}</span>,
  },
];
