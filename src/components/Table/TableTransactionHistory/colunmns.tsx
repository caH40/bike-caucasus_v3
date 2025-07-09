import { CellContext, ColumnDef } from '@tanstack/react-table';

import { getTimerLocal } from '@/libs/utils/date-local';

// types
import { TPaymentNotificationDto } from '@/types/dto.types';
import PaymentDetails from '@/components/PaymentDetails/PaymentDetails';

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
    cell: renderCell,
  },
  {
    header: 'Статус',
    accessorKey: 'status',
    cell: renderCell,
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
    header: 'Дата создания платежа',
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
