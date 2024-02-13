import { View, Text } from 'react-native';
import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import image from '../../assets/Animation.json';
import tw from 'twrnc';
const NotFound = ({ onPress }) => {
  const animationRef = useRef<LottieView>(null);
  useEffect(() => {
    animationRef.current?.play();

    // Or set a specific startFrame and endFrame with:
    animationRef.current?.play(30, 120);
  }, []);
  return (
    <View style={tw`justify-center items-center  flex-1`}>
      {/* <View
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
      </View> */}
      <Text style={tw`text-[5]`}>No Notification </Text>
    </View>
  );
};

export default NotFound;
