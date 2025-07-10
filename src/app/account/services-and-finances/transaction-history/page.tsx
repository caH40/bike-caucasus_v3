import { getPaymentHistory } from '@/actions/payment';
import { IconTransactionHistory } from '@/components/Icons';
import ServerErrorMessage from '@/components/ServerErrorMessage/ServerErrorMessage';
import TransactionHistoryTableContainer from '@/components/Table/Containers/TransactionHistoryTableContainer/TransactionHistoryTableContainer';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

/**
 * Страница историй финансовых операций.
 */
export default async function TransactionHistoryPage() {
  const paymentHistory = await getPaymentHistory();

  if (!paymentHistory.ok || !paymentHistory.data) {
    return (
      <ServerErrorMessage
        message={paymentHistory.message}
        statusCode={paymentHistory.statusCode}
      />
    );
  }

  return (
    <div>
      <TitleAndLine hSize={1} title="История платежей" Icon={IconTransactionHistory} />

      <TransactionHistoryTableContainer paymentHistory={paymentHistory.data} />
    </div>
  );
}
