import { TSiteServicePriceDto } from '@/types/dto.types';
import { TSiteServicePrice } from '@/types/models.interface';

export function getPriceDto(price: TSiteServicePrice): TSiteServicePriceDto {
  const _id = price._id.toString();

  return { ...price, _id };
}
