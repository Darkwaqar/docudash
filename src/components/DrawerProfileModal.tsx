import COLORS from '@constants/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { selectProfileData } from '@stores/slices/UserSlice';
import { RootStackScreenProps } from '@type/index';
import { colors } from '@utils/Colors';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import tw from 'twrnc';

const DrawerProfileModal = () => {
  const user = useSelector(selectProfileData);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<RootStackScreenProps<'Home'>['navigation']>();
  return (
    <>
      {user && (
        <Pressable style={tw`w-full py-5`} onPress={() => setModalVisible(true)}>
          <View
            style={{
              marginLeft: 20,
              marginVertical: 40,
            }}
          >
            <Image
              source={{ uri: user.profile_photo }}
              style={{ height: 70, width: 70, borderRadius: 20 }}
            />
            <Text
              style={{
                color: colors.blue,
                fontWeight: 'bold',
                fontSize: 15,
                marginTop: 10,
              }}
            >
              {user.first_name} {user.last_name}
            </Text>
          </View>
        </Pressable>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={[tw`flex-1 justify-center items-center`, { backgroundColor: 'rgba(0,0,0,0.8)' }]}
        >
          <View style={tw`py-20 w-75 bg-white justify-center items-center gap-4`}>
            <Pressable
              style={tw`absolute top-1 right-2 p-2`}
              onPress={() => setModalVisible(false)}
            >
              <MaterialCommunityIcons name="close-circle" size={30} />
            </Pressable>
            {/* content */}
            <View style={tw`gap-2 w-[80%] overflow-hidden`}>
              <Text style={tw`font-bold text-4`}>
                {user.first_name} {user.last_name}
              </Text>
              <Text style={styles.profile_small_text}>{user.email}</Text>
              <Text style={styles.profile_small_text}> Account #00000{user.id}</Text>
              <Text style={styles.profile_small_text}>
                {user.first_name} {user.last_name}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('Profile');
                }}
                style={tw`bg-[${colors.green}] justify-center items-center h-8 rounded-lg`}
              >
                <Text style={tw`text-white`}>Manage Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DrawerProfileModal;

const styles = StyleSheet.create({
  profile_small_text: tw`text-[${colors.gray}]`,
});
