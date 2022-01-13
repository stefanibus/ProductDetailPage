const queryHelper = {
  assembleURL: (configSettings: { [x: string]: string }) => {
    var queryString = Object.keys(configSettings)
      .map(key => {
        return key + '=' + configSettings[key];
      })
      .join('&');
    return `/configure/?${queryString}`;
  },
  dropConfig: {
    format: {
      keyValue: 'format',
      labelValue: 'formatLabel',
      priceValue: 'format'
    },
    paper: {
      keyValue: 'key',
      labelValue: 'label',
      priceValue: 'price',
      propertyDepth1: 'productOptions',
      propertyDepth2: 'papers'
    },
    refinement: {
      keyValue: 'key',
      labelValue: 'label',
      priceValue: 'label',
      propertyDepth1: 'productOptions',
      propertyDepth2: 'refinements'
    },
    quantity: {
      keyValue: 'quantity',
      labelValue: 'quantity',
      priceValue: 'price',
      propertyDepth1: 'prices'
    }
  },
  getPath: (type: string, variant: any, settings: any) => {
    // @ts-ignore: Unreachable code error
    const start = queryHelper.dropConfig[type];
    const path1 = variant[start.propertyDepth1];
    const path2 = variant[start.propertyDepth1][start.propertyDepth2];

    const variantPath = () => {
      if (type === 'quantity') {
        return path1;
      } else {
        return path2;
      }
    };
    // provide path for this variant
    return variantPath();
  },
  findPrice: (type: string, variant: any, settings: any) => {
    // @ts-ignore: Unreachable code error
    const start = queryHelper.dropConfig[type];
    // find the price for this variant
    return queryHelper
      .getPath(type, variant, settings)
      .find((variant: any) => variant[start.keyValue] == settings[type]).price;
  },
  isValid: (type: string, variant: any, query: any) => {
    // @ts-ignore: Unreachable code error
    const start = queryHelper.dropConfig[type];
    // validate the query-value for this variant
    return queryHelper
      .getPath(type, variant, query)
      .some((variant: any) => variant[start.keyValue] == query[type]);
  }
};
export default queryHelper;
