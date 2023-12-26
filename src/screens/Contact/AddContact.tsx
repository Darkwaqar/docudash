import AddSignatureDraw from '@components/AddSignauteDraw';
import { colors } from '@utils/Colors';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Appbar, Button, SegmentedButtons, TextInput } from 'react-native-paper';
import tw from 'twrnc';

import ChooseSignatureItem from '@components/ChooseSignatureItem';
import { useNavigation, useRoute } from '@react-navigation/native';
import { selectAccessToken, selectProfileData } from '@stores/slices/UserSlice';
import { Contact, RootStackScreenProps, SignaturePreview } from '@type/index';
import { useSelector } from 'react-redux';

const AddContact = () => {
  const user = useSelector(selectProfileData);
  const accessToken = useSelector(selectAccessToken);
  const [contact, setContact] = React.useState<Contact>({
    name: '',
    email: '',
  });

  const navigation = useNavigation<RootStackScreenProps<'AddContact'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'AddContact'>['route']>();
  const Contact = route.params?.Contact as Contact;

  useEffect(() => {
    if (Contact) {
      setContact(Contact);
    }
  }, []);

  const createOrUpdate = () => {
    if (contact.name.length == 0 && contact.email.length == 0) {
      Alert.alert('Please add a name');
      return;
    }
    if (Contact) {
      // update
      // console.log(contact.name, contact.email);
      axios
        .post(
          'https://docudash.net/api/Contacts/update/' + contact.id,
          {
            name: contact.name,
            email: contact.email,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((response) => {
          const {
            message,
            status,
          }: {
            message: string;
            status: boolean;
          } = response.data;
          // console.log(response.data);
          if (status) {
            navigation.goBack();
            // navigation.navigate('Signatures', {});
          } else {
            Alert.alert(message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // create
      // console.log(contact.name, contact.email);
      axios
        .post(
          'https://docudash.net/api/Contacts/create',
          {
            name: contact.name,
            email: contact.email,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((response) => {
          const {
            message,
            status,
          }: {
            message: string;
            status: boolean;
          } = response.data;
          // console.log(response.data);
          if (status) {
            navigation.goBack();
            // navigation.navigate('Signatures', {});
          } else {
            Alert.alert(message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteContact = () => {
    if (contact.id == undefined) {
      alert('Local Id Cannot Be Deleted');
      return;
    }
    axios
      .post(
        'https://docudash.net/api/Contacts/delete',
        {
          deleteId: contact.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        const {
          message,
          success,
        }: {
          message: string;
          success: boolean;
        } = response.data;
        // console.log(response.data);
        if (success) {
          navigation.goBack();
          // navigation.navigate('Signatures', {});
        } else {
          Alert.alert(message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <View style={tw`h-full`}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Contact" />
        {Contact && <Appbar.Action icon="delete" onPress={deleteContact} />}
      </Appbar.Header>
      <View style={tw`mx-2 gap-2 flex-1`}>
        <TextInput
          mode="outlined"
          label="Name"
          // disabled
          value={contact.name}
          onChangeText={(text) => setContact((prev) => ({ ...prev, name: text }))}
        />
        <TextInput
          keyboardType="email-address"
          label="Email"
          mode="outlined"
          // disabled
          value={contact.email}
          onChangeText={(text) => setContact((prev) => ({ ...prev, email: text }))}
        />
      </View>
      <View style={tw`flex-row justify-end p-6 py-10`}>
        <Button mode="contained" onPress={createOrUpdate}>
          {Contact ? 'Update' : 'Add'}
        </Button>
      </View>
    </View>
  );
};

export default AddContact;
