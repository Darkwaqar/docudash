import React, { useEffect } from 'react';
import { Alert, View } from 'react-native';
import { Appbar, Button, TextInput } from 'react-native-paper';
import tw from 'twrnc';

import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useAddContactMutation,
  useDeleteContactMutation,
  useUpdateContactMutation,
} from '@services/contact';
import { selectAccessToken } from '@stores/slices/UserSlice';
import { Contact, RootStackScreenProps } from '@type/index';
import { useSelector } from 'react-redux';

const AddContact = () => {
  const [contact, setContact] = React.useState<Contact>({
    name: '',
    email: '',
  });

  const navigation = useNavigation<RootStackScreenProps<'AddContact'>['navigation']>();
  const route = useRoute<RootStackScreenProps<'AddContact'>['route']>();
  const Contact = route.params?.Contact as Contact;
  const [addContact, { isLoading: addContactLoading }] = useAddContactMutation();
  const [updateContact, { isLoading: updateContactLoading }] = useUpdateContactMutation();
  const [deleteCont, { isLoading: deleteContactLoading }] = useDeleteContactMutation();

  useEffect(() => {
    if (Contact) {
      setContact(Contact);
    }
  }, []);

  const createOrUpdate = async () => {
    if (contact.name.length == 0 && contact.email.length == 0) {
      Alert.alert('Please add a name');
      return;
    }
    if (
      !String(contact.email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      Alert.alert('Please input valid Email');
      return;
    }
    if (Contact) {
      // update
      // console.log(contact.name, contact.email);
      try {
        await updateContact({
          id: contact.id,
          name: contact.name,
          email: contact.email,
        }).unwrap();
        navigation.goBack();
      } catch (error) {
        navigation.goBack();
      }
    } else {
      // create
      // console.log(contact.name, contact.email);
      try {
        await addContact({
          name: contact.name,
          email: contact.email,
        }).unwrap();
        navigation.goBack();
      } catch (error) {
        navigation.goBack();
      }
    }
  };

  const deleteContact = async () => {
    if (contact.id == undefined) {
      alert('Local Id Cannot Be Deleted');
      return;
    }
    try {
      await deleteCont(contact.id).unwrap();
      navigation.goBack();
    } catch (error) {
      navigation.goBack();
    }
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
        <Button
          mode="contained"
          loading={addContactLoading || updateContactLoading || deleteContactLoading}
          disabled={addContactLoading || updateContactLoading || deleteContactLoading}
          onPress={createOrUpdate}
        >
          {Contact ? 'Update' : 'Add'}
        </Button>
      </View>
    </View>
  );
};

export default AddContact;
