import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import tw from 'twrnc';

const Loader = () => {
  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <Image style={tw`h-50 w-50 `} source={require('@assets/Loader/docudash-loader.gif')} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({});
