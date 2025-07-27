import { Schema, model, models } from 'mongoose';

import { TLogsErrorModel } from '@/types/models.interface';

// types

const debugMetaSchema = new Schema(
  {
    caller: String,
    path: String,
    authUserId: Number,
    rawParams: Schema.Types.Mixed,
    search: Schema.Types.Mixed,
  },
  { _id: false }
);

const logsErrorSchema = new Schema<TLogsErrorModel>(
  {
    type: String,
    message: String,
    stack: String,
    debugMeta: debugMetaSchema,
  },
  { timestamps: true }
);

export const LogsError =
  models.LogsError || model<TLogsErrorModel>('LogsError', logsErrorSchema);
