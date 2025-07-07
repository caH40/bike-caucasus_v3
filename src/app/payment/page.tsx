// import { createPayment } from '@/actions/payment';
// import JSONBlock from '@/components/JSONBlock/JSONBlock';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';
import { ICreatePayment } from '@a2seven/yoo-checkout';

/**
 * Страница оплаты.
 * Пр нажатии оплатить на странице с предложением услуг, открывается данная страница, где описываются подробности платежа.
 * За что взымается плата, какие услуги предоставляются. Полная сумма
 */
export default async function PaymentPage() {
  const createPayload: ICreatePayment = {
    amount: {
      value: '100.00',
      currency: 'RUB',
    },
    capture: true,
    confirmation: {
      type: 'redirect',
      return_url: 'http://localhost:3000',
    },
    description: 'Заказ №1',
  };
  // const response = await createPayment({ createPayload });

  return (
    <>
      <TitleAndLine hSize={1} title="Страница оплаты" />
      {/* <JSONBlock json={response} /> */}
    </>
  );
}
