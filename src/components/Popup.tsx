import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import tw from 'twrnc';

import { colors } from '@utils/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface IPopup {
  heading: string | null;
  description: string | null;
  alert: boolean;
  setAlert: Dispatch<SetStateAction<boolean>>;
}

export const Popup = ({ heading, alert, description, setAlert }: IPopup) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    setIsVisible(alert);
    // console.log(alert);
  }, [alert]);

  return (
    <Modal
      visible={isVisible}
      onDismiss={() => {
        setIsVisible(false);
        setAlert(false);
      }}
      // panDirection={PanningProvider.Directions.DOWN}
    >
      <View style={tw`bg-[${colors.green}] p-3 pt-5 rounded-xl `}>
        <Text style={tw`text-[${colors.white}] text-5 font-bold`}>{heading}</Text>

        <View style={tw`mt-2`}>
          <Text style={tw`text-[${colors.white}] text-4`}>{description}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setIsVisible(false);
            setAlert(false);
          }}
          style={tw`bg-[${colors.blue}] items-center justify-center py-2 rounded-2xl mt-3`}
        >
          <Text style={tw`text-[${colors.white}]`}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});
