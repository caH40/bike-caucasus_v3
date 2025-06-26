// types
import type { TClientMeta, TFormDistanceCreate } from '@/types/index.interface';

type Params = {
  dataFromForm: TFormDistanceCreate;
  client: TClientMeta;
};

/**
 * Функция для сериализации данных дистанции.
 * @param dataForm - Данные формы, которые нужно сериализовать.
 * @returns Сериализованные данные в формате FormData.
 */
export function serializationDistance({ dataFromForm, client }: Params): FormData {
  const formData = new FormData();

  if (dataFromForm.name) {
    formData.set('name', dataFromForm.name);
  }
  if (dataFromForm.description) {
    formData.set('description', dataFromForm.description);
  }
  if (dataFromForm.surfaceType) {
    formData.set('surfaceType', dataFromForm.surfaceType);
  }
  if (dataFromForm.trackGPXFile) {
    formData.set('trackGPXFile', dataFromForm.trackGPXFile);
  }

  if (client) {
    formData.set('client', JSON.stringify(client));
  }

  return formData;
}
