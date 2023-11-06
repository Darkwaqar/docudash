import Loader from '@components/Loader';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Browser from '@screens/Browser';
import Details from '@screens/Manage/Details';
import DocumentEditor from '@screens/Manage/DocumentEditor';
import Edit from '@screens/Manage/Edit';
import Profile from '@screens/Profile';
import AddSignature from '@screens/Signatures/AddSignature';
import Signatures from '@screens/Signatures/List';
import AddStamp from '@screens/Stamp/AddStamps';
import Stamps from '@screens/Stamp/List';
import { logoutUser, selectAccessToken, setAccessToken } from '@stores/Slices';
import { getData, getNotaryOrUser, getTokenGlobal } from '@utils/AsyncGlobal';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../types/navigation';
import DrawerNavigator from './DrawerNavigator';
import LoginStackNavigator from './LoginStackNavigator';
import DocumentViewer from '@screens/Manage/DocumentViewer';
import SignatureSelection from '@screens/Manage/SignatureSelection';
import StampSelection from '@screens/Manage/StampSelection';
import AddRecipient from '@screens/Manage/AddRecipient';
import EmailScreen from '@screens/SignUp1/Email';
import AddContact from '@screens/Contact/AddContact';
import Contacts from '@screens/Contact/List';
import Addresses from '@screens/Address/List';
import FeatureHighlightScreen from '@screens/FeatureHighlightScreen';
import NotaryLoginStackNavigator from './NotaryLoginStackNavigator';
import NotaryOrUser from '@screens/SignUp1/NotaryOrUser';
import NotaryProfile from '@screens/Notary/NotaryProfile';
import AddAddress from '@screens/Address/AddAddress';
import CreateARequest from '@screens/Notary/CreateARequest';
import RequestDetails from '@screens/Request/Details';
import Map from '@screens/Map';
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  const [signUpToken, setSignUpToken] = useState<string>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const getNotaryData = async () => {
      const token = await getNotaryOrUser();
      setLoading(false);
      if (token) setSignUpToken(token);
    };
    getNotaryData();
  }, []);
  // clearToken();
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    const getAccessToken = async () => {
      const token = await getTokenGlobal();
      setLoading(false);
      if (!token) {
        dispatch(logoutUser());
      } else {
        dispatch(setAccessToken(token));
      }
    };
    getAccessToken();
  }, []);
  const user = useSelector(selectAccessToken);

  if (loading) {
    return <Loader />;
  }
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
