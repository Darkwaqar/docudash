import COLORS from '@constants/colors';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { selectProfileData } from '@stores/slices/UserSlice';
import { HomeDrawerScreenProps } from '@type/*';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Divider, Menu } from 'react-native-paper';
import { useSelector } from 'react-redux';
import tw from 'twrnc';

export default function HomeHeader({
  heading,
  addTarget,
}: {
  heading: string;
  addTarget?: (ref: any, key: string) => void;
}) {
  const navigation = useNavigation<HomeDrawerScreenProps<'HomeScreen'>['navigation']>();
  const route = useRoute<HomeDrawerScreenProps<'HomeScreen'>['route']>();
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  const user = useSelector(selectProfileData);
  return (
    <View style={style.header}>
      <View
        ref={(r) => {
          addTarget && addTarget(r, '0');
        }}
      >
        {navigation.canGoBack() ? (
          <Icon
            // style={{ width: 28, height: 28 }}
            name="arrow-left"
            size={28}
            onPress={navigation.goBack}
          />
        ) : (
          <Icon
            // style={{ width: 28, height: 28 }}
            name="sort-variant"
            size={28}
            onPress={navigation.toggleDrawer}
          />
        )}
      </View>
      <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 16 }}>{heading}</Text>

      <Menu
        anchorPosition="bottom"
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TouchableOpacity onPress={openMenu} ref={(r) => addTarget && addTarget(r, '1')}>
            <Avatar.Image
              source={{
                uri: user
                  ? user.profile_photo
                  : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
              }}
              size={30}
            />
          </TouchableOpacity>
        }
      >
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('Browser', {
              url: 'https://docudash.net/pricing',
              heading: 'PRICING',
            });
          }}
          title="Get Started"
        />
        <Divider />
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('Browser', {
              url: 'https://docudash.net/contact-us',
              heading: 'SUPPORT',
            });
          }}
          title="Support"
        />
        <Divider />
        <Menu.Item onPress={() => {}} title="Community" />
        <Divider />
        <Menu.Item onPress={() => {}} title="Trust center" />
        <Divider />
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('Browser', {
              url: 'https://docudash.net/contact-us',
              heading: 'CONTACT US',
            });
          }}
          title="Contact Us"
        />
      </Menu>
    </View>
  );
}

const style = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
