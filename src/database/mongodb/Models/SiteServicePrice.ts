import { model, models, Schema } from 'mongoose';

// types
import { TPriceTier, TSiteServicePriceDocument } from '@/types/models.interface';

const PriceTierSchema = new Schema<TPriceTier>(
  {
    quantityRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    unitPrice: { type: Number, required: true },
    currency: { type: String, enum: ['RUB'], required: true },
  },
  { _id: false }
);

/**
 * Цена за предоставляемую штучный сервис на сайте.
 * Цена зависит от количества приобретаемых услуг.
 */
const SiteServicePriceSchema = new Schema<TSiteServicePriceDocument>({
  entityName: { type: String, enum: ['championship'], required: true, unique: true },
  tiers: { type: [PriceTierSchema] },
});

export const SiteServicePriceModel =
  models.SiteServicePrice ||
  model<TSiteServicePriceDocument>('SiteServicePrice', SiteServicePriceSchema);
