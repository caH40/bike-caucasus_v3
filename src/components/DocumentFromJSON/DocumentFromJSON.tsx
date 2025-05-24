import { renderTextWithLinks } from '@/libs/utils/html-jsx';

import styles from './DocumentFromJSON.module.css';
import { TJsonDocument } from '@/types/index.interface';

type Props = {
  dataJson: TJsonDocument;
};

/**
 * Компонент формирование документа.
 */
export default function DocumentFromJSON({ dataJson }: Props) {
  return (
    <div className={styles.wrapper}>
      {dataJson.application && (
        <div className={styles.wrapper__application}>
          <h3 className={styles.title__application}>{dataJson.application}</h3>
          <h3 className={styles.title__application}>{dataJson.applicationAffiliation}</h3>
        </div>
      )}

      <h1 className={styles.title}>{dataJson.title}</h1>
      <p className={styles.updated}>{dataJson.lastUpdated}</p>

      {dataJson.sections.map((section, indexSection) => (
        <div key={indexSection} className={styles.section}>
          <h2 className={styles.title__section}>
            {section.number && `${section.number}. `}
            {section.title}
          </h2>

          {section.content.map((contentItem, indexContent) => (
            <div key={indexContent} className={styles.content__item}>
              <p className={styles.content__text}>
                {contentItem.number} {renderTextWithLinks(contentItem.text)}
              </p>

              {contentItem.term && (
                <ul className={styles.list__term}>
                  {contentItem.term.map((termItem, index) => (
                    <li key={index} className={styles.item}>
                      <strong className={styles.term}>{termItem.term}:</strong>{' '}
                      {termItem.definition}
                    </li>
                  ))}
                </ul>
              )}

              {contentItem.list && (
                <ul className={styles.list__circle}>
                  {contentItem.list.map((item, index) => (
                    <li key={index} className={styles.item}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {contentItem.contentSecond &&
                contentItem.contentSecond.map((contentSecond, index) => (
                  <p className={styles.contentSecond__text} key={index}>
                    {contentSecond.number}. {renderTextWithLinks(contentSecond.text)}
                  </p>
                ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
