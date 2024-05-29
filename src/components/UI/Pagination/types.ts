export type TPropsPagination = {
  pages: number[];
  // eslint-disable-next-line no-unused-vars
  getClick: (item: '<<' | '>>' | number) => void;
  page: number;
};
