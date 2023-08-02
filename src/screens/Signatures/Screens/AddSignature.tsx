import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import React, {
  useRef,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from "react";
import {
  Button,
  Checkbox,
  RadioButton,
  SegmentedButtons,
  TextInput,
} from "react-native-paper";
import tw from "twrnc";
import { colors } from "../../../Colors";
import AddSignatureDraw from "../Components/AddSignauteDraw";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { useCounterStore } from "../../../../MobX/TodoStore";

import { Signature, SignaturePreview, User } from "../../../../types";
import { useNavigation, useRoute } from "@react-navigation/native";
import ChooseSignatureItem from "../Components/ChooseSignatureItem";

const AddSignature = () => {
  const Mobx = useCounterStore();
  const user: User = Mobx.user;
  const [fullName, setFullName] = React.useState(
    user.first_name + " " + user.last_name
  );

  const [initials, setInitials] = React.useState(
    fullName
      .replace(/\b(\w)\w+/g, "$1")
      .replace(/\s/g, "")
      .replace(/\.$/, "")
      .toUpperCase()
  );
  const [value, setValue] = React.useState("choose");
  const [list, setList] = React.useState(
    new Array(6).fill({ selected: false })
  );
  const [selectedUri, setSetselectedUri] = useState<string>("");
  const [selectedInitialUri, setSetselectedInitialUri] = useState<string>("");
  const [sign, setSign] = useState<Array<{}> | undefined>();
  const [initial, setInitial] = useState<Array<{}> | undefined>();
  const navigation = useNavigation();
  const route = useRoute();
  const signaturePreview = route.params as SignaturePreview;
  console.log("sign", sign);
  console.log("initials", initial);

  useEffect(() => {
    if (signaturePreview) {
      setList((prev) =>
        prev.map((sign, i) =>
          i === signaturePreview.DT_RowIndex - 1
            ? { ...sign, selected: true }
            : { ...sign, selected: false }
        )
      );
    }
  }, []);

  const uploadSignature = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"], // You can specify the file types here (e.g., 'image/*', 'application/pdf', etc.)
      });
      if (result?.type !== "cancel") {
        setSign(result);
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  const uploadInitial = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"], // You can specify the file types here (e.g., 'image/*', 'application/pdf', etc.)
      });
      if (result?.type !== "cancel") {
        setInitial(result);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const create = () => {
    axios
      .post(
        "https://docudash.net/api/signatures/create",
        {
          signature: "data:image/png;base64," + selectedUri,
          initial: "data:image/png;base64," + selectedInitialUri,
        },
        {
          headers: {
            Authorization: `Bearer ${Mobx.access_token}`,
          },
        }
      )
      .then((response) => {
        const data = response.data;
        Alert.alert("Signature added");
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <View style={tw`p-3 gap-2 flex-1`}>
      <TextInput
        mode="outlined"
        label="Full Name"
        disabled
        value={fullName}
        onChangeText={(text) => setFullName(text)}
      />
      <TextInput
        label="Initials"
        mode="outlined"
        disabled
        value={initials}
        onChangeText={(text) => setInitials(text)}
      />
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: "choose",
            label: "Choose",
          },
          {
            value: "draw",
            label: "Draw",
          },
          { value: "upload", label: "Upload" },
        ]}
      />
      {value === "choose" ? (
        <FlatList
          data={list}
          renderItem={({ item, index }) => (
            <ChooseSignatureItem
              item={item}
              id={index}
              setList={setList}
              fullName={fullName}
              initials={initials}
              setSetselectedUri={setSetselectedUri}
              setSetselectedInitialUri={setSetselectedInitialUri}
            />
          )}
        />
      ) : null}
      {value === "draw" ? (
        <AddSignatureDraw
          setSetselectedUri={setSetselectedUri}
          setSetselectedInitialUri={setSetselectedInitialUri}
        />
      ) : null}
      {value === "upload" ? (
        <ScrollView
          contentContainerStyle={tw`bg-white px-8 py-8 rounded-md gap-5`}
        >
          <View
            style={tw` border-2 py-10 rounded-xl border-dashed gap-5 border-[${colors.blue}] justify-center items-center`}
          >
            {sign && (
              <Image
                style={tw`h-20 w-20 bg-red-300`}
                source={{ uri: sign.uri }}
              />
            )}
            <TouchableOpacity style={tw`p-1 `} onPress={uploadSignature}>
              <Image
                style={tw`h-10 w-10 self-center`}
                source={require("../../../assets/Upload.png")}
              />
              <Text style={tw`text-[${colors.blue}] mt-2`}>
                Upload your signature
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={tw` border-2 py-10 rounded-xl border-dashed gap-5 border-[${colors.blue}] justify-center items-center`}
          >
            {initial && (
              <Image
                style={tw`h-20 w-20 bg-red-300`}
                source={{ uri: initial.uri }}
              />
            )}
            <TouchableOpacity style={tw`p-1 `} onPress={uploadInitial}>
              <Image
                style={tw`h-10 w-10 self-center`}
                source={require("../../../assets/Upload.png")}
              />
              <Text style={tw`text-[${colors.blue}] mt-2`}>
                Upload your signature
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : null}

      {/* Create sign button */}
      <Button onPress={create} mode="contained" style={tw`mt-4`}>
        Create
      </Button>
    </View>
  );
};

export default AddSignature;

const styles = StyleSheet.create({
  h2: tw`font-bold text-4`,
});
