import React from 'react';
import Unsplash from 'react-unsplash-wrapper';
import useWindowDimensions from '../hooks/windowDimensionsHook';

const LoggedOutWrapper = ({ children }) => {
  const { height, width } = useWindowDimensions();

  return <div>
    <div>
      <Unsplash
        expand
        collectionId={6770950}
        height={height}
        width={width}
      />
    </div>

    <div>
      {children}
    </div>
  </div>
}

export default LoggedOutWrapper;