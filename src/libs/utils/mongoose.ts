import mongoose, { Types } from 'mongoose';

export function isObjectId(value: Types.ObjectId | string): boolean {
  return (
    mongoose.Types.ObjectId.isValid(value) &&
    String(new mongoose.Types.ObjectId(value)) === String(value)
  );
}
