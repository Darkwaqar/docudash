import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Linking,
  Alert,
  SafeAreaView,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '@constants/colors';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import StarRating from 'react-native-star-rating-fixed-viewproptype';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Foundation from '@expo/vector-icons/Foundation';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '@stores/slices/UserSlice';
import { NotarizeReview, ReviewsList } from 'src/types/ReviewList';
import tw from 'twrnc';
import { Avatar } from 'react-native-paper';
import { Notaries } from 'src/types/NoraryList';
// uri: 'https://docudash.net/public/uploads/NotaryRequestBanner/' + item.BannerImage,

const { width, height } = Dimensions.get('window');
const NotaryProfile = ({ navigation, route }) => {
  const { item } = route.params as { item: Notaries };
  const accessToken = useSelector(selectAccessToken);
  const [seeMore, setSeeMore] = useState(false);
  const [reviews, setReviews] = useState<NotarizeReview[]>([]);
  let numberOfLines = 2;
  let seeMoreText = 'See more';
  if (seeMore) {
    numberOfLines = 100;
    seeMoreText = 'See less';
  } else {
    numberOfLines = 2;
    seeMoreText = 'See more';
  }
  console.log('profile', item);

  const fetchReviews = () => {
    const url = 'https://docudash.net/api/notarize-map-details/' + item.first_name + item.last_name;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const { status, NotarizeReview }: ReviewsList = response.data;
        if (status) {
          console.log(NotarizeReview);

          setReviews(NotarizeReview);
        } else {
        }
      });
  };
  useEffect(() => {
    fetchReviews();
  }, []);
  const image_dimension = 100;
  const args = {
    number: '', // String value with the number to call
    prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
    skipCanOpen: true, // Skip the canOpenURL check
  };
  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}>
      <SafeAreaView style={styles.header}>
        <Pressable
          style={{ position: 'absolute', left: 10, top: 40, padding: 10 }}
          onPress={() => navigation.goBack()}
        >
          <EvilIcons name={'arrow-left'} size={35} color={Colors.white} />
        </Pressable>
        <Image
          style={{
            height: image_dimension,
            width: image_dimension,
            borderRadius: image_dimension / 2,
            marginTop: 60,
          }}
          source={{
            uri: 'https://docudash.net/public/uploads/profile-pics/' + item.image,
          }}
        />
        <Text style={[styles.heading, { fontSize: 20 }]}>{item.first_name}</Text>
        <Text style={styles.heading}>{item.email}</Text>
        <Text style={styles.heading}>{item.phone}</Text>
        <View style={{ marginTop: 5 }}>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={4.5}
            starSize={20}
            starStyle={{ color: Colors.golden }}
          />
        </View>
      </SafeAreaView>

      <View
        style={{
          width: width - 80,
          // backgroundColor: Colors.white,
          top: -80,
          borderRadius: 10,
        }}
      >
        <Image
          source={{
            uri: 'https://docudash.net/public/uploads/NotaryRequestBanner/' + item.BannerImage,
          }}
          style={tw`w-full h-14`}
          resizeMode={'contain'}
        ></Image>
        {/* <View
          style={{
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            paddingHorizontal: 30,
          }}
        >
          <Text
            style={{
              color: 'gray',
              width: '95%',
            }}
            numberOfLines={6}
          >
            {item.BioDescription}
          </Text>
        </View> */}
      </View>

      {/* Content */}
      <View
        style={{
          width: width - 30,
          backgroundColor: Colors.white,
          paddingVertical: 20,
          top: -50,
          borderRadius: 10,
          paddingHorizontal: 10,
        }}
      >
        <View style={styles.box}>
          <View style={styles.tiny_box}>
            <FontAwesome name={'star'} color={Colors.golden} size={10} />
            <Text style={styles.tiny_box_text}>Top Pro</Text>
          </View>
          <View style={[styles.tiny_box, { backgroundColor: 'lightgreen' }]}>
            <Text style={styles.tiny_box_text}>
              Exceptional Service 4.5 <FontAwesome name={'star'} color={'gray'} size={13} /> (146)
            </Text>
          </View>
        </View>
        <Text style={{ color: Colors.gray, marginTop: 5 }}>
          Typically responds in about 8 minutes
        </Text>
        <TouchableOpacity
          style={[
            styles.box,
            {
              backgroundColor: Colors.blue,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 5,
              borderRadius: 10,
              marginTop: 10,
            },
          ]}
        >
          <Text style={[styles.heading, { marginTop: 0 }]}>View Pricing</Text>
        </TouchableOpacity>
        {/* About this Notary */}
        <View style={styles.content_box}>
          <Text style={styles.content_heading}>About This Notary</Text>
          <Text style={{ color: 'gray' }} numberOfLines={numberOfLines}>
            {item.about_notary}
          </Text>
          <Pressable style={{ padding: 3 }} onPress={() => setSeeMore(!seeMore)}>
            <Text style={{ color: Colors.gray }}>{seeMoreText}</Text>
          </Pressable>
        </View>
        {/* OverView */}
        <View style={styles.content_box}>
          <Text style={styles.content_heading}>Overview</Text>
          <View style={styles.overview_bullet}>
            <Ionicons name="md-trophy-outline" color={Colors.black} size={16} />
            <Text style={styles.bullet_text}>Hired {Math.floor(Math.random() * 200)} times</Text>
          </View>
          <View style={styles.overview_bullet}>
            <Ionicons name="location" color={Colors.black} size={16} />
            <Text style={styles.bullet_text}>{item.city + ',' + item.state}</Text>
          </View>

          <View style={styles.overview_bullet}>
            <Ionicons name="md-person-add" color={Colors.black} size={16} />
            <Text style={styles.bullet_text}>verified by</Text>
          </View>
          <View style={styles.overview_bullet}>
            <Ionicons name="people" color={Colors.black} size={15} />
            <Text style={styles.bullet_text}>{Math.floor(Math.random() * 10)} employees</Text>
          </View>
          <View style={styles.overview_bullet}>
            <Ionicons name="alarm-outline" color={Colors.black} size={15} />
            <Text style={styles.bullet_text}>
              {Math.floor(Math.random() * 10)} years in business
            </Text>
          </View>
        </View>
        {/* Top Pro */}
        <View style={styles.content_box}>
          <Text style={styles.content_heading}>Top Pro Status</Text>
          <Text style={{ color: 'gray' }}>
            Top Pros are among the highest-rated, most popular professionals on Docudash
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}
          >
            <View style={styles.badge_box}>
              <Image style={styles.badge_image} source={require('@assets/badge.png')} />
              <Text style={styles.badge_box_text}>2021</Text>
            </View>
            <View style={styles.badge_box}>
              <Image style={styles.badge_image} source={require('@assets/badge.png')} />
              <Text style={styles.badge_box_text}>2022</Text>
            </View>
          </View>
        </View>
        {/* contact */}
        <View style={styles.content_box}>
          <Text style={styles.content_heading}>Contact</Text>

          <TouchableOpacity
            style={styles.contact_button}
            onPress={() => navigation.navigate('CreateARequest', { Notary: item.email })}
          >
            <Text style={styles.contact_button_text}>Book an appointment</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content_box}>
          <View style={{ alignItems: 'center', marginVertical: 5 }}>
            {/* <Text style={{ color: 'gray' }}>or</Text> */}
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Schedule', { Notary: item.email })}
            style={{
              backgroundColor: Colors.blue,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: Colors.white }}>Schedule a meeting in person</Text>
          </TouchableOpacity>
        </View>
        {/* Reviews */}
        <View style={styles.content_box}>
          <Text style={styles.content_heading}>Reviews:</Text>

          {reviews.length === 0 ? (
            <Text>No reviews of this Notary</Text>
          ) : (
            reviews.map((element, i) => {
              return (
                <View style={{ paddingVertical: 15 }} key={element.id}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: 4,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: '90%',
                      }}
                    >
                      <Avatar.Image
                        size={50}
                        source={{
                          uri:
                            'https://docudash.net/public/uploads/profile-pics/' +
                            element.user?.image,
                        }}
                      />
                      <View style={{ marginLeft: 14, height: '90%' }}>
                        <Text
                          style={[
                            {
                              marginVertical: 1,
                              color: Colors.black,
                            },
                          ]}
                        >
                          {element.name}
                        </Text>
                        <StarRating
                          disabled={false}
                          maxStars={5}
                          rating={element.star}
                          starSize={15}
                          starStyle={{ color: Colors.golden }}
                        />
                      </View>
                    </View>
                    <Text style={tw`font-light text-gray-400`}>
                      {element.created_at.substring('0', '10')}
                    </Text>
                  </View>
                  <Text style={{ color: 'gray', marginTop: 5, paddingHorizontal: 6 }}>
                    {element.review}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default NotaryProfile;

const styles = StyleSheet.create({
  header: {
    height: 400,
    backgroundColor: Colors.green,
    borderBottomEndRadius: 60,
    borderBottomStartRadius: 60,
    alignItems: 'center',
    width: width,
  },
  heading: {
    color: Colors.white,
    marginTop: 5,
  },
  tiny_box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    paddingHorizontal: 10,
    justifyContent: 'space-evenly',
    borderRadius: 10,
    padding: 5,
    margin: 5,
  },
  tiny_box_text: { color: 'gray', marginLeft: 2 },
  box: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  content_heading: {
    color: Colors.black,
    fontSize: 20,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  content_box: { marginTop: 15 },
  overview_bullet: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  bullet_text: { marginLeft: 10, color: Colors.black },
  badge_box: { alignItems: 'center', marginLeft: 10 },
  badge_image: { width: 50, height: 50 },
  badge_box_text: { color: Colors.black, marginTop: 5 },
  contact_button: {
    borderWidth: 2,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.blue,
  },
  contact_button_text: {
    color: Colors.blue,
  },
});
