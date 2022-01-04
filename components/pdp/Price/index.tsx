import queryHelper from '../../../utils/config';

// @ts-ignore: Unreachable code error
const PriceInfo = ({ configSettings, variant }) => {
  const getPrice = (type: string) => {
    return queryHelper.findPrice(type, variant, configSettings);
  };

  const calcPrice = () => {
    return (
      (Number(configSettings.quantity) *
        (getPrice('quantity') + getPrice('refinement') + getPrice('paper'))) /
      100
    );
  };

  // number formatter
  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  });

  return <p>{formatter.format(calcPrice())}</p>;
};

export default PriceInfo;
