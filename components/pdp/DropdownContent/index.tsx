import { useEffect } from 'react';
import { useRouter } from 'next/router';
import CreateDropdown from './createDropdown';

type DropdownContentProps = {
  dropdownname: string;
  variantsArray: any;
  handleDropdown?: (e: any, f?: any) => void;
} & React.ComponentPropsWithoutRef<'option'>;

// @ts-ignore: Unreachable code error
const DropdownContent: React.FC<DropdownContentProps> = ({
  dropdownname,
  variantsArray,
  handleDropdown = (e: any) => {}
}) => {
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    // paper-dropdown
    if (dropdownname === 'paper') {
      // refinement-Value is not equal to default-Value
      if (query.refinement && query.refinement !== 'V00') {
        const refinablePaper = variantsArray.filter(
          (object: { isRefinable: any }) => object.isRefinable
        );
        // IF the query-Paper-value is missing inside of our shortened refinablePaper-List
        if (
          !refinablePaper.some(
            (paper: { key: string | string[] | undefined }) =>
              paper.key === query.paper
          )
        ) {
          // --> reset query.paper to default paper-value
          handleDropdown('paper');
        }
      }
    }
  }, [
    query.paper,
    dropdownname,
    variantsArray,
    query.refinement,
    handleDropdown
  ]);

  const refinablePaper = variantsArray.filter(
    (object: { isRefinable: any }) => object.isRefinable
  );

  switch (dropdownname) {
    case 'format': {
      return CreateDropdown('format', dropdownname, variantsArray);
    }
    case 'refinement': {
      return CreateDropdown('refinement', dropdownname, variantsArray);
    }
    case 'quantity': {
      return CreateDropdown('quantity', dropdownname, variantsArray);
    }
    case 'paper': {
      if (query.refinement && query.refinement !== 'V00') {
        return CreateDropdown('paper', dropdownname, refinablePaper);
      } else {
        return CreateDropdown('paper', dropdownname, variantsArray);
      }
    }
  }
};

export default DropdownContent;
