// @ts-nocheck
import { View, Text, SafeAreaView, ScrollView, Alert, Pressable } from 'react-native';
import React, { useState } from 'react';
import HomeHeader from '@components/HomeHeader';
import tw from 'twrnc';
import { Entypo } from '@expo/vector-icons';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { useNavigation } from '@react-navigation/native';
import { selectAccessToken } from '@stores/slices/UserSlice';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Pricing = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const accessToken = useSelector(selectAccessToken);
  const [responseData, setResponseData] = useState();
  const navigation = useNavigation();
  const initializePaymentSheet = async (data) => {
    // console.log('initializePaymentSheet', data);

    setLoading(true);
    // const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Docudash, Inc.',
      customerId: data.customer,
      customerEphemeralKeySecret: data.phemeralKey,
      paymentIntentClientSecret: data.paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });
    openPaymentSheet(data);
    if (!error) {
      setLoading(true);
      //have to implement cancel logic here/ ask sufe
    }
  };
  const openPaymentSheet = async (data) => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
      PaymentApprove(data);
    }
  };
  const PaymentApprove = (data) => {
    let formDataNew = new FormData();

    // formData.append('NotaryRequestsReturnID', NotaryRequestsReturnID);
    // formDataNew.append('pending_payment_id', data?.paymentIntent);
    var limit: number = data.amount == 0.99 ? 1 : data.amount == 3.0 ? 3 : 10;
    formDataNew.append('envelop_limit', limit);
    // const obj = {
    //   pending_payment_id: data?.client_secret,
    //   envelop_limit: data.amount == 0.99 ? 1 : data.amount == 3.0 ? 3 : 10,
    // };
    console.log('formDataNew', data);
    // console.log('responseData', responseData);
    let headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    };
    axios
      .post('https://docudash.net/api/create-request-payment-envelope-approve', formDataNew, {
        headers,
      })
      .then((response) => {
        console.log('envelope', response.data);
        if (response.data.status) {
          // initializePaymentSheet(responseData);
          navigation.navigate('Home');
        }
      })
      .catch((error) => {
        // setLoading(false);
        console.log('error', error);
      });
  };
  const createRequestPayment = (amount) => {
    let formData = new FormData();
    // formData.append('NotaryRequestsReturnID', NotaryRequestsReturnID);
    formData.append('amount', amount);
    // formData.append('envelop_limit', amount == 0.99 ? 1 : amount == 3.0 ? 3 : 10);
    let headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    };
    console.log('formData createRequestPayment', formData);

    axios
      .post('https://docudash.net/api/create-request-payment-envelope', formData, { headers })
      .then((response) => {
        setLoading(false);
        if (response.data.status) {
          setResponseData(response.data.detailsArr);
          console.log('response.data', response.data);

          if (response.data.detailsArr) {
            // PaymentApprove(response.data.detailsArr);
            initializePaymentSheet(response.data.detailsArr);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log('error', error);
      });
  };
  return (
    <SafeAreaView style={tw`flex-1 `}>
      <HomeHeader heading={'Pricing'} />
      <ScrollView>
        <Pressable
          onPress={() => createRequestPayment(0.99)}
          style={tw`bg-white shadow-md rounded-lg p-2 m-2 gap-2`}
        >
          <View style={tw`items-center`}>
            <View
              style={{
                backgroundColor: '#6fac46',
                width: 80,
                height: 80,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                marginBottom: 10,
              }}
            >
              <Text style={tw`text-white text-lg`}>$0.99</Text>
            </View>
          </View>
          <View style={tw`gap-2 items-center text-black font-bold`}>
            <Text>BRONZE</Text>
            <Text style={tw`text-center `}>
              For individuals and sole proprietors requiring simple e-signature solutions.
            </Text>
          </View>
          <View style={tw`gap-3`}>
            <View style={tw`flex-row items-center`}>
              <Entypo name="check" size={20} color="green" />
              <Text> 1 envelope</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Entypo name="check" size={20} color="green" />
              <Text>24/7 live support</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Entypo name="check" size={20} color="green" />
              <Text>Manage data across App and Web App</Text>
            </View>
          </View>
        </Pressable>
        <Pressable
          onPress={() => createRequestPayment(3.0)}
          style={tw`bg-white shadow-md rounded-lg p-2 m-2 gap-2`}
        >
          <View style={tw`items-center`}>
            <View
              style={{
                backgroundColor: '#6fac46',
                width: 80,
                height: 80,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                marginBottom: 10,
              }}
            >
              <Text style={tw`text-white text-lg`}>$3.00</Text>
            </View>
          </View>
          <View style={tw`gap-2 items-center text-black font-bold`}>
            <Text>GOLD</Text>
            <Text style={tw`text-center `}>
              For small to medium-sized teams seeking to send, sign, and collaborate effectively.
            </Text>
          </View>
          <View style={tw`gap-3`}>
            <View style={tw`flex-row items-center`}>
              <Entypo name="check" size={20} color="green" />
              <Text> 5 envelope</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Entypo name="check" size={20} color="green" />
              <Text>24/7 live support</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Entypo name="check" size={20} color="green" />
              <Text>Manage data across App and Web App</Text>
            </View>
          </View>
        </Pressable>
        <Pressable
          onPress={() => createRequestPayment(5.0)}
          style={tw`bg-white shadow-md rounded-lg p-2 m-2 gap-2`}
        >
          <View style={tw`items-center`}>
            <View
              style={{
                backgroundColor: '#6fac46',
                width: 80,
                height: 80,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                marginBottom: 10,
              }}
            >
              <Text style={tw`text-white text-lg`}>$5.00</Text>
            </View>
          </View>
          <View style={tw`gap-2 items-center text-black font-bold text-lg`}>
            <Text>PLATINUM</Text>
            <Text style={tw`text-center `}>
              For streamlining and enhancing agreements with advanced automation features.
            </Text>
          </View>
          <View style={tw`gap-3`}>
            <View style={tw`flex-row items-center`}>
              <Entypo name="check" size={20} color="green" />
              <Text> 10 envelope</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Entypo name="check" size={20} color="green" />
              <Text>24/7 live support</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Entypo name="check" size={20} color="green" />
              <Text>Manage data across App and Web App</Text>
            </View>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Pricing;
