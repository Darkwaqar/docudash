import { createStackNavigator } from '@react-navigation/stack';
import Browser from '@screens/Browser';
import Address from '@screens/NotarySignUp/Address';
import EmailScreen from '@screens/SignUp1/Email';
import IndustriesScreen from '@screens/SignUp1/Industries';
import NotaryOrUser from '@screens/SignUp1/NotaryOrUser';
import OptScreen from '@screens/SignUp1/OptScreen';
import PasswordScreen from '@screens/SignUp1/Password';
import SetPasswordScreen from '@screens/SignUp1/SetPassword';
import UserInfoScreen from '@screens/SignUp1/UserInfo';
import { selectUserStep } from '@stores/slices/UserSlice';
import { SignUpStackParamList } from '@type/index';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const LoginStack = createStackNavigator<SignUpStackParamList>();
export default function LoginStackNavigator() {
  const step = useSelector(selectUserStep);
  return (
    <LoginStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={'Step' + step}>
      <LoginStack.Screen name="Index" component={EmailScreen} />
      <LoginStack.Screen name="Step1" component={UserInfoScreen} />
      <LoginStack.Screen name="Step2" component={OptScreen} />
      <LoginStack.Screen name="Step3" component={SetPasswordScreen} />
      <LoginStack.Screen name="Step4" component={IndustriesScreen} />
      <LoginStack.Screen name="Step5" component={PasswordScreen} />
      <LoginStack.Screen name="Browser" component={Browser} />
    </LoginStack.Navigator>
  );
}
