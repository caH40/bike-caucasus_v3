import { Dispatch } from 'react';

import styles from './PaginationInput.module.css';

type Props = {
  search: string;
  setSearch: Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
};

function PaginationInput({ search, setSearch, placeholder }: Props) {
  return (
    <input
      value={search}
      className={styles.input}
      onChange={(e) => {
        setSearch(e.target.value);
      }}
      placeholder={placeholder}
    />
  );
}

export default PaginationInput;
