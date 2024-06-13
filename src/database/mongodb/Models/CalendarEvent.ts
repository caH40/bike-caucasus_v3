import mongoose, { Schema, model, models } from 'mongoose';
import { TCalendarEventDocument } from '../../../types/models.interface';

const calendarEventSchema = new Schema<TCalendarEventDocument>(
  {
    title: { type: String, required: true, trim: true }, // Короткое названия События.
    date: { type: Date, required: true }, // Дата старта события.
    urlSlug: { type: String, required: true }, // url новости с анонсом события.
    bikeType: { type: String, required: true }, // Тип велосипеда.
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const CalendarEvent =
  models.CalendarEvent || model<TCalendarEventDocument>('CalendarEvent', calendarEventSchema);
