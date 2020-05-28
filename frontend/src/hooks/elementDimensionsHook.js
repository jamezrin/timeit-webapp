import { useEffect, useState } from 'react';

function getElementDimensions(element) {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
  };
}

export default function useElementDimensions(elementRef) {
  const [elementDimensions, setElementDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function updateDimensions() {
      if (elementRef.current) {
        setElementDimensions(getElementDimensions(elementRef.current));
      } else {
        setElementDimensions({
          width: 0,
          height: 0,
        });
      }
    }

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [elementRef]);

  return elementDimensions;
}
