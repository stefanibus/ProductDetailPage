import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Product Detail Page Challenge</title>
        <meta name="description" content="Product Detail Page Challenge" />
        <link rel="icon" href="https://www.make-mobile.de/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome
          {/* to <a href="https://nextjs.org">Next.js!</a> */}
        </h1>

        <p className={styles.description}>
          Path to result-page:{' '}
          <code className={styles.code}>pages/pdp/[id].tsx</code>
        </p>
        {/* <p className={styles.title}>
          <a href="pdp/MGG73GG">ProductDetailPage (PDP)</a>
        </p> */}

        <div className={styles.grid}>
          <a href="pdp/MGG73GG" className={styles.card}>
            <h2>ProductDetailPage &rarr;</h2>
            <p>
              ...running on Next JS 12+, with URL-Parameters including
              value-verification, React Router Query, TypeScript, REST API,
              Internat. Currency Calc().
            </p>
          </a>

          <a
            href="https://github.com/stefanibus"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h2>GitHub Project &rarr;</h2>
            <p>
              Learn more about the project and the underlying architecture & the
              inter-active business logic on GitHub. VSCode, Cypress/jest.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          target="_blank"
          href="https://make-mobile.de"
          rel="noopener noreferrer"
        >
          © Copyright 2022 ProdDetailPage. Powered with
          <span className={styles.love}> ♥ </span>
          by&nbsp; make-mobile.de .
        </a>
      </footer>
    </div>
  );
};

export default Home;
