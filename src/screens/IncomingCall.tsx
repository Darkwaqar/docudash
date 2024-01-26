import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useRoute, useNavigation } from '@react-navigation/native';
// @ts-ignore
import { Voximplant } from 'react-native-voximplant';
// import { DocumentNavigationProps, DocumentRouteProps } from "../types";

const IncomingCall = () => {
  const [caller, setCaller] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const { call } = route.params;

  useEffect(() => {
    setCaller(call.getEndpoints()[0].displayName);

    call.on(Voximplant.CallEvents.Disconnected, (callEvent: any) => {
      //   navigation.navigate('ContactList');
    });

    return () => {
      call.off(Voximplant.CallEvents.Disconnected);
    };
  }, []);

  const onDecline = () => {
    call.decline();
  };

  const onAccept = () => {
    //@ts-ignore
    navigation.navigate('Calling', {
      call,
      isIncomingCall: true,
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/ios_bg.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <Text style={styles.name}>{caller}</Text>
      <Text style={styles.phoneNumber}>WhatsApp video...</Text>

      <View style={[styles.row, { marginTop: 'auto' }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="alarm" color="white" size={30} />
          <Text style={styles.iconText}>Remind me</Text>
        </View>
        <View style={styles.iconContainer}>
          <Entypo name="message" color="white" size={30} />
          <Text style={styles.iconText}>Message</Text>
        </View>
      </View>

      <View style={styles.row}>
        {/* Decline Button */}
        <Pressable onPress={onDecline} style={styles.iconContainer}>
          <View style={styles.iconButtonContainer}>
            <Feather name="x" color="white" size={40} />
          </View>
          <Text style={styles.iconText}>Decline</Text>
        </Pressable>

        {/* Accept Button */}
        <Pressable onPress={onAccept} style={styles.iconContainer}>
          <View style={[styles.iconButtonContainer, { backgroundColor: '#2e7bff' }]}>
            <Feather name="check" color="white" size={40} />
          </View>
          <Text style={styles.iconText}>Accept</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 100,
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 20,
    color: 'white',
  },
  bg: {
    backgroundColor: 'red',
    flex: 1,
    alignItems: 'center',
    padding: 10,
    paddingBottom: 50,
  },

  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  iconText: {
    color: 'white',
    marginTop: 10,
  },
  iconButtonContainer: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
    margin: 10,
  },
});

export default IncomingCall;
