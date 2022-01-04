import { useEffect } from 'react';
import { useRouter } from 'next/router';
import CreateDropdown from './createDropdown';

type DropdownContentProps = {
  dropdownname: string;
  variantsArray: any;
  handleDropdown?: (e: string) => void;
} & React.ComponentPropsWithoutRef<'option'>;

// @ts-ignore: Unreachable code error
const DropdownContent: React.FC<DropdownContentProps> = ({
  dropdownname,
  variantsArray,
  handleDropdown = (e: string) => {}
}) => {
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    const refinementValueIsNotDefault =
      query.refinement && query.refinement !== 'V00';
    // refinable Paper only in --> shortPaperList
    const shortPaperList = variantsArray.filter(
      (object: { isRefinable: any }) => object.isRefinable
    );
    const QueryPaperValue_IsMissingInShortPaperList = !shortPaperList.some(
      (paper: { key: string | string[] | undefined }) =>
        paper.key === query.paper
    );

    // paper-dropdown
    if (dropdownname === 'paper') {
      if (refinementValueIsNotDefault) {
        if (QueryPaperValue_IsMissingInShortPaperList) {
          // --> set query.paper-value to default
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
