import { useRouter } from 'next/router';
import { useRef } from 'react';
import Head from 'next/head';
import styles from './index.module.css';
import Button from '../../components/button';
import useTracking from '../../utils/useTracking';

const Configure = () => {
  const router = useRouter();
  const { query } = router;
  const targetRef = useRef<HTMLDivElement>(null);
  const trackingPixel = useTracking(targetRef);

  return (
    <>
      <div className={styles.container} ref={targetRef}>
        <Head>
          <title>config Page</title>
          <link rel="icon" href="https://www.make-mobile.de/favicon.ico" />
        </Head>
        <main>
          <h1>Your selected options:</h1>
          <ul className={styles.ul}>
            {Object.entries(query).map(([key, value]) => {
              return (
                <li key={key}>
                  <span className={styles.values}>{value}</span> ...{key}
                </li>
              );
            })}
          </ul>
          <div className={styles.wrapButton}>
            <Button onClick={() => router.back()}>zurück...</Button>
          </div>
        </main>

        {/* Tracking Pixel */}
        <div className={styles.invisible}>{trackingPixel}</div>
      </div>
    </>
  );
};

export default Configure;
