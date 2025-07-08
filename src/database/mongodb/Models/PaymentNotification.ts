import mongoose, { model, models, Schema } from 'mongoose';

// types
import { TPaymentNotificationDocument } from '@/types/models.interface';

const PaymentNotificationSchema = new Schema<TPaymentNotificationDocument>(
  {
    event: { type: String, enum: ['payment.succeeded'], required: true },
    id: { type: String, required: true },
    status: { type: String, enum: ['succeeded'], required: true },
    amount: {
      value: { type: Number, required: true },
      currency: { type: String, required: true },
    },
    income_amount: {
      value: { type: Number, required: true },
      currency: { type: String, required: true },
    },
    metadata: {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      entityName: { type: String, enum: ['championship'], required: true },
      quantity: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentNotificationModel =
  models.PaymentNotification ||
  model<TPaymentNotificationDocument>('PaymentNotification', PaymentNotificationSchema);
