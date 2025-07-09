import mongoose, { model, models, Schema } from 'mongoose';

// types
import { TPaymentNotificationDocument } from '@/types/models.interface';

const PaymentNotificationSchema = new Schema<TPaymentNotificationDocument>({
  event: { type: String, enum: ['payment.succeeded'], required: true },
  id: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['succeeded'], required: true },
  description: { type: String },
  amount: {
    value: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  income_amount: {
    value: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  metadata: {
    entityName: { type: String, enum: ['championship'], required: true },
    quantity: { type: Number, required: true },
  },
  capturedAt: Date, // Оплачен платёж.
  createdAt: Date, //Создан платёж.
});

export const PaymentNotificationModel =
  models.PaymentNotification ||
  model<TPaymentNotificationDocument>('PaymentNotification', PaymentNotificationSchema);
