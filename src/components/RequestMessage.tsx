import { Pressable, Touchable, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { Text, Button, Divider, Menu, TextInput, IconButton } from 'react-native-paper';
import tw from 'twrnc';
import { IRequest } from 'src/types/request';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '@stores/Slices';
import { AddressList, Addresses } from 'src/types/AddressList';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SignUpStackScreenProps } from 'src/types/navigation';

export default function RequestMessage({
  data,
  setData,
}: {
  data: IRequest;
  setData: React.Dispatch<React.SetStateAction<IRequest>>;
}) {
  const accessToken = useSelector(selectAccessToken);
  const navigation = useNavigation<SignUpStackScreenProps<'Step4'>['navigation']>();
  const [LocationVisible, setLocationVisible] = React.useState(false);
  const openLocationMenu = () => setLocationVisible(true);
  const closeLocationMenu = () => setLocationVisible(false);
  const [text, setText] = React.useState('');
  const [location, setLocation] = React.useState('Home');
  const [userLocation, setUserLocation] = React.useState<Addresses[]>([]);
  const fouces = useIsFocused();

  const fetchLoaction = () => {
    axios
      .get('https://docudash.net/api/Address', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const { data }: AddressList = response.data;
        setUserLocation(data);
      });
  };
  useEffect(() => {
    fetchLoaction();
  }, [fouces]);
  return (
    <>
      <View style={tw`mx-2`}>
        <Text variant="labelLarge">Location</Text>
        <Menu
          theme={{ roundness: 4 }}
          onDismiss={closeLocationMenu}
          visible={LocationVisible}
          anchorPosition="bottom"
          style={tw`w-[90%]`}
          anchor={
            <TouchableOpacity
              onPress={openLocationMenu}
              style={tw`flex-row items-center border rounded-xl border-gray-300`}
            >
              <Text variant="bodyMedium" style={tw`flex-1 px-2`}>
                {location}
              </Text>
              <IconButton icon="chevron-down" onPress={openLocationMenu} />
            </TouchableOpacity>
          }
        >
          {userLocation.map((e, i) => {
            return (
              <>
                <Menu.Item
                  key={e.uuid}
                  style={tw`flex-1`}
                  onPress={() => {
                    setLocation(e.address);
                    closeLocationMenu();
                  }}
                  title={e.name}
                />
                <Divider />
              </>
            );
          })}
          <Menu.Item
            style={tw`flex-1`}
            onPress={() => {
              navigation.navigate('AddAddress', { From: 'create request' });
              closeLocationMenu();
            }}
            title={'Add Address'}
          />
        </Menu>
      </View>
      <View style={tw`mx-2`}>
        <Text variant="labelLarge">Message </Text>
        <TextInput
          // label="Message"
          mode="outlined"
          multiline
          numberOfLines={2}
          style={tw`h-32`}
          value={text}
          onChangeText={(text) => setText(text)}
        />
      </View>
    </>
  );
}
