import { adBlocks } from './blocks';

type RenderOptions = {
  renderTo: string;
  blockId: string;
  type?: string;
};
/**
 * Рекомендательный виджет
 * @param {number} number номер блока присвоенный РСЯ, диапазон  4-8 (создаются блоки на сайте РСЯ)
 */
export const adBlockRecommendation = (number: number) => {
  const label = adBlocks.find((block) => block.id === number);

  if (!label) {
    return;
  }

  window.yaContextCb.push(() => {
    const renderOptions: RenderOptions = {
      renderTo: `yandex_rtb_${label.label}`,
      blockId: label.label,
    };

    switch (label.type) {
      case 'feed':
        renderOptions.type = 'feed';
        window.Ya.Context.AdvManager.render(renderOptions);
        break;

      case 'widget':
        window.Ya.Context.AdvManager.renderWidget(renderOptions);
        break;

      default:
        window.Ya.Context.AdvManager.render(renderOptions);
        break;
    }
  });
};
