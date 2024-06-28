import React from 'react';
import Lottie from 'lottie-react';
import PropTypes from 'prop-types';
import "./LottieAnimation.css";

const LottieAnimation = ({ animationData }) => {
  return <Lottie className="lottie-animation" animationData={animationData} loop={true} />;
};

LottieAnimation.propTypes = {
  animationData: PropTypes.object.isRequired,
};

export default LottieAnimation;
