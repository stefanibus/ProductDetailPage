import queryHelper from '../../../utils/config';

const CreateDropdown = (
  selecttype = '',
  dropdownname = '',
  variantsArray: any[]
) => {
  // @ts-ignore: Unreachable code error
  const dropType = queryHelper.dropConfig[dropdownname];
  const keyVal = dropType.keyValue;
  const labelVal = dropType.labelValue;
  const priceVal = dropType.priceValue;

  return variantsArray.map(
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
            ? ` ${selecttype === 'paper' ? ` + ` : `Stück a' `}${(
                object.price / 100
              )
                .toFixed(2)
                .toString()} Euro`
            : undefined}
        </option>
      );
    }
  );
};
export default CreateDropdown;
