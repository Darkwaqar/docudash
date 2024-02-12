import { View, Text } from 'react-native';
import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import image from '../../assets/Animation.json';
const NotFound = ({ onPress }) => {
  const animationRef = useRef<LottieView>(null);
  useEffect(() => {
    animationRef.current?.play();

    // Or set a specific startFrame and endFrame with:
    animationRef.current?.play(30, 120);
  }, []);
  return (
    <View>
      <View
        style={{
          //   flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',

          //   height: 500,
          //   backgroundColor: 'red',
        }}
      >
        <LottieView
          style={{ width: '100%', height: 200 }}
          ref={animationRef}
          source={image}
          autoPlay
          loop
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

export default NotFound;
