import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { colors } from "../../Colors";
import { Button, Chip, DataTable, Switch } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import axios from "axios";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCounterStore } from "../../../MobX/TodoStore";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { useNavigation } from "@react-navigation/native";
import {
  RootStackParamList,
  SignaturePreview,
  SignaturesListAPI,
} from "../../../types";

const Index = () => {
  const [list, setList] = React.useState<SignaturePreview[]>();
  const [isFetching, setIsFetching] = React.useState(false);
  const Mobx = useCounterStore();
  const navigation = useNavigation();
  console.log(Mobx.access_token);

  const fetchList = () => {
    setIsFetching(true);
    axios
      .get("https://docudash.net/api/stamps", {
        headers: {
          Authorization: `Bearer ${Mobx.access_token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        setList(data.data.data);
        setIsFetching(false);
      })
      .catch((err) => {
        setIsFetching(false);
      });
  };
  React.useEffect(() => {
    fetchList();
  }, []);

  const DropdownComp = () => {
    const [action, setAction] = React.useState("");
    const [showDropDown, setShowDropDown] = React.useState(false);
    const ActionList = [
      {
        label: "Edit",
        value: "edit",
      },
      {
        label: "Delete",
        value: "delete",
      },
    ];

    return (
      <DropDown
        label={"Action"}
        mode={"outlied"}
        visible={showDropDown}
        showDropDown={() => setShowDropDown(true)}
        onDismiss={() => setShowDropDown(false)}
        value={action}
        setValue={setAction}
        list={ActionList}
      />
    );
  };
  const TableRow = () => {
    const [openModal, setOpenModal] = React.useState(false);

    return (
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal}
          onDismiss={() => setOpenModal(false)}
        >
          <View style={tw`flex-1 justify-center items-center `}>
            <View
              style={tw`border-2  w-70 rounded-lg bg-white p-5 gap-4 pb-25`}
            >
              <Pressable
                style={tw`absolute top-1 right-1 p-1`}
                onPress={() => setOpenModal(false)}
              >
                <MaterialCommunityIcons name="close-circle" size={30} />
              </Pressable>
              <Text style={tw`font-bold`}>Status</Text>
              <SwitchComp />
              <Text style={tw`font-bold`}>Action</Text>
              <DropdownComp />
            </View>
          </View>
        </Modal>
        <DataTable.Row>
          <DataTable.Cell style={tw`items-center h-35`}>
            <Image
              style={tw`w-20 h-4`}
              resizeMode="contain"
              source={require("../../assets/docudash_pow_logo.png")}
            />
          </DataTable.Cell>
          <DataTable.Cell style={tw` items-center justify-center h-35`}>
            <Image
              style={tw`w-15 h-4`}
              resizeMode="contain"
              source={require("../../assets/docudash_pow_logo.png")}
            />
          </DataTable.Cell>
          <DataTable.Cell style={tw` items-center h-35 justify-center`}>
            <View style={tw`justify-start items-center gap-2 overflow-hidden`}>
              <Text style={tw`text-3 text-[${colors.gray}]`} numberOfLines={2}>
                {"5qDXe96-pkhNTj-55211"}
              </Text>
              <Button
                onPress={() => setOpenModal(!openModal)}
                icon="dots-horizontal"
              ></Button>
            </View>
          </DataTable.Cell>
        </DataTable.Row>
      </>
    );
  };
  const Delete = (id: number) => {
    axios
      .post(
        "https://docudash.net/api/stamps/delete",
        {
          deleteId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${Mobx.access_token}`,
          },
        }
      )
      .then((response) => {
        fetchList();
        const data = response.data;
        console.log(data);
      });
  };
  const StatusUpdate = (id: number, status: number | boolean) => {
    console.log(id, status);

    axios
      .post(
        "https://docudash.net/api/signatures/statusUpdate",
        {
          id: id,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${Mobx.access_token}`,
          },
        }
      )
      .then((response) => {
        const data = response.data;
        console.log(data);
      });
  };

  const RenderItem = ({ item }) => {
    const [more, setMore] = React.useState(false);
    const [isSwitchOn, setIsSwitchOn] = React.useState(
      item.status === 1 ? true : false
    );
    console.log("switchStatus", isSwitchOn);

    const onToggleSwitch = () => {
      setIsSwitchOn(!isSwitchOn);

      StatusUpdate(item.id, !isSwitchOn ? 1 : 0);
      fetchList();
    };

    return (
      <View style={tw` bg-white p-2 my-1 gap-2 px-3`}>
        <View style={tw`flex-row gap-2 overflow-hidden`}>
          <View style={tw`flex-1 gap-3 p-2 items-center overflow-hidden `}>
            <Image
              style={tw`w-full h-20  `}
              resizeMode="contain"
              source={{
                uri: item.image_base64,
              }}
            />

            <Text style={tw`font-medium`}>{item.title}</Text>

            <Text style={tw`font-medium overflow-hidden`}>
              {item.stamp_code}
            </Text>
          </View>
          <View style={tw` p-2 justify-between`}>
            <View style={tw`gap-2`}>
              <Text style={tw`font-medium`}>Status:</Text>
              <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
            </View>
            <View>
              <View style={tw`flex-row items-center gap-1`}>
                <Chip
                  mode="outlined"
                  selectedColor={colors.blue}
                  onPress={() => {
                    navigation.navigate("AddStamp", item);
                    // console.log(item);
                  }}
                >
                  Edit
                </Chip>
                <Chip mode="outlined" onPress={() => Delete(item.id)}>
                  Delete
                </Chip>
              </View>
            </View>
          </View>
        </View>

        {/* {more ? (
            <View style={tw`gap-2`}>
              <View style={tw`flex-row items-center gap-4`}>
                <Text>Status:</Text>
                <SwitchComp />
              </View>
              <View style={tw`flex-row items-center gap-4`}>
                <Text>Action:</Text>
                <DropdownComp />
              </View>
            </View>
          ) : null} */}
      </View>
    );
  };

  return (
    <View>
      <View style={tw`m-4 gap-1 `}>
        <Text style={tw`text-black text-5 font-bold `}>Stamps</Text>
        <Text style={tw`text-[${colors.gray}] text-3`}>
          Add or update your name and stamps.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddStamp")}
          style={tw`bg-[${colors.green}] justify-center items-center w-35 h-10 rounded-md self-end m-4`}
        >
          <Text style={tw`text-white`}>Add Stamp</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        onRefresh={fetchList}
        refreshing={isFetching}
        contentContainerStyle={tw`pb-50`}
        renderItem={({ item }) => <RenderItem item={item} />}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
