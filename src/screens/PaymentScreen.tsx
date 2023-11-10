import { Button } from '@components/Button';
import { selectAuthState } from '@stores/store';
import { useStripe } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import tw from 'twrnc';
// import FormData from 'form-data';

const PaymentScreen = ({ price }: { price: number }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    setAmount(price);
    initializePaymentSheet();
  }, [price]);

  // const fetchPaymentSheetParams = async () => {
  //   console.log(parseFloat(amount), 'amount');
  //   var formData = new FormData();
  //   formData.append('amount', parseFloat(amount));
  //   const response = await fetch(`https://www.snappstay.com/api/payment-sheet`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: formData,
  //   });
  //   console.log(response);
  //   const data = await response.json();
  //   const { paymentIntent, ephemeralKey, customer } = data.Details;
  //   return {
  //     paymentIntent,
  //     ephemeralKey,
  //     customer,
  //   };
  // };

  const initializePaymentSheet = async () => {
    setLoading(true);
    // const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'SnappStay, Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  return (
    <Button
      disabled={!loading}
      style={tw`mb-10`}
      onPress={openPaymentSheet}
      title={'Confirm and pay'}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avoider: {
    flex: 1,
    padding: 36,
  },
  button: {
    margin: 36,
    marginTop: 0,
  },
});
export default PaymentScreen;
