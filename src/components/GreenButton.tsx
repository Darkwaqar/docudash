import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "../Colors";
interface props {
  text: string;
  onPress: () => void;
}
const GreenButton = (props: props) => {
  const { text, onPress } = props;
  return (
    <Pressable
      onPress={onPress}
      style={tw`bg-[${colors.green}] mt-4 h-11 rounded-full justify-center items-center`}
    >
      <Text style={tw`text-[${colors.white}] `}>{text}</Text>
    </Pressable>
  );
};

export default GreenButton;

const styles = StyleSheet.create({});
