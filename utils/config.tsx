const queryHelper = {
  assembleConfigURL: (configSettings: { [x: string]: string }) => {
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
      priceValue: 'price'
    },
    refinement: {
      keyValue: 'key',
      labelValue: 'label',
      priceValue: 'label'
    },

    quantity: {
      keyValue: 'quantity',
      labelValue: 'quantity',
      priceValue: 'price'
    }
  }
};
export default queryHelper;
