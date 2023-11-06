import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { selectAccessToken, selectProfileData, setProfileData } from '@stores/slices/UserSlice';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, View } from 'react-native';
import { Button, Divider, Menu, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';

const VoidEnvelope = ({ inbox, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const user = useSelector(selectProfileData);
  const accessToken = useSelector(selectAccessToken);
  const dispatch = useDispatch();
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const VoidEnvelope = () => {
    if (reason == '') return;
    setLoading(true);
    var url = 'https://docudash.net/api/generate-signature/VoidEnvelope';

    axios
      .post(
        url,
        {
          signature_id: inbox.signature_id,
          uniqid: inbox.uniqid,
          reason_for_voiding_envelope: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        const { status, message }: { status: boolean; message: string } = response.data;
        console.log(response.data);
        if (status) {
          setModalVisible(false);
          navigation.navigate('Home');
          Alert.alert(message);
        } else {
          alert(message);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log('Error----', error);
      });
  };

  return (
    <>
      <Menu.Item
        onPress={() => {
          setModalVisible(true);
        }}
        title="Void"
      />
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
              <Text style={tw`text-xl`}>Reason For Void</Text>
              <MaterialCommunityIcons
                name="close"
                size={24}
                onPress={() => setModalVisible(false)}
              />
            </View>
            <Divider></Divider>
            <View style={tw`gap-2`}>
              <Text style={tw`text-gray-500`}>Please Provide a Reason</Text>
              <TextInput label="Reason" value={reason} onChangeText={(text) => setReason(text)} />
            </View>

            <Divider></Divider>
            <View style={tw`flex-row items-center gap-4 justify-between`}>
              <Button
                style={tw`rounded-lg`}
                mode="contained"
                disabled={loading}
                loading={loading}
                onPress={VoidEnvelope}
              >
                Void
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

export default VoidEnvelope;

const styles = StyleSheet.create({});
