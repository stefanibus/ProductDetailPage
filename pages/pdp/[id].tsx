import { GetStaticProps } from 'next';
import { GetStaticPaths } from 'next';
import { ChangeEvent, useEffect, useState, useRef } from 'react';
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
  const targetRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 });
  const router = useRouter();
  const { query } = router;

  const defaultProductOptions = product.defaultSelectedProductOptions;
  const [configSettings, setConfigSettings] = useState(defaultProductOptions);
  const [variant, setVariant] = useState(product.variants[0]);
  const defaultPaper: ChangeEvent<HTMLSelectElement> | any = {
    target: { value: defaultProductOptions.paper }
  };

  // grab the Screen-Dimensions for our Tracking Pixel
  useEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight
      });
    }
  }, []);

  // inject the Tracking Pixel
  const trackingPixel = () => {
    if (dimensions.width > 1) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt="Tracking-Pixel"
          id="trackingPixel"
          src={`https://www.make-mobile.de/webportal/assets/php/2019_together.php?width_${dimensions.width}_height_${dimensions.height}_query=${window.location.href} `}
        />
      );
    } else {
      return 'no data yet';
    }
  };
  // [query.format]
  useEffect(() => {
    const selectVariant = (formatValue: string | string[] | undefined) => {
      return product.variants.find(
        (variant: any) => variant.format === formatValue
      );
    };

    const VariantFormatIsDefault =
      variant.format !== defaultProductOptions.format;

    const VariantFormatNotEqual = variant.format !== query.format;

    // (no query.format) --> set variant to default variant (first variant)
    if (!Boolean(query.format) && !VariantFormatIsDefault) {
      setVariant(selectVariant(defaultProductOptions.format));
    }
    // set variant to query.format
    if (Boolean(query.format) && VariantFormatNotEqual) {
      const myVariant = selectVariant(query.format);
      const formatIsValid = product.variants.some(
        (variant: any) => variant['format'] === query.format
      );
      if (formatIsValid) {
        // query.format is valid
        setVariant(myVariant);
      } else {
        // invalid query.format
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
    if (query.format === undefined) {
      var formatVal = defaultProductOptions.format;
    } else {
      formatVal = query.format.toString();
    }
    const queryInput = { ...configSettings, ...{ format: formatVal } };

    const validateQueryInput = (type: string) => {
      const ValidQueryValue = queryHelper.isValid(type, variant, query);

      if (ValidQueryValue) {
        // overwrite defaultValues with valid queryInput value
        queryInput[type] = query[type];
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
          <title>
            {product.groupName} - {product.name}
          </title>
          <link rel="icon" href="https://www.make-mobile.de/favicon.ico" />
        </Head>
        <main className={styles.main} ref={targetRef}>
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
          {/* Tracking Pixel */}
          <div className={styles.invisible}>
            {dimensions && (
              <div className={styles.trackingPic}>{trackingPixel()}</div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ProdDetailPage;

// @ts-ignore: Unreachable code error
export const getStaticProps: GetStaticProps = async (ctx: {
  params: { id: any };
}) => {
  const data = await fetch(`${process.env.API_PATH}/${ctx?.params?.id}.json`);
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
export const getStaticPaths: GetStaticPaths = async () => {
  const data = await fetch(`${process.env.API_PATH}/products.json`);

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
