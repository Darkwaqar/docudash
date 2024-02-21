import { createStackNavigator } from '@react-navigation/stack';
import Browser from '@screens/Browser';
import Address from '@screens/NotarySignUp/Address';
import EmailScreen from '@screens/NotarySignUp/Email';
import LicenseDocument from '@screens/NotarySignUp/LicenseDocument';
import OptScreen from '@screens/NotarySignUp/OptScreen';
import SetPasswordScreen from '@screens/NotarySignUp/Password';
import RON_DocUpload from '@screens/NotarySignUp/RON_DocUpload';
import UserInfoScreen from '@screens/NotarySignUp/UserInfo';
import PasswordScreen from '@screens/SignUp1/Password';
import { selectNotaryStep, setNotaryStep } from '@stores/slices/UserSlice';
import { SignUpStackParamList } from '@type/index';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const LoginStack = createStackNavigator<SignUpStackParamList>();
export default function NotaryLoginStackNavigator() {
  const step = useSelector(selectNotaryStep);
  const dispatch = useDispatch();
  // console.log('step', step);
  dispatch(setNotaryStep(0));
  // @ts-ignore
  const initialRouteName: keyof SignUpStackParamList = 'Step' + step;

  return (
    <LoginStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRouteName}
    >
      <LoginStack.Screen name="Index" component={EmailScreen} />
      <LoginStack.Screen name="Step1" component={UserInfoScreen} />
      <LoginStack.Screen name="Step2" component={OptScreen} />
      <LoginStack.Screen name="Step3" component={LicenseDocument} />
      <LoginStack.Screen name="Step4" component={SetPasswordScreen} />
      <LoginStack.Screen name="Step5" component={Address} />
      <LoginStack.Screen name="Step6" component={RON_DocUpload} />
      <LoginStack.Screen name="Step7" component={PasswordScreen} />
      <LoginStack.Screen name="Browser" component={Browser} />
    </LoginStack.Navigator>
  );
}
