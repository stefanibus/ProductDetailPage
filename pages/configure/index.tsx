import { useRouter } from 'next/router';
import styles from './index.module.css';
import Head from 'next/head';

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
          <h1>Your selected options</h1>
          <ul>
            {Object.entries(query).map(([key, value]) => {
              return (
                <li key={key}>
                  {key} = {value}
                </li>
              );
            })}{' '}
          </ul>

          <button onClick={() => router.back()}>return</button>
        </main>
      </div>
    </>
  );
};

export default Configure;
