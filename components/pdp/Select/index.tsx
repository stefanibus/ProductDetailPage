import { useEffect } from 'react';
import { useRouter } from 'next/router';
import CreateDropdown from './createDropdown';

type DropdownContentProps = {
  dropdownname: string;
  relevantVariant: any;
  handleDropdown?: (e: string) => void;
} & React.ComponentPropsWithoutRef<'select'>;

// @ts-ignore: Unreachable code error
const Select: React.FC<DropdownContentProps> = ({
  dropdownname,
  relevantVariant,
  handleDropdown = (e: string) => {}
}) => {
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    const refinementValueIsNotDefault =
      query.refinement && query.refinement !== 'V00';
    // refinable Paper only in --> shortPaperList
    const shortPaperList = relevantVariant.filter(
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
    relevantVariant,
    query.refinement,
    handleDropdown
  ]);

  const refinablePaper = relevantVariant.filter(
    (object: { isRefinable: any }) => object.isRefinable
  );

  switch (dropdownname) {
    case 'format': {
      return CreateDropdown('format', relevantVariant);
    }
    case 'refinement': {
      return CreateDropdown('refinement', relevantVariant);
    }
    case 'quantity': {
      return CreateDropdown('quantity', relevantVariant);
    }
    case 'paper': {
      if (query.refinement && query.refinement !== 'V00') {
        return CreateDropdown('paper', refinablePaper);
      } else {
        return CreateDropdown('paper', relevantVariant);
      }
    }
  }
};

export default Select;
