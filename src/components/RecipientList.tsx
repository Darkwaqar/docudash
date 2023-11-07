import _ from 'lodash';
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';
import {
  SortableList,
  SortableListItemProps,
  View,
  TouchableOpacity,
  Icon,
  Assets,
  Colors,
} from 'react-native-ui-lib';
import tw from 'twrnc';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '@stores/slices/UserSlice';

interface Item extends SortableListItemProps {
  id: string;
  recName: string;
  recEmail: string;
  sign_type: string;
  hostName: string;
  hostEmail: string;
  access_code: string;
  private_message: string;
  recipients_update_id: string;
  showDropDown: boolean;
  visible: boolean;
  showAccessCode: boolean;
  showPrivateMessage: boolean;
}

// const data: Item[] = _.times(5, (index) => {
//   // if (index === 3) {
//   //   text = 'Locked item';
//   // }

//   return {
//     id: `${index}`,
//     locked: false,
//   };
// });
const actionList = [
  {},
  {
    label: 'Needs to Sign',
    value: '1',
  },
  {
    label: 'In Person Signer',
    value: '2',
  },
  {
    label: 'Receives a Copy',
    value: '3',
  },
  {
    label: 'Needs to View',
    value: '4',
  },
];
const RecipientList = ({ data, setData }) => {
  const accessToken = useSelector(selectAccessToken);
  console.log('RecipientList', data);
  // const [data, setData] = useState<Item[]>([]);
  const navigation = useNavigation();
  const [items, setItems] = useState<Item[]>(data);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  useEffect(() => {
    const idData2 = data.map((item, index) => ({ ...item, id: `${index}` }));
    setItems(idData2);
  }, [data]);

  const toggleItemSelection = useCallback(
    (item: Item) => {
      if (selectedItems.includes(item)) {
        setSelectedItems(
          selectedItems.filter((selectedItem) => ![item.id].includes(selectedItem.id))
        );
      } else {
        setSelectedItems(selectedItems.concat(item));
      }
    },
    [selectedItems, setSelectedItems]
  );

  // const addItem = useCallback(() => {
  //     setItems(orderedItems.current);
  // }, [ setItems]);

  const deleteRecipient = () => {
    const item = items.find((item) => selectedItems.includes(item));
    if (item.recipients_update_id == '0') {
      setItems(items.filter((item) => !selectedItems.includes(item)));
      return;
    }
    axios
      .post(
        'https://docudash.net/api/generate-signature/deleteReceipent',
        { deleteId: item.recipients_update_id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        const apiData: {
          status: boolean;
          message: string;
          returnAffected: number;
        } = response.data;
        if (apiData.status) {
          setItems(items.filter((item) => !selectedItems.includes(item)));
          alert(apiData.message);
        } else {
          alert(apiData.message);
        }
        console.log('data', response.data);
      })
      .catch((error) => {
        console.log('Error----', error);
      });
  };

  const removeSelectedItems = useCallback(() => {
    setSelectedItems([]);
    // orderedItems.current = data.current.filter((item) => !selectedItems.includes(item));
    deleteRecipient();
    // setItems(items.filter((item) => !selectedItems.includes(item)));
  }, [selectedItems, setItems, setSelectedItems]);

  const keyExtractor = useCallback((item: Item) => {
    return `${item.id}`;
  }, []);

  const onOrderChange = useCallback((newData: Item[]) => {
    console.log('New order:', newData);
    setData(newData);
  }, []);

  const renderItem = ({ item, index: _index }: { item: Item; index: number }) => {
    const isSelected = selectedItems.includes(item);
    const { locked } = item;
    const Container = locked ? View : TouchableOpacity;
    return (
      <Container
        // TODO: fix Android selection color
        style={[styles.itemContainer, isSelected && styles.selectedItemContainer]}
        onPress={() => toggleItemSelection(item)}
        // overriding the BG color to anything other than white will cause Android's elevation to fail
        // backgroundColor={Colors.red30}
        centerV
        // centerH={locked}
        paddingH-page
      >
        <View
          style={tw`flex-1 h-20 flex-row bg-white justify-center  border border-gray-200 items-center text-white text-xl font-bold text-center`}
        >
          <Text style={tw`w-14 text-center`} variant="labelLarge">
            {_index}
          </Text>
          <View style={tw`w-14 text-center`}>
            <Avatar.Text size={40} label="XD" />
          </View>

          <View style={tw`flex-1`}>
            <Text variant="labelLarge">{item.recName}</Text>
            <Text variant="bodySmall">
              {item.sign_type != '1' ? `Host: ${item.hostEmail}` : item.recEmail}
            </Text>
            <Text variant="bodySmall">{actionList[item.sign_type].label}</Text>
          </View>
          <IconButton
            onPress={() => {
              navigation.navigate('AddRecipient', { Recipients: items, Recipient: item });
            }}
            icon="chevron-right"
          ></IconButton>
        </View>
      </Container>
    );
  };

  return (
    <View style={tw`flex-1`}>
      <View row center style={tw`p-2 justify-around`}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddRecipient', { Recipients: items })}
        >
          Add Recipient
        </Button>
        <Button
          mode="contained"
          disabled={selectedItems.length === 0}
          onPress={removeSelectedItems}
        >
          Remove Recipient
        </Button>
      </View>
      <View flex useSafeArea>
        <SortableList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onOrderChange={onOrderChange}
          scale={1.02}
          ListEmptyComponent={
            <View style={tw`flex-1 h-20 justify-center items-center`}>
              <Text>No Recipients</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default RecipientList;
const styles = StyleSheet.create({
  itemContainer: {
    height: 80,
    borderColor: Colors.$outlineDefault,
    borderBottomWidth: 1,
  },
  selectedItemContainer: {
    borderLeftColor: Colors.$outlinePrimary,
    borderLeftWidth: 5,
  },
});
