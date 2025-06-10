import { syntaxHighlight } from '@/libs/utils/hightlight';
import styles from './JSONBlock.module.css';

function JSONBlock({ json }: { json: Record<string, any> }) {
  return (
    <div className={styles.group}>
      <pre
        className={styles.scrollable}
        dangerouslySetInnerHTML={{
          __html: syntaxHighlight(JSON.stringify(json, undefined, 3), styles),
        }}
      />
    </div>
  );
}

export default JSONBlock;
