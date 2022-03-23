import React from 'react';
import * as animationData from '../../assets/lottie/notFound.json';
import Lottie from 'react-lottie';
import useWindowDimensions from '../../config/constants';

const NotFound = () => {
  return (
    <Lottie
      options={{
        animationData,
      }}
      style={{
        width: `${useWindowDimensions().width}`,
        height: `${useWindowDimensions().height}`,
      }}
    />
  );
};
export default NotFound;
