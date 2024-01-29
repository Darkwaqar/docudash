import React, { useEffect } from 'react'
import StackNavigator from '@navigation/StackNavigator';
import { selectAccessToken } from '@stores/slices/UserSlice';
import { useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
const Root = () =>{
    const accessToken = useSelector(selectAccessToken);
    useEffect(()=>{
        if(accessToken){
            store_token()
          }
    },[])
    const store_token = async( ) => {
        const token = await messaging().getToken();
        alert('store_token')
        console.log('token ==><><', token);
        const obj = {
          token:token
        }
        axios
          .post('https://docudash.net/api/store-token',obj, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            console.log('store_token',response);
            
          })
          .catch((error) => {
            console.log('Error----', error);
          });
      }
    return(
        <StackNavigator />
    )
}
export default Root
