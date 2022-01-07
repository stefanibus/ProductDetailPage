import { GetStaticProps } from 'next';
import { GetStaticPaths } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import queryHelper from '../../utils/config';
import Head from 'next/head';
import styles from './index.module.css';
import SelectField from '../../components/pdp/SelectField';
import Select from '../../components/pdp/Select';
import Price from '../../components/pdp/Price';
import Button from '../../components/button';
import Images from '../../components/pdp/images';

const ProdDetailPage = ({ product }: any) => {
  const router = useRouter();
  const { query } = router;

  const defaultProductOptions = product.defaultSelectedProductOptions;
  const [configSettings, setConfigSettings] = useState(defaultProductOptions);
  const [variant, setVariant] = useState(product.variants[0]);
  const defaultPaper: ChangeEvent<HTMLSelectElement> | any = {
    target: { value: defaultProductOptions.paper }
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
      variant.format !== defaultProductOptions.format;
    const newQueryFormat =
      // the current variant differs from that query value
      variant.format !== query.format;

    // set variant to default variant (no query.format)
    if (!Boolean(query.format) && newDefaultFormat) {
      setVariant(selectVariant(defaultProductOptions.format));
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
          query: { ...query, ...{ format: defaultProductOptions.format } }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    query.format,
    product.variants,
    defaultProductOptions.format,
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
        queryInput[type] = defaultProductOptions[type];
      }
    };

    // validate query values for paper, refinement and quantity
    const formatTypes = ['paper', 'refinement', 'quantity'];
    formatTypes.forEach(validateQueryInput);
    // update configSettings with validated query-input
    setConfigSettings(queryInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, defaultProductOptions]);

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
      <div className={styles.containerCard}>
        <Head>
          <title>config Page</title>
          <link rel="icon" href="https://www.make-mobile.de/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <Images variant={variant} />
          <div className={styles.productDescription}>
            <div>
              <h1 className={styles.cardType}>{product.groupName}</h1>
              <h3 className={styles.cardName}>{product.name}</h3>
              <Price configSettings={configSettings} variant={variant} />
            </div>
            <SelectField
              label="Format"
              id="format"
              className={variant.format}
              defaultValue={configSettings.format}
              key={configSettings.format}
              onChange={e => handleDropdown('format', e)}
            >
              <Select
                dropdownname="format"
                relevantVariant={product.variants}
              />
            </SelectField>

            <SelectField
              label="Papier"
              id="paper"
              defaultValue={configSettings.paper}
              key={configSettings.paper}
              onChange={e => handleDropdown('paper', e)}
            >
              <Select
                dropdownname="paper"
                relevantVariant={variant.productOptions.papers}
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
              <Select
                dropdownname="refinement"
                relevantVariant={variant.productOptions.refinements}
              />
            </SelectField>
            <SelectField
              label="Menge"
              id="quantity"
              defaultValue={configSettings.quantity}
              key={configSettings.quantity}
              onChange={e => handleDropdown('quantity', e)}
            >
              <Select
                dropdownname="quantity"
                relevantVariant={variant.prices}
              />
            </SelectField>
            <div className={styles.wrapButton}>
              <Button href={`${queryHelper.assembleURL(configSettings)}`}>
                Jetzt gestalten
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProdDetailPage;

export const getStaticProps: GetStaticProps = async ctx => {
  // const data = await fetch(
  //   `http://localhost:3000/mockAPI/${ctx?.params?.id}.json`
  // );
  const data = await fetch(
    `https://raw.githubusercontent.com/stefanibus/ProductDetailPage/main/public/mockAPI/MGG73GG.json`
  );
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
  const data = await fetch(
    `https://raw.githubusercontent.com/stefanibus/ProductDetailPage/main/public/mockAPI/products.json`
  );

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
