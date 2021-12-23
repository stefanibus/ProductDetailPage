import { GetStaticProps } from 'next';
import { GetStaticPaths } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import queryHelper from '../../utils/config';
import Head from 'next/head';
import styles from './index.module.css';
import SelectField from '../../components/pdp/SelectField';
import DropdownContent from '../../components/pdp/DropdownContent';

const ProdDetailPage = ({ product }: any) => {
  const router = useRouter();
  const { query } = router;

  const defaultProdOptions = product.defaultSelectedProductOptions;
  const [configSettings, setConfigSettings] = useState(defaultProdOptions);
  const [variant, setVariant] = useState(product.variants[0]);
  const defaultPaper: ChangeEvent<HTMLSelectElement> | any = {
    target: { value: defaultProdOptions.paper }
  };

  // [query.format]
  useEffect(() => {
    const findVariant = (formatValue: string | string[]) => {
      return product.variants.find(
        (variant: any) => variant.format === formatValue
      );
    };
    // set Variant according to query Value
    if (!!query.format && variant.format !== query.format) {
      setVariant(findVariant(query.format));
    }
    // no format query --> set variant to default-Product-Options
    if (!query.format && variant.format !== defaultProdOptions.format) {
      setVariant(findVariant(defaultProdOptions.format));
    }
  }, [
    query.format,
    product.variants,
    defaultProdOptions.format,
    variant.format
  ]);

  // [query]  = update ConfigSettings
  useEffect(() => {
    const settings = { ...defaultProdOptions, ...query };
    // update ConfigSettings
    setConfigSettings(settings);
  }, [query, defaultProdOptions]);

  const handleDropdown = (
    selectFieldType: string,
    event: ChangeEvent<HTMLSelectElement> = defaultPaper
  ) => {
    if (event.target.value) {
      router.replace({
        query: { ...query, [selectFieldType]: event.target.value }
      });
    }
  };

  const getQuery = (selectType: string) => {
    return router.query[selectType]
      ? router.query[selectType]
      : defaultProdOptions[selectType];
  };

  return (
    <>
      <Head>
        <title>config Page</title>
        <link rel="icon" href="https://www.make-mobile.de/favicon.ico" />
      </Head>
      <main className={styles.containerCard}>
        <div>
          <p>PDP-Image Component</p>
          <p>Product Description</p>
          <h1>Headline</h1>
          <h3>SubTitle</h3>
          <p>PriceInfo Component</p>
          <a href={queryHelper.assembleConfigURL(configSettings)}>
            config button href{' '}
          </a>
        </div>
        <div>
          <p>Select-Fields</p>
          <SelectField
            label="Format"
            id="format"
            className={variant.format}
            defaultValue={getQuery('format')}
            key={getQuery('format')}
            onChange={e => handleDropdown('format', e)}
          >
            <DropdownContent
              dropdownname="format"
              variantsArray={product.variants}
            />
          </SelectField>

          <SelectField
            label="Papier"
            id="paper"
            defaultValue={getQuery('paper')}
            key={getQuery('paper')}
            onChange={e => handleDropdown('paper', e)}
          >
            <DropdownContent
              dropdownname="paper"
              variantsArray={variant.productOptions.papers}
              handleDropdown={handleDropdown}
            />
          </SelectField>
          <SelectField
            label="Veredelung"
            id="refinement"
            defaultValue={getQuery('refinement')}
            key={getQuery('refinement')}
            onChange={e => handleDropdown('refinement', e)}
          >
            <DropdownContent
              dropdownname="refinement"
              variantsArray={variant.productOptions.refinements}
            />
          </SelectField>
          <SelectField
            label="Menge"
            id="quantity"
            defaultValue={getQuery('quantity')}
            key={getQuery('quantity')}
            onChange={e => handleDropdown('quantity', e)}
          >
            <DropdownContent
              dropdownname="quantity"
              variantsArray={variant.prices}
            />
          </SelectField>
        </div>
      </main>
    </>
  );
};

export default ProdDetailPage;

export const getStaticProps: GetStaticProps = async ctx => {
  const data = await fetch(`http://localhost:3000/mockAPI/MGG73GG.json`);
  if (!data.ok) {
    throw new Error('Failed to fetch.');
  }
  const product = await data.json();
  return {
    props: {
      product
    },
    revalidate: 86400
  };
};

export const getStaticPaths: GetStaticPaths = async ctx => {
  const data = await fetch(`http://localhost:3000/mockAPI/products.json`);

  if (!data.ok) {
    throw new Error('Failed to fetch.');
  }
  const products = await data.json();

  return {
    paths: products.map((product: { id: any }) => ({
      params: { id: product.id }
    })),
    fallback: false
  };
};
