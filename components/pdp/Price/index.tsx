import queryHelper from '../../../utils/config';
import formatter from '../../../utils/currencyFormatter';
import styles from './index.module.css';

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

  return <div className={styles.price}>{formatter.format(calcPrice())}</div>;
};

export default PriceInfo;
