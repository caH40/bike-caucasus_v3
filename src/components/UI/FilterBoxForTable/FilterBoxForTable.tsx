import { Dispatch } from 'react';

import PaginationSelect from '../PaginationSelect/PaginationSelect';
// import PaginationInput from '../PaginationInput/PaginationInput';
import styles from './FilterBoxForTable.module.css';
import PaginationInput from '../PaginationInput/PaginationInput';

type Props = {
  docsOnPage: number;
  setDocsOnPage: Dispatch<React.SetStateAction<number>>;
  search: string;
  setSearch: Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
};

function FilterBoxForTable({
  docsOnPage,
  setDocsOnPage,
  search,
  setSearch,
  placeholder,
}: Props) {
  return (
    <div className={styles.block}>
      <PaginationInput search={search} setSearch={setSearch} placeholder={placeholder || ''} />
      <PaginationSelect docsOnPage={docsOnPage} setDocsOnPage={setDocsOnPage} />
    </div>
  );
}

export default FilterBoxForTable;
