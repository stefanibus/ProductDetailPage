import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from './index.module.css';
import Button from '../../components/button';

const Configure = () => {
  const router = useRouter();
  const { query } = router;

  return (
    <>
      <div className={styles.container}>
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
      </div>
    </>
  );
};

export default Configure;
