/* eslint-disable no-unused-vars */
// global.d.ts
interface Window {
  yaContextCb: any[];
  Ya: {
    Context: {
      AdvManager: {
        render: (options: RenderOptions) => void;
        renderWidget: (options: RenderOptions) => void;
      };
    };
  };
}

type RenderOptions = {
  renderTo: string;
  blockId: string;
  type?: string;
};
