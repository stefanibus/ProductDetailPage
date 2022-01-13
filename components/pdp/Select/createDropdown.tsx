import queryHelper from '../../../utils/config';
import formatter from '../../../utils/currencyFormatter';

const CreateDropdown = (selecttype = '', relevantVariant: any[]) => {
  // @ts-ignore: Unreachable code error
  const dropType = queryHelper.dropConfig[selecttype];
  const keyVal = dropType.keyValue;
  const labelVal = dropType.labelValue;
  const priceVal = dropType.priceValue;

  return relevantVariant.map(
    (object: {
      [x: string]: boolean | null | undefined | any;
      price: number;
    }) => {
      return (
        <option
          key={object[keyVal]}
          value={object[keyVal]}
          data-price={labelVal === 'quantity' ? object[priceVal] : undefined}
        >
          {object[labelVal]}
          {object.price
            ? ` ${selecttype === 'quantity' ? ` Stück a' ` : ` + `}
                ${formatter.format(Number(object.price) / 100)}`
            : undefined}
        </option>
      );
    }
  );
};
export default CreateDropdown;
