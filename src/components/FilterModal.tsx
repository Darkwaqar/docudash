import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Button, Divider, IconButton, Searchbar, Text } from 'react-native-paper';
import tw from 'twrnc';

import { DateTimePicker } from 'react-native-ui-lib';

interface IFilter {
  onPress: (name: string, date: Date) => void;
}

const FilterModal = ({ onPress }: IFilter) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempNameList, setTempNameList] = useState('');
  const [SelectedDate, setSelectedDate] = useState<Date>(new Date());
  return (
    <>
      <Button icon="filter" mode="contained" onPress={() => setModalVisible(true)}>
        Filter
      </Button>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/30`}>
          <View style={tw`w-72 px-4 bg-white rounded-lg`}>
            <View>
              <View style={tw`flex-row items-center  justify-between `}>
                <Text variant="titleLarge">Filter</Text>
                <IconButton
                  icon={'close-circle'}
                  style={tw`left-3`}
                  onPress={() => setModalVisible(false)}
                />
              </View>
              <Divider></Divider>
              <View style={tw`gap-2 py-2`}>
                <Text variant="titleMedium">Select Field</Text>

                <Searchbar
                  style={tw`rounded-md`}
                  placeholder="Name"
                  value={tempNameList}
                  onChangeText={(text) => setTempNameList(text)}
                />
                <Text variant="titleMedium">Date</Text>
                <DateTimePicker
                  value={SelectedDate}
                  // title="Select time"
                  onChange={(date: Date) => setSelectedDate(date)}
                  // placeholder="Placeholder"

                  display="spinner"
                  renderInput={() => (
                    <Searchbar
                      style={tw`rounded-md`}
                      placeholder="All"
                      value={String(SelectedDate).slice(0, 15)}
                    />
                  )}
                />
              </View>
              <Divider></Divider>
              <View style={tw`flex-row items-center gap-2 my-3`}>
                <Button
                  mode="contained"
                  onPress={() => {
                    onPress(tempNameList, SelectedDate);
                    setModalVisible(false);
                  }}
                >
                  Apply
                </Button>
                <Button
                  onPress={() => {
                    setSelectedDate(new Date());
                    setTempNameList('');
                  }}
                >
                  Reset
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  heading: tw`font-bold text-4`,
});
