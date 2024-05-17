import FormNewsCreate from '@/components/UI/Forms/FormNewsCreate/FormNewsCreate';
import { Cloud } from '@/services/cloud';

/**
 * Страница создания новости
 */
export default function NewsCreatePage() {
  const saveImageTitle = async (file: FormData) => {
    'use server';
    const cloud = new Cloud('vk');

    const fileForm = file.get('image') as File | null;

    if (!fileForm) {
      return;
    }

    const fileName = `news_image_title-${Date.now()}`;
    const extension = fileForm.name.split('.').pop();
    const fileNameFull = `${fileName}.${extension}`;

    const bucketName = 'bike-caucasus';

    await cloud.saveFile(fileForm, bucketName, fileNameFull);

    return `https://${bucketName}.hb.vkcs.cloud/${fileNameFull}`;
  };
  return (
    <div>
      <FormNewsCreate />
    </div>
  );
}
