import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddAddress from '@screens/Address/AddAddress';
import Addresses from '@screens/Address/List';
import Browser from '@screens/Browser';
import AddContact from '@screens/Contact/AddContact';
import Contacts from '@screens/Contact/List';
import AddRecipient from '@screens/Manage/AddRecipient';
import Details from '@screens/Manage/Details';
import DocumentEditor from '@screens/Manage/DocumentEditor';
import DocumentViewer from '@screens/Manage/DocumentViewer';
import Edit from '@screens/Manage/Edit';
import SignatureSelection from '@screens/Manage/SignatureSelection';
import StampSelection from '@screens/Manage/StampSelection';
import Map from '@screens/Map';
import ApproveRequest from '@screens/Notary/ApproveRequest';
import CreateARequest from '@screens/Notary/CreateARequest';
import NotaryProfile from '@screens/Notary/NotaryProfile';
import Profile from '@screens/Profile';
import RequestDetails from '@screens/Request/Details';
import NotaryOrUser from '@screens/SignUp1/NotaryOrUser';
import AddSignature from '@screens/Signatures/AddSignature';
import Signatures from '@screens/Signatures/List';
import AddStamp from '@screens/Stamp/AddStamps';
import Stamps from '@screens/Stamp/List';
import { selectAccessToken, selectProfileData, setUserStep } from '@stores/slices/UserSlice';
import { StripeProvider } from '@stripe/stripe-react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../types/navigation';
import DrawerNavigator from './DrawerNavigator';
import LoginStackNavigator from './LoginStackNavigator';
import NotaryLoginStackNavigator from './NotaryLoginStackNavigator';
import Calling from '@screens/Calling';
import Call from '@screens/Call';
import IncomingCallScreen from '@screens/IncomingCall';
import { Voximplant } from 'react-native-voximplant';
import { useNavigation } from '@react-navigation/native';
import calls from '@screens/Store';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  const user = useSelector(selectAccessToken);
  const userInfo = useSelector(selectProfileData);
  const navigation = useNavigation();
  console.log('user StackNavigator', userInfo?.email?.split('@')[0]);
  const APP_NAME = 'docudash';
  const ACC_NAME = 'wizard.n2';
  // const ACC_NAME = userInfo?.email?.split('@')[0];
  const password = '12345678';
  // const password = '123123';
  // const username = 'urspecial1one';
  const username = userInfo?.email?.split('@')[0];

  const voximplant = Voximplant.getInstance();
  function convertCodeMessage(code: number) {
    switch (code) {
      case 401:
        return 'Invalid password';
      case 404:
        return 'Invalid user';
      case 491:
        return 'Invalid state';
      default:
        return 'Try again later';
    }
  }
  useEffect(() => {
    voximplant.on(Voximplant.ClientEvents.IncomingCall, (incomingCallEvent) => {
      calls.set(incomingCallEvent.call.callId, incomingCallEvent.call);
      navigation.navigate('IncomingCall', {
        call: incomingCallEvent.call,
      });
    });
    return function cleanup() {
      voximplant.off(Voximplant.ClientEvents.IncomingCall);
    };
  });
  useEffect(() => {
    const Login = async () => {
      try {
        let clientState = await voximplant.getClientState();
        if (clientState === Voximplant.ClientState.DISCONNECTED) {
          await voximplant.connect();
          await voximplant.login(`${username}@${APP_NAME}.${ACC_NAME}.voximplant.com`, password);
          console.log('connected');
        }
        if (clientState === Voximplant.ClientState.CONNECTED) {
          await voximplant.login(`${username}@${APP_NAME}.${ACC_NAME}.voximplant.com`, password);
          console.log('connected');
        }
      } catch (e: any) {
        let message;
        console.log('Error on Voximplant', message);
        switch (e.name) {
          case Voximplant.ClientEvents.ConnectionFailed:
            message = 'Connection error, check your internet connection';
            break;
          case Voximplant.ClientEvents.AuthResult:
            message = convertCodeMessage(e.code);
            break;
          default:
            message = 'Unknown error. Try again';
        }
        console.log('Error on Voximplant', message);
        // showLoginError(message);
      }
    };

    Login();
  }, [user]);
  return (
    <StripeProvider
      merchantIdentifier="merchant.com.Docudash"
      publishableKey={
        'pk_test_51NGLKgENH01nEXEQS9Gnq8NlhNxD5nZ6rXpa9Fr1q5DOyupUahN1k22hE4y9azhfErdmPoMyn6oZzItFyMexZBnl00gAWDSY7G'
      }
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Group>
            {/* <Stack.Screen name="RequestDetails" component={RequestDetails} /> */}
            {/* <Stack.Screen name="CreateARequest" component={CreateARequest} /> */}
            {/* <Stack.Screen name="Featured" component={FeatureHighlightScreen} /> */}

            <Stack.Screen name="Home" component={DrawerNavigator} />
            <Stack.Screen name="Signatures" component={Signatures} />
            <Stack.Screen name="AddSignature" component={AddSignature} />

            <Stack.Screen name="AddContact" component={AddContact} />
            <Stack.Screen name="Stamps" component={Stamps} />
            <Stack.Screen name="AddStamp" component={AddStamp} />
            <Stack.Screen name="Browser" component={Browser} />
            <Stack.Screen name="Details" component={Details} />
            <Stack.Screen name="Edit" component={Edit} />
            <Stack.Screen name="AddRecipient" component={AddRecipient} />
            <Stack.Screen name="DocumentEditor" component={DocumentEditor} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="DocumentViewer" component={DocumentViewer} />
            <Stack.Screen name="SignatureSelection" component={SignatureSelection} />
            <Stack.Screen name="StampSelection" component={StampSelection} />
            <Stack.Screen name="Contacts" component={Contacts} />
            <Stack.Screen name="NotaryProfile" component={NotaryProfile} />
            <Stack.Screen name="Addresses" component={Addresses} />
            <Stack.Screen name="AddAddress" component={AddAddress} />
            <Stack.Screen name="CreateARequest" component={CreateARequest} />
            <Stack.Screen name="RequestDetails" component={RequestDetails} />
            <Stack.Screen name="ApproveRequest" component={ApproveRequest} />
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="Call" component={Call} />
            <Stack.Screen name="Calling" component={Calling} />
            <Stack.Screen name="IncomingCall" component={IncomingCallScreen} />

            {/* <Stack.Screen name="ManageDrawer" component={ManageDrawer} /> */}
            {/* <Stack.Screen name="TemplateHistory" component={TemplateHistory} /> */}
          </Stack.Group>
        ) : (
          <Stack.Group>
            {/* <Stack.Screen name="NotaryOrUser" component={NotaryOrUser} /> */}
            <Stack.Screen name="SignUpIndex" component={LoginStackNavigator} />
            {/* <Stack.Screen name="NotaryLoginStackNavigator" component={NotaryLoginStackNavigator} /> */}
          </Stack.Group>
        )}
      </Stack.Navigator>
    </StripeProvider>
  );
}
