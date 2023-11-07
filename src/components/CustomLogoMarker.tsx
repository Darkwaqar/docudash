import { colors } from '@utils/Colors';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { LatLng, Marker } from 'react-native-maps';
import tw from 'twrnc';
const CustomLogoMarker = ({ coordinate, onPress, title, identifier }: any) => {
  return (
    <Marker identifier={identifier} title={title} coordinate={coordinate} onPress={onPress}>
      <View style={tw`items-center justify-center`}>
        <Image source={require('../../assets/logo.png')} />
      </View>
    </Marker>
  );
};

export default CustomLogoMarker;
