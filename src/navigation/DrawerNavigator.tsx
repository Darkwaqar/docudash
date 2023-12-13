import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';

import CustomDrawerContent from '@components/CustomDrawerContent';
import DrawerScreenContainer from '@components/DrawerScreenContainer';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import AddressesList from '@screens/Address/List';
import ContactList from '@screens/Contact/List';
import HomeScreen from '@screens/HomeScreen';
import Inbox from '@screens/Manage/Inbox';
import Map from '@screens/Notary/List';
import Profile from '@screens/Profile';
import RequestList from '@screens/Request/List';
import UserRequestList from '@screens/Request/UserList';
import SignatureList from '@screens/Signatures/List';
import StampList from '@screens/Stamp/List';
import { selectProfileData } from '@stores/slices/UserSlice';
import { colors } from '@utils/Colors';
import { useSelector } from 'react-redux';
import ScanDocument from '@screens/Notary/ScanDocument';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const user = useSelector(selectProfileData);
  const type = user?.user_type;
  const route = useRoute();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerStyle: {
          width: 200,
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
      <>
        <Drawer.Screen
          name="HomeScreen"
          options={{
            title: 'Home',
            drawerIcon: ({ color }) => (
              <Icon name="home" size={25} style={{ marginRight: -20, color }} />
            ),
          }}
        >
          {(props) => (
            <DrawerScreenContainer {...props}>
              <HomeScreen />
            </DrawerScreenContainer>
          )}
        </Drawer.Screen>
        <Drawer.Screen
          initialParams={{ heading: 'Inbox' }}
          name="MANAGE"
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="email-newsletter" size={25} style={{ marginRight: -20, color }} />
            ),
          }}
        >
          {(props) => (
            <DrawerScreenContainer {...props}>
              <Inbox />
            </DrawerScreenContainer>
          )}
        </Drawer.Screen>

        <Drawer.Screen
          name="SIGNATURES"
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="signature-freehand" size={25} style={{ marginRight: -20, color }} />
            ),
          }}
        >
          {(props) => (
            <DrawerScreenContainer {...props}>
              <SignatureList />
            </DrawerScreenContainer>
          )}
        </Drawer.Screen>

        {type === 7 && (
          <Drawer.Screen
            name="STAMPS"
            options={{
              drawerIcon: ({ color }) => (
                <Icon name="stamper" size={25} style={{ marginRight: -20, color }} />
              ),
            }}
          >
            {(props) => (
              <DrawerScreenContainer {...props}>
                <StampList />
              </DrawerScreenContainer>
            )}
          </Drawer.Screen>
        )}
        <Drawer.Screen
          name="CONTACTS"
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="contacts" size={25} style={{ marginRight: -20, color }} />
            ),
          }}
        >
          {(props) => (
            <DrawerScreenContainer {...props}>
              <ContactList />
            </DrawerScreenContainer>
          )}
        </Drawer.Screen>
        {type === 7 ? (
          <Drawer.Screen
            name="REQUEST"
            options={{
              drawerIcon: ({ color }) => (
                <Icon name="briefcase" size={25} style={{ marginRight: -20, color }} />
              ),
            }}
          >
            {(props) => (
              <DrawerScreenContainer {...props}>
                <RequestList />
              </DrawerScreenContainer>
            )}
          </Drawer.Screen>
        ) : (
          <Drawer.Screen
            name="REQUEST SENT"
            options={{
              drawerIcon: ({ color }) => (
                <Icon name="briefcase" size={25} style={{ marginRight: -20, color }} />
              ),
            }}
          >
            {(props) => (
              <DrawerScreenContainer {...props}>
                <UserRequestList />
              </DrawerScreenContainer>
            )}
          </Drawer.Screen>
        )}
        <Drawer.Screen
          name="ADDRESSES"
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="map-marker" size={25} style={{ marginRight: -20, color }} />
            ),
          }}
        >
          {(props) => (
            <DrawerScreenContainer {...props}>
              <AddressesList />
            </DrawerScreenContainer>
          )}
        </Drawer.Screen>

        <Drawer.Screen
          name="PROFILE"
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="account" size={25} style={{ marginRight: -20, color }} />
            ),
          }}
        >
          {(props) => (
            <DrawerScreenContainer>
              <Profile />
            </DrawerScreenContainer>
          )}
        </Drawer.Screen>
        {type === 7 || (
          <Drawer.Screen
            name="FIND NOTARY"
            options={{
              drawerIcon: ({ color }) => (
                <Icon name="map" size={25} style={{ marginRight: -20, color }} />
              ),
            }}
          >
            {(props) => (
              <DrawerScreenContainer>
                <Map />
              </DrawerScreenContainer>
            )}
          </Drawer.Screen>
        )}
      </>
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
