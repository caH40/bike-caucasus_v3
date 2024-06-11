'use client';

import { useEffect, useState } from 'react';

import NewsCard from '../NewsCard/NewsCard';
import TitleAndLine from '../TitleAndLine/TitleAndLine';
import { getNews } from '@/actions/news';
import type { TNewsGetOneDto } from '@/types/dto.types';
import styles from './BlockNews.module.css';
import Pagination from '../UI/PaginationCurrent/Pagination';

type Props = {
  idUserDB?: string | undefined;
};

export default function BlockNews({ idUserDB }: Props) {
  const [news, setNews] = useState<TNewsGetOneDto[]>([]);
  const [page, setPage] = useState<number>(1);
  const [quantityPages, setQuantityPages] = useState<number>(1);

  useEffect(() => {
    getNews({ idUserDB, page, docsOnPage: 5 }).then((data) => {
      if (data) {
        setNews(data.news);
        setQuantityPages(data.quantityPages);
      } else {
        setNews([]);
      }
    });
  }, [page, idUserDB]);

  return (
    !!news.length && (
      <div className={styles.wrapper}>
        <TitleAndLine hSize={2} title="Новости" />
        <div className={styles.wrapper__cards}>
          {news.map((elm) => (
            <NewsCard key={String(elm._id)} newsOne={elm} />
          ))}
        </div>
        <Pagination
          isFirstPage={page === 1}
          isLastPage={page === quantityPages}
          quantityPages={quantityPages}
          page={page}
          setPage={setPage}
        />
      </div>
    )
  );
}
