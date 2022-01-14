import { useState, useEffect, RefObject } from 'react';

const useTracking = (myRef: RefObject<HTMLDivElement>) => {
  const [dimensions, setDimensions] = useState({
    width: 1,
    height: 1,
    hrefPath: ''
  });

  // grab screen-dimensions and href-path
  useEffect(() => {
    if (myRef.current) {
      setDimensions({
        width: myRef.current.offsetWidth,
        height: myRef.current.offsetHeight,
        hrefPath: window.location.href
      });
    }
  }, [myRef]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      style={{ visibility: 'hidden' }}
      alt="Tracking-Pixel"
      id="trackingPixel"
      src={`https://www.make-mobile.de/webportal/assets/php/2019_together.php?width_${dimensions.width}_height_${dimensions.height}_query=${dimensions.hrefPath}  `}
    />
  );
};

export default useTracking;
