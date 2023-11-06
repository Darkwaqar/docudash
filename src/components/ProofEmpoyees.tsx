import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { selectAccessToken, selectProfileData, setProfileData } from '@stores/slices/UserSlice';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, View } from 'react-native';
import { Button, Divider, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import UploadView from './UploadView';

const ProofEmployees = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const user = useSelector(selectProfileData);
  const accessToken = useSelector(selectAccessToken);
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState<null | string>(user.ProofOfEmployes.toString());
  const [documents, setDocuments] = useState([]);
  const onSave = () => {
    const formData = new FormData();
    formData.append('action_type', 'ProofOfEmployes');
    formData.append('ProofOfEmployes', firstName);
    formData.append('ProofOfEmployesDoc', '');

    axios
      .post('https://docudash.net/api/profiles', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const { success, message }: { success: boolean; message: string } = response.data;
        console.log(success);

        if (success) {
          dispatch(
            setProfileData({
              ...user,
              ProofEmployees: firstName,
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
              <Text style={tw`text-xl`}>Update Number of Employees</Text>
              <MaterialCommunityIcons
                name="close"
                size={24}
                onPress={() => setModalVisible(false)}
              />
            </View>
            <Divider></Divider>
            <View style={tw`gap-2`}>
              <TextInput
                label="Enter Number of Employees"
                value={firstName}
                keyboardType="number-pad"
                onChangeText={(text) => setFirstName(text)}
                style={tw`h-20`}
              />
              <UploadView documents={documents} setDocuments={setDocuments} />
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

export default ProofEmployees;

const styles = StyleSheet.create({});
