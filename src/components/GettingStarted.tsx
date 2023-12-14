import { selectAccessToken } from '@stores/slices/UserSlice';
import { HeaderAPI, HeaderOption } from '@type/*';
import { colors } from '@utils/Colors';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useSelector } from 'react-redux';
import tw from 'twrnc';
import ProgressModal from './ProgressModal';

export default function GettingStarted({ addTarget }) {
  const [completeNumber, setCompleteNumber] = useState<number>(0);
  const [progressBar, setProgressBar] = useState<number>(0);
  const [Headers, setHeaders] = useState<HeaderOption>();
  const accessToken = useSelector(selectAccessToken);

  const fetchData = () => {
    // console.log('Fetch data');

    axios
      .get('https://docudash.net/api/getStartedWithDocudash', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        const { data, message, status } = response.data as HeaderAPI;

        let ones = 0;
        let zeros = 0;

        const obj = response.data.data;
        setProgressBar(obj.percentage / 100);
        delete obj.percentage;
        setHeaders(obj);

        const key_array = Object.values(obj);
        key_array.forEach((element) => {
          if (element) {
            ones++;
          } else {
            zeros++;
          }
        });
        setCompleteNumber(ones);

        // console.log(response.data);
      })
      .catch((error) => {
        // console.log(error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={tw`items-center px-5 justify-center`}>
      <View>
        <View style={tw`flex-row items-center justify-between w-80 overflow-hidden py-2`}>
          <Text style={tw`text-[${colors.black}] font-bold`}>Get Started with Docudash</Text>
          <Text style={tw`text-[${colors.black}] font-bold`}>
            {` ${completeNumber}/6 Completed`}
          </Text>
        </View>
        <Progress.Bar
          progress={progressBar}
          color={'#6FAC46'}
          unfilledColor={'#D9D9D9'}
          width={null}
          borderColor={'#D9D9D9'}
        />
      </View>
      <ProgressModal
        progress={progressBar}
        obj={Headers}
        steps={completeNumber}
        addTarget={addTarget}
      />
    </View>
  );
}
