export type TPropsPagination = {
  pages: number[];
   
  getClick: (item: '<<' | '>>' | number) => void;
  page: number;
};
