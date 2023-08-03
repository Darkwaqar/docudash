import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import React, { ReactNode, useState } from "react";
import tw from "twrnc";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors } from "../../../Colors";
import { Button, Divider, TextInput } from "react-native-paper";
import { useCounterStore } from "../../../../MobX/TodoStore";
import { User } from "../../../../types";
import axios from "axios";

const NameEditModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const Mobx = useCounterStore();
  const user = useCounterStore().user as User;
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);

  const onSave = () => {
    if (firstName.length > 0 && lastName.length > 0) {
      alert("Please enter a valid name");
    }
    axios
      .post(
        "https://docudash.net/api/profiles",
        {
          action_type: "names",
          first_name: firstName,
          last_name: lastName,
        },
        {
          headers: {
            Authorization: `Bearer ${Mobx.access_token}`,
          },
        }
      )
      .then((response) => {
        const { status, message }: { status: boolean; message: string } =
          response.data;
        if (status) {
          Mobx.AddUser({
            ...user,
            first_name: firstName,
            last_name: lastName,
          });
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
              <Text style={tw`text-xl`}>Update Name</Text>
              <MaterialCommunityIcons
                name="close"
                size={24}
                onPress={() => setModalVisible(false)}
              />
            </View>
            <Divider></Divider>
            <View style={tw`gap-2`}>
              <Text style={tw`text-gray-500`}>Enter your new name below.</Text>
              <TextInput
                label="First Name"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
              />
              <TextInput
                label="Last Name"
                value={lastName}
                onChangeText={(text) => setLastName(text)}
              />
            </View>

            <Divider></Divider>
            <View style={tw`flex-row items-center gap-4 justify-between`}>
              <Button style={tw`rounded-lg`} mode="contained" onPress={onSave}>
                Update
              </Button>
              <Button
                style={tw`rounded-lg`}
                mode="outlined"
                onPress={() => setModalVisible(false)}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default NameEditModal;

const styles = StyleSheet.create({});
