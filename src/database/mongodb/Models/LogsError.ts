import { Schema, model, models } from 'mongoose';

import { TLogsErrorModel } from '@/types/models.interface';

// types

const logsErrorSchema = new Schema<TLogsErrorModel>(
  {
    type: String,
    message: String,
    stack: String,
  },
  { timestamps: true }
);

export const LogsError =
  models.LogsError || model<TLogsErrorModel>('LogsError', logsErrorSchema);
