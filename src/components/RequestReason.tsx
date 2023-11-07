import GreenButton from '@components/GreenButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { setAccessToken } from '@stores/slices/UserSlice';
import { Istep5Response, SignUpStackScreenProps } from '@type/index';
import { clearAsync, getToken } from '@utils/AsyncFunc';
import { storeTokenGlobal } from '@utils/AsyncGlobal';
import { colors } from '@utils/Colors';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Chip,
  Divider,
  Menu,
  ProgressBar,
  SegmentedButtons,
  Text,
  TextInput,
} from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import { useDispatch } from 'react-redux';
import tw from 'twrnc';
import CalendarPicker from 'react-native-calendar-picker';
import { IRequest } from 'src/types/request';
import { reasons } from '@utils/requestReason';
import { time } from '@utils/requestTime';

export default function RequestReason({
  data,
  setData,
}: {
  data: IRequest;
  setData: React.Dispatch<React.SetStateAction<IRequest>>;
}) {
  const [state, setState] = useState<{
    selectedStartDate: Date;
    selectedEndDate: Date;
  }>({
    selectedStartDate: new Date(),
    selectedEndDate: new Date(),
  });
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const [showDropDownIndustry, setShowDropDownIndustry] = useState(false);
  const [timeDropdown, setTimeDropdown] = useState(false);
  const minDate = new Date(); // Today
  // const maxDate = new Date(2017, 6, 3);
  const startDate = state.selectedStartDate
    ? new Date(state.selectedStartDate).toLocaleDateString()
    : '';
  const endDate = state.selectedEndDate ? new Date(state.selectedEndDate).toLocaleDateString() : '';

  useEffect(() => {
    setData((prev) => ({ ...prev, requestDate: startDate + ' - ' + endDate }));
  }, [startDate, endDate]);

  const onDateChange = (date, type) => {
    if (type === 'END_DATE') {
      setState((prev) => ({ ...prev, selectedEndDate: date }));
      closeMenu();
    } else {
      setState((prev) => ({
        ...prev,
        selectedStartDate: date,
        selectedEndDate: null,
      }));
    }
  };

  return (
    <>
      <View style={tw`mx-2`}>
        <Text variant="labelLarge">Reason of Request</Text>
        <View style={tw`border border-[${colors.green}] rounded-3xl overflow-hidden my-2`}>
          <DropDown
            mode={'flat'}
            placeholder="Reason of Request"
            visible={showDropDownIndustry}
            inputProps={{ backgroundColor: 'white', width: '100%' }}
            showDropDown={() => setShowDropDownIndustry(true)}
            onDismiss={() => setShowDropDownIndustry(false)}
            value={data.reasonOfRequest}
            setValue={(text) => setData((prev) => ({ ...prev, reasonOfRequest: text }))}
            list={reasons}
          />
        </View>
      </View>
      <View style={tw`mx-2`}>
        <Text variant="labelLarge">Availability Date</Text>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchorPosition="bottom"
          anchor={
            <Button onPress={openMenu}>
              START DATE:{startDate} END DATE:{endDate}
            </Button>
          }
        >
          <CalendarPicker
            startFromMonday={true}
            allowRangeSelection={true}
            minDate={minDate}
            // maxDate={maxDate}
            todayBackgroundColor="#f2e6ff"
            selectedDayColor="#7300e6"
            selectedDayTextColor="#FFFFFF"
            onDateChange={onDateChange}
          />
        </Menu>
      </View>
      <View style={tw`mx-2`}>
        <Text variant="labelLarge">Time</Text>
        <View style={tw`border border-[${colors.green}] rounded-3xl overflow-hidden my-2`}>
          <DropDown
            mode={'flat'}
            placeholder="Select Your Time ?"
            visible={timeDropdown}
            inputProps={{ backgroundColor: 'white', width: '100%' }}
            showDropDown={() => setTimeDropdown(true)}
            onDismiss={() => setTimeDropdown(false)}
            value={data.requestTime}
            setValue={(text) => setData((prev) => ({ ...prev, requestTime: text }))}
            list={time}
          />
        </View>
      </View>
    </>
  );
}
