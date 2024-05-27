import { Schema, model, models } from 'mongoose';

import { TLogsErrorModel } from '@/types/models.interface';

// types

const logsErrorSchema = new Schema<TLogsErrorModel>({
  timestamp: Number,
  type: String,
  message: String,
  responseData: String,
  stack: String,
  config: { type: Object, default: null },
});

export const LogsError = models.LogsError || model('LogsError', logsErrorSchema);
