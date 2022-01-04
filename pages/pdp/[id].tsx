import { GetStaticProps } from 'next';
import { GetStaticPaths } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import queryHelper from '../../utils/config';
import Head from 'next/head';
import styles from './index.module.css';
import SelectField from '../../components/pdp/SelectField';
import DropdownContent from '../../components/pdp/DropdownContent';
import Price from '../../components/pdp/Price';

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
    const selectVariant = (formatValue: string | string[] | undefined) => {
      return product.variants.find(
        (variant: any) => variant.format === formatValue
      );
    };
    const newDefaultFormat =
      // default format differs to current variant format
      variant.format !== defaultProdOptions.format;
    const newQueryFormat =
      // the current variant differs from that query value
      variant.format !== query.format;

    // set variant to default variant (no query.format)
    if (!Boolean(query.format) && newDefaultFormat) {
      setVariant(selectVariant(defaultProdOptions.format));
    }
    // set variant to query.format (query.format does exist and is valid)
    if (Boolean(query.format) && newQueryFormat) {
      const updateVariant = selectVariant(query.format);
      const formatIsValid = product.variants.some(
        (variant: any) => variant['format'] === query.format
      );
      if (formatIsValid) {
        setVariant(updateVariant);
      } else {
        // invalid query.format --> set variant to default
        router.replace({
          query: { ...query, ...{ format: defaultProdOptions.format } }
        });
      }
    }
  }, [
    query.format,
    product.variants,
    defaultProdOptions.format,
    variant.format
  ]);

  // [query]  = update ConfigSettings
  useEffect(() => {
    const queryInput = { ...configSettings, ...{ format: query.format } };

    const validateQueryInput = (type: string) => {
      const ValidQueryValue = queryHelper.isValid(type, variant, query);

      if (ValidQueryValue) {
        // update queryInput with valid value
        queryInput[type] = query[type];
      } else {
        // reset queryInput to default
        queryInput[type] = defaultProdOptions[type];
      }
    };

    // validate query values for paper, refinement and quantity
    const formatTypes = ['paper', 'refinement', 'quantity'];
    formatTypes.forEach(validateQueryInput);
    // update configSettings with validated query-input
    setConfigSettings(queryInput);
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
          <p>Price Component</p>
          <Price configSettings={configSettings} variant={variant} />
          <a href={queryHelper.assembleURL(configSettings)}>
            config button href{' '}
          </a>
        </div>
        <div>
          <p>Select-Fields</p>
          <SelectField
            label="Format"
            id="format"
            className={variant.format}
            defaultValue={configSettings.format}
            key={configSettings.format}
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
            defaultValue={configSettings.paper}
            key={configSettings.paper}
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
            defaultValue={configSettings.refinement}
            key={configSettings.refinement}
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
            defaultValue={configSettings.quantity}
            key={configSettings.quantity}
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
