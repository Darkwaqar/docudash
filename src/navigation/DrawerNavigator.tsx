import { DrawerGestureContext, createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';

import CustomDrawerContent from '@components/CustomDrawerContent';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import AddressesList from '@screens/Address/List';
import ContactList from '@screens/Contact/List';
import HomeScreen from '@screens/HomeScreen';
import Inbox from '@screens/Manage/Inbox';
import Map from '@screens/Notary/List';
import Notification from '@screens/Notification';
import Profile from '@screens/Profile';
import RequestList from '@screens/Request/List';
import UserRequestList from '@screens/Request/UserList';
import SignatureList from '@screens/Signatures/List';
import StampList from '@screens/Stamp/List';
import { selectProfileData } from '@stores/slices/UserSlice';
import { colors } from '@utils/Colors';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import DrawerScreenContainer from '@components/DrawerScreenContainer';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const user = useSelector(selectProfileData);
  const type = user?.user_type;

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerStyle: {
          width: 213,
          backgroundColor: colors.white,
        },
        // @ts-ignore
        overlayColor: null,
        drawerLabelStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: colors.green,
        drawerInactiveTintColor: colors.blue,
        // @ts-ignore
        drawerItemStyle: { backgroundColor: null },
        sceneContainerStyle: {
          backgroundColor: colors.white,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Group>
        <Drawer.Screen
          name="HomeScreen"
          options={{
            title: 'Home',
            drawerIcon: ({ color }) => (
              <Icon name="home" size={25} style={{ marginRight: -20, color }} />
            ),
          }}
          component={HomeScreen}
        />
        <Drawer.Screen
          initialParams={{ heading: 'Inbox' }}
          name="MANAGE"
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="email-newsletter" size={25} style={{ marginRight: -20, color }} />
            ),
          }}
          component={Inbox}
        />

        <Drawer.Screen
          name="SIGNATURES"
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="signature-freehand" size={25} style={{ marginRight: -20, color }} />
            ),
          }}
          component={SignatureList}
        />

        {type === 7 && (
          <Drawer.Screen
            name="STAMPS"
            options={{
              drawerIcon: ({ color }) => (
                <Icon name="stamper" size={25} style={{ marginRight: -20, color }} />
              ),
            }}
            component={StampList}
          />
        )}
        <Drawer.Screen
          name="CONTACTS"
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="contacts" size={25} style={{ marginRight: -20, color }} />
            ),
          }}
          component={ContactList}
        />
        {type === 7 ? (
          <Drawer.Screen
            name="REQUEST"
            options={{
              drawerIcon: ({ color }) => (
                <Icon name="briefcase" size={25} style={{ marginRight: -20, color }} />
              ),
            }}
            component={RequestList}
          />
        ) : (
          <Drawer.Screen
            name="REQUEST SENT"
            options={{
              drawerIcon: ({ color }) => (
                <Icon name="briefcase" size={25} style={{ marginRight: -20, color }} />
              ),
            }}
            component={UserRequestList}
          />
        )}
        <Drawer.Screen
          name="ADDRESSES"
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="map-marker" size={25} style={{ marginRight: -20, color }} />
            ),
          }}
          component={AddressesList}
        />

        <Drawer.Screen
          name="PROFILE"
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="account" size={25} style={{ marginRight: -20, color }} />
            ),
          }}
          component={Profile}
        />
        <Drawer.Screen
          name="Notification"
          options={{
            drawerIcon: ({ color }) => (
              <View>
                <Icon name="bell-outline" size={25} style={{ marginRight: -20, color }} />
              </View>
            ),
          }}
          component={Notification}
        />
        {type === 7 || (
          <Drawer.Screen
            name="FIND NOTARY"
            options={{
              drawerIcon: ({ color }) => (
                <Icon name="map" size={25} style={{ marginRight: -20, color }} />
              ),
            }}
            component={Map}
          />
        )}
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
