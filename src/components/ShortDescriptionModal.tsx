import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { selectAccessToken, selectProfileData, setProfileData } from '@stores/slices/UserSlice';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, View } from 'react-native';
import { Button, Divider, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';

const ShortDescriptionModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const user = useSelector(selectProfileData);
  const accessToken = useSelector(selectAccessToken);
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState<string | null>(user.ShortDescription);

  const onSave = () => {
    if (firstName.length < 0) {
      alert('Please enter a valid name');
      return;
    }
    axios
      .post(
        'https://docudash.net/api/profiles',
        {
          action_type: 'ShortDescription',
          ShortDescription: firstName,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        const { status, message }: { status: boolean; message: string } = response.data;
        if (status) {
          dispatch(
            setProfileData({
              ...user,
              ShortDescription: firstName,
            })
          );
          setModalVisible(false);
        }
        Alert.alert(message);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Button
        mode="contained"
        style={tw`rounded-lg`}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        Update
      </Button>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={tw`flex-1 justify-center items-center  `}>
          <View style={tw`bg-white m-2 p-2 gap-2 w-72 rounded-lg`}>
            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-xl`}>Update Short Description</Text>
              <MaterialCommunityIcons
                name="close"
                size={24}
                onPress={() => setModalVisible(false)}
              />
            </View>
            <Divider></Divider>
            <View style={tw`gap-2`}>
              <TextInput
                label="Enter Short Description"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
                multiline
                style={tw`h-40`}
              />
            </View>

            <Divider></Divider>
            <View style={tw`flex-row items-center gap-4 justify-between`}>
              <Button style={tw`rounded-lg`} mode="contained" onPress={onSave}>
                Update
              </Button>
              <Button style={tw`rounded-lg`} mode="outlined" onPress={() => setModalVisible(false)}>
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ShortDescriptionModal;

const styles = StyleSheet.create({});
