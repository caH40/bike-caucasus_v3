import mongoose, { model, models, Schema } from 'mongoose';

// types
import { TPaymentNotificationDocument } from '@/types/models.interface';

const PaymentNotificationSchema = new Schema<TPaymentNotificationDocument>({
  event: {
    type: String,
    enum: [
      'payment.succeeded',
      'payment.pending',
      'payment.waiting_for_capture',
      'payment.canceled',
    ],
    required: true,
  },
  id: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['succeeded', 'pending', 'waiting_for_capture', 'canceled'],
    required: true,
  },
  description: { type: String },
  amount: {
    value: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  income_amount: {
    value: { type: Number },
    currency: { type: String },
  },
  metadata: {
    entityName: { type: String, enum: ['championship'], required: true },
    quantity: { type: Number, required: true },
  },
  cancellation_details: {
    party: { type: String },
    reason: { type: String },
  },
  capturedAt: Date, // Оплачен платёж.
  createdAt: Date, //Создан платёж.
  expiresAt: Date, //Создан платёж.
});

export const PaymentNotificationModel =
  models.PaymentNotification ||
  model<TPaymentNotificationDocument>('PaymentNotification', PaymentNotificationSchema);
