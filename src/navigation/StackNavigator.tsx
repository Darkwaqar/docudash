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
import CreateARequest from '@screens/Notary/CreateARequest';
import NotaryProfile from '@screens/Notary/NotaryProfile';
import Profile from '@screens/Profile';
import RequestDetails from '@screens/Request/Details';
import NotaryOrUser from '@screens/SignUp1/NotaryOrUser';
import AddSignature from '@screens/Signatures/AddSignature';
import Signatures from '@screens/Signatures/List';
import AddStamp from '@screens/Stamp/AddStamps';
import Stamps from '@screens/Stamp/List';
import { selectAccessToken } from '@stores/slices/UserSlice';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../types/navigation';
import DrawerNavigator from './DrawerNavigator';
import LoginStackNavigator from './LoginStackNavigator';
import NotaryLoginStackNavigator from './NotaryLoginStackNavigator';
import Map from '@screens/Map';
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  const user = useSelector(selectAccessToken);
  return (
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
          <Stack.Screen name="Map" component={Map} />

          {/* <Stack.Screen name="ManageDrawer" component={ManageDrawer} /> */}
          {/* <Stack.Screen name="TemplateHistory" component={TemplateHistory} /> */}
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="NotaryOrUser" component={NotaryOrUser} />
          <Stack.Screen name="SignUpIndex" component={LoginStackNavigator} />
          <Stack.Screen name="NotaryLoginStackNavigator" component={NotaryLoginStackNavigator} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
