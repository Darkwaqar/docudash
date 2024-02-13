import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import CallActionBox from '../components/CallActionBox';
import Ionicons from '@expo/vector-icons/Ionicons';
// @ts-ignore
import { Voximplant } from 'react-native-voximplant';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectProfileData } from '@stores/slices/UserSlice';
// import { DocumentNavigationProps, DocumentRouteProps } from "../types";

const permissions = [
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  PermissionsAndroid.PERMISSIONS.CAMERA,
];

const Calling = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [callStatus, setCallStatus] = useState('Initializing...');
  const [localVideoStreamId, setLocalVideoStreamId] = useState('');
  const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');
  const userInfo = useSelector(selectProfileData);
  console.log('user StackNavigator', userInfo?.email?.split('@')[0]);
  const navigation = useNavigation();
  const route = useRoute();

  const { user, call: incomingCall, isIncomingCall } = route?.params;
  // const user = {
  //   user_id: '1',
  //   user_name: 'Abdul Qayyum',
  //   user_display_name: 'Abdul',
  // };

  console.log(user);

  const voximplant = Voximplant.getInstance();

  const call = useRef(incomingCall);
  const endpoint = useRef<any>(null);

  const goBack = () => {
    navigation.pop();
  };

  useEffect(() => {
    const getPermissions = async () => {
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const recordAudioGranted = granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
      const cameraGranted = granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
      if (!cameraGranted || !recordAudioGranted) {
        Alert.alert('Permissions not granted');
      } else {
        setPermissionGranted(true);
      }
    };

    if (Platform.OS === 'android') {
      getPermissions();
    } else {
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    if (!permissionGranted) {
      return;
    }

    const callSettings = {
      video: {
        sendVideo: true,
        receiveVideo: true,
      },
    };

    const makeCall = async () => {
      console.log('makeCall', user.user_name);
      call.current = await voximplant.call(user.user_name?.split('@')[0], callSettings);
      subscribeToCallEvents();
    };

    const answerCall = async () => {
      subscribeToCallEvents();
      endpoint.current = call.current.getEndpoints()[0];
      subscribeToEndpointEvent();
      call.current.answer(callSettings);
    };

    const subscribeToCallEvents = () => {
      call.current.on(Voximplant.CallEvents.Failed, (callEvent: any) => {
        console.log(callEvent);
        showError(callEvent.reason);
      });
      call.current.on(Voximplant.CallEvents.ProgressToneStart, (callEvent: any) => {
        setCallStatus('Calling...');
      });
      call.current.on(Voximplant.CallEvents.Connected, (callEvent: any) => {
        setCallStatus('Connected');
      });
      call.current.on(Voximplant.CallEvents.Disconnected, (callEvent: any) => {
        navigation.navigate('Home');
      });
      call.current.on(Voximplant.CallEvents.LocalVideoStreamAdded, (callEvent: any) => {
        setLocalVideoStreamId(callEvent.videoStream.id);
      });
      call.current.on(Voximplant.CallEvents.EndpointAdded, (callEvent: any) => {
        endpoint.current = callEvent.endpoint;
        subscribeToEndpointEvent();
      });
    };

    const subscribeToEndpointEvent = async () => {
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        (endpointEvent: any) => {
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
        }
      );
    };

    const showError = (reason: string) => {
      Alert.alert('Call failed', `Reason: ${reason}`, [
        {
          text: 'Ok',
          onPress: () => navigation.goBack(),
        },
      ]);
    };

    if (isIncomingCall) {
      answerCall();
    } else {
      makeCall();
    }

    return () => {
      call.current.off(Voximplant.CallEvents.Failed);
      call.current.off(Voximplant.CallEvents.ProgressToneStart);
      call.current.off(Voximplant.CallEvents.Connected);
      call.current.off(Voximplant.CallEvents.Disconnected);
    };
  }, [permissionGranted]);

  const onHangupPress = () => {
    call.current.hangup();
    goBack;
    // alert('Hello');
  };

  return (
    <View style={styles.page}>
      <Pressable onPress={goBack} style={styles.backButton}>
        <Ionicons name="chevron-back" color="white" size={25} />
      </Pressable>

      <Voximplant.VideoView videoStreamId={remoteVideoStreamId} style={styles.remoteVideo} />

      <Voximplant.VideoView videoStreamId={localVideoStreamId} style={styles.localVideo} />

      <View style={styles.cameraPreview}>
        <Text style={styles.name}>{user?.user_display_name}</Text>
        <Text style={styles.phoneNumber}>{callStatus}</Text>
      </View>

      <CallActionBox onHangupPress={onHangupPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    height: '100%',
    backgroundColor: '#7b4e80',
  },
  cameraPreview: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  localVideo: {
    width: 100,
    height: 150,
    backgroundColor: '#ffff6e',

    borderRadius: 10,

    position: 'absolute',
    right: 10,
    top: 100,
  },
  remoteVideo: {
    backgroundColor: '#7b4e80',
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 100,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 50,
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 20,
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 10,
    zIndex: 10,
  },
});

export default Calling;
